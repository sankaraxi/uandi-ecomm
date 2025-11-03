// backend/models/categoryModel.js
const pool = require('../config/database');

const categoryModel = {
  // Get all categories
  getAllCategories: async () => {
    const [rows] = await pool.query(
      'SELECT * FROM categories ORDER BY created_at DESC'
    );
    return rows;
  },

  // Get category by ID
  getCategoryById: async (id) => {
    const [rows] = await pool.query(
      'SELECT * FROM categories WHERE category_id = ?',
      [id]
    );
    return rows[0];
  },

  // Create category
  createCategory: async (data) => {
    const { category_name, category_description } = data;
    const [result] = await pool.query(
      'INSERT INTO categories (category_name, category_description) VALUES (?, ?)',
      [category_name, category_description]
    );
    return result;
  },

  // Update category
  updateCategory: async (id, data) => {
    const { category_name, category_description } = data;
    const [result] = await pool.query(
      'UPDATE categories SET category_name = ?, category_description = ? WHERE category_id = ?',
      [category_name, category_description, id]
    );
    return result;
  },

  // Delete category
  deleteCategory: async (id) => {
    const [result] = await pool.query(
      'DELETE FROM categories WHERE category_id = ?',
      [id]
    );
    return result;
  }
};

module.exports = categoryModel;
