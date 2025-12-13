const mongoose = require('mongoose');

const connectDB = async (uri) => {
    try {
        await mongoose.connect(uri, {
            // Mongoose 7+ uses sensible defaults; options can be added if needed
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection failed:', err);
        throw err;
    }
};

module.exports = connectDB;
