// backend/controllers/categoryController.js
const categoryModel = require('../models/categoryModel');

const categoryController = {
  // Get all categories
  getAllCategories: async (req, res) => {
    try {
      const categories = await categoryModel.getAllCategories();
      res.json({ success: true, data: categories });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Get category by ID
  getCategoryById: async (req, res) => {
    try {
      const category = await categoryModel.getCategoryById(req.params.id);
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      res.json({ success: true, data: category });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Create category
  createCategory: async (req, res) => {
    try {
      const result = await categoryModel.createCategory(req.body);
      res.status(201).json({ 
        success: true, 
        message: 'Category created successfully',
        data: { category_id: result.insertId }
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ 
          success: false, 
          message: 'Category name already exists' 
        });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Update category
  updateCategory: async (req, res) => {
    try {
      await categoryModel.updateCategory(req.params.id, req.body);
      res.json({ success: true, message: 'Category updated successfully' });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ 
          success: false, 
          message: 'Category name already exists' 
        });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Delete category
  deleteCategory: async (req, res) => {
    try {
      await categoryModel.deleteCategory(req.params.id);
      res.json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(400).json({ 
          success: false, 
          message: 'Cannot delete category with existing products' 
        });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = categoryController;
