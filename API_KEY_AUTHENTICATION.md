API Key Authentication - Security Guide

Overview
This Universal Shopping Site now includes API Key Authentication to secure access to the website and backend APIs. Users must enter a valid API key before they can access any part of the application.

How It Works

Frontend Protection
1. When users visit the website, they are first shown an API Key Gate page
2. Users must enter a valid API key to proceed
3. The API key is validated by making a test request to the backend
4. Once validated, the key is stored in `localStorage` and included in all subsequent API requests
5. Users can remove/change their API key from the navigation menu

Backend Protection
- All API routes (`/api/`) are protected by API key middleware
- Every request must include a valid API key in the `X-API-Key` header
- Invalid or missing API keys result in 401/403 errors

Default API Keys

For development and testing, the following API keys are pre-configured:

1. Default Key: `UNIVERSAL_SHOP_2024_KEY`
2. Development Key: `DEV_KEY_12345`

Using Custom API Keys

Backend Configuration
Add your custom API key to the backend `.env` file:

```env
API_KEY=YOUR_CUSTOM_API_KEY_HERE
```

Updating Allowed Keys
Edit `backend/src/middleware/apiKeyMiddleware.js`:

```javascript
const API_KEYS = [
    process.env.API_KEY || 'UNIVERSAL_SHOP_2024_KEY',
    'DEV_KEY_12345',
    'YOUR_NEW_KEY_HERE',  // Add more keys here
];
```

User Guide

Entering Your API Key

1. Visit the website - You'll see the API Key Gate
2. Quick Select - Click one of the predefined keys for easy access:
   - Default Key: `UNIVERSAL_SHOP_2024_KEY`
   - Development Key: `DEV_KEY_12345`
3. Or manually enter - Type your API key in the input field
4. Click "Verify & Access" - The system will validate your key
5. Success! - You'll be granted access to the website

Managing Your API Key

Desktop
- Look for the "API" button in the navigation bar
- Click it to see your current key (partially masked)
- Click "Remove API Key" to log out and require re-authentication

Mobile
- Open the mobile menu (hamburger icon)
- Scroll to find "Remove API Key" button
- Confirm to remove your key and return to the API Key Gate

Security Features

Local Storage - Your API key is stored securely in your browser  
Masked Display - Keys are partially hidden in the UI (e.g., `UNIVERSA...`)  
Server Validation - Every request is verified by the backend  
Easy Removal - Quickly remove your key when needed  
Request Logging - All API access is logged on the server  

Technical Details

Request Headers
All API requests automatically include:

```javascript
headers: {
  'X-API-Key': 'YOUR_API_KEY',
  'Authorization': 'Bearer YOUR_JWT_TOKEN',  // If logged in
  'Content-Type': 'application/json'
}
```

API Key Flow

```
User visits site
    ↓
API Key Gate displayed
    ↓
User enters key
    ↓
Frontend validates with backend test request
    ↓
Valid? → Store in localStorage → Grant access
Invalid? → Show error message → Retry
```

Files Modified

Backend
- `backend/src/middleware/apiKeyMiddleware.js` - New middleware for key validation
- `backend/src/server.js` - Applied middleware to all `/api` routes

Frontend
- `frontend/src/components/ApiKeyGate.jsx` - New API key entry component
- `frontend/src/utils/api.js` - Updated to include API key in all requests
- `frontend/src/context/AppContext.jsx` - Added API key state management
- `frontend/src/main.jsx` - Added API key gate logic
- `frontend/src/components/NavBar.jsx` - Added API key management menu

Troubleshooting

"API key required" Error
- Cause: No API key provided
- Solution: Enter a valid API key on the API Key Gate page

"Invalid API key" Error
- Cause: The key doesn't match any allowed keys
- Solution: Check your key or use one of the default keys

Backend Connection Issues
- Cause: Backend server not running
- Solution: Start the backend server with `npm start`

Key Not Persisting
- Cause: Browser blocking localStorage
- Solution: Check browser settings and allow localStorage

Production Deployment

Security Best Practices

1. Change Default Keys - Never use default keys in production
2. Environment Variables - Store keys in `.env` file, not in code
3. Rotate Keys - Regularly update API keys
4. Monitor Access - Review API key usage logs
5. Limit Distribution - Only share keys with authorized users

Generating Secure Keys

Use these methods to generate strong API keys:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32

# Using Python
python -c "import secrets; print(secrets.token_hex(32))"
```

Support

For issues or questions about API key authentication:
- Check the backend console logs for detailed error messages
- Verify your API key is correctly configured
- Ensure the backend server is running and accessible
- Contact your system administrator for production keys

---

Last Updated: December 2025  
Version: 1.0
