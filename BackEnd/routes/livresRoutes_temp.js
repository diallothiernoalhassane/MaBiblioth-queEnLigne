const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
const { uploadBookFiles, handleBookUpload } = require('../middlewares/uploadMiddleware');
const livreController = require('../controllers/livreController');

// Ajouter un livre (admin seulement, avec PDF + image) - Cloudinary
router.post('/livres', auth, role, uploadBookFiles, handleBookUpload, livreController.ajouterLivre);

// Modifier un livre (admin seulement) - Cloudinary
router.put('/livres/:id', auth, role, uploadBookFiles, handleBookUpload, livreController.modifierLivre);

// Supprimer un livre (admin seulement) - Cloudinary
router.delete('/livres/:id', auth, role, livreController.supprimerLivre);

// Détails d'un livre (public)
router.get('/livres/:id', livreController.livreDetails);

// Liste des livres (public) avec pagination, tri et filtre
router.get('/livres', livreController.listeLivres);

// Télécharger un livre (réservé aux utilisateurs connectés) - Cloudinary
router.get('/livres/:id/telecharger', auth, livreController.telechargerLivre);

module.exports = router;
