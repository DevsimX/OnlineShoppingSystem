from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from django.db.models import F, Q
from .models import Product, ProductTag
from .serializers import ProductListSerializer, ProductDetailSerializer


class ProductPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


@api_view(['GET'])
@permission_classes([AllowAny])
def product_list(request):
    """Get all products with pagination, ranked by rank_if high to low"""
    from django.db.models import Case, When, Value, FloatField
    
    products = Product.objects.select_related('tag').annotate(
        rank_if_value=Case(
            When(tag__isnull=False, then=F('tag__rank_if')),
            default=Value(0.0),
            output_field=FloatField()
        )
    ).order_by('-rank_if_value', '-created_at')
    
    paginator = ProductPagination()
    paginated_products = paginator.paginate_queryset(products, request)
    serializer = ProductListSerializer(paginated_products, many=True)
    return paginator.get_paginated_response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def product_list_by_category(request, category_id):
    """Get products by category ID with pagination, ranked by rank_if high to low"""
    from django.db.models import Case, When, Value, FloatField
    
    products = Product.objects.select_related('tag').filter(
        category_id=category_id
    ).annotate(
        rank_if_value=Case(
            When(tag__isnull=False, then=F('tag__rank_if')),
            default=Value(0.0),
            output_field=FloatField()
        )
    ).order_by('-rank_if_value', '-created_at')
    
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
    products = Product.objects.select_related('tag').filter(
        tag__gift_box=True,
        tag__isnull=False
    ).order_by('-tag__rank_if')[:8]
    serializer = ProductListSerializer(products, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
