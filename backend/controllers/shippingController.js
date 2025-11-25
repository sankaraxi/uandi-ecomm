const axios = require('axios');
const { getShiprocketToken } = require('../utils/shiprocketToken');
const pool = require('../config/database');
const orderModel = require('../models/orderModel');


const shippingController = {
    checkServiceability: async (req, res) => {
        try {
            const { pickup_postcode, delivery_postcode, weight, cod } = req.body;

            console.log('Checking serviceability with:', req.body);

            // Check if Shiprocket credentials are set
            
           const token = await getShiprocketToken();

            // 2. Check serviceability
            const serviceabilityResponse = await axios.get('https://apiv2.shiprocket.in/v1/external/courier/serviceability', {
                params: {
                    pickup_postcode,
                    delivery_postcode,
                    weight,
                    cod
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = serviceabilityResponse.data;


            
            // Process response to find best courier or just return raw data
            // For now, let's return the first recommended courier's ETD
            
            if (data.data && data.data.available_courier_companies && data.data.available_courier_companies.length > 0) {
                const bestCourier = data.data.available_courier_companies[0];
                
                console.log('Serviceability found:', bestCourier);
                console.log('Serviceability found:', bestCourier.rate, bestCourier.etd, bestCourier.courier_name);
                res.status(200).json({
                    success: true,
                    estimated_delivery_date: bestCourier.etd,
                    courier_name: bestCourier.courier_name,
                    rate: bestCourier.rate
                });
            } else {
                 res.status(444).json({
                    success: false,
                    message: 'No serviceability found'
                });
            }

        } catch (error) {
            console.error('Shiprocket Error:', error.response?.data || error.message);
            res.status(500).json({
                success: false,
                message: 'Failed to check delivery serviceability'
            });
        }
    },

    createShiprocketOrder: async (orderPayload) => {
        try {
            const token = await getShiprocketToken();

            const response = await axios.post(
                'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
                orderPayload,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            const data = response.data;

            console.log('Shiprocket Order Created:', data);

            // ------------------------------------------------------
            // 1. Get your own order_id using channel_order_id
            // ------------------------------------------------------
            const [rows] = await pool.query(
                `SELECT order_id FROM orders WHERE order_number = ? LIMIT 1`,
                [data.channel_order_id]
            );

            if (rows.length === 0) {
                console.warn("No matching order_id found for channel_order_id:", data.channel_order_id);
            } else {
                const orderId = rows[0].order_id;

                // ------------------------------------------------------
                // 2. Save to shiprocket_order_responses table
                // ------------------------------------------------------
                await orderModel.saveShiprocketResponse({
                    order_id: orderId,
                    shiprocket_order_id: data.order_id || null,
                    channel_order_id: data.channel_order_id || null,
                    shipment_id: data.shipment_id || null,
                    status: data.status || null,
                    status_code: data.status_code || null,
                    onboarding_completed_now: data.onboarding_completed_now || 0,
                    awb_code: data.awb_code || null,
                    courier_company_id: data.courier_company_id || null,
                    courier_name: data.courier_name || null,
                    new_channel: data.new_channel || 0,
                    packaging_box_error: data.packaging_box_error || null
                });
            }

            return data;

        } catch (error) {
            console.error('Shiprocket Create Order Error:', error.response?.data || error.message);
            throw error;
        }
    }
};

module.exports = shippingController;
