const express = require('express');
const router = express.Router();
const placeController = require('../controllers/placeController');

router.get('/:placeId', placeController.getDetails);

module.exports = router;
