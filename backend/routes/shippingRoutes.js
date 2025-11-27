const express = require('express');
const router = express.Router();
const shippingController = require('../controllers/shippingController');

router.post('/check-serviceability', shippingController.checkServiceability);
router.get('/track/:orderNumber', shippingController.trackOrderByNumber);

module.exports = router;
