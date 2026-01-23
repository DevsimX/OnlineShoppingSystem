#!/bin/bash
set -e

# Get database host from environment or use default
DB_HOST=${POSTGRES_HOST:-db}
DB_PORT=${POSTGRES_PORT:-5432}

# Only wait for database if we're in Docker Compose (hostname is 'db')
# On Render, the database is external and we'll connect directly
if [ "$DB_HOST" = "db" ]; then
    echo "Waiting for PostgreSQL at $DB_HOST:$DB_PORT..."
    while ! nc -z $DB_HOST $DB_PORT; do
        sleep 0.1
    done
    echo "PostgreSQL started"
else
    echo "Using external database at $DB_HOST:$DB_PORT"
fi

# Run migrations
echo "Running database migrations..."
python manage.py migrate --noinput

echo "Starting server..."
exec "$@"
