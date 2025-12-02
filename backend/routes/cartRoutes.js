const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// GET all items for a user
router.get('/:userId', cartController.getCart);

// ADD item to cart
router.post('/', cartController.addToCart);

// BULK merge guest cart into user cart
router.post('/merge', cartController.mergeCart);

// UPDATE quantity
router.put('/:cartItemId', cartController.updateQuantity);

// DELETE specific item
router.delete('/:cartItemId', cartController.removeItem);

// CLEAR entire cart
router.delete('/clear/:userId', cartController.clearCart);

module.exports = router;
