from .base import *
import os

DEBUG = True

# Handle ALLOWED_HOSTS - support both local development and Render (as fallback)
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0', 'web']

# Add Render domain if detected (fallback in case production settings aren't used)
render_host = os.environ.get('RENDER_EXTERNAL_HOSTNAME')
if render_host and render_host not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.append(render_host)

# Also check for Render service name pattern
if not render_host:
    render_service = os.environ.get('RENDER_SERVICE_NAME', '')
    if render_service:
        render_host = f"{render_service}.onrender.com"
        if render_host not in ALLOWED_HOSTS:
            ALLOWED_HOSTS.append(render_host)

# Fallback: add known Render domain if we detect Render environment
if os.environ.get('RENDER') or os.environ.get('RENDER_SERVICE_ID'):
    known_render_domain = 'onlineshoppingsystem.onrender.com'
    if known_render_domain not in ALLOWED_HOSTS:
        ALLOWED_HOSTS.append(known_render_domain)

# Development-specific settings
try:
    import django_extensions
    INSTALLED_APPS += ['django_extensions']
except ImportError:
    pass

# Email backend for development
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
