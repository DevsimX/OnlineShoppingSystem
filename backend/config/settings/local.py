from .base import *

DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0', 'web']

# Development-specific settings
try:
    import django_extensions
    INSTALLED_APPS += ['django_extensions']
except ImportError:
    pass

# Email backend for development
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
