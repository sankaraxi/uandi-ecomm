const pool = require('../config/database');

const cartModel = {
    // Get all cart items for a user
    getCartByUserId: async (userId) => {
        const [rows] = await pool.query(
            `SELECT ci.*, 
              p.product_name, 
              v.variant_name, 
              v.final_price, 
              v.price AS variant_price,
              v.stock,
              p.main_image
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.product_id
       JOIN variants v ON ci.variant_id = v.variant_id
       WHERE ci.user_id = ?`,
            [userId]
        );
        return rows;
    },

    // Add item to cart (create or update if exists)
    addToCart: async ({ user_id, product_id, variant_id, quantity, price }) => {
        const [existing] = await pool.query(
            'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ? AND variant_id = ?',
            [user_id, product_id, variant_id]
        );

        if (existing.length > 0) {
            const [updateResult] = await pool.query(
                'UPDATE cart_items SET quantity = quantity + ? WHERE cart_item_id = ?',
                [quantity, existing[0].cart_item_id]
            );
            return updateResult;
        } else {
            const [result] = await pool.query(
                'INSERT INTO cart_items (user_id, product_id, variant_id, quantity, price) VALUES (?, ?, ?, ?, ?)',
                [user_id, product_id, variant_id, quantity, price]
            );
            return result;
        }
    },

    // Update quantity
    updateCartQuantity: async (cartItemId, quantity) => {
        const [result] = await pool.query(
            'UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?',
            [quantity, cartItemId]
        );
        return result;
    },

    // Remove item
    removeCartItem: async (cartItemId) => {
        const [result] = await pool.query(
            'DELETE FROM cart_items WHERE cart_item_id = ?',
            [cartItemId]
        );
        return result;
    },

    // Clear cart for a user
    clearCart: async (userId) => {
        const [result] = await pool.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);
        return result;
    },
};

module.exports = cartModel;
