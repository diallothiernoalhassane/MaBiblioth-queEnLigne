const Rating = require('../models/ratingModel');
const Livre = require('../models/livreModel');

// Ajouter ou mettre à jour une note
const addOrUpdateRating = async (req, res) => {
    try {
        const { livreId, rating, commentaire } = req.body;
        const utilisateurId = req.user._id;

        console.log('Rating request:', { livreId, rating, utilisateurId });

        // Vérifier que le livre existe
        const livre = await Livre.findById(livreId);
        if (!livre) {
            return res.status(404).json({ message: 'Livre non trouvé' });
        }

        // Si rating est 0, supprimer la note existante
        if (rating === 0) {
            const deletedRating = await Rating.findOneAndDelete({ livreId, utilisateurId });
            if (deletedRating) {
                return res.json({ message: 'Note supprimée avec succès' });
            } else {
                return res.json({ message: 'Aucune note à supprimer' });
            }
        }

        // Vérifier si l'utilisateur a déjà noté ce livre
        let existingRating = await Rating.findOne({ livreId, utilisateurId });

        if (existingRating) {
            // Mettre à jour la note existante
            existingRating.rating = rating;
            existingRating.commentaire = commentaire || existingRating.commentaire;
            await existingRating.save();
            res.json({ message: 'Note mise à jour avec succès', rating: existingRating });
        } else {
            // Créer une nouvelle note
            const newRating = new Rating({
                livreId,
                utilisateurId,
                rating,
                commentaire
            });
            await newRating.save();
            res.status(201).json({ message: 'Note ajoutée avec succès', rating: newRating });
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout/mise à jour de la note:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

// Obtenir les statistiques de notation d'un livre
const getBookRatingStats = async (req, res) => {
    try {
        const { livreId } = req.params;

        const mongoose = require('mongoose');
        const stats = await Rating.aggregate([
            { $match: { livreId: new mongoose.Types.ObjectId(livreId) } },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' },
                    totalRatings: { $sum: 1 },
                    ratings: { $push: '$rating' }
                }
            }
        ]);

        if (stats.length === 0) {
            return res.json({
                averageRating: 0,
                totalRatings: 0,
                ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
            });
        }

        const { averageRating, totalRatings, ratings } = stats[0];
        
        // Calculer la distribution des notes
        const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        ratings.forEach(rating => {
            ratingDistribution[rating]++;
        });

        res.json({
            averageRating: Math.round(averageRating * 10) / 10,
            totalRatings,
            ratingDistribution
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Obtenir la note d'un utilisateur pour un livre
const getUserRating = async (req, res) => {
    try {
        const { livreId } = req.params;
        const utilisateurId = req.user._id;

        const userRating = await Rating.findOne({ livreId, utilisateurId });
        
        if (!userRating) {
            return res.json({ rating: null, commentaire: null });
        }

        res.json({
            rating: userRating.rating,
            commentaire: userRating.commentaire,
            dateCreation: userRating.dateCreation
        });
    } catch (error) {
        console.error('Erreur lors de la récupération de la note utilisateur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Obtenir toutes les notes d'un livre avec les détails des utilisateurs
const getBookRatings = async (req, res) => {
    try {
        const { livreId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const ratings = await Rating.find({ livreId })
            .populate('utilisateurId', 'nom email')
            .sort({ dateCreation: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Rating.countDocuments({ livreId });

        res.json({
            ratings,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalRatings: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des notes:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Supprimer une note
const deleteRating = async (req, res) => {
    try {
        const { livreId } = req.params;
        const utilisateurId = req.user._id;

        const deletedRating = await Rating.findOneAndDelete({ livreId, utilisateurId });

        if (!deletedRating) {
            return res.status(404).json({ message: 'Note non trouvée' });
        }

        res.json({ message: 'Note supprimée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la note:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = {
    addOrUpdateRating,
    getBookRatingStats,
    getUserRating,
    getBookRatings,
    deleteRating
};
