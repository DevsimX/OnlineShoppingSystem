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

## Project Structure
```
OnlineShoppingSystem/
├─ backend/                # Django + DRF backend
│  ├─ apps/               # Django apps
│  │  └─ authentication/  # Auth app (login/register)
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
  
- **Backend:**
  - Backend restructured with Docker, Nginx, PostgreSQL
  - Authentication API endpoints implemented with JWT tokens
  - Username-based authentication (unique username and email)
  - Token expiration (24 hours access, 7 days refresh)
  - User registration and login endpoints
  - Protected endpoints with JWT authentication with JWT tokens
- User registration with password strength validation
- Form validation with real-time feedback
- Protected dashboard page
- Token-based authentication system
- Header navigation updates (redirects to dashboard if authenticated)

## Notes
- Development only; not production-hardened.
- Backend uses Docker Compose for local development.
- Frontend connects to backend API at http://localhost (via Nginx).
- Inspired by sections found on `https://www.poplocal.com.au/`.
