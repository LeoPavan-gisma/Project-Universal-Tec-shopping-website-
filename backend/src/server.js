const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
// Allow requests from the frontend origin (set via .env FRONTEND_URL) or allow all in dev
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
const registerApiExtensions = require('./apiExtensions');
app.use(express.json());
app.use(morgan('dev'));

// API Key Authentication Middleware
const { validateApiKey, logApiKeyUsage } = require('./middleware/apiKeyMiddleware');
// Apply API key validation to all API routes
app.use('/api', logApiKeyUsage); // Log usage first
app.use('/api', validateApiKey); // Then validate the key

// Database connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.log(`Error: ${error.message}`));

// Import Routes
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
try {
    registerApiExtensions(app);
} catch (err) {
    console.warn('Failed to register API extensions:', err.message);
}
