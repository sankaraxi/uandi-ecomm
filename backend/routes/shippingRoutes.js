const express = require('express');
const router = express.Router();
const shippingController = require('../controllers/shippingController');

router.post('/check-serviceability', shippingController.checkServiceability);

module.exports = router;
