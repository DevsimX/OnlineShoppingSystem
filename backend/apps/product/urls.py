from django.urls import path
from . import views

urlpatterns = [
    path('', views.product_list, name='product-list'),
    path('hot/', views.hot_products, name='hot-products'),
    path('new/', views.new_products, name='new-products'),
    path('explore/', views.explore_products, name='explore-products'),
    path('gift-box/', views.gift_box_products, name='gift-box-products'),
    path('collections/<str:slug>/', views.product_list_by_collection, name='product-list-by-collection'),
    path('brand/<int:brand_id>/', views.product_list_by_brand, name='product-list-by-brand'),
    path('<int:product_id>/you-might-like/', views.you_might_like_products, name='you-might-like-products'),
    path('<int:product_id>/', views.product_detail, name='product-detail'),
]
