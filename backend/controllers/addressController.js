// backend/controllers/addressController.js
const addressModel = require("../models/addressModel");

const addressController = {
    // 🟢 Get all addresses for a specific user
    getAddressesByUser: async (req, res) => {
        try {
            const { user_id } = req.params;
            const addresses = await addressModel.getAddressesByUser(user_id);

            res.json({ success: true, data: addresses });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // 🟢 Get single address by ID
    getAddressById: async (req, res) => {
        try {
            const { id } = req.params;
            const address = await addressModel.getAddressById(id);

            if (!address) {
                return res
                    .status(404)
                    .json({ success: false, message: "Address not found" });
            }

            res.json({ success: true, data: address });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // 🟢 Create new address
    createAddress: async (req, res) => {
        try {
            const {
                user_id,
                full_name,
                phone_number,
                address_line_1,
                address_line_2,
                city,
                state,
                postal_code,
                country,
                is_default,
            } = req.body;

            if (
                !user_id ||
                !full_name ||
                !phone_number ||
                !address_line_1 ||
                !city ||
                !state ||
                !postal_code ||
                !country
            ) {
                return res
                    .status(400)
                    .json({ success: false, message: "All required fields are mandatory" });
            }

            const result = await addressModel.createAddress({
                user_id,
                full_name,
                phone_number,
                address_line_1,
                address_line_2,
                city,
                state,
                postal_code,
                country,
                is_default: is_default ? 1 : 0,
            });

            res.status(201).json({
                success: true,
                message: "Address created successfully",
                data: { address_id: result.insertId },
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // 🟢 Update address
    updateAddress: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await addressModel.updateAddress(id, req.body);

            if (result.affectedRows === 0) {
                return res
                    .status(404)
                    .json({ success: false, message: "Address not found" });
            }

            res.json({ success: true, message: "Address updated successfully" });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // 🟢 Delete address
    deleteAddress: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await addressModel.deleteAddress(id);

            if (result.affectedRows === 0) {
                return res
                    .status(404)
                    .json({ success: false, message: "Address not found" });
            }

            res.json({ success: true, message: "Address deleted successfully" });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
};

module.exports = addressController;
