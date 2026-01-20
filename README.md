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
- **Products**: 
  - `/api/products/` - All products (supports `?sort=PRICE`, `?page=1`, `?page_size=20`)
  - `/api/products/collections/<slug>/` - Products by collection with fuzzy matching (e.g., `/api/products/collections/food-drinks/`, `/api/products/collections/gifts-under-100/`)
    - Supports flexible slug-based routing with PostgreSQL Full-Text Search (FTS) and pg_trgm fuzzy matching
    - Automatically interprets slugs like `food-drinks`, `cooking-condiments`, `gifts-under-100`, `art-prints`
    - Supports `?sort=PRICE`, `?page=1`, `?page_size=20`
  - `/api/products/<id>/` - Single product details
  - `/api/products/<id>/you-might-like/` - 8 recommended products (same type, ordered by rank)
  - `/api/products/hot/` - 8 most hot products
  - `/api/products/new/` - 8 most new products
  - `/api/products/explore/` - 8 most explore products
  - `/api/products/gift-box/` - 8 gift box products
  - **Sort Options**: `COLLECTION_DEFAULT` (Featured), `BEST_SELLING`, `CREATED` (Oldest), `CREATED_REVERSE` (Newest), `PRICE` (Low to High), `PRICE_REVERSE` (High to Low)
- **Orders/Payments/Cart**: Placeholders (not implemented yet)

## Project Structure

```
OnlineShoppingSystem/
├─ backend/          # Django + DRF
│  ├─ apps/          # authentication, brand, product, order, payment, cart
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

- ✅ JWT authentication (login/register)
- ✅ Protected dashboard
- ✅ Product carousels with real-time backend data
- ✅ Lazy loading for product sections
- ✅ Flexible collection routing with fuzzy search (PostgreSQL FTS + pg_trgm)
- ✅ Collections page with pagination and sorting
- ✅ Sort dropdown with URL-trackable sort parameters
- ✅ Product detail pages with image galleries
- ✅ "You Might Like" recommendations
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
- ✅ Product & Brand models and API endpoints
- ✅ Product carousels with loading states and lazy loading
- ✅ Backend integration for all product sections (Hot, New, Gift Box, Explore)
- ✅ Badge animations (new/hot badges with opposite rotation)
- ✅ **Flexible collection routing with PostgreSQL Full-Text Search (FTS) and pg_trgm**
  - Removed Category table and hardcoded category endpoints
  - Implemented fuzzy matching using PostgreSQL native search capabilities
  - Collection slugs like `food-drinks`, `gifts-under-100`, `art-prints` are automatically interpreted
  - Supports price filtering (e.g., `gifts-under-100`)
  - Prioritizes FTS matches over similarity for better accuracy
- ✅ Collections page with pagination and URL-trackable parameters
- ✅ Product sorting functionality (Featured, Best Selling, Oldest, Newest, Price: Low to High, Price: High to Low)
- ✅ Sort dropdown component with fade-in/fade-out animations
- ✅ **Product detail pages** with image galleries and modal views
- ✅ **"You Might Like" recommendations** based on product type
- ✅ Shopping cart UI with drawer
- ✅ **Product descriptions and types** - All products have accurate 50+ word descriptions and simple type classifications
- ✅ Custom hooks extracted for better maintainability
  - `useProductSections` - Product fetching and lazy loading
  - `useCollections` - Collections page data fetching
  - `useCollectionsPagination` - Pagination and URL management
  - `useSortDropdown` - Sort dropdown state management
  - `useProductDetail` - Product detail page data fetching
  - `useAuth` - Authentication checking
  - `useLogin` / `useRegister` - Form handling
  - `usePasswordValidation` - Password strength
- ✅ Responsive design across all pages

### In Progress
- 🔄 Order, Payment, and Cart API endpoints (models created, endpoints pending)

## Recent Updates

### Search & Collections
- **Migrated from Meilisearch to PostgreSQL FTS + pg_trgm**: Removed external search dependency and now use PostgreSQL's native full-text search with fuzzy matching capabilities
- **Removed Category table**: Replaced with flexible collection routing that interprets slugs dynamically
- **Improved search accuracy**: Higher similarity thresholds (0.2) and prioritized FTS matches reduce false positives

### Product Data
- **Enhanced product descriptions**: All products now have detailed 50+ word descriptions matching their actual content
- **Standardized product types**: Products use simple, consistent type classifications (food, drink, art, jewelry, etc.)
