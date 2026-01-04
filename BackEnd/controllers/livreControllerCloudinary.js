const Livre = require('../models/livreModel');
const { livreSchema } = require('../validateurs/livreValidateurs');
const mongoose = require('mongoose');
const { deleteFromCloudinary } = require('../config/cloudinary');

// Ajouter un livre (Admin) avec Cloudinary
exports.ajouterLivre = async (req, res) => {
    try {
        // Vérification que les fichiers existent
        if (!req.files || !req.files.pdf || req.files.pdf.length === 0) {
            return res.status(400).json({ message: 'Le fichier PDF est obligatoire' });
        }
        if (!req.files || !req.files.image || req.files.image.length === 0) {
            return res.status(400).json({ message: 'L\'image de couverture est obligatoire' });
        }

        // Récupérer les URLs Cloudinary
        const pdfUrl = req.files.pdf[0].path;
        const imageUrl = req.files.image[0].path;

        // Ajouter les URLs des fichiers à req.body pour Joi
        req.body.fichierPdf = pdfUrl;
        req.body.imageCouverture = imageUrl;

        // Validation des champs texte
        const { error } = livreSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        // Création du livre avec les URLs Cloudinary
        const livre = new Livre({
            titre: req.body.titre,
            auteur: req.body.auteur,
            description: req.body.description || '',
            categorieId: req.body.categorieId,
            fichierPdf: pdfUrl,
            imageCouverture: imageUrl
        });

        // Sauvegarde en base
        const savedLivre = await livre.save();
        res.status(201).json({ message: 'Livre ajouté avec succès', livre: savedLivre });

    } catch (err) {
        console.error('Erreur lors de l\'ajout du livre:', err);
        res.status(500).json({ message: err.message });
    }
};

// Modifier un livre (Admin) avec Cloudinary
exports.modifierLivre = async (req, res) => {
    try {
        const livreExist = await Livre.findById(req.params.id);
        if (!livreExist) return res.status(404).json({ message: 'Livre non trouvé' });

        const updateData = { ...req.body };
        
        // Gérer le remplacement des fichiers si de nouveaux fichiers sont uploadés
        if (req.files) {
            // Supprimer l'ancien PDF de Cloudinary si un nouveau est uploadé
            if (req.files.pdf && req.files.pdf.length > 0) {
                if (livreExist.fichierPdf) {
                    const oldPdfPublicId = livreExist.fichierPdf.split('/').pop().split('.')[0];
                    await deleteFromCloudinary(`bibliotheque/pdf-livres/${oldPdfPublicId}`, 'raw');
                }
                updateData.fichierPdf = req.files.pdf[0].path;
            }

            // Supprimer l'ancienne image de Cloudinary si une nouvelle est uploadée
            if (req.files.image && req.files.image.length > 0) {
                if (livreExist.imageCouverture) {
                    const oldImagePublicId = livreExist.imageCouverture.split('/').pop().split('.')[0];
                    await deleteFromCloudinary(`bibliotheque/images-couvertures/${oldImagePublicId}`, 'image');
                }
                updateData.imageCouverture = req.files.image[0].path;
            }
        }

        const livre = await Livre.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json({ message: 'Livre modifié', livre });
    } catch (err) {
        console.error('Erreur lors de la modification du livre:', err);
        res.status(500).json({ message: err.message });
    }
};

// Supprimer un livre (Admin) avec Cloudinary
exports.supprimerLivre = async (req, res) => {
    try {
        const livre = await Livre.findById(req.params.id);
        if (!livre) return res.status(404).json({ message: 'Livre non trouvé' });

        // Supprimer le PDF de Cloudinary
        if (livre.fichierPdf) {
            try {
                const pdfPublicId = livre.fichierPdf.split('/').pop().split('.')[0];
                await deleteFromCloudinary(`bibliotheque/pdf-livres/${pdfPublicId}`, 'raw');
                console.log('PDF supprimé de Cloudinary:', pdfPublicId);
            } catch (error) {
                console.error('Erreur suppression PDF Cloudinary:', error);
            }
        }

        // Supprimer l'image de couverture de Cloudinary
        if (livre.imageCouverture) {
            try {
                const imagePublicId = livre.imageCouverture.split('/').pop().split('.')[0];
                await deleteFromCloudinary(`bibliotheque/images-couvertures/${imagePublicId}`, 'image');
                console.log('Image supprimée de Cloudinary:', imagePublicId);
            } catch (error) {
                console.error('Erreur suppression image Cloudinary:', error);
            }
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
        console.error('Erreur lors de la suppression du livre:', err);
        res.status(500).json({ message: err.message });
    }
};

// Affichage des livres (Tout le monde)
exports.listeLivres = async (req, res) => {
    try {
        // Pagination - augmenter la limite par défaut
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;
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

// Télécharger un livre (Utilisateur connecté) avec Cloudinary
const Telechargement = require('../models/telechargement');
const axios = require('axios');

exports.telechargerLivre = async (req, res) => {
    try {
        // Chercher le livre
        const livre = await Livre.findById(req.params.id);
        if (!livre) {
            return res.status(404).json({ message: 'Livre non trouvé' });
        }

        // Enregistrer le téléchargement dans la collection
        const nouveauTelechargement = await Telechargement.create({
            utilisateurId: req.user._id,
            livreId: livre._id,
            dateTelechargement: new Date()
        });
        
        console.log('Téléchargement enregistré:', {
            utilisateurId: req.user._id,
            livreId: livre._id,
            telechargementId: nouveauTelechargement._id
        });

        // Télécharger le PDF depuis Cloudinary et le servir à l'utilisateur
        try {
            const response = await axios.get(livre.fichierPdf, {
                responseType: 'stream',
                timeout: 30000 // 30 secondes timeout
            });

            // Définir les headers pour le téléchargement
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${livre.titre.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`);

            // Envoyer le stream directement au client
            response.data.pipe(res);

        } catch (downloadError) {
            console.error('Erreur lors du téléchargement depuis Cloudinary:', downloadError);
            res.status(500).json({ message: 'Erreur lors du téléchargement du fichier' });
        }

    } catch (err) {
        console.error("Erreur téléchargement:", err);
        res.status(500).json({ message: "Erreur lors du téléchargement du livre" });
    }
};
