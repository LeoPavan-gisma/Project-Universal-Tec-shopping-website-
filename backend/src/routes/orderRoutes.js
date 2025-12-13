const express = require('express');
const router = express.Router();
const { createCheckoutSession, getOrdersByUser, getAllOrders } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/create-checkout-session', protect, createCheckoutSession);
router.get('/my-orders', protect, getOrdersByUser);
router.get('/', protect, adminOnly, getAllOrders);

module.exports = router;
