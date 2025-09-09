const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { userSchema, loginSchema } = require('../validateurs/userValidateurs');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Inscription
exports.inscription = async (req, res) => {
    const { error } = userSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).json({ message: 'Email déjà utilisé' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.motDePasse, salt);

    const user = new User({
        nom: req.body.nom,
        email: req.body.email,
        motDePasse: hashedPassword,
        role: req.body.role || 'utilisateur'
    });

    try {
        const savedUser = await user.save();
        res.status(201).json({ message: 'Utilisateur créé', userId: savedUser._id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Créer un admin (route temporaire)
exports.createAdmin = async (req, res) => {
    try {
        const { nom, email, motDePasse } = req.body;
        
        if (!nom || !email || !motDePasse) {
            return res.status(400).json({ message: 'Tous les champs sont requis' });
        }

        const emailExist = await User.findOne({ email });
        if (emailExist) return res.status(400).json({ message: 'Email déjà utilisé' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(motDePasse, salt);

        const admin = new User({
            nom,
            email,
            motDePasse: hashedPassword,
            role: 'admin'
        });

        const savedAdmin = await admin.save();
        res.status(201).json({ 
            message: 'Administrateur créé avec succès', 
            userId: savedAdmin._id,
            email: savedAdmin.email 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Connexion
exports.connexion = async (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: 'Email ou mot de passe incorrect' });

    const validPass = await bcrypt.compare(req.body.motDePasse, user.motDePasse);
    if (!validPass) return res.status(400).json({ message: 'Email ou mot de passe incorrect' });

    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ message: 'Connexion réussie', token, user: { _id: user._id, nom: user.nom, email: user.email, role: user.role } });
};

// Liste des utilisateurs (Admin seulement)
exports.listeUsers = async (req, res) => {
    try {
        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Tri
        let sort = {};
        if (req.query.sortBy && req.query.order) {
            const order = req.query.order.toLowerCase() === 'desc' ? -1 : 1;
            sort[req.query.sortBy] = order;
        } else {
            sort = { nom: 1 }; // tri par défaut par nom croissant
        }

        // Récupérer utilisateurs avec pagination + tri
        const users = await User.find()
            .select('-motDePasse')
            .sort(sort)
            .skip(skip)
            .limit(limit);

        // Nombre total d'utilisateurs
        const totalUsers = await User.countDocuments();

        res.status(200).json({
            totalUsers,
            page,
            totalPages: Math.ceil(totalUsers / limit),
            users
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Modifier un utilisateur (Admin seulement)
exports.modifierUser = async (req, res) => {
    try {
        const updateData = req.body;
        if (updateData.motDePasse) {
            const salt = await bcrypt.genSalt(10);
            updateData.motDePasse = await bcrypt.hash(updateData.motDePasse, salt);
        }
        const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-motDePasse');
        res.status(200).json({ message: 'Utilisateur modifié', user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Supprimer un utilisateur (Admin seulement)
exports.supprimerUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Utilisateur supprimé' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Récupérer le profil de l'utilisateur connecté
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-motDePasse');
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Modifier le profil de l'utilisateur connecté
exports.updateProfile = async (req, res) => {
    try {
        const { nom, email } = req.body;
        
        // Vérifier si l'email est déjà utilisé par un autre utilisateur
        if (email) {
            const existingUser = await User.findOne({ 
                email, 
                _id: { $ne: req.user._id } 
            });
            if (existingUser) {
                return res.status(400).json({ message: 'Cet email est déjà utilisé' });
            }
        }

        const updateData = {};
        if (nom) updateData.nom = nom;
        if (email) updateData.email = email;

        const user = await User.findByIdAndUpdate(
            req.user._id, 
            updateData, 
            { new: true }
        ).select('-motDePasse');

        res.status(200).json({ 
            message: 'Profil mis à jour avec succès', 
            user 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Authentification Google OAuth
exports.googleAuth = async (req, res) => {
    try {
        const { credential } = req.body;
        
        if (!credential) {
            return res.status(400).json({ message: 'Token Google manquant' });
        }

        // Vérifier le token Google
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, picture, sub: googleId } = payload;

        // Vérifier si l'utilisateur existe déjà
        let user = await User.findOne({ 
            $or: [
                { email: email },
                { googleId: googleId }
            ]
        });

        if (user) {
            // Utilisateur existant - mise à jour des infos Google si nécessaire
            if (!user.googleId) {
                user.googleId = googleId;
                user.profilePicture = picture;
                await user.save();
            }
        } else {
            // Nouvel utilisateur - création du compte
            user = new User({
                nom: name,
                email: email,
                googleId: googleId,
                profilePicture: picture,
                role: 'utilisateur',
                // Pas de mot de passe pour les comptes Google
                motDePasse: null
            });
            await user.save();
        }

        // Générer le token JWT
        const token = jwt.sign(
            { _id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Connexion Google réussie',
            token,
            user: {
                _id: user._id,
                nom: user.nom,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture
            }
        });

    } catch (error) {
        console.error('Erreur authentification Google:', error);
        res.status(400).json({ 
            message: 'Token Google invalide ou erreur de vérification' 
        });
    }
};

// Callback Google OAuth pour gérer la redirection
exports.googleCallback = async (req, res) => {
    try {
        const { code, state } = req.body;
        
        if (!code) {
            return res.status(400).json({ message: 'Code d\'autorisation manquant' });
        }

        // Échanger le code contre un token d'accès
        const { OAuth2Client } = require('google-auth-library');
        const oauth2Client = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            'http://localhost:5173/auth/callback'
        );

        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // Obtenir les informations de l'utilisateur
        const { data } = await oauth2Client.request({
            url: 'https://www.googleapis.com/oauth2/v2/userinfo',
        });

        const { email, name, picture, id: googleId } = data;

        // Vérifier si l'utilisateur existe déjà
        let user = await User.findOne({ 
            $or: [
                { email: email },
                { googleId: googleId }
            ]
        });

        if (user) {
            // Utilisateur existant - mise à jour des infos Google si nécessaire
            if (!user.googleId) {
                user.googleId = googleId;
                user.profilePicture = picture;
                await user.save();
            }
        } else {
            // Nouvel utilisateur - création du compte
            user = new User({
                nom: name,
                email: email,
                googleId: googleId,
                profilePicture: picture,
                role: 'utilisateur',
                motDePasse: null
            });
            await user.save();
        }

        // Générer le token JWT
        const token = jwt.sign(
            { _id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Connexion Google réussie',
            token,
            user: {
                _id: user._id,
                nom: user.nom,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture
            }
        });

    } catch (error) {
        console.error('Erreur callback Google:', error);
        res.status(400).json({ 
            message: 'Erreur lors de l\'authentification Google' 
        });
    }
};