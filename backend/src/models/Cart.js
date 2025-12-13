const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        unique: true
    },
    items: [{
        productId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product', 
            required: true 
        },
        title: String,
        price: Number,
        image: String,
        qty: { 
            type: Number, 
            required: true, 
            min: 1,
            default: 1
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }],
    totalItems: {
        type: Number,
        default: 0
    },
    totalPrice: {
        type: Number,
        default: 0
    },
    lastModified: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

// Calculate totals before saving
cartSchema.pre('save', function(next) {
    this.totalItems = this.items.reduce((sum, item) => sum + item.qty, 0);
    this.totalPrice = this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    this.lastModified = Date.now();
    next();
});

// Index for faster queries
cartSchema.index({ userId: 1 });

module.exports = mongoose.model('Cart', cartSchema);
