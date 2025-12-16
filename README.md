Universal Shopping Site

A full-stack e-commerce platform with advanced features including API key authentication, multi-language support, multiple currency options, AI assistant, and comprehensive admin panel.

Table of Contents

- [Features]
- [Tech Stack]
- [Requirements]
- [Installation]
- [Configuration]
- [Running the Project]
- [API Key Authentication]
- [Project Structure]
- [Available Scripts]
- [API Endpoints]
- [Troubleshooting]
- [Contributing]

Features

Security
- API Key Authentication - Secure access control for all API endpoints
- JWT-based user authentication
- Role-based access control (Admin/Customer)
- Protected routes and middleware

E-Commerce
- Product browsing with categories and filters
- Shopping cart management
- Order processing and tracking
- Payment integration (Stripe & PayPal)
- Product reviews and ratings

User Management
- User registration and login
- Password reset functionality
- User dashboard with order history
- Admin panel for management

User Experience
- Multi-language support (English, Telugu, German)
- Multiple currency options (USD, EUR, INR, GBP, JPY, CNY)
- Multiple theme options (Light, Dark, Ocean, Sunset, Forest, Midnight, Rose)
- Responsive design for all devices
- Real-time chat widget
- AI-powered shopping assistant

Admin Features
- Product management (CRUD operations)
- Order management
- User management
- Dashboard with statistics
- Inventory tracking

Tech Stack

Frontend
- React 18+ - UI library
- Vite - Build tool and dev server
- React Router - Navigation
- Tailwind CSS - Styling
- Lucide React - Icons
- Axios - HTTP client

Backend
- Node.js - Runtime environment
- Express.js - Web framework
- MongoDB - Database
- Mongoose - ODM
- JWT - Authentication
- bcryptjs - Password hashing
- CORS - Cross-origin resource sharing
- Morgan - HTTP request logger

Requirements

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js** (v16.0.0 or higher)
- **npm** (v8.0.0 or higher) or **yarn**
- **MongoDB** (v5.0 or higher) - Local or MongoDB Atlas
- **Git** (for cloning the repository)

### Optional
- **MongoDB Compass** - For database management
- **Postman** - For API testing

### Check Installed Versions
```bash
node --version
npm --version
mongod --version

Installation

1. Clone the Repository
```bash
git clone <your-repository-url>
cd "Project Universal Shoping Site"

2. Install Backend Dependencies
```bash
cd backend
npm install

3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

---

Configuration

Backend Configuration

1. Create .env file in the backend directory:
```bash
cd backend
```

2. Add the following environment variables:
```env
# Server Configuration
PORT=5000

# Database Configuration
MONGO_URI=mongodb://localhost:27017/shopease

# JWT Secret (use a strong random string)
JWT_SECRET=your_jwt_secret_key_here_change_this

# API Key Authentication (REQUIRED)
API_KEY=UNIVERSAL_SHOP_2024_KEY

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Payment Providers (Optional)
STRIPE_SECRET=sk_test_your_stripe_secret_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# OpenAI API Key (Optional - for AI features)
OPENAI_API_KEY=sk-your_openai_api_key
```

Frontend Configuration

1. Create .env file in the frontend directory:
```bash
cd frontend
```

2. Add the following environment variables:
```env
# API Base URL
VITE_API_URL=http://localhost:5000/api
```

MongoDB Setup

Option 1: Local MongoDB
```bash
# Start MongoDB service
mongod

# Or on Windows with MongoDB installed as service
net start MongoDB
```

Option 2: MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update MONGO_URI in backend .env

---

Running the Project

Development Mode

1. Start MongoDB (if using local)
```bash
mongod
```

2. Start Backend Server
```bash
# From project root
cd backend
npm start
```
The backend will run on http://localhost:5000

3. Start Frontend Development Server
```bash
# From project root (in a new terminal)
cd frontend
npm run dev
```
The frontend will run on http://localhost:5173

4. Open in Browser
Navigate to http://localhost:5173

Production Mode

Build Frontend
```bash
cd frontend
npm run build
```

Start Backend in Production
```bash
cd backend
NODE_ENV=production npm start
```

---

API Key Authentication

Default API Keys

For development and testing, use one of these keys:

| Purpose | API Key |
|---------|---------|
| Default | UNIVERSAL_SHOP_2024_KEY |
| Development | DEV_KEY_12345 |

How to Access the Website

1. Visit http://localhost:5173
2. You'll see the API Key Gate page
3. Click one of the Quick Select buttons or enter a key manually
4. Click "Verify & Access"
5. You're in!

Managing Your API Key

- Desktop: Click the API button in navigation
- Mobile: Open menu → API Key Settings
- Settings Page: Navigate to /api-settings

For Production

Important: Change the API key in production!

1. Generate a secure key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

2. Update API_KEY in backend .env
3. Update key in backend/src/middleware/apiKeyMiddleware.js

---

Project Structure

```
Project Universal Shoping Site/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # Database configuration
│   │   ├── controllers/
│   │   │   ├── authController.js   # Auth logic
│   │   │   ├── orderController.js  # Order logic
│   │   │   └── productController.js # Product logic
│   │   ├── middleware/
│   │   │   ├── apiKeyMiddleware.js # API key validation
│   │   │   └── authMiddleware.js   # JWT validation
│   │   ├── models/
│   │   │   ├── Cart.js
│   │   │   ├── Order.js
│   │   │   ├── Payment.js
│   │   │   ├── Product.js
│   │   │   ├── Review.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── ai.js
│   │   │   ├── authRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   ├── payments.js
│   │   │   └── productRoutes.js
│   │   ├── scripts/
│   │   │   ├── seedProducts.js    # Seed database
│   │   │   └── seedUsers.js       # Seed users
│   │   ├── apiExtensions.js
│   │   └── server.js              # Entry point
│   ├── .env                       # Environment variables
│   ├── package.json
│   └── README_BACKEND.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ApiKeyGate.jsx     # API key entry
│   │   │   ├── BiometricAuth.jsx
│   │   │   ├── ChatWidget.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── NavBar.jsx
│   │   │   └── SecurityGuard.jsx
│   │   ├── context/
│   │   │   └── AppContext.jsx     # Global state
│   │   ├── pages/
│   │   │   ├── AdminPanel.jsx
│   │   │   ├── AiAssistant.jsx
│   │   │   ├── ApiKeySettings.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── OrderSuccess.jsx
│   │   │   ├── PasswordReset.jsx
│   │   │   ├── Payment.jsx
│   │   │   ├── ProductPage.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Tracking.jsx
│   │   ├── utils/
│   │   │   ├── api.js             # API calls
│   │   │   └── jannuBot.js
│   │   ├── index.css
│   │   └── main.jsx               # Entry point
│   ├── .env                       # Environment variables
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── API_KEY_AUTHENTICATION.md      # API key docs
├── API_KEY_QUICKSTART.md          # Quick guide
├── IMPLEMENTATION_SUMMARY.md      # Implementation details
└── README.md                      # This file
```

---

Available Scripts

Backend Scripts
bash
npm start          # Start the server
npm run dev        # Start with nodemon (auto-reload)
npm test           # Run tests
npm run seed       # Seed database with sample data
```

Frontend Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

---

API Endpoints

Authentication
```
POST   /api/auth/register     # Register new user
POST   /api/auth/login        # Login user
GET    /api/auth/users        # Get all users (admin only)
```

Products
```
GET    /api/products          # Get all products
GET    /api/products/:id      # Get single product
POST   /api/products          # Create product (admin)
PUT    /api/products/:id      # Update product (admin)
DELETE /api/products/:id      # Delete product (admin)
```

Orders
```
GET    /api/orders            # Get all orders (admin)
GET    /api/orders/my-orders  # Get user's orders
POST   /api/orders            # Create new order
GET    /api/orders/:id        # Get single order
PUT    /api/orders/:id        # Update order status (admin)
```

Payments
```
POST   /api/payments/create-checkout-session  # Stripe checkout
POST   /api/payments/paypal                   # PayPal payment
```

AI
```
POST   /api/ai/chat           # Chat with AI assistant
```

Note: All endpoints require X-API-Key header with a valid API key.

---

Testing

Test Accounts

Admin Account:
- Email: admin@dev
- Password: password

Regular User:
- Email: user@dev
- Password: password

Manual Testing

1. Register: Create a new account
2. Login: Login with credentials
3. Browse: View products and categories
4. Cart: Add items to cart
5. Checkout: Complete purchase
6. Admin: Login as admin to manage

---

Troubleshooting

Common Issues

Port Already in Use
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (Windows)
taskkill /PID <process_id> /F

# Kill process (Mac/Linux)
kill -9 <process_id>
```

MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGO_URI in .env
- Verify MongoDB port (default: 27017)

API Key Error
- Ensure you've entered the API key
- Check if backend is running
- Verify API key in backend middleware matches

Module Not Found
```bash
# Reinstall dependencies
cd backend && npm install
cd ../frontend && npm install
```

Frontend Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

Getting Help

- Check backend console logs for errors
- Check browser DevTools console
- Review documentation files
- Check MongoDB connection

---

Security Considerations

Development
- API keys are validated
- JWT tokens for authentication
- Passwords are hashed
- CORS is configured

Production Checklist
- [ ] Change all default API keys
- [ ] Use strong JWT secret
- [ ] Enable HTTPS
- [ ] Set secure CORS origins
- [ ] Use environment variables
- [ ] Enable rate limiting
- [ ] Set up monitoring
- [ ] Regular security updates
- [ ] Database backups

---

Environment Variables Reference

Backend Required
| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGO_URI | MongoDB connection | mongodb://localhost:27017/shopease |
| JWT_SECRET | JWT signing key | your_secret_key |
| API_KEY | Primary API key | UNIVERSAL_SHOP_2024_KEY |

Backend Optional
| Variable | Description |
|----------|-------------|
| FRONTEND_URL | CORS origin |
| STRIPE_SECRET | Stripe API key |
| PAYPAL_CLIENT_ID | PayPal client ID |
| PAYPAL_CLIENT_SECRET | PayPal secret |
| OPENAI_API_KEY | OpenAI API key |

Frontend
| Variable | Description | Example |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:5000/api |

---

Deployment

Backend Deployment (e.g., Heroku, Railway, Render)

1. Set environment variables in hosting platform
2. Ensure MongoDB connection is configured
3. Deploy from Git repository or CLI

Frontend Deployment (e.g., Vercel, Netlify)

1. Build the frontend: npm run build
2. Deploy dist folder
3. Set environment variables
4. Configure backend API URL

---

Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (git checkout -b feature/AmazingFeature)
3. Commit changes (git commit -m 'Add some AmazingFeature')
4. Push to branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

---

License

This project is licensed under the MIT License.

---

Authors

- Your Name/Team

---

Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS
- MongoDB for the database
- All open-source contributors

---

Support

For issues or questions:
- Open an issue on GitHub
- Contact: your-email@example.com
- Documentation: See included markdown files

---

Quick Start Summary

```bash
# 1. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 2. Configure environment variables
# Create backend/.env and frontend/.env (see Configuration section)

# 3. Start MongoDB
mongod

# 4. Start backend (new terminal)
cd backend && npm start

# 5. Start frontend (new terminal)
cd frontend && npm run dev

# 6. Open browser
# Go to http://localhost:5173
# Enter API key: UNIVERSAL_SHOP_2024_KEY
# Start shopping!
```

---

Happy Shopping
Project-Universal-Tec-shopping-website-
College assignment 
0af5259b7e3115837dabd244f44a59ec33930db6
