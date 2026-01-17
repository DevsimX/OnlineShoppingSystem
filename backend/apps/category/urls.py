from django.urls import path
from . import views

urlpatterns = [
    path('', views.category_list, name='category-list'),
    path('great-gifts/', views.great_gift_categories, name='great-gift-categories'),
]
