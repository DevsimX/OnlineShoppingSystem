# OnlineShoppingSystem

Full-stack e-commerce app with Next.js frontend and Django + DRF backend.

## 🌐 Live Deployment

- **Frontend**: [https://online-shopping-system-hv2v.vercel.app](https://online-shopping-system-hv2v.vercel.app) (Vercel)
- **Backend API**: [https://onlineshoppingsystem.onrender.com](https://onlineshoppingsystem.onrender.com) (Render)

## Prerequisites

- Node.js 18+
- Docker and Docker Compose (for local development)
- Python 3.11+ (for local development)

## Quick Start

### Backend (Local Development)

```bash
cd backend
cp .env.example .env  # Edit .env with your settings
docker compose up --build -d
docker compose exec backend python manage.py makemigrations
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py createsuperuser  # Optional
```

**API Base URL**: http://localhost

### Frontend (Local Development)

```bash
cd frontend
npm install
npm run dev
```

**App URL**: http://localhost:3000

## 🚀 Deployment

### Frontend Deployment (Vercel)

The frontend is deployed on Vercel and automatically deploys on push to main branch.

**Required Environment Variables:**
- `NEXT_PUBLIC_API_BASE_URL`: `https://onlineshoppingsystem.onrender.com`

### Backend Deployment (Render)

The backend is deployed on Render using Docker.

**Required Environment Variables:**
- `SECRET_KEY`: Django secret key
- `ENVIRONMENT`: `production`
- `DB_HOST` or `POSTGRES_HOST`: Database host
- `DB_PORT` or `POSTGRES_PORT`: Database port (default: 5432)
- `POSTGRES_DB`: Database name
- `POSTGRES_USER`: Database user
- `POSTGRES_PASSWORD`: Database password
- `ALLOWED_HOSTS`: Comma-separated list of allowed hosts
- `CORS_ALLOWED_ORIGINS`: Comma-separated list of frontend URLs (include `https://`)
- `STRIPE_SECRET_KEY`: Stripe secret key
- `STRIPE_PUBLISHABLE_KEY`: Stripe publishable key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook secret

**Example CORS_ALLOWED_ORIGINS:**
```
https://online-shopping-system-hv2v.vercel.app,https://online-shopping-system-hv2v-yutian-xias-projects.vercel.app
```

## API Endpoints

- **Auth** (`/api/auth/`): User registration, login/logout, profile management, postal address CRUD
- **Products** (`/api/products/`): Product listings with pagination, sorting, filtering (availability, price, type, brand); collection-based routing with fuzzy matching; search with suggestions; product details and recommendations
- **Cart** (`/api/cart/`): Cart management (add, update, remove) for authenticated users; unauthenticated users use localStorage
- **Orders** (`/api/orders/`): Order history and details
- **Payments** (`/api/payments/`): Stripe checkout session creation and webhook handling

## Project Structure

```
OnlineShoppingSystem/
├─ backend/          # Django REST Framework API
│  ├─ apps/          # Domain modules (auth, products, cart, orders, payments)
│  ├─ config/        # Django settings (base, local, staging, production)
│  ├─ Dockerfile     # Production Docker image
│  ├─ docker-compose.yml  # Local development setup
│  └─ .env.example   # Environment variables template
└─ frontend/         # Next.js application
   └─ src/
      ├─ app/        # Pages and routing
      ├─ components/ # UI components
      ├─ hooks/      # Business logic hooks
      └─ lib/api/    # API client
```

## Features

- **Authentication & User Management**: JWT-based auth, user profiles with phone validation, independent postal address management
- **Product Discovery**: Flexible collection routing with PostgreSQL FTS + pg_trgm, header search with suggestions, product detail pages
- **Filtering & Search**: Collection filters (availability, price, type, brand) with URL-synced state, full-text search with pagination
- **Shopping Cart**: Dual storage system (database for authenticated, localStorage for guests) with automatic sync on login
- **Payment Integration**: Stripe checkout with support for gift wrapping, shipping options, and webhook handling
- **Order Management**: Order history, order details, and order status tracking
- **Responsive UI**: Mobile-first design with reusable components and custom hooks

## Recent Updates

### Backend
- ✅ Removed entrypoint script - simplified deployment
- ✅ Added support for both `DB_HOST`/`DB_PORT` and `POSTGRES_HOST`/`POSTGRES_PORT` environment variables
- ✅ Auto-detection of production environment on Render
- ✅ Enhanced CORS configuration with environment variable support
- ✅ Updated ALLOWED_HOSTS to support both local development and production
- ✅ Comprehensive `.env.example` with all required variables

### Frontend
- ✅ Updated to Next.js 15.5.9 (security patch)
- ✅ Configured to connect to Render backend via `NEXT_PUBLIC_API_BASE_URL`

## Development

### Backend Commands

```bash
# Run migrations
docker compose exec backend python manage.py makemigrations
docker compose exec backend python manage.py migrate

# View logs
docker compose logs -f backend

# Access Django shell
docker compose exec backend python manage.py shell

# Stop services
docker compose down
```

### Frontend Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Environment Variables

See `backend/.env.example` for a complete list of required environment variables.

### Key Variables:
- **Backend**: `SECRET_KEY`, `DB_HOST`, `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `CORS_ALLOWED_ORIGINS`
- **Frontend**: `NEXT_PUBLIC_API_BASE_URL`

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Django 5.2, Django REST Framework, PostgreSQL, Gunicorn
- **Deployment**: Vercel (Frontend), Render (Backend)
- **Payment**: Stripe
- **Containerization**: Docker

## License

© Devsim 2026
