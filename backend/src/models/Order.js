const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        default: null 
    },
    orderNumber: {
        type: String,
        unique: true,
        required: true
    },
    customerInfo: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: String
    },
    items: [{
        productId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product' 
        },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        qty: { type: Number, required: true, min: 1 },
        image: String
    }],
    totalPrice: { 
        type: Number, 
        required: true 
    },
    shippingAddress: {
        fullAddress: { type: String, required: true },
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    paymentStatus: { 
        type: String, 
        enum: ['pending', 'paid', 'failed', 'refunded'], 
        default: 'pending' 
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    trackingInfo: {
        carrier: String,
        trackingNumber: String,
        estimatedDelivery: Date
    },
    notes: String,
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Auto-generate order number before saving
orderSchema.pre('save', async function(next) {
    if (!this.orderNumber) {
        this.orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    }
    next();
});

// Indexes for faster queries
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ paymentStatus: 1, orderStatus: 1 });

module.exports = mongoose.model('Order', orderSchema);
