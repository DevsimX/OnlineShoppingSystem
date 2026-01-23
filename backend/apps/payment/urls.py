from django.urls import path
from . import views

urlpatterns = [
    path('', views.payment_list, name='payment-list'),
    path('checkout/', views.create_checkout_session, name='payment-checkout'),
]
