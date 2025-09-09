
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
const telechargementController = require('../controllers/telechargementController');

// Récupérer tous les téléchargements (admin seulement)
router.get('/telechargements', auth, role, telechargementController.getAllTelechargements);

// Récupérer les téléchargements d'un utilisateur spécifique
router.get('/telechargements/user/:userId', auth, telechargementController.getTelechargementsByUser);

// Récupérer les livres les plus téléchargés (public)
router.get('/telechargements/top-books', telechargementController.getTopDownloadedBooks);

// Ajouter un nouveau téléchargement
router.post('/telechargements', auth, telechargementController.addTelechargement);

// Voir l'historique personnel (utilisateur connecté)
router.get('/telechargements/my-downloads', auth, async (req, res) => {
    try {
        console.log('=== MY-DOWNLOADS DEBUG ===');
        console.log('User ID from token:', req.user._id);
        console.log('User object:', req.user);
        
        const Telechargement = require('../models/telechargement');
        
        // Vérifier d'abord tous les téléchargements dans la base
        const allDownloads = await Telechargement.find({});
        console.log('Total downloads in DB:', allDownloads.length);
        console.log('All downloads:', allDownloads.map(d => ({ 
            _id: d._id, 
            utilisateurId: d.utilisateurId, 
            livreId: d.livreId,
            date: d.dateTelechargement 
        })));
        
        const telechargements = await Telechargement.find({ utilisateurId: req.user._id })
            .populate({
                path: 'livreId',
                select: 'titre auteur description imageCouverture image categorieId dateAjout',
                populate: {
                    path: 'categorieId',
                    select: 'nom'
                }
            })
            .sort({ dateTelechargement: -1 });
        
        console.log('Found downloads for user:', telechargements.length);
        console.log('User downloads:', telechargements);
        
        // Filtrer les téléchargements valides
        const validTelechargements = telechargements.filter(t => t.livreId !== null);
        console.log('Valid downloads after filtering:', validTelechargements.length);
        
        // Format attendu par le frontend MyDownloadsBasic
        const formattedTelechargements = validTelechargements.map(t => ({
            _id: t._id,
            livreId: {
                titre: t.livreId?.titre || 'Titre non disponible',
                auteur: t.livreId?.auteur || 'Auteur non disponible'
            },
            dateTelechargement: t.dateTelechargement
        }));
        
        console.log('Formatted downloads:', formattedTelechargements);
        console.log('=== END MY-DOWNLOADS DEBUG ===');
        res.json(formattedTelechargements);
    } catch (err) {
        console.error('Error in my-downloads route:', err);
        res.status(500).json({ message: err.message });
    }
});

// Routes existantes (pour compatibilité)
router.get('/telechargements/me', auth, telechargementController.mesTelechargements);
router.get('/telechargements/all', auth, role, telechargementController.tousTelechargements);
router.get('/telechargements/top5Livres', telechargementController.top5Livres);
router.get('/telechargements/parCategorie', auth, role, telechargementController.telechargementsParCategorie);
router.get('/telechargements/evolution', auth, role, telechargementController.evolutionTelechargements);

// Exportation de router:
module.exports = router;

