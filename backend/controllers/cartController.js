const cartModel = require('../models/cartModel');

const cartController = {
    // Get all items in user’s cart
    getCart: async (req, res) => {
        try {
            const { userId } = req.params;
            const items = await cartModel.getCartByUserId(userId);
            res.status(200).json({ success: true, items });
        } catch (err) {
            console.error('Error fetching cart:', err);
            res.status(500).json({ success: false, message: 'Failed to fetch cart' });
        }
    },

    // Add item
    addToCart: async (req, res) => {
        try {
            const { user_id, product_id, variant_id, quantity, price, main_image } = req.body;

            if (!user_id || !product_id || !variant_id)
                return res.status(400).json({ success: false, message: 'Missing fields' });

            await cartModel.addToCart({ user_id, product_id, variant_id, quantity, price, main_image });

            const items = await cartModel.getCartByUserId(user_id);
            res.status(201).json({ success: true, items });
        } catch (err) {
            console.error('Error adding to cart:', err);
            res.status(500).json({ success: false, message: 'Failed to add to cart' });
        }
    },

    // Update quantity
    updateQuantity: async (req, res) => {
        try {
            const { cartItemId } = req.params;
            const { quantity } = req.body;

            await cartModel.updateCartQuantity(cartItemId, quantity);
            res.status(200).json({ success: true, message: 'Quantity updated' });
        } catch (err) {
            console.error('Error updating quantity:', err);
            res.status(500).json({ success: false, message: 'Failed to update quantity' });
        }
    },

    // Remove an item
    removeItem: async (req, res) => {
        try {
            const { cartItemId } = req.params;
            await cartModel.removeCartItem(cartItemId);
            res.status(200).json({ success: true, message: 'Item removed' });
        } catch (err) {
            console.error('Error removing item:', err);
            res.status(500).json({ success: false, message: 'Failed to remove item' });
        }
    },

    // Clear cart
    clearCart: async (req, res) => {
        try {
            const { userId } = req.params;
            await cartModel.clearCart(userId);
            res.status(200).json({ success: true, message: 'Cart cleared' });
        } catch (err) {
            console.error('Error clearing cart:', err);
            res.status(500).json({ success: false, message: 'Failed to clear cart' });
        }
    },
};

module.exports = cartController;
