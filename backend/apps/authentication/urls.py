from django.urls import path
from . import views

app_name = 'authentication'

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('me/', views.me, name='me'),
    path('me/update/', views.update_profile, name='update_profile'),
    path('postal-addresses/', views.postal_addresses, name='postal_addresses'),
    path('postal-addresses/<int:address_id>/', views.postal_address_detail, name='postal_address_detail'),
]
