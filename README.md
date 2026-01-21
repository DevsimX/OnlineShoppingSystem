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

- **Auth**: 
  - `/api/auth/register/` - Register new user (requires phone)
  - `/api/auth/login/` - Login
  - `/api/auth/logout/` - Logout
  - `/api/auth/me/` - Get current user info
  - `/api/auth/me/update/` - Update user profile (PATCH)
  - `/api/auth/postal-addresses/` - Get or create postal addresses (GET/POST)
  - `/api/auth/postal-addresses/<id>/` - Manage specific address (GET/PUT/PATCH/DELETE)
- **Products**: 
  - `/api/products/` - All products (supports `?sort=PRICE`, `?page=1`, `?page_size=20`)
  - `/api/products/collections/<slug>/` - Products by collection with fuzzy matching
    - Supports flexible slug-based routing with PostgreSQL FTS + pg_trgm
    - Automatically interprets slugs like `food-drinks`, `gifts-under-100`, `art-prints`
    - Supports `?sort=PRICE`, `?page=1`, `?page_size=20`
  - `/api/products/<id>/` - Single product details
  - `/api/products/<id>/you-might-like/` - 8 recommended products (same type)
  - `/api/products/hot/`, `/api/products/new/`, `/api/products/explore/`, `/api/products/gift-box/` - Featured product sections
  - **Sort Options**: `COLLECTION_DEFAULT`, `BEST_SELLING`, `CREATED`, `CREATED_REVERSE`, `PRICE`, `PRICE_REVERSE`
- **Cart**: 
  - `GET /api/cart/` - Get cart (requires authentication)
  - `POST /api/cart/add/` - Add item to cart
  - `POST /api/cart/update/` - Update item quantity
  - `POST /api/cart/remove/` - Remove item from cart
  - **Note**: Cart works for both authenticated (database) and unauthenticated (localStorage) users

## Project Structure

```
OnlineShoppingSystem/
├─ backend/          # Django + DRF
│  ├─ apps/          # authentication, brand, product, order, payment, cart
│  │  ├─ authentication/  # User model with phone, UserPostalAddress model
│  │  └─ product/    # Product models, views, and search services
│  │     └─ services.py  # PostgreSQL FTS + pg_trgm search logic
│  └─ config/        # Django settings
└─ frontend/         # Next.js
   └─ src/
      ├─ app/        # Pages and routes
      │  ├─ collections/[slug]/  # Dynamic collection pages
      │  └─ products/[product_id]/  # Product detail pages
      ├─ components/ # Shared components
      ├─ contexts/   # React contexts
      ├─ hooks/      # Custom React hooks
      └─ lib/api/    # API service functions
```

## Features

- ✅ JWT authentication (login/register with phone validation)
- ✅ User profile management with Australian phone format validation
- ✅ Postal address management (independent from user profile)
- ✅ Protected account area (dashboard, order history, points activity, account details)
- ✅ Product carousels with lazy loading
- ✅ Flexible collection routing with PostgreSQL FTS + pg_trgm fuzzy search
- ✅ Product detail pages with image galleries and modal views
- ✅ Shopping cart with dual storage (database for authenticated, localStorage for guests)
- ✅ Automatic cart sync on login (merges localStorage cart with database)
- ✅ Cart persists across page refreshes for all users
- ✅ Free shipping progress indicator
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
- ✅ Product & Brand models and API endpoints
- ✅ Product carousels with loading states and lazy loading
- ✅ Flexible collection routing with PostgreSQL FTS + pg_trgm
  - Removed Category table, uses dynamic slug-based routing
  - Automatic interpretation of slugs like `food-drinks`, `gifts-under-100`
  - Supports price filtering and prioritizes FTS matches
- ✅ Collections page with pagination and sorting
- ✅ Product detail pages with image galleries and modal views
- ✅ "You Might Like" recommendations based on product type
- ✅ **Shopping cart with dual storage system**
  - Database storage for authenticated users
  - localStorage for unauthenticated users (persists across refreshes)
  - Automatic sync on login (merges localStorage cart with database)
- ✅ Product descriptions and types (50+ words, simple classifications)
- ✅ Custom hooks for maintainability (`useProductSections`, `useCollections`, `useProductDetail`, `useCart`, etc.)
- ✅ Responsive design across all pages

### In Progress
- 🔄 Order and Payment API endpoints (models created, endpoints pending)
- Search input
- Filter function

## Recent Updates

### Search & Collections
- Migrated from Meilisearch to PostgreSQL FTS + pg_trgm for native search
- Removed Category table, implemented flexible slug-based collection routing
- Improved search accuracy with higher similarity thresholds (0.2) and prioritized FTS matches

### Product Data
- Enhanced product descriptions (50+ words) and standardized product types

### Shopping Cart
- Dual storage system: database for authenticated users, localStorage for guests
- Automatic cart sync on login (merges localStorage with database cart)
- Cart persists across page refreshes for all users
- Free shipping progress indicator with success state

### User Profile & Address Management
- Added phone field to User model with Australian format validation (+61XXXXXXXXX or 0XXXXXXXXX)
- Phone is required during registration and validated on both frontend and backend
- Created UserPostalAddress model with independent first_name, last_name, and all address fields
- API endpoints for updating user profile and managing postal addresses
- Frontend validation and form handling for profile and address updates
