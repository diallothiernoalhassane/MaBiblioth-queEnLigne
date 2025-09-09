const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// Mettre à jour le profil utilisateur
router.put('/profile', auth, async (req, res) => {
    try {
        const { nom, email, currentPassword, newPassword } = req.body;
        const userId = req.user._id;

        // Trouver l'utilisateur
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Préparer les données à mettre à jour
        const updateData = {};
        
        if (nom) updateData.nom = nom;
        if (email) updateData.email = email;

        // Si un nouveau mot de passe est fourni
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ message: 'Le mot de passe actuel est requis' });
            }

            // Vérifier le mot de passe actuel
            const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.motDePasse);
            if (!isCurrentPasswordValid) {
                return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
            }

            // Hasher le nouveau mot de passe
            const saltRounds = 10;
            updateData.motDePasse = await bcrypt.hash(newPassword, saltRounds);
        }

        // Mettre à jour l'utilisateur
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, select: '-motDePasse' }
        );

        res.status(200).json({
            message: 'Profil mis à jour avec succès',
            user: updatedUser
        });

    } catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du profil' });
    }
});

module.exports = router;
