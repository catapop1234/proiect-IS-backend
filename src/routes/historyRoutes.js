const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const historyController = require('../controllers/historyController');

router.get('/', authenticate, historyController.getHistory);
router.post('/', authenticate, historyController.saveHistory);
router.delete('/', authenticate, historyController.clearHistory);

module.exports = router;
