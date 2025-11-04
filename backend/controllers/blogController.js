const Blog = require('../models/Blog');
const slugify = require('slugify');

exports.createBlog = async (req, res) => {
    try {
        const blogData = req.body;
        
        // Generate slug from title if not provided
        if (!blogData.slug) {
            blogData.slug = slugify(blogData.title, { lower: true, strict: true });
        }

        // Convert empty published_at to null
        if (blogData.published_at === '') {
            blogData.published_at = null;
        }

        // Check if slug already exists
        const existingBlog = await Blog.findBySlug(blogData.slug);
        if (existingBlog) {
            return res.status(400).json({ 
                success: false, 
                message: 'Blog with this slug already exists' 
            });
        }

        const blogId = await Blog.create(blogData);
        const blog = await Blog.findById(blogId);

        res.status(201).json({
            success: true,
            message: 'Blog created successfully',
            data: blog
        });
    } catch (error) {
        console.error('Create blog error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create blog',
            error: error.message
        });
    }
};

exports.getAllBlogs = async (req, res) => {
    try {
        // Get query params with defaults
        const status = req.query.status;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const page = req.query.page ? parseInt(req.query.page) : 1;

        // Build filters object
        const filters = { status };
        
        // Only add pagination if limit is provided and valid
        if (limit && !isNaN(limit) && limit > 0) {
            const offset = (page - 1) * limit;
            filters.limit = limit;
            filters.offset = offset;
        }

        const blogs = await Blog.findAll(filters);
        const total = await Blog.count({ status });

        // Response with or without pagination
        const response = {
            success: true,
            data: blogs
        };

        // Only add pagination info if limit was provided
        if (limit) {
            response.pagination = {
                total,
                page: page,
                limit: limit,
                totalPages: Math.ceil(total / limit)
            };
        }

        res.status(200).json(response);
    } catch (error) {
        console.error('Get blogs error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch blogs',
            error: error.message
        });
    }
};

exports.getBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        res.status(200).json({
            success: true,
            data: blog
        });
    } catch (error) {
        console.error('Get blog error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch blog',
            error: error.message
        });
    }
};

exports.getBlogBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const blog = await Blog.findBySlug(slug);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        res.status(200).json({
            success: true,
            data: blog
        });
    } catch (error) {
        console.error('Get blog error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch blog',
            error: error.message
        });
    }
};

exports.updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blogData = req.body;

        // Convert empty published_at to null
        if (blogData.published_at === '') {
            blogData.published_at = null;
        }

        // Check if blog exists
        const existingBlog = await Blog.findById(id);
        if (!existingBlog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        // If slug is being updated, check uniqueness
        if (blogData.slug && blogData.slug !== existingBlog.slug) {
            const slugExists = await Blog.findBySlug(blogData.slug);
            if (slugExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Blog with this slug already exists'
                });
            }
        }

        await Blog.update(id, blogData);
        const updatedBlog = await Blog.findById(id);

        res.status(200).json({
            success: true,
            message: 'Blog updated successfully',
            data: updatedBlog
        });
    } catch (error) {
        console.error('Update blog error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update blog',
            error: error.message
        });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        await Blog.delete(id);

        res.status(200).json({
            success: true,
            message: 'Blog deleted successfully'
        });
    } catch (error) {
        console.error('Delete blog error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete blog',
            error: error.message
        });
    }
};
