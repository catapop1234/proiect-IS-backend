const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.get('/me', authenticate, authController.me);

module.exports = router;
