Quick Start: API Key Authentication

For Users

How to Access the Website

1. Open the website in your browser
2. You'll see the API Key Gate security screen
3. Choose one of these options:

   Option 1: Quick Select (Easiest)
   - Click on "Default Key" button
   - Click "Verify & Access"
   - You're in!

   Option 2: Manual Entry
   - Enter: `UNIVERSAL_SHOP_2024_KEY`
   - Click "Verify & Access"
   - You're in!

Available API Keys (Development)

```
Default Key:      UNIVERSAL_SHOP_2024_KEY
Development Key:  DEV_KEY_12345
```

Managing Your API Key

- Desktop: Click the API button in the top navigation bar
- Mobile: Open the menu and find Remove API Key
- Your key is stored safely in your browser

---

For Developers

Setup Steps

1. Backend Setup
   ```bash
   cd backend
   npm install
   
   # Create .env file with API key
   echo "API_KEY=UNIVERSAL_SHOP_2024_KEY" >> .env
   
   # Start server
   npm start
   ```

2. Frontend Setup
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Access the Site
   - Open http://localhost:5173
   - Enter API key: `UNIVERSAL_SHOP_2024_KEY`
   - Start developing!

Adding Custom API Keys

Edit `backend/src/middleware/apiKeyMiddleware.js`:

```javascript
const API_KEYS = [
    process.env.API_KEY || 'UNIVERSAL_SHOP_2024_KEY',
    'DEV_KEY_12345',
    'YOUR_CUSTOM_KEY',  // Add your key here
];
```

Testing API Key Protection

```bash
# Without API key (will fail)
curl http://localhost:5000/api/products

# With API key (will succeed)
curl -H "X-API-Key: UNIVERSAL_SHOP_2024_KEY" http://localhost:5000/api/products
```

---

Security Features

All API requests protected  
Keys validated server-side  
Easy key management from UI  
Keys stored securely in browser  
Request logging for monitoring  

---

Need Help?

Full Documentation: See [API_KEY_AUTHENTICATION.md](./API_KEY_AUTHENTICATION.md)  
Issues: Check backend console logs for errors  
Support: Contact your system administrator  

---

Quick Reference:
- Default Key: `UNIVERSAL_SHOP_2024_KEY`
- Dev Key: `DEV_KEY_12345`
- Header Name: `X-API-Key`
