const db = require('../config/database');

class ProductReel {
    static async create(reelData) {
        const { product_id, variant_id, title, description, video_url, thumbnail_url, duration, status, display_order } = reelData;
        const query = `
            INSERT INTO product_reels (product_id, variant_id, title, description, video_url, thumbnail_url, duration, status, display_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [product_id, variant_id, title, description, video_url, thumbnail_url, duration, status || 'processing', display_order || 0]);
        return result.insertId;
    }

    static async findAll(filters = {}) {
        let query = 'SELECT * FROM product_reels WHERE 1=1';
        const params = [];

        if (filters.product_id) {
            query += ' AND product_id = ?';
            params.push(filters.product_id);
        }

        if (filters.variant_id) {
            query += ' AND variant_id = ?';
            params.push(filters.variant_id);
        }

        if (filters.status) {
            query += ' AND status = ?';
            params.push(filters.status);
        }

        query += ' ORDER BY display_order ASC, created_at DESC';

        const [rows] = await db.execute(query, params);
        return rows;
    }

    static async findById(id) {
        const query = 'SELECT * FROM product_reels WHERE id = ?';
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    }

    static async findByProductId(productId) {
        const query = 'SELECT * FROM product_reels WHERE product_id = ? AND status = "active" ORDER BY display_order ASC';
        const [rows] = await db.execute(query, [productId]);
        return rows;
    }

    static async findByVariantId(variantId) {
        const query = 'SELECT * FROM product_reels WHERE variant_id = ? AND status = "active" ORDER BY display_order ASC';
        const [rows] = await db.execute(query, [variantId]);
        return rows;
    }

    static async update(id, reelData) {
        const fields = [];
        const values = [];

        Object.keys(reelData).forEach(key => {
            if (reelData[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(reelData[key]);
            }
        });

        values.push(id);
        const query = `UPDATE product_reels SET ${fields.join(', ')} WHERE id = ?`;
        const [result] = await db.execute(query, values);
        return result.affectedRows;
    }

    static async delete(id) {
        const query = 'DELETE FROM product_reels WHERE id = ?';
        const [result] = await db.execute(query, [id]);
        return result.affectedRows;
    }

    static async incrementViews(id) {
        const query = 'UPDATE product_reels SET views_count = views_count + 1 WHERE id = ?';
        const [result] = await db.execute(query, [id]);
        return result.affectedRows;
    }
}

module.exports = ProductReel;
