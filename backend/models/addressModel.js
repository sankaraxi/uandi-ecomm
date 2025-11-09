// backend/models/addressModel.js
const pool = require("../config/database");

const addressModel = {
    // Create new address
    async createAddress(data) {
        const query = `
            INSERT INTO addresses
            (user_id, full_name, phone_number, address_line_1, address_line_2, city, state, postal_code, country, is_default)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await pool.query(query, [
            data.user_id,
            data.full_name,
            data.phone_number,
            data.address_line_1,
            data.address_line_2 || "",
            data.city,
            data.state,
            data.postal_code,
            data.country,
            data.is_default ? 1 : 0,
        ]);

        return result;
    },

    // Get all addresses for a user
    async getAddressesByUser(user_id) {
        const [rows] = await pool.query("SELECT * FROM addresses WHERE user_id = ?", [user_id]);
        return rows;
    },

    // Get a single address by ID
    async getAddressById(address_id) {
        const [rows] = await pool.query("SELECT * FROM addresses WHERE address_id = ?", [address_id]);
        return rows[0];
    },

    // Update address
    async updateAddress(address_id, data) {
        const query = `
            UPDATE addresses
            SET full_name=?, phone_number=?, address_line_1=?, address_line_2=?, city=?, state=?, postal_code=?, country=?, is_default=?, updated_at=NOW()
            WHERE address_id=?`;

        const [result] = await pool.query(query, [
            data.full_name,
            data.phone_number,
            data.address_line_1,
            data.address_line_2 || "",
            data.city,
            data.state,
            data.postal_code,
            data.country,
            data.is_default ? 1 : 0,
            address_id,
        ]);

        return result;
    },

    // Delete address
    async deleteAddress(address_id) {
        const [result] = await pool.query("DELETE FROM addresses WHERE address_id = ?", [address_id]);
        return result;
    },
};

module.exports = addressModel;
