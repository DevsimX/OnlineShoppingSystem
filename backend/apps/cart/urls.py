from django.urls import path
from . import views

urlpatterns = [
    # Endpoints will be added later
    path('', views.cart_list, name='cart-list'),
]
