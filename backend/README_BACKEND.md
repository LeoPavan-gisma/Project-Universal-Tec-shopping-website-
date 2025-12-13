ShopEase - Backend

Setup
1. Copy `.env.example` to `.env` and fill values:
   - `MONGODB_URI` (e.g. `mongodb://localhost:27017/shopease`)
   - `JWT_SECRET` (a secure random string)
   - `STRIPE_SECRET_KEY` (test key for development)
   - `FRONTEND_URL` (e.g. `http://localhost:5173`)
   - `PORT` (optional, defaults to `5000`)

2. Install dependencies:
```
npm install
```

3. Run in development:
```
npm run dev
```

4. Start production:
```
npm start
```

Quick API Examples
- `POST /api/auth/register`  { name, email, password }
- `POST /api/auth/login`     { email, password }
- `GET  /api/products`
- `GET  /api/products/:id`
- `POST /api/products`      (admin) { title, description, price, ... }
- `PUT  /api/products/:id`  (admin)
- `DELETE /api/products/:id`(admin)
- `POST /api/orders/create-checkout-session` (protected) { items: [{ productId, title, price, qty }] }
- `GET  /api/orders/my-orders` (protected)

Notes
- Admin users: register a user then set `role` to `admin` in the database, or add a secure server-side flow to create admins.
- Stripe: use test keys during development. In production, use real keys and verify webhooks.

Files added/updated
- Added `.env.example` with required environment variables and sample values.

If you'd like, I can:
- add example requests (curl/Postman collection)
- add a CONTRIBUTING or API reference file

