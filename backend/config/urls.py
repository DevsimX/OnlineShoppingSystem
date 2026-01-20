"""
URL configuration for OnlineShoppingSystem project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.authentication.urls')),
    path('api/products/', include('apps.product.urls')),
    path('api/orders/', include('apps.order.urls')),
    path('api/payments/', include('apps.payment.urls')),
    path('api/cart/', include('apps.cart.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
