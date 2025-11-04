const Testimonial = require('../models/Testimonial');

exports.createTestimonial = async (req, res) => {
    try {
        const testimonialData = req.body;

        // Validate rating
        if (testimonialData.rating < 1 || testimonialData.rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        const testimonialId = await Testimonial.create(testimonialData);
        const testimonial = await Testimonial.findById(testimonialId);

        res.status(201).json({
            success: true,
            message: 'Testimonial created successfully',
            data: testimonial
        });
    } catch (error) {
        console.error('Create testimonial error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create testimonial',
            error: error.message
        });
    }
};

exports.getAllTestimonials = async (req, res) => {
    try {
        const { status, rating, limit, page = 1 } = req.query;
        const offset = limit ? (page - 1) * limit : undefined;

        const filters = { status, rating, limit, offset };
        const testimonials = await Testimonial.findAll(filters);

        res.status(200).json({
            success: true,
            data: testimonials
        });
    } catch (error) {
        console.error('Get testimonials error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch testimonials',
            error: error.message
        });
    }
};

exports.getTestimonialById = async (req, res) => {
    try {
        const { id } = req.params;
        const testimonial = await Testimonial.findById(id);

        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: 'Testimonial not found'
            });
        }

        res.status(200).json({
            success: true,
            data: testimonial
        });
    } catch (error) {
        console.error('Get testimonial error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch testimonial',
            error: error.message
        });
    }
};

exports.updateTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        const testimonialData = req.body;

        const existingTestimonial = await Testimonial.findById(id);
        if (!existingTestimonial) {
            return res.status(404).json({
                success: false,
                message: 'Testimonial not found'
            });
        }

        // Validate rating if provided
        if (testimonialData.rating && (testimonialData.rating < 1 || testimonialData.rating > 5)) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        await Testimonial.update(id, testimonialData);
        const updatedTestimonial = await Testimonial.findById(id);

        res.status(200).json({
            success: true,
            message: 'Testimonial updated successfully',
            data: updatedTestimonial
        });
    } catch (error) {
        console.error('Update testimonial error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update testimonial',
            error: error.message
        });
    }
};

exports.deleteTestimonial = async (req, res) => {
    try {
        const { id } = req.params;

        const testimonial = await Testimonial.findById(id);
        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: 'Testimonial not found'
            });
        }

        await Testimonial.delete(id);

        res.status(200).json({
            success: true,
            message: 'Testimonial deleted successfully'
        });
    } catch (error) {
        console.error('Delete testimonial error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete testimonial',
            error: error.message
        });
    }
};

exports.updateDisplayOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { display_order } = req.body;

        await Testimonial.updateDisplayOrder(id, display_order);

        res.status(200).json({
            success: true,
            message: 'Display order updated successfully'
        });
    } catch (error) {
        console.error('Update display order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update display order',
            error: error.message
        });
    }
};
