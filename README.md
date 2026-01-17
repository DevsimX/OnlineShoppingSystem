# OnlineShoppingSystem

Full-stack e-commerce app with Next.js + Tailwind frontend and Django + DRF backend.

## Prerequisites
- Node.js 18+
- Docker and Docker Compose
- Python 3.11+ (for local development)

## Getting Started

### Backend (Django + DRF)

Navigate to the backend directory:
```bash
cd backend
```

**Step 1: Create .env.example file from .env**
```bash
cp .env .env.example
```

Edit `.env` and update the `SECRET_KEY` with a secure random string if needed.

**Step 2: Build and start Docker services**
```bash
docker compose up --build -d
```

This will start PostgreSQL, Django web server, and Nginx in the background.

**Step 3: Create database migrations**
```bash
docker compose exec backend python manage.py makemigrations
```

**Step 4: Run database migrations**
```bash
docker compose exec backend python manage.py migrate
```

**Step 5: (Optional) Create superuser for admin access**
```bash
docker compose exec backend python manage.py createsuperuser
```

**API Base URL**: http://localhost (via Nginx)

For more backend details, see [backend/README.md](./backend/README.md)

### Frontend (Next.js)

Navigate to the frontend directory:
```bash
cd frontend
```

**Install dependencies:**
```bash
npm install
```

**Start development server:**
```bash
npm run dev
```

**App URL**: http://localhost:3000

For more frontend details, see [frontend/README.md](./frontend/README.md)

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
  - Body: `{ "username": "string", "email": "string", "password": "string", "password_confirm": "string", "first_name": "string" (optional), "last_name": "string" (optional) }`
  - Returns: `{ "message": "User registered successfully" }`
- `POST /api/auth/login/` - User login
  - Body: `{ "username": "string", "password": "string" }`
  - Returns: `{ "message": "Login successful", "token": "JWT token", "refresh_token": "refresh token", "user": {...} }`
- `POST /api/auth/logout/` - User logout (requires authentication)
- `GET /api/auth/me/` - Get current user info (requires authentication)

### Categories
- `GET /api/categories/` - Get all categories
  - Returns: `[{ "id": number, "name": "string", "great_gift": boolean }, ...]`
- `GET /api/categories/great-gifts/` - Get categories where great_gift is True
  - Returns: `[{ "id": number, "name": "string", "great_gift": true }, ...]`

### Products
- `GET /api/products/` - Get all products (paginated, 20/page)
  - Returns: Paginated list with `{ "id": number, "name": "string", "company": "string", "price": "string", "profile_pic_link": "string", "new": boolean, "hot": boolean }`
  - Ranked by `rank_if` (high to low)
- `GET /api/products/category/<category_id>/` - Get products by category (paginated, 20/page)
  - Returns: Same format as above, filtered by category
  - Ranked by `rank_if` (high to low)
- `GET /api/products/<product_id>/` - Get single product with all details
  - Returns: Full product details including description, images, stock, etc.
- `GET /api/products/hot/` - Get 8 most hot products
  - Returns: List of 8 products ranked by `hot_if` (high to low)
- `GET /api/products/new/` - Get 8 most new products
  - Returns: List of 8 products ranked by `new_if` (high to low)
- `GET /api/products/explore/` - Get 8 most deserve to explore products
  - Returns: List of 8 products ranked by `rank_if` (high to low)
- `GET /api/products/gift-box/` - Get 8 gift box products
  - Returns: List of 8 products ranked by `rank_if` (high to low)

### Orders
- `GET /api/orders/` - Placeholder (not implemented yet)

### Payments
- `GET /api/payments/` - Placeholder (not implemented yet)

### Cart
- `GET /api/cart/` - Placeholder (not implemented yet)

## Project Structure
```
OnlineShoppingSystem/
├─ backend/                # Django + DRF backend
│  ├─ apps/               # Django apps
│  │  ├─ authentication/  # Auth app (login/register)
│  │  ├─ category/        # Category model and endpoints
│  │  ├─ product/         # Product and ProductTag models and endpoints
│  │  ├─ order/          # Order model (endpoints pending)
│  │  ├─ payment/        # Payment model (endpoints pending)
│  │  └─ cart/           # ShoppingCart model (endpoints pending)
│  ├─ config/             # Django project settings
│  ├─ nginx/              # Nginx configuration
│  ├─ docker compose.yml  # Docker services
│  └─ Dockerfile          # Web container image
├─ frontend/              # Next.js frontend
│  └─ src/
│     ├─ app/             # Pages and routes
│     │  ├─ auth/         # Authentication pages
│     │  │  ├─ _components/  # Auth-specific components
│     │  │  │  ├─ LoginForm.tsx
│     │  │  │  └─ RegisterForm.tsx
│     │  │  └─ page.tsx   # Auth page with tabs
│     │  ├─ dashboard/     # Protected dashboard
│     │  └─ ...           # Other pages
│     ├─ components/       # Shared components
│     │  ├─ cart/         # Cart drawer component
│     │  └─ ...           # Other components
│     ├─ contexts/        # React contexts
│     │  └─ CartContext.tsx
│     └─ lib/              # Utilities and API clients
│        └─ api/           # API service functions
└─ README.md
```

## Development Commands

### Backend (from `backend/`)
```bash
docker compose up --build          # Build and start all services
docker compose exec backend python manage.py makemigrations  # Create migrations
docker compose exec backend python manage.py migrate        # Run migrations
docker compose exec backend python manage.py shell          # Django shell
docker compose logs -f web         # View web logs
docker compose down                # Stop services
```

### Frontend (from `frontend/`)
```bash
npm run dev        # Start Next.js dev server
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run ESLint
```

## Features

- ✅ User authentication (login/register with JWT tokens)
- ✅ Protected dashboard page
- ✅ Password strength validation
- ✅ Form validation with real-time feedback
- ✅ Responsive home page
- ✅ Product carousels
- ✅ Category navigation
- ✅ Visit/Store location page
- ✅ About page with timeline
- ✅ Instagram feed integration

## Development Notes

### 2026-01-17
- **Frontend:**
  - Home page frontend finished
  - Visit page frontend finished
  - About page frontend finished
  - Login/Register page with tab switching
  - Protected dashboard page
  - Password strength validation with real-time feedback
  - Form validation (email, password match, required fields)
  - Toast notifications (top-right, 3-second duration)
  - Header navigation updates (redirects to dashboard if authenticated)
  - Cart drawer component with scroll lock
  - All images converted to Next.js Image component
  
- **Backend:**
  - Backend restructured with Docker, Nginx, PostgreSQL
  - Authentication API endpoints implemented with JWT tokens
  - Username-based authentication (unique username and email)
  - Token expiration (24 hours access, 7 days refresh)
  - User registration and login endpoints
  - Protected endpoints with JWT authentication
  - **Product & Category System:**
    - Category model with great_gift field
    - Product model (name, company, description, price, images, stock, status)
    - ProductTag model (new, hot, gift_box flags with impact factors)
    - Category API endpoints (list all, great gifts)
    - Product API endpoints (list, by category, detail, hot, new, explore, gift-box)
    - Pagination support (20 items per page)
  - **Order & Payment System:**
    - Order model (owner, products, amount, status)
    - Payment model (order, stripe_payment_id, status)
    - Endpoints placeholder (to be implemented)
  - **Shopping Cart:**
    - ShoppingCart model (owner, products, amount)
    - Endpoints placeholder (to be implemented)

## Notes
- Development only; not production-hardened.
- Backend uses Docker Compose for local development.
- Frontend connects to backend API at http://localhost (via Nginx).
- Inspired by sections found on `https://www.poplocal.com.au/`.
