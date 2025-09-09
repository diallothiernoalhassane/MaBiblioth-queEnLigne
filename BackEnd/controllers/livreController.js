const Livre = require('../models/livreModel');
const { livreSchema } = require('../validateurs/livreValidateurs');
const mongoose = require('mongoose');

// Ajouter un livre (Admin)
exports.ajouterLivre = async (req, res) => {
    try {
        // Vérification que les fichiers existent
        if (!req.files || !req.files.pdf || req.files.pdf.length === 0) {
            return res.status(400).json({ message: 'Le fichier PDF est obligatoire' });
        }
        if (!req.files || !req.files.image || req.files.image.length === 0) {
            return res.status(400).json({ message: 'L\'image de couverture est obligatoire' });
        }

        // Ajouter les chemins des fichiers à req.body pour Joi
        req.body.fichierPdf = req.files.pdf[0].path;
        req.body.imageCouverture = req.files.image[0].path;

        // Validation des champs texte
        const { error } = livreSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        // Création du livre
        const livre = new Livre({
            titre: req.body.titre,
            auteur: req.body.auteur,
            description: req.body.description || '',
            categorieId: req.body.categorieId,
            fichierPdf: req.body.fichierPdf,
            imageCouverture: req.body.imageCouverture
        });

        // Sauvegarde en base
        const savedLivre = await livre.save();
        res.status(201).json({ message: 'Livre ajouté avec succès', livre: savedLivre });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Modifier un livre (Admin)
exports.modifierLivre = async (req, res) => {
    try {
        const updateData = req.body;
        if (req.files) {
            if (req.files.pdf) updateData.fichierPdf = req.files.pdf[0].path;
            if (req.files.image) updateData.imageCouverture = req.files.image[0].path;
        }
        const livre = await Livre.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json({ message: 'Livre modifié', livre });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Supprimer un livre (Admin)
const fs = require('fs');

exports.supprimerLivre = async (req, res) => {
    try {
        const livre = await Livre.findById(req.params.id);
        if (!livre) return res.status(404).json({ message: 'Livre non trouvé' });

        // Supprimer le fichier PDF
        if (livre.fichierPdf) {
            fs.unlink(livre.fichierPdf, (err) => {
                if (err) console.error('Erreur suppression PDF:', err);
            });
        }

        // Supprimer l'image de couverture
        if (livre.imageCouverture) {
            fs.unlink(livre.imageCouverture, (err) => {
                if (err) console.error('Erreur suppression image:', err);
            });
        }

        // Supprimer tous les téléchargements associés à ce livre
        const Telechargement = require('../models/telechargement');
        console.log('Suppression des téléchargements pour le livre:', req.params.id);
        const deleteResult = await Telechargement.deleteMany({ livreId: req.params.id });
        console.log('Téléchargements supprimés:', deleteResult.deletedCount);

        // Supprimer le document MongoDB
        await Livre.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Livre supprimé avec succès' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Affichage des livres(Tout le monde)
exports.listeLivres = async (req, res) => {
    try {
        // Pagination - augmenter la limite par défaut
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100; // Augmenté de 10 à 100
        const skip = (page - 1) * limit;

        // Tri
        let sort = {};
        if (req.query.sortBy && req.query.order) {
            const order = req.query.order.toLowerCase() === 'desc' ? -1 : 1;
            sort[req.query.sortBy] = order;
        } else {
            sort = { titre: 1 }; // tri par défaut
        }

        // Filtre global
        let filter = {};

        // Filtre par catégorie (si ObjectId valide)
        if (req.query.categorieId && mongoose.Types.ObjectId.isValid(req.query.categorieId)) {
            filter.categorieId = new mongoose.Types.ObjectId(req.query.categorieId);
        }

        // Recherche par titre/auteur
        if (req.query.search) {
            const regex = new RegExp(req.query.search, 'i');
            filter.$or = [{ titre: regex }, { auteur: regex }];
        }

        // Récupération des livres
        const livres = await Livre.find(filter)
            .populate('categorieId', 'nom')
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const totalLivres = await Livre.countDocuments(filter);

        res.status(200).json({
            totalLivres,
            page,
            totalPages: Math.ceil(totalLivres / limit),
            livres
        });
    } catch (err) {
        console.error('Erreur dans listeLivres:', err);
        res.status(500).json({ message: err.message });
    }
};



// Afficher un livre spécifique (Tout le monde)
exports.livreDetails = async (req, res) => {
    try {
        const livre = await Livre.findById(req.params.id).populate('categorieId', 'nom');
        if (!livre) return res.status(404).json({ message: 'Livre non trouvé' });
        res.status(200).json(livre);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Télécharger un livre (Utilisateur connecté)
const Telechargement = require('../models/telechargement');
const path = require('path');

exports.telechargerLivre = async (req, res) => {
    try {
        // Chercher le livre
        const livre = await Livre.findById(req.params.id);
        if (!livre) {
            return res.status(404).json({ message: 'Livre non trouvé' });
        }

        // Enregistrer le téléchargement dans la collection
        const nouveauTelechargement = await Telechargement.create({
            utilisateurId: req.user._id,  // récupéré depuis le middleware auth
            livreId: livre._id,
            dateTelechargement: new Date()
        });
        
        console.log('Téléchargement enregistré:', {
            utilisateurId: req.user._id,
            livreId: livre._id,
            telechargementId: nouveauTelechargement._id
        });

        // Envoyer le fichier
        const filePath = path.resolve(livre.fichierPdf); // chemin enregistré dans Mongo
        res.download(filePath, livre.titre + '.pdf'); // nom du fichier pour l'utilisateur

    } catch (err) {
        console.error("Erreur téléchargement:", err);
        res.status(500).json({ message: "Erreur lors du téléchargement du livre" });
    }
};
