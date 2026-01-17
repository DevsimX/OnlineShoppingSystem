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

- **Auth**: `/api/auth/register/`, `/api/auth/login/`, `/api/auth/logout/`, `/api/auth/me/`
- **Categories**: `/api/categories/`
- **Products**: `/api/products/`, `/api/products/category/<id>/`, `/api/products/<id>/`, `/api/products/hot/`, `/api/products/new/`, `/api/products/explore/`, `/api/products/gift-box/`
- **Orders/Payments/Cart**: Placeholders (not implemented yet)

## Project Structure

```
OnlineShoppingSystem/
├─ backend/          # Django + DRF
│  ├─ apps/          # authentication, category, product, order, payment, cart
│  └─ config/        # Django settings
└─ frontend/         # Next.js
   └─ src/
      ├─ app/        # Pages and routes
      ├─ components/ # Shared components
      ├─ contexts/   # React contexts
      ├─ hooks/      # Custom React hooks
      └─ lib/api/    # API service functions
```

## Features

- ✅ JWT authentication (login/register)
- ✅ Protected dashboard
- ✅ Product carousels with real-time backend data
- ✅ Lazy loading for product sections
- ✅ Category navigation
- ✅ Shopping cart UI
- ✅ Responsive design
- ✅ Custom hooks for maintainability

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

## Progress

### Completed
- ✅ JWT authentication with username-based login
- ✅ User registration with password strength validation
- ✅ Protected dashboard page
- ✅ Product & Category models and API endpoints
- ✅ Product carousels with loading states and lazy loading
- ✅ Backend integration for all product sections (Hot, New, Gift Box, Explore)
- ✅ Badge animations (new/hot badges with opposite rotation)
- ✅ Shopping cart UI with drawer
- ✅ Custom hooks extracted for better maintainability
  - `useProductSections` - Product fetching and lazy loading
  - `useAuth` - Authentication checking
  - `useLogin` / `useRegister` - Form handling
  - `usePasswordValidation` - Password strength
- ✅ Responsive design across all pages

### In Progress
- 🔄 Order, Payment, and Cart API endpoints (models created, endpoints pending)
