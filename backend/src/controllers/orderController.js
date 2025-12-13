const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');

exports.createCheckoutSession = async (req, res) => {
    try {
        const { items } = req.body; // items: [{ productId, title, price, qty }]
        if (!items || !items.length) return res.status(400).json({ message: 'No items provided' });

        const line_items = items.map(i => ({
            price_data: {
                currency: 'usd',
                product_data: { name: i.title },
                unit_amount: Math.round(i.price * 100)
            },
            quantity: i.qty
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/cart`
        });

        // create order with pending status
        const order = new Order({
            userId: req.user ? req.user._id : null,
            items,
            totalPrice: items.reduce((s, it) => s + it.price * it.qty, 0),
            paymentStatus: 'pending'
        });
        await order.save();

        res.json({ url: session.url, orderId: order._id });
    } catch (err) {
        console.error('Create checkout error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getOrdersByUser = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error('Get orders by user error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error('Get all orders error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
