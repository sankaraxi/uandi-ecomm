const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');
// const { authenticateAdmin } = require('../middleware/auth');

// Public routes
router.get('/', testimonialController.getAllTestimonials);

// Protected admin routes
// router.post('/', authenticateAdmin, testimonialController.createTestimonial);
// router.get('/:id', authenticateAdmin, testimonialController.getTestimonialById);
// router.put('/:id', authenticateAdmin, testimonialController.updateTestimonial);
// router.delete('/:id', authenticateAdmin, testimonialController.deleteTestimonial);
// router.patch('/:id/display-order', authenticateAdmin, testimonialController.updateDisplayOrder);


router.post('/', testimonialController.createTestimonial);
router.get('/:id', testimonialController.getTestimonialById);
router.put('/:id', testimonialController.updateTestimonial);
router.delete('/:id', testimonialController.deleteTestimonial);
router.patch('/:id/display-order', testimonialController.updateDisplayOrder);
module.exports = router;
