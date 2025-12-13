const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    orderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Order', 
        required: true 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    currency: { 
        type: String, 
        default: 'USD' 
    },
    paymentMethod: { 
        type: String, 
        enum: ['stripe', 'paypal', 'card', 'mock'], 
        required: true 
    },
    transactionId: { 
        type: String, 
        unique: true, 
        sparse: true 
    },
    status: { 
        type: String, 
        enum: ['pending', 'processing', 'completed', 'failed', 'refunded'], 
        default: 'pending' 
    },
    paymentDetails: {
        last4: String,
        brand: String,
        paypalEmail: String,
        receiptUrl: String
    },
    metadata: {
        customerName: String,
        customerEmail: String,
        shippingAddress: String,
        phone: String
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    completedAt: Date,
    failureReason: String
}, { timestamps: true });

// Index for faster queries
paymentSchema.index({ orderId: 1, userId: 1, status: 1 });
paymentSchema.index({ transactionId: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
