const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
// const { authenticateAdmin } = require('../middleware/auth');

// Public routes
router.get('/', blogController.getAllBlogs);
router.get('/slug/:slug', blogController.getBlogBySlug);
router.get('/:id', blogController.getBlogById);

// Protected admin routes
// router.post('/', authenticateAdmin, blogController.createBlog);
// router.put('/:id', authenticateAdmin, blogController.updateBlog);
// router.delete('/:id', authenticateAdmin, blogController.deleteBlog);

router.post('/', blogController.createBlog);
router.put('/:id', blogController.updateBlog);
router.delete('/:id', blogController.deleteBlog);


module.exports = router;
