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

# Fallback: If we're on Render but RENDER_EXTERNAL_HOSTNAME isn't set,
# check for common Render domain patterns from environment
# Render services typically have domains like: service-name.onrender.com
if not render_host:
    # Try to get from RENDER_SERVICE_NAME or infer from common patterns
    render_service = os.environ.get('RENDER_SERVICE_NAME', '')
    if render_service:
        render_host = f"{render_service}.onrender.com"
        if render_host not in ALLOWED_HOSTS:
            ALLOWED_HOSTS.append(render_host)
    # Also add common fallback domain if we detect we're on Render
    # (check if we're not in DEBUG and certain Render env vars exist)
    if not DEBUG and (os.environ.get('RENDER') or os.environ.get('RENDER_SERVICE_ID')):
        # Add a common pattern - user should set ALLOWED_HOSTS env var for their specific domain
        # But as a last resort, we'll allow any .onrender.com domain
        # Note: Django doesn't support wildcards, so we add the specific known domain
        known_render_domain = 'onlineshoppingsystem.onrender.com'
        if known_render_domain not in ALLOWED_HOSTS:
            ALLOWED_HOSTS.append(known_render_domain)

# Remove duplicates while preserving order
ALLOWED_HOSTS = list(dict.fromkeys(ALLOWED_HOSTS))

# Security settings
SECURE_SSL_REDIRECT = config('SECURE_SSL_REDIRECT', default=True, cast=bool)
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# Static files with WhiteNoise
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
