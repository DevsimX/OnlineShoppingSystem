# OnlineShoppingSystem Backend

Django + DRF backend with Docker, Nginx, and PostgreSQL.

## Setup

Follow these commands step by step:

### Step 1: Create .env file from .env.example
```bash
cp .env.example .env
```

Edit `.env` and update the `SECRET_KEY` with a secure random string.

### Step 2: Build and start Docker services
```bash
docker-compose up --build
```

This will:
- Build the Docker images
- Start PostgreSQL database
- Start Django web server
- Start Nginx reverse proxy

Wait for all services to be ready (you'll see "Starting server..." in the logs).

### Step 3: Create database migrations
```bash
docker-compose exec web python manage.py makemigrations
```

This creates migration files for the authentication app and custom User model.

### Step 4: Run database migrations
```bash
docker-compose exec web python manage.py migrate
```

This applies all migrations to create the database tables.

### Step 5: (Optional) Create superuser for admin access
```bash
docker-compose exec web python manage.py createsuperuser
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
docker-compose exec web python manage.py migrate
```

### Create new Django app
```bash
docker-compose exec web python manage.py startapp app_name apps/
```

### Access Django shell
```bash
docker-compose exec web python manage.py shell
```

### View logs
```bash
docker-compose logs -f web
```

### Stop services
```bash
docker-compose down
```

### Stop services and remove volumes (clean slate)
```bash
docker-compose down -v
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
├── docker-compose.yml      # Docker services
├── Dockerfile              # Web container image
├── entrypoint.sh          # Container startup script
├── requirements.txt        # Python dependencies
└── .env.example           # Environment variables template
```

## Access Points

- **API**: http://localhost (via Nginx)
- **Django Admin**: http://localhost/admin/
- **PostgreSQL**: localhost:5432
