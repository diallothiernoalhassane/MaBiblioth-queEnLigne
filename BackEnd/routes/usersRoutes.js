const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
const userController = require('../controllers/userController');

// Inscription (accessible publiquement)
router.post('/users', userController.inscription);

// Connexion (accessible publiquement)
router.post('/login', userController.connexion);

// Authentification Google OAuth (accessible publiquement)
router.post('/auth/google', userController.googleAuth);

// Callback Google OAuth (accessible publiquement)
router.post('/auth/google/callback', userController.googleCallback);

// Route temporaire pour créer un admin (à supprimer après utilisation)
router.post('/create-admin', userController.createAdmin);

// Liste des utilisateurs (admin seulement)
router.get('/users', auth, role, userController.listeUsers);

// Modifier un utilisateur (admin seulement)
router.put('/users/:id', auth, role, userController.modifierUser);

// Supprimer un utilisateur (admin seulement)
router.delete('/users/:id', auth, role, userController.supprimerUser);

// Profil utilisateur (utilisateur connecté)
router.get('/users/profile', auth, userController.getProfile);
router.put('/users/profile', auth, userController.updateProfile);

module.exports = router;
