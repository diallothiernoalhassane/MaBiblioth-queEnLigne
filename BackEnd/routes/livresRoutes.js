const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
const uploadLivre  = require('../middlewares/multer');
const livreController = require('../controllers/livreController');

// Ajouter un livre (admin seulement, avec PDF + image)
router.post('/livres', auth, role, uploadLivre.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'image', maxCount: 1 }
]), livreController.ajouterLivre);

// Modifier un livre (admin seulement)
router.put('/livres/:id', auth, role, uploadLivre.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'image', maxCount: 1 }
]), livreController.modifierLivre);

// Supprimer un livre (admin seulement)
router.delete('/livres/:id', auth, role, livreController.supprimerLivre);

// Détails d’un livre (public)
router.get('/livres/:id',livreController.livreDetails);

// Liste des livres (public) avec pagination, tri et filtre
router.get('/livres', livreController.listeLivres);

module.exports = router;

// Télécharger un livre (réservé aux utilisateurs connectés)
router.get('/livres/:id/telecharger', auth, livreController.telechargerLivre);
