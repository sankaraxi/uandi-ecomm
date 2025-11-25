const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Create new order
router.post('/create', orderController.createOrder);

// Get order by ID
// router.get('/:orderId', orderController.getOrder);

router.get("/getOrders/:userId",orderController.getUserOrders)

router.get('/all', orderController.getAllOrders);

router.get('/:orderNumber', orderController.getOrder);

module.exports = router;