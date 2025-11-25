const pool = require('../config/database');

const productAttributesModel = {

  create: async (data) => {
    const { product_id, key_ingredients, know_about_product, benefits } = data;

    const [result] = await pool.query(
      `INSERT INTO product_attributes 
       (product_id, key_ingredients, know_about_product, benefits)
       VALUES (?, ?, ?, ?)`,
      [product_id, key_ingredients, know_about_product, JSON.stringify(benefits)]
    );

    return result;
  },

  update: async (attribute_id, data) => {
    const { key_ingredients, know_about_product, benefits } = data;

    const [result] = await pool.query(
      `UPDATE product_attributes
       SET key_ingredients = ?, know_about_product = ?, benefits = ?
       WHERE attribute_id = ?`,
      [key_ingredients, know_about_product, JSON.stringify(benefits), attribute_id]
    );

    return result;
  },

  delete: async (attribute_id) => {
    const [result] = await pool.query(
      `DELETE FROM product_attributes WHERE attribute_id = ?`,
      [attribute_id]
    );
    return result;
  },

  getByProductId: async (product_id) => {
    const [rows] = await pool.query(
      `SELECT * FROM product_attributes WHERE product_id = ?`,
      [product_id]
    );
    return rows[0] || null;
  }
};

module.exports = productAttributesModel;
