const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { doSearch, getRecommendations, nearbyPlaces } = require('../controllers/searchController');

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const { verifyToken } = require('../utils/jwt');
    const decoded = verifyToken(authHeader.split(' ')[1]);
    if (decoded) req.user = decoded;
  }
  next();
};

router.post('/hotels', optionalAuth, doSearch('hotels'));
router.post('/restaurants', optionalAuth, doSearch('restaurants'));
router.post('/attractions', optionalAuth, doSearch('tourist_attractions'));
router.get('/recommendations', authenticate, getRecommendations);
router.post('/nearby', authenticate, nearbyPlaces);

module.exports = router;
