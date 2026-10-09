# Voltline: Electronics E-commerce

Online store for mobiles, laptops, headphones and accessories.
Stack: React (Vite) + Node.js/Express + MongoDB (Mongoose).

## Features
- Browse, search (name, brand, category), filter by category, sort by price or rating
- Product detail page with specifications and live stock status
- Cart saved in the browser, quantity limited to available stock
- Checkout with customer details; the order is stored in MongoDB
- Server re-reads prices and stock from the database, reduces stock atomically and rolls back if any item is unavailable
- Order confirmation page

## Run it
Requires Node 18+ and MongoDB (local, or a MongoDB Atlas connection string).

```bash
# 1. API
cd server
npm install
cp .env.example .env      # set MONGO_URI if not using local MongoDB
npm run seed              # loads 12 sample products
npm start                 # http://localhost:5000

# 2. Website (new terminal)
cd client
npm install
npm run dev               # http://localhost:5173
```

## API
| Method | Path | Purpose |
|---|---|---|
| GET | /api/products?q=&category=&sort= | List and search products (`sort`: price-asc, price-desc, rating) |
| GET | /api/products/:id | Product details |
| POST | /api/orders | Place an order: `{ customer: {name,email,phone,address}, items: [{productId, qty}] }` |
| GET | /api/orders/:id | Order details |

## Structure
```
server/  server.js  routes.js  models.js  seed.js
client/  src/ App.jsx  pages.jsx  cart.jsx  api.js  styles.css
```
