const express = require('express');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

router.post('/create-order', paymentController.createRazorpayOrder);
router.post('/verify', paymentController.verifyPaymentAndCreateOrder);

module.exports = router;
