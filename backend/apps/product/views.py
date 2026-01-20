from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from django.db.models import Case, When, Value, FloatField, F, Q
from apps.brand.models import Brand
from .models import Product
from .serializers import ProductListSerializer, ProductDetailSerializer
from .services import get_collection_search_query
from django.db import connection


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
def product_list_by_collection(request, slug):
    """Get products by collection slug with fuzzy matching using PostgreSQL FTS + pg_trgm"""
    # Build PostgreSQL search query
    search_config = get_collection_search_query(slug)
    
    # Get pagination params
    page = int(request.query_params.get('page', 1))
    page_size = int(request.query_params.get('page_size', 20))
    offset = (page - 1) * page_size
    
    # Handle sorting
    sort_param = request.query_params.get('sort', 'COLLECTION_DEFAULT')
    
    # Adjust ORDER BY based on sort parameter
    base_order_by = search_config['order_by']
    if sort_param == 'BEST_SELLING':
        order_by = "COALESCE(pt.rank_if, 0) DESC, p.created_at DESC"
    elif sort_param == 'CREATED':
        order_by = "p.created_at ASC, p.id ASC"
    elif sort_param == 'CREATED_REVERSE':
        order_by = "p.created_at DESC, p.id DESC"
    elif sort_param == 'PRICE':
        order_by = "p.price ASC, p.id ASC"
    elif sort_param == 'PRICE_REVERSE':
        order_by = "p.price DESC, p.id DESC"
    else:
        order_by = base_order_by
    
    # Build SQL with pagination
    sql_query = search_config['sql_query'].replace(
        f"ORDER BY {search_config['order_by']}",
        f"ORDER BY {order_by}"
    )
    sql_query = f"{sql_query} LIMIT %s OFFSET %s"
    
    # Execute query
    with connection.cursor() as cursor:
        # Count total results - extract WHERE clause and build simpler count query
        sql_query_str = search_config['sql_query']
        # Extract WHERE clause from the original query
        where_match = sql_query_str.split('WHERE')
        where_clause = where_match[1].split('ORDER BY')[0].strip() if len(where_match) > 1 else 'TRUE'
        
        count_query = f"""
            SELECT COUNT(DISTINCT p.id)
            FROM products p
            LEFT JOIN brands b ON p.brand_id = b.id
            LEFT JOIN product_tags pt ON p.id = pt.product_id
            WHERE {where_clause}
        """
        cursor.execute(count_query, search_config['params'])
        total = cursor.fetchone()[0]
        
        # Get paginated results
        params = search_config['params'] + [page_size, offset]
        cursor.execute(sql_query, params)
        
        # Fetch results
        columns = [col[0] for col in cursor.description]
        rows = cursor.fetchall()
        
        # Convert rows to dictionaries
        results = [dict(zip(columns, row)) for row in rows]
        product_ids = [r['id'] for r in results]
    
    # Fetch Product objects from Django ORM to use serializers
    # Preserve order by using a dict
    products_dict = {
        p.id: p for p in Product.objects.select_related('tag', 'brand')
        .filter(id__in=product_ids)
    }
    
    # Order products according to SQL results
    products = [products_dict[pid] for pid in product_ids if pid in products_dict]
    
    # Serialize
    serializer = ProductListSerializer(products, many=True)
    
    # Build paginated response
    return Response({
        'count': total,
        'next': f"{request.build_absolute_uri()}?page={page + 1}" if offset + page_size < total else None,
        'previous': f"{request.build_absolute_uri()}?page={page - 1}" if page > 1 else None,
        'results': serializer.data
    })


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


@api_view(['GET'])
@permission_classes([AllowAny])
def you_might_like_products(request, product_id):
    """Get 8 products with same type as provided product, ordered by rank_if, excluding the provided product"""
    # Get the product to find its type
    product = get_object_or_404(Product, id=product_id)
    
    # Get product's type array
    product_types = product.type if isinstance(product.type, list) else []
    
    if not product_types:
        # If product has no type, return empty list
        return Response([], status=status.HTTP_200_OK)
    
    # Find products that share at least one type with the provided product
    # Using __contains for each type in the array
    type_filters = Q()
    for product_type in product_types:
        type_filters |= Q(type__contains=[product_type])
    
    # Get products with same type, exclude current product, ordered by rank_if
    products = Product.objects.select_related('tag').filter(
        type_filters
    ).exclude(
        id=product_id
    ).annotate(
        rank_if_value=Case(
            When(tag__isnull=False, then=F('tag__rank_if')),
            default=Value(0.0),
            output_field=FloatField()
        )
    ).order_by('-rank_if_value', '-created_at')[:8]
    
    serializer = ProductListSerializer(products, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
