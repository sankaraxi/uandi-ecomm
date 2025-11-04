const db = require('../config/database');

class Blog {
    static async create(blogData) {
        const { title, slug, excerpt, content, featured_image, author_name, status, published_at, meta_title, meta_description } = blogData;
        
        // Convert empty string to null for published_at
        const publishedDate = published_at && published_at.trim() !== '' ? published_at : null;
        
        const query = `
            INSERT INTO blogs (title, slug, excerpt, content, featured_image, author_name, status, published_at, meta_title, meta_description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [
            title, 
            slug, 
            excerpt, 
            content, 
            featured_image, 
            author_name, 
            status, 
            publishedDate, 
            meta_title, 
            meta_description
        ]);
        return result.insertId;
    }

    static async findAll(filters = {}) {
        let query = 'SELECT * FROM blogs WHERE 1=1';
        const params = [];

        if (filters.status) {
            query += ' AND status = ?';
            params.push(filters.status);
        }

        query += ' ORDER BY created_at DESC';

        // Only add LIMIT/OFFSET if limit is provided and valid
        if (filters.limit && !isNaN(filters.limit) && filters.limit > 0) {
            const limit = parseInt(filters.limit);
            const offset = filters.offset && !isNaN(filters.offset) ? parseInt(filters.offset) : 0;
            
            query += ' LIMIT ? OFFSET ?';
            params.push(limit, offset);
        }

        const [rows] = await db.execute(query, params);
        return rows;
    }

    static async findById(id) {
        const query = 'SELECT * FROM blogs WHERE id = ?';
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    }

    static async findBySlug(slug) {
        const query = 'SELECT * FROM blogs WHERE slug = ?';
        const [rows] = await db.execute(query, [slug]);
        return rows[0];
    }

    static async update(id, blogData) {
        const fields = [];
        const values = [];

        Object.keys(blogData).forEach(key => {
            if (blogData[key] !== undefined) {
                // Handle published_at empty string
                if (key === 'published_at' && blogData[key] === '') {
                    fields.push(`${key} = ?`);
                    values.push(null);
                } else {
                    fields.push(`${key} = ?`);
                    values.push(blogData[key]);
                }
            }
        });

        values.push(id);
        const query = `UPDATE blogs SET ${fields.join(', ')} WHERE id = ?`;
        const [result] = await db.execute(query, values);
        return result.affectedRows;
    }

    static async delete(id) {
        const query = 'DELETE FROM blogs WHERE id = ?';
        const [result] = await db.execute(query, [id]);
        return result.affectedRows;
    }

    static async count(filters = {}) {
        let query = 'SELECT COUNT(*) as total FROM blogs WHERE 1=1';
        const params = [];

        if (filters.status) {
            query += ' AND status = ?';
            params.push(filters.status);
        }

        const [rows] = await db.execute(query, params);
        return rows[0].total;
    }
}

module.exports = Blog;
