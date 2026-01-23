from django.urls import path
from . import views

urlpatterns = [
    path('', views.cart_list, name='cart-list'),
    path('add/', views.add_to_cart, name='cart-add'),
    path('update/', views.update_cart_item, name='cart-update'),
    path('remove/', views.remove_cart_item, name='cart-remove'),
    path('checkout/', views.create_checkout_session, name='cart-checkout'),
]
