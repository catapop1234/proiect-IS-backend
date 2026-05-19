const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');

router.post('/update', authenticate, authController.updateUser);

module.exports = router;
