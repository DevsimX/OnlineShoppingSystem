from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from django.db.models import Case, When, Value, FloatField, F
from apps.category.models import Category
from apps.brand.models import Brand
from .models import Product
from .serializers import ProductListSerializer, ProductDetailSerializer


class ProductPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


@api_view(['GET'])
@permission_classes([AllowAny])
def product_list(request):
    """Get all products with pagination, with optional sorting"""
    products = Product.objects.select_related('tag').annotate(
        rank_if_value=Case(
            When(tag__isnull=False, then=F('tag__rank_if')),
            default=Value(0.0),
            output_field=FloatField()
        )
    )
    
    # Handle sorting based on query parameter
    sort_param = request.query_params.get('sort', 'COLLECTION_DEFAULT')
    
    if sort_param == 'BEST_SELLING':
        # Best selling: rank by rank_if (could be enhanced with sales data later)
        products = products.order_by('-rank_if_value', '-created_at')
    elif sort_param == 'CREATED':
        # Oldest first
        products = products.order_by('created_at', 'id')
    elif sort_param == 'CREATED_REVERSE':
        # Newest first
        products = products.order_by('-created_at', '-id')
    elif sort_param == 'PRICE':
        # Price: Low to High
        products = products.order_by('price', 'id')
    elif sort_param == 'PRICE_REVERSE':
        # Price: High to Low
        products = products.order_by('-price', '-id')
    else:
        # COLLECTION_DEFAULT or unknown: Featured (rank by rank_if)
        products = products.order_by('-rank_if_value', '-created_at')
    
    paginator = ProductPagination()
    paginated_products = paginator.paginate_queryset(products, request)
    serializer = ProductListSerializer(paginated_products, many=True)
    return paginator.get_paginated_response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def product_list_by_category(request, category_name):
    """Get products by category name with pagination, with optional sorting"""
    # Get category by name (case-insensitive lookup)
    category = get_object_or_404(Category, name__iexact=category_name)
    
    products = Product.objects.select_related('tag').filter(
        category=category
    ).annotate(
        rank_if_value=Case(
            When(tag__isnull=False, then=F('tag__rank_if')),
            default=Value(0.0),
            output_field=FloatField()
        )
    )
    
    # Handle sorting based on query parameter
    sort_param = request.query_params.get('sort', 'COLLECTION_DEFAULT')
    
    if sort_param == 'BEST_SELLING':
        # Best selling: rank by rank_if (could be enhanced with sales data later)
        products = products.order_by('-rank_if_value', '-created_at')
    elif sort_param == 'CREATED':
        # Oldest first
        products = products.order_by('created_at', 'id')
    elif sort_param == 'CREATED_REVERSE':
        # Newest first
        products = products.order_by('-created_at', '-id')
    elif sort_param == 'PRICE':
        # Price: Low to High
        products = products.order_by('price', 'id')
    elif sort_param == 'PRICE_REVERSE':
        # Price: High to Low
        products = products.order_by('-price', '-id')
    else:
        # COLLECTION_DEFAULT or unknown: Featured (rank by rank_if)
        products = products.order_by('-rank_if_value', '-created_at')
    
    paginator = ProductPagination()
    paginated_products = paginator.paginate_queryset(products, request)
    serializer = ProductListSerializer(paginated_products, many=True)
    return paginator.get_paginated_response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def product_detail(request, product_id):
    """Get single product by ID with all details"""
    product = get_object_or_404(Product, id=product_id)
    serializer = ProductDetailSerializer(product)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def hot_products(request):
    """Get 8 most hot products ranked by hot_if high to low"""
    products = Product.objects.select_related('tag').filter(
        tag__hot=True,
        tag__isnull=False
    ).order_by('-tag__hot_if')[:8]
    serializer = ProductListSerializer(products, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def new_products(request):
    """Get 8 most new products ranked by new_if high to low"""
    products = Product.objects.select_related('tag').filter(
        tag__new=True,
        tag__isnull=False
    ).order_by('-tag__new_if')[:8]
    serializer = ProductListSerializer(products, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def explore_products(request):
    """Get 8 most deserve to explore products ranked by rank_if high to low"""
    products = Product.objects.select_related('tag').filter(
        tag__isnull=False
    ).order_by('-tag__rank_if')[:8]
    serializer = ProductListSerializer(products, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def gift_box_products(request):
    """Get 8 gift box products ranked by rank_if high to low"""
    # Filter products where type array contains 'Gift Box'
    products = Product.objects.select_related('tag').filter(
        type__contains=['Gift Box'],
        tag__isnull=False
    ).order_by('-tag__rank_if')[:8]
    serializer = ProductListSerializer(products, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def product_list_by_brand(request, brand_id):
    """Get products by brand ID with pagination, with optional sorting"""
    # Get brand by ID
    brand = get_object_or_404(Brand, id=brand_id)
    
    products = Product.objects.select_related('tag').filter(
        brand=brand
    ).annotate(
        rank_if_value=Case(
            When(tag__isnull=False, then=F('tag__rank_if')),
            default=Value(0.0),
            output_field=FloatField()
        )
    )
    
    # Handle sorting based on query parameter
    sort_param = request.query_params.get('sort', 'COLLECTION_DEFAULT')
    
    if sort_param == 'BEST_SELLING':
        # Best selling: rank by rank_if (could be enhanced with sales data later)
        products = products.order_by('-rank_if_value', '-created_at')
    elif sort_param == 'CREATED':
        # Oldest first
        products = products.order_by('created_at', 'id')
    elif sort_param == 'CREATED_REVERSE':
        # Newest first
        products = products.order_by('-created_at', '-id')
    elif sort_param == 'PRICE':
        # Price: Low to High
        products = products.order_by('price', 'id')
    elif sort_param == 'PRICE_REVERSE':
        # Price: High to Low
        products = products.order_by('-price', '-id')
    else:
        # COLLECTION_DEFAULT or unknown: Featured (rank by rank_if)
        products = products.order_by('-rank_if_value', '-created_at')
    
    paginator = ProductPagination()
    paginated_products = paginator.paginate_queryset(products, request)
    serializer = ProductListSerializer(paginated_products, many=True)
    return paginator.get_paginated_response(serializer.data)
