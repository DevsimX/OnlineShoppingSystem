# OnlineShoppingSystem Backend

Django + DRF backend with Docker, Nginx, and PostgreSQL.

## Setup

1. Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

2. Build and start services:
```bash
docker-compose up --build
```

3. Create superuser:
```bash
docker-compose exec web python manage.py createsuperuser
```

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/me/` - Get current user info

## Development

Run migrations:
```bash
docker-compose exec web python manage.py migrate
```

Create new app:
```bash
docker-compose exec web python manage.py startapp app_name apps/
```

## Project Structure

```
backend/
├── apps/                    # Django apps
│   └── authentication/     # Auth app (login/register)
├── config/                  # Django project settings
│   └── settings/           # Environment-specific settings
├── requirements/            # Python dependencies
├── nginx/                  # Nginx configuration
├── docker-compose.yml      # Docker services
├── Dockerfile              # Web container image
└── entrypoint.sh          # Container startup script
```
