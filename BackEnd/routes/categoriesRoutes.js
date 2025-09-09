const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
const categorieController = require('../controllers/categorieController');

// Ajouter une catégorie (admin seulement)
router.post('/categories', auth, role, categorieController.ajouterCategorie);

// Modifier une catégorie (admin seulement)
router.put('/categories/:id', auth, role, categorieController.modifierCategorie);

// Supprimer une catégorie (admin seulement)
router.delete('/categories/:id', auth, role, categorieController.supprimerCategorie);

// Liste des catégories (publique) avec pagination et tri
router.get('/categories', categorieController.listeCategories);

module.exports = router;
