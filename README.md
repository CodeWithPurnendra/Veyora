# Veyora

A full-stack e-commerce web application with product browsing, a shopping cart, user accounts, and order management. Built with React, Tailwind CSS, Node.js, Express, and PostgreSQL.

![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)

> Veyora is a portfolio project. The products and prices are sample data.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [Security](#security)
- [Roadmap](#roadmap)
- [Author](#author)

## Features

**Storefront**
- Product listing with search, category filters, and sorting (price, rating, name)
- Collections page generated automatically from product categories
- Product detail pages with stock status, quantity selector, and related products
- Responsive design with loading skeletons and friendly error states

**Cart and checkout**
- Persistent shopping cart (saved in the browser)
- Free-shipping progress bar and live order totals
- Checkout form with validation, prefilled from the logged-in account
- Cash on delivery and an order confirmation page

**Accounts and orders**
- Register and log in with JWT authentication
- Protected routes (checkout and order history require a login)
- "My orders" page with items, totals, and order status

**Backend**
- REST API built with Express and PostgreSQL
- Orders are created inside a database transaction, so an order, its items, and the stock update either all succeed or none do
- Row locking on stock to prevent two customers buying the last item at the same moment
- Prices and totals are always calculated on the server, never trusted from the browser

## Tech Stack

| Area | Technologies |
|---|---|
| Frontend | React, Vite, React Router, Tailwind CSS, Lucide icons |
| Backend | Node.js, Express |
| Database | PostgreSQL (`pg`) |
| Auth | JSON Web Tokens, bcrypt |

## Screenshots

<!-- Add your own screenshots to a docs/ folder and update these paths, or delete this section. -->

| Home | Shop |
|---|---|
| ![Home](docs/home.png) | ![Shop](docs/shop.png) |

| Product | Checkout |
|---|---|
| ![Product](docs/product.png) | ![Checkout](docs/checkout.png) |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- [PostgreSQL](https://www.postgresql.org/) 14 or newer
- Git

### 1. Clone the repositories

```bash
https://github.com/CodeWithPurnendra/Veyora.git
```

### 2. Set up the database

Create a database named `veyora`, then run the following SQL in `psql` or pgAdmin:

```sql
CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          VARCHAR(20) NOT NULL DEFAULT 'customer',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(200) NOT NULL,
  description TEXT,
  price       NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  category    VARCHAR(100) NOT NULL,
  image       TEXT,
  rating      NUMERIC(2, 1) NOT NULL DEFAULT 0,
  stock       INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE orders (
  id             SERIAL PRIMARY KEY,
  order_number   VARCHAR(20) NOT NULL UNIQUE,
  user_id        INTEGER REFERENCES users(id) ON DELETE SET NULL,
  full_name      VARCHAR(100) NOT NULL,
  email          VARCHAR(255) NOT NULL,
  phone          VARCHAR(30) NOT NULL,
  address        TEXT NOT NULL,
  city           VARCHAR(100) NOT NULL,
  postal_code    VARCHAR(20) NOT NULL,
  subtotal       NUMERIC(10, 2) NOT NULL,
  shipping       NUMERIC(10, 2) NOT NULL,
  total          NUMERIC(10, 2) NOT NULL,
  payment_method VARCHAR(20) NOT NULL,
  payment_status VARCHAR(20) NOT NULL DEFAULT 'pending',
  status         VARCHAR(20) NOT NULL DEFAULT 'placed',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
  id         SERIAL PRIMARY KEY,
  order_id   INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  name       VARCHAR(200) NOT NULL,
  price      NUMERIC(10, 2) NOT NULL,
  quantity   INTEGER NOT NULL CHECK (quantity > 0),
  image      TEXT
);
```

### 3. Run the server

```bash
cd server
npm install
```

Create a `.env` file (see [Environment Variables](#environment-variables)), then load the sample products and start the server:

```bash
npm run seed
npm run dev
```

The API runs at `http://localhost:5000`. Check it with `http://localhost:5000/api/health`.

### 4. Run the client

In a second terminal:

```bash
cd client
npm install
```

Create a `.env` file with the API address, then start the app:

```bash
npm run dev
```

Open the address shown in the terminal (usually `http://localhost:5173`).

## Environment Variables

**`server/.env`**

```env
PORT=5000

DB_USER=your_postgres_user
DB_HOST=localhost
DB_NAME=veyora
DB_PORT=5432
DB_PASSWORD=your_postgres_password

# Use a long random value, for example:
# node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
JWT_SECRET=replace_with_a_long_random_string
```

**`client/.env`**

```env
VITE_API_URL=http://localhost:5000
```

Never commit `.env` files. Both repositories ignore them.

## API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | No | Server health check |
| GET | `/api/products` | No | List all products |
| GET | `/api/products/:id` | No | Get one product |
| POST | `/api/auth/register` | No | Create an account |
| POST | `/api/auth/login` | No | Log in and receive a token |
| GET | `/api/auth/profile` | Yes | Get the logged-in user |
| POST | `/api/orders` | Yes | Create an order |
| GET | `/api/orders` | Yes | List the user's orders |
| GET | `/api/orders/:orderNumber` | Yes | Get one of the user's orders |

Protected routes expect an `Authorization: Bearer <token>` header.

## Project Structure

```
client/
└── src/
    ├── api/            # fetch helpers (products, auth, orders)
    ├── Components/     # NavBar, Footer, ProductCard, ProtectedRoute
    ├── Context/        # CartContext, AuthContext
    ├── hooks/          # useProducts
    ├── Pages/          # Home, Products, ProductDetail, Cart, Checkout, ...
    └── utils/          # formatPrice

server/
├── config/             # database connection pool
├── middleware/         # JWT verification
├── routes/             # products, auth, orders
├── seed.js             # loads sample products
└── server.js           # app entry point
```

## Security

- Passwords are hashed with bcrypt and never stored or returned in plain text
- All database queries use parameters, which protects against SQL injection
- Order prices and totals are calculated on the server from database values
- Users can only read their own orders (ownership is checked inside the query)
- Request bodies are validated on the server before anything is saved
- Secrets live in environment variables and are excluded from version control

## Roadmap

- [x] Product catalogue, cart, and checkout
- [x] User accounts with JWT authentication
- [x] Order history
- [ ] Online payments through a payment provider
- [ ] Admin panel for managing products and orders
- [ ] Password reset by email
- [ ] Deployment

## Author

**YOUR NAME**

- GitHub: https://github.com/CodeWithPurnendra
- Twitter(X): @PurnendraN06
