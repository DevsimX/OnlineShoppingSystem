from .base import *
import os

DEBUG = False

# Handle ALLOWED_HOSTS - support both local development and production (Render)
# Always include local development hosts
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0', 'web']

# Add hosts from environment variable if provided
allowed_hosts_str = config('ALLOWED_HOSTS', default='')
if allowed_hosts_str:
    additional_hosts = [host.strip() for host in allowed_hosts_str.split(',') if host.strip()]
    ALLOWED_HOSTS.extend(additional_hosts)

# Add Render domain if detected (for production deployments)
render_host = os.environ.get('RENDER_EXTERNAL_HOSTNAME')
if render_host and render_host not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.append(render_host)

# Remove duplicates while preserving order
ALLOWED_HOSTS = list(dict.fromkeys(ALLOWED_HOSTS))

# Security settings
SECURE_SSL_REDIRECT = config('SECURE_SSL_REDIRECT', default=False, cast=bool)
SESSION_COOKIE_SECURE = config('SESSION_COOKIE_SECURE', default=False, cast=bool)
CSRF_COOKIE_SECURE = config('CSRF_COOKIE_SECURE', default=False, cast=bool)
