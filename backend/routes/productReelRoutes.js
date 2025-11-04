const express = require('express');
const router = express.Router();
const productReelController = require('../controllers/productReelController');
// const { authenticateAdmin } = require('../middleware/auth');

// Public routes
router.get('/', productReelController.getAllReels);
router.get('/product/:productId', productReelController.getReelsByProduct);
router.get('/variant/:variantId', productReelController.getReelsByVariant);
router.get('/:id', productReelController.getReelById);
router.post('/:id/views', productReelController.incrementViews);

// Protected admin routes
// router.post('/', authenticateAdmin, productReelController.createReel);
// router.put('/:id', authenticateAdmin, productReelController.updateReel);
// router.delete('/:id', authenticateAdmin, productReelController.deleteReel);

router.post('/', productReelController.createReel);
router.put('/:id', productReelController.updateReel);
router.delete('/:id', productReelController.deleteReel);

module.exports = router;
