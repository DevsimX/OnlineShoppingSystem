# OnlineShoppingSystem Backend

Django + DRF backend with Docker, Nginx, and PostgreSQL.

## Setup

Follow these commands step by step:

### Step 1: Create .env.example file from .env
```bash
cp .env .env.example
```

Edit `.env` and update the `SECRET_KEY` with a secure random string if needed.

### Step 2: Build and start Docker services
```bash
docker compose up --build -d
```

This will:
- Build the Docker images
- Start PostgreSQL database
- Start Django web server
- Start Nginx reverse proxy
- Run in detached mode (background)

### Step 3: Create database migrations
```bash
docker compose exec backend python manage.py makemigrations
```

This creates migration files for the authentication app and custom User model.

### Step 4: Run database migrations
```bash
docker compose exec backend python manage.py migrate
```

This applies all migrations to create the database tables.

### Step 5: (Optional) Create superuser for admin access
```bash
docker compose exec backend python manage.py createsuperuser
```

Follow the prompts to create an admin user.

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
  - Body: `{ "email": "user@example.com", "username": "username", "password": "password", "password_confirm": "password" }`
- `POST /api/auth/login/` - User login
  - Body: `{ "email": "user@example.com", "password": "password" }`
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/me/` - Get current user info (requires authentication)

## Development Commands

### Run migrations
```bash
docker compose exec backend python manage.py migrate
```

### Run tests
```bash
# Run all tests
docker compose exec backend python manage.py test

# Run tests for specific app
docker compose exec backend python manage.py test apps.authentication
docker compose exec backend python manage.py test apps.product
docker compose exec backend python manage.py test apps.cart
docker compose exec backend python manage.py test apps.order
docker compose exec backend python manage.py test apps.payment

# Run with verbose output
docker compose exec backend python manage.py test --verbosity=2
```

### Create new Django app
```bash
docker compose exec backend python manage.py startapp app_name apps/
```

### Access Django shell
```bash
docker compose exec backend python manage.py shell
```

### View logs
```bash
docker compose logs -f backend
```

### Stop services
```bash
docker compose down
```

### Stop services and remove volumes (clean slate)
```bash
docker compose down -v
```

### Troubleshooting PostgreSQL Connection

If you can't connect to the database in pgAdmin:

1. **Check if local PostgreSQL is running:**
   ```bash
   brew services list | grep postgresql
   # or
   ps aux | grep postgres
   ```

2. **Stop local PostgreSQL (if needed):**
   ```bash
   brew services stop postgresql
   # or use your system's service manager
   ```

3. **Restart Docker containers:**
   ```bash
   docker compose down
   docker compose up -d
   ```

4. **Verify Docker PostgreSQL is running:**
   ```bash
   docker compose exec db psql -U postgres -c "\l"
   ```

## Project Structure

```
backend/
├── apps/                    # Django apps
│   └── authentication/     # Auth app (login/register)
├── config/                  # Django project settings
│   └── settings/           # Environment-specific settings
│       ├── base.py         # Base settings
│       ├── local.py        # Local development
│       ├── staging.py      # Staging environment
│       └── production.py   # Production environment
├── nginx/                  # Nginx configuration
│   └── nginx.conf          # Nginx reverse proxy config
├── docker compose.yml      # Docker services
├── Dockerfile              # Web container image
├── requirements.txt        # Python dependencies
└── .env.example           # Environment variables template
```

## Access Points

- **API**: http://localhost (via Nginx)
- **Django Admin**: http://localhost/admin/
- **PostgreSQL**: localhost:5432
  - **Note**: If you have a local PostgreSQL running, you may need to stop it first: `brew services stop postgresql` (macOS) or check your system's PostgreSQL service
