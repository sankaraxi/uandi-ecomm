const User = require('../models/authModel');
const addressModel = require('../models/addressModel');
const orderModel = require('../models/orderModel');

const customerController = {
    getCustomerDetails: async (req, res) => {
        try {
            const { id } = req.params;

            // 1. Get User Details
            const user = await User.findByUserId(id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Customer not found'
                });
            }

            // 2. Get Addresses
            const addresses = await addressModel.getAddressesByUser(id);

            // 3. Get Orders
            const orders = await orderModel.getUserOrders(id);

            // 4. Calculate Total Revenue
            // Assuming revenue is calculated from orders that are not cancelled/refunded
            // or simply sum of all orders. Let's sum all for now, or filter by status if needed.
            // Usually revenue implies money received.
            // const validOrders = orders.filter(o => 
            //     o.payment_status === 'Paid' || 
            //     (o.payment_method === 'COD' && o.order_status === 'Delivered')
            // );
            
            const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
            console.log('Total Revenue Calculation:', { ordersCount: orders.length, totalRevenue });

            res.status(200).json({
                success: true,
                customer: {
                    ...user,
                    addresses,
                    orders,
                    total_revenue: totalRevenue,
                    orders_count: orders.length
                }
            });

        } catch (error) {
            console.error('Error fetching customer details:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch customer details'
            });
        }
    }
};

module.exports = customerController;
