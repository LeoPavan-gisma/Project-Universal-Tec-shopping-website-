// API Key Middleware for securing all API endpoints
// This middleware validates the API key sent from the frontend

const API_KEYS = [
    process.env.API_KEY || 'UNIVERSAL_SHOP_2024_KEY', // Primary key from environment
    'DEV_KEY_12345', // Development key
    'UNIVERSAL_SHOP_2024_KEY' // Default fallback key
];

exports.validateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    
    // Check if API key is provided
    if (!apiKey) {
        return res.status(401).json({ 
            message: 'API key required. Please provide a valid API key to access this service.',
            error: 'MISSING_API_KEY'
        });
    }

    // Validate API key against allowed keys
    if (!API_KEYS.includes(apiKey)) {
        return res.status(403).json({ 
            message: 'Invalid API key. Access denied.',
            error: 'INVALID_API_KEY'
        });
    }

    // API key is valid, proceed to next middleware
    next();
};

// Optional: Middleware to log API key usage (for monitoring)
exports.logApiKeyUsage = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey) {
        console.log(`[API Access] Key: ${apiKey.substring(0, 10)}... | Path: ${req.path} | Method: ${req.method}`);
    }
    next();
};
