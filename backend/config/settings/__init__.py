from decouple import config

# Determine which settings to use based on environment
ENVIRONMENT = config('ENVIRONMENT', default='local')

if ENVIRONMENT == 'production':
    from .production import *
elif ENVIRONMENT == 'staging':
    from .staging import *
else:
    from .local import *
