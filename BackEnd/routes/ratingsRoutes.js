const express = require('express');
const router = express.Router();
const { 
    addOrUpdateRating, 
    getBookRatingStats, 
    getUserRating, 
    getBookRatings, 
    deleteRating 
} = require('../controllers/ratingController');
const auth = require('../middlewares/auth');

// Routes pour les ratings
router.post('/', auth, addOrUpdateRating);
router.get('/book/:livreId/stats', getBookRatingStats);
router.get('/book/:livreId/user', auth, getUserRating);
router.get('/book/:livreId', getBookRatings);
router.delete('/book/:livreId', auth, deleteRating);

module.exports = router;
