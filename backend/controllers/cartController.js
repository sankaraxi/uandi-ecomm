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
            const {
                user_id,
                product_id,
                variant_id,
                quantity = 1,
                price,
                main_image,
                source_collection_id // OPTIONAL
            } = req.body;

            if (!user_id || !product_id || !variant_id) {
                return res.status(400).json({
                    success: false,
                    message: "Missing user_id, product_id or variant_id"
                });
            }

            await cartModel.addToCart({
                user_id,
                product_id,
                variant_id,
                quantity,
                price,
                main_image,
                source_collection_id   // IMPORTANT: pass to model
            });

            const items = await cartModel.getCartByUserId(user_id);

            res.status(201).json({
                success: true,
                items
            });

        } catch (err) {
            console.error("Error adding to cart:", err);
            res.status(500).json({
                success: false,
                message: "Failed to add to cart"
            });
        }
    },

    // Bulk merge: guest cart items -> user cart
    mergeCart: async (req, res) => {
        try {
            const { items } = req.body || {};
            if (!Array.isArray(items) || items.length === 0) {
                return res.status(400).json({ success: false, message: 'No items to merge' });
            }

            const merged = [];
            const failed = [];

            for (const raw of items) {
                try {
                    const user_id = raw.user_id;
                    const product_id = raw.product_id;
                    const variant_id = raw.variant_id;
                    const quantity = Number(raw.quantity || 1);
                    const price = Number(raw.price);
                    const main_image = raw.main_image || null;
                    const source_collection_id = raw.source_collection_id || null;

                    if (!user_id || !product_id || !variant_id || Number.isNaN(price) || price <= 0 || quantity <= 0) {
                        failed.push({ item: raw, error: 'Invalid fields' });
                        continue;
                    }

                    await cartModel.addToCart({ user_id, product_id, variant_id, quantity, price, main_image, source_collection_id });
                    merged.push({ product_id, variant_id });
                } catch (err) {
                    failed.push({ item: raw, error: err?.message || 'Add failed' });
                }
            }

            const userId = items[0]?.user_id;
            const refreshed = userId ? await cartModel.getCartByUserId(userId) : [];

            res.status(200).json({ success: true, mergedCount: merged.length, failedCount: failed.length, failed, items: refreshed });
        } catch (err) {
            console.error('Error merging cart:', err);
            res.status(500).json({ success: false, message: 'Failed to merge cart' });
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
            const { user_id } = req.body; // Get user_id from request body

            console.log('🛒 Remove item request:', { cartItemId, user_id });

            if (!user_id) {
                return res.status(400).json({
                    success: false,
                    message: 'User ID is required'
                });
            }

            await cartModel.removeCartItem(cartItemId, user_id);

            // Return updated cart
            const items = await cartModel.getCartByUserId(user_id);

            res.status(200).json({
                success: true,
                message: 'Item removed successfully',
                items
            });
        } catch (err) {
            console.error('Error removing item:', err);
            res.status(500).json({
                success: false,
                message: err.message || 'Failed to remove item'
            });
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
