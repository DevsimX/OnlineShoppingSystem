from django.urls import path
from . import views

urlpatterns = [
    # Endpoints will be added later
    path('', views.order_list, name='order-list'),
]
