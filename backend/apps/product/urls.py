from django.urls import path
from . import views

urlpatterns = [
    path('', views.product_list, name='product-list'),
    path('category/<str:category_name>/', views.product_list_by_category, name='product-list-by-category'),
    path('<int:product_id>/', views.product_detail, name='product-detail'),
    path('hot/', views.hot_products, name='hot-products'),
    path('new/', views.new_products, name='new-products'),
    path('explore/', views.explore_products, name='explore-products'),
    path('gift-box/', views.gift_box_products, name='gift-box-products'),
]
