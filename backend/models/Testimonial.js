const db = require('../config/database');

class Testimonial {
    static async create(testimonialData) {
        const { customer_name, customer_image, rating, testimonial_text, location, verified_purchase, status, display_order } = testimonialData;
        const query = `
            INSERT INTO testimonials (customer_name, customer_image, rating, testimonial_text, location, verified_purchase, status, display_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [customer_name, customer_image, rating, testimonial_text, location, verified_purchase || false, status || 'pending', display_order || 0]);
        return result.insertId;
    }

    static async findAll(filters = {}) {
        let query = 'SELECT * FROM testimonials WHERE 1=1';
        const params = [];

        if (filters.status) {
            query += ' AND status = ?';
            params.push(filters.status);
        }

        if (filters.rating) {
            query += ' AND rating >= ?';
            params.push(filters.rating);
        }

        query += ' ORDER BY display_order ASC, created_at DESC';

        if (filters.limit) {
            query += ' LIMIT ? OFFSET ?';
            params.push(parseInt(filters.limit), parseInt(filters.offset || 0));
        }

        const [rows] = await db.execute(query, params);
        return rows;
    }

    static async findById(id) {
        const query = 'SELECT * FROM testimonials WHERE id = ?';
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    }

    static async update(id, testimonialData) {
        const fields = [];
        const values = [];

        Object.keys(testimonialData).forEach(key => {
            if (testimonialData[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(testimonialData[key]);
            }
        });

        values.push(id);
        const query = `UPDATE testimonials SET ${fields.join(', ')} WHERE id = ?`;
        const [result] = await db.execute(query, values);
        return result.affectedRows;
    }

    static async delete(id) {
        const query = 'DELETE FROM testimonials WHERE id = ?';
        const [result] = await db.execute(query, [id]);
        return result.affectedRows;
    }

    static async updateDisplayOrder(id, display_order) {
        const query = 'UPDATE testimonials SET display_order = ? WHERE id = ?';
        const [result] = await db.execute(query, [display_order, id]);
        return result.affectedRows;
    }
}

module.exports = Testimonial;
