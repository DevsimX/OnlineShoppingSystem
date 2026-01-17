from django.urls import path
from . import views

urlpatterns = [
    # Endpoints will be added later
    path('', views.payment_list, name='payment-list'),
]
