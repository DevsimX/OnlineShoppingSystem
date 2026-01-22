# OnlineShoppingSystem

Full-stack e-commerce app with Next.js frontend and Django + DRF backend.

## Prerequisites

- Node.js 18+
- Docker and Docker Compose

## Quick Start

### Backend

```bash
cd backend
cp .env .env.example  # Edit .env with your settings
docker compose up --build -d
docker compose exec backend python manage.py makemigrations
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py createsuperuser  # Optional
```

**API Base URL**: http://localhost

### Frontend

```bash
cd frontend
npm install
npm run dev
```

**App URL**: http://localhost:3000

## API Endpoints

- **Auth** (`/api/auth/`): User registration, login/logout, profile management, postal address CRUD
- **Products** (`/api/products/`): Product listings with pagination, sorting, filtering (availability, price, type, brand); collection-based routing with fuzzy matching; search with suggestions; product details and recommendations
- **Cart** (`/api/cart/`): Cart management (add, update, remove) for authenticated users; unauthenticated users use localStorage

## Project Structure

```
OnlineShoppingSystem/
├─ backend/          # Django REST Framework API
│  └─ apps/          # Domain modules (auth, products, cart, orders, payments)
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
- **Responsive UI**: Mobile-first design with reusable components and custom hooks

## Development

**Backend**:
```bash
docker compose exec backend python manage.py makemigrations
docker compose exec backend python manage.py migrate
docker compose logs -f backend
docker compose down
```

**Frontend**:
```bash
npm run dev
npm run build
npm run lint
```

