from decouple import config
import os

# Determine which settings to use based on environment
# Auto-detect production if on Render (RENDER_EXTERNAL_HOSTNAME is set)
ENVIRONMENT = config('ENVIRONMENT', default=None)
if ENVIRONMENT is None:
    # Auto-detect: if RENDER_EXTERNAL_HOSTNAME is set, we're on Render (production)
    if os.environ.get('RENDER_EXTERNAL_HOSTNAME'):
        ENVIRONMENT = 'production'
    else:
        ENVIRONMENT = 'local'

if ENVIRONMENT == 'production':
    from .production import *
elif ENVIRONMENT == 'staging':
    from .staging import *
else:
    from .local import *
