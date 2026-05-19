const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const favoriteController = require('../controllers/favoriteController');

router.get('/', authenticate, favoriteController.getFavorites);
router.post('/', authenticate, favoriteController.addFavorite);
router.delete('/:placeId', authenticate, favoriteController.removeFavorite);
router.post('/check', authenticate, favoriteController.checkFavorites);
router.get('/status/:placeId', authenticate, favoriteController.favoriteStatus);

module.exports = router;
