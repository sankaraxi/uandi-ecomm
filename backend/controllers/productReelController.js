const ProductReel = require('../models/ProductReel');

exports.createReel = async (req, res) => {
    try {
        const reelData = req.body;

        const reelId = await ProductReel.create(reelData);
        const reel = await ProductReel.findById(reelId);

        res.status(201).json({
            success: true,
            message: 'Product reel created successfully',
            data: reel
        });
    } catch (error) {
        console.error('Create reel error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create product reel',
            error: error.message
        });
    }
};

exports.getAllReels = async (req, res) => {
    try {
        const { product_id, variant_id, status } = req.query;
        const filters = { product_id, variant_id, status };
        
        const reels = await ProductReel.findAll(filters);

        res.status(200).json({
            success: true,
            data: reels
        });
    } catch (error) {
        console.error('Get reels error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch product reels',
            error: error.message
        });
    }
};

exports.getReelById = async (req, res) => {
    try {
        const { id } = req.params;
        const reel = await ProductReel.findById(id);

        if (!reel) {
            return res.status(404).json({
                success: false,
                message: 'Product reel not found'
            });
        }

        res.status(200).json({
            success: true,
            data: reel
        });
    } catch (error) {
        console.error('Get reel error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch product reel',
            error: error.message
        });
    }
};

exports.getReelsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const reels = await ProductReel.findByProductId(productId);

        res.status(200).json({
            success: true,
            data: reels
        });
    } catch (error) {
        console.error('Get product reels error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch product reels',
            error: error.message
        });
    }
};

exports.getReelsByVariant = async (req, res) => {
    try {
        const { variantId } = req.params;
        const reels = await ProductReel.findByVariantId(variantId);

        res.status(200).json({
            success: true,
            data: reels
        });
    } catch (error) {
        console.error('Get variant reels error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch variant reels',
            error: error.message
        });
    }
};

exports.updateReel = async (req, res) => {
    try {
        const { id } = req.params;
        const reelData = req.body;

        const existingReel = await ProductReel.findById(id);
        if (!existingReel) {
            return res.status(404).json({
                success: false,
                message: 'Product reel not found'
            });
        }

        await ProductReel.update(id, reelData);
        const updatedReel = await ProductReel.findById(id);

        res.status(200).json({
            success: true,
            message: 'Product reel updated successfully',
            data: updatedReel
        });
    } catch (error) {
        console.error('Update reel error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update product reel',
            error: error.message
        });
    }
};

exports.deleteReel = async (req, res) => {
    try {
        const { id } = req.params;

        const reel = await ProductReel.findById(id);
        if (!reel) {
            return res.status(404).json({
                success: false,
                message: 'Product reel not found'
            });
        }

        await ProductReel.delete(id);

        res.status(200).json({
            success: true,
            message: 'Product reel deleted successfully'
        });
    } catch (error) {
        console.error('Delete reel error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete product reel',
            error: error.message
        });
    }
};

exports.incrementViews = async (req, res) => {
    try {
        const { id } = req.params;

        const reel = await ProductReel.findById(id);
        if (!reel) {
            return res.status(404).json({
                success: false,
                message: 'Product reel not found'
            });
        }

        await ProductReel.incrementViews(id);

        res.status(200).json({
            success: true,
            message: 'View count incremented'
        });
    } catch (error) {
        console.error('Increment views error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to increment views',
            error: error.message
        });
    }
};
