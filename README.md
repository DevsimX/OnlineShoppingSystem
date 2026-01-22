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
  - `/api/products/` - All products (supports `?sort=`, `?page=`, `?page_size=`, filters: `?available=`, `?minPrice=`, `?maxPrice=`, `?productType=`, `?brand=`)
  - `/api/products/collections/<slug>/` - Products by collection with fuzzy matching
    - Supports flexible slug-based routing with PostgreSQL FTS + pg_trgm
    - Same query params as above plus filters; list serializer includes `type`, `current_stock`, `status` for filter metadata
  - `/api/products/search/` - Search suggestions (collections, products) with `?q=`, `?limit=`
  - `/api/products/search/<query>/` - Paginated full search results
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
      │  ├─ collections/[slug]/  # Collection pages with filters
      │  ├─ search/[query]/      # Search results page
      │  └─ products/[product_id]/  # Product detail pages
      ├─ components/ # Shared components (incl. FilterDialog, SearchDropdown)
      ├─ contexts/   # React contexts
      ├─ hooks/      # Custom React hooks (useCollections, useCollectionFilters, etc.)
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
- ✅ Header search: dropdown (collection suggestions, products), "See all results" → `/search/[query]`, paginated results
- ✅ Collection filters: slide-in dialog (left) with Availability, Price, Product type, Brand; URL-synced; Clear clears params and navigates
- ✅ Filter metadata from products: in/out-of-stock counts, price range, product types, brands (list API includes `type`, `current_stock`, `status`)
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
  - Supports filters (availability, price, product type, brand) and prioritizes FTS matches
- ✅ Collections page with pagination, sorting, and filter dialog
- ✅ Header search (suggestions + products) and `/search/[query]` results page
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

## Recent Updates

### Search
- Header search dropdown: collection suggestions (static, contain-check), product results (FTS + pg_trgm), "See all results" → `/search/[query]`
- Search results page: product grid, pagination, "Results for X" (no "0" when zero results)

### Collection Filters
- Filter dialog (slide-in from left, opposite of cart): Availability (in stock / out of stock), Price (min/max), Product type, Brand
- Filters stored in URL; **Clear** clears all filter params and navigates
- Metadata from products: in-stock = `status === 'available'` and `current_stock > 0`; out-of-stock = `status === 'available'` and `current_stock === 0`
- Backend: `ProductListSerializer` includes `type`, `current_stock`, `status`; brand filter uses decoded names (no double-encoding)

### Search & Collections (earlier)
- Migrated from Meilisearch to PostgreSQL FTS + pg_trgm; flexible slug-based collection routing
- Product types and enhanced descriptions

### Shopping Cart
- Dual storage (DB / localStorage), sync on login, free shipping progress indicator

### User Profile & Addresses
- User `phone` (AU format, required); `UserPostalAddress` model; profile and postal-address API endpoints
