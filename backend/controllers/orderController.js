const orderModel = require('../models/orderModel');
const shippingController = require('./shippingController');

const orderController = {
    createOrder: async (req, res) => {
        try {
            const { order, order_items } = req.body;
            console.log('🛒 Received order creation request', { order, order_items });

            console.log('🛒 Creating order:', { order, order_items });

            if (!order || !order_items || order_items.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Order data and items are required'
                });
            }

            // Create order and order items
            const result = await orderModel.createOrderWithItems(order, order_items);

            // Integrate Shiprocket
            try {
                const fullOrder = await orderModel.getOrderById(result.order.order_id);
                const orderDetails = fullOrder.order;
                const orderItems = fullOrder.items;

                // Split name
                const nameParts = (orderDetails.full_name || '').trim().split(' ');
                const firstName = nameParts[0];
                const lastName = nameParts.slice(1).join(' ');

                const payload = {
                    order_id: orderDetails.order_number,
                    order_date: new Date(orderDetails.created_at).toISOString().slice(0, 16).replace('T', ' '),
                    pickup_location: "Home",
                    shipping_is_billing: true,
                    billing_customer_name: firstName,
                    billing_last_name: lastName,
                    billing_address: orderDetails.address_line_1,
                    billing_address_2: orderDetails.address_line_2 || "",
                    billing_city: orderDetails.city,
                    billing_pincode: orderDetails.postal_code,
                    billing_state: orderDetails.state,
                    billing_country: orderDetails.country || "India",
                    billing_email: orderDetails.email,
                    billing_phone: orderDetails.phone_number,
                    order_items: orderItems.map(item => ({
                        name: item.product_name,
                        sku: item.sku || "SKU",
                        units: item.quantity,
                        selling_price: parseFloat(item.price),
                        tax: 0
                    })),
                    payment_method: orderDetails.payment_method === 'COD' ? 'COD' : 'Prepaid',
                    sub_total: parseFloat(orderDetails.total_amount),
                    length: 10,
                    breadth: 10,
                    height: 10,
                    weight: orderItems.reduce((total, item) => total + (parseFloat(item.weight) || 0.5) * item.quantity, 0)
                };

                console.log('Sending to Shiprocket:', payload);
                await shippingController.createShiprocketOrder(payload);

            } catch (srError) {
                console.error('Shiprocket integration failed:', srError.message);
                // Continue without failing the order
            }

            res.status(201).json({
                success: true,
                message: 'Order created successfully',
                order: result.order,
                order_items: result.order_items
            });

        } catch (error) {
            console.error('Error creating order:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to create order'
            });
        }
    },

    getUserOrders: async (req, res) => {
        try {
            const { userId } = req.params;

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: 'User id is required'
                })
            }
            const result = await orderModel.getUserOrders(userId);

            res.status(201).json({
                success: true,
                message: 'User id is retrieved',
                orders : result,
            })
        }catch(error) {
            console.error('Error retrieving order:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to retrieving order'
            });
        }
    },

    getAllOrders: async (req, res) => {
        try {
            const orders = await orderModel.getAllOrders();
            res.status(200).json({
                success: true,
                orders
            });
        } catch (error) {
            console.error('Error fetching all orders:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch orders'
            });
        }
    },

    getOrder: async (req, res) => {
        try {
            const { orderNumber } = req.params;
            const result = await orderModel.getOrderByOrderNumber(orderNumber);

            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }

            res.status(200).json({
                success: true,
                order: result.order,
                items: result.items
            });
        } catch (error) {
            console.error('Error fetching order:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch order details'
            });
        }
    }

};

module.exports = orderController;