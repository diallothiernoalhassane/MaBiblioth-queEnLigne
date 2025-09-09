const Categorie = require('../models/categorieModel');
const Livre = require('../models/livreModel')


// Ajouter catégorie (Admin)
exports.ajouterCategorie = async (req, res) => {
    try {
        const categorie = new Categorie(req.body);
        const savedCategorie = await categorie.save();
        res.status(201).json({ message: 'Catégorie ajoutée', categorie: savedCategorie });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Modifier catégorie (Admin)
exports.modifierCategorie = async (req, res) => {
    try {
        const categorie = await Categorie.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: 'Catégorie modifiée', categorie });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Supprimer catégorie (Admin)
// Suppression d'une catégorie
exports.supprimerCategorie = async (req, res) => {
    try {
        const categorieId = req.params.id;

        // Vérifier si des livres existent dans cette catégorie
        const livres = await Livre.find({ categorieId: categorieId });
        if (livres.length > 0) {
            return res.status(400).json({
                message: "Impossible de supprimer cette catégorie car elle contient des livres."
            });
        }

        // Supprimer la catégorie si aucun livre n’est lié
        const resultat = await Categorie.findByIdAndDelete(categorieId);
        if (!resultat) {
            return res.status(404).json({ message: "Catégorie non trouvée." });
        }

        res.json({ message: "Catégorie supprimée avec succès." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};


// Afficher toutes les catégories (Tout le monde)
exports.listeCategories = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Tri
        const sort = req.query.order === 'desc' ? { nom: -1 } : { nom: 1 };

        const categories = await Categorie.find()
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const totalCategories = await Categorie.countDocuments();

        res.status(200).json({
            totalCategories,
            page,
            totalPages: Math.ceil(totalCategories / limit),
            categories
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

