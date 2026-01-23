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
from .services import get_collection_search_query, get_search_query, get_search_suggestions
from django.db import connection
from urllib.parse import unquote


class ProductPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


@api_view(['GET'])
@permission_classes([AllowAny])
def product_list(request):
    """Get all products with pagination, with optional sorting and filtering"""
    products = Product.objects.select_related('tag', 'brand').annotate(
        rank_if_value=Case(
            When(tag__isnull=False, then=F('tag__rank_if')),
            default=Value(0.0),
            output_field=FloatField()
        )
    )
    
    # Apply filters
    available_param = request.query_params.get('available')
    if available_param is not None:
        is_available = available_param.lower() == 'true'
        if is_available:
            products = products.filter(current_stock__gt=0, status='available')
        else:
            products = products.filter(Q(current_stock=0) | Q(status='unavailable'))
    
    min_price = request.query_params.get('minPrice')
    if min_price:
        products = products.filter(price__gte=float(min_price))
    
    max_price = request.query_params.get('maxPrice')
    if max_price:
        products = products.filter(price__lte=float(max_price))
    
    product_type = request.query_params.get('productType')
    if product_type:
        type_list = [t.strip() for t in product_type.split(',')]
        type_q = Q()
        for pt in type_list:
            type_q |= Q(type__icontains=pt)
        products = products.filter(type_q)
    
    brand = request.query_params.get('brand')
    if brand:
        brand_list = [unquote(b.strip()) for b in brand.split(',')]
        brand_q = Q()
        for b_name in brand_list:
            brand_q |= Q(brand__name__icontains=b_name)
        products = products.filter(brand_q)
    
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
    # Extract filter parameters
    filters = {}
    available_param = request.query_params.get('available')
    if available_param is not None:
        filters['available'] = available_param.lower() == 'true'
    
    min_price = request.query_params.get('minPrice')
    if min_price:
        filters['min_price'] = float(min_price)
    
    max_price = request.query_params.get('maxPrice')
    if max_price:
        filters['max_price'] = float(max_price)
    
    product_type = request.query_params.get('productType')
    if product_type:
        filters['product_type'] = [t.strip() for t in product_type.split(',')]
    
    brand = request.query_params.get('brand')
    if brand:
        filters['brand'] = [unquote(b.strip()) for b in brand.split(',')]
    
    # Build PostgreSQL search query with filters
    search_config = get_collection_search_query(slug, filters)
    
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
def search_products(request):
    """Search products with FTS + pg_trgm, returns products and suggestions"""
    query = request.query_params.get('q', '').strip()
    limit = int(request.query_params.get('limit', 8))
    
    if not query:
        return Response({
            'suggestions': [],
            'products': [],
            'total': 0
        })
    
    # Get suggestions (brands)
    suggestions = get_search_suggestions(query, limit=limit)
    
    # Get products
    search_config = get_search_query(query, limit=limit)
    
    with connection.cursor() as cursor:
        cursor.execute(search_config['sql_query'], search_config['params'])
        columns = [col[0] for col in cursor.description]
        rows = cursor.fetchall()
        results = [dict(zip(columns, row)) for row in rows]
        product_ids = [r['id'] for r in results]
    
    # Fetch Product objects from Django ORM
    products_dict = {
        p.id: p for p in Product.objects.select_related('tag', 'brand')
        .filter(id__in=product_ids)
    }
    products = [products_dict[pid] for pid in product_ids if pid in products_dict]
    
    # Serialize
    serializer = ProductListSerializer(products, many=True)
    
    return Response({
        'suggestions': suggestions,
        'products': serializer.data,
        'total': len(products)
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def search_products_full(request, query):
    """Full search results page with pagination"""
    # Get pagination params
    page = int(request.query_params.get('page', 1))
    page_size = int(request.query_params.get('page_size', 20))
    offset = (page - 1) * page_size
    
    # Build search query
    search_config = get_search_query(query, limit=10000)  # Large limit for counting
    
    # Extract WHERE clause for count
    sql_query_str = search_config['sql_query']
    where_match = sql_query_str.split('WHERE')
    where_clause = where_match[1].split('ORDER BY')[0].strip() if len(where_match) > 1 else 'TRUE'
    # Remove LIMIT from where_clause if present
    where_clause = where_clause.split('LIMIT')[0].strip()
    
    # Check if it's a short query (no similarity_score in SELECT)
    is_short_query = 'similarity_score' not in sql_query_str
    
    # Build count query
    count_query = f"""
        SELECT COUNT(DISTINCT p.id)
        FROM products p
        LEFT JOIN brands b ON p.brand_id = b.id
        LEFT JOIN product_tags pt ON p.id = pt.product_id
        WHERE {where_clause}
    """
    
    # Build paginated query - use the ORDER BY from search_config
    if is_short_query:
        # Short query: no similarity_score
        select_fields = (
            f"p.id, p.name, p.brand_id, p.description, p.price, p.profile_pic_link, "
            f"p.type, p.current_stock, p.status, p.created_at, p.updated_at, "
            f"pt.rank_if"
        )
        order_by = search_config['order_by']
    else:
        # Longer query: include similarity_score
        search_text_escaped = query.replace("'", "''")
        similarity_expr = (
            f"GREATEST("
            f"similarity(p.name, '{search_text_escaped}'), "
            f"similarity(p.description, '{search_text_escaped}'), "
            f"similarity(b.name, '{search_text_escaped}')"
            f")"
        )
        select_fields = (
            f"p.id, p.name, p.brand_id, p.description, p.price, p.profile_pic_link, "
            f"p.type, p.current_stock, p.status, p.created_at, p.updated_at, "
            f"pt.rank_if, {similarity_expr} AS similarity_score"
        )
        order_by = search_config['order_by']
    
    paginated_query = f"""
        SELECT {select_fields}
        FROM products p
        LEFT JOIN brands b ON p.brand_id = b.id
        LEFT JOIN product_tags pt ON p.id = pt.product_id
        WHERE {where_clause}
        ORDER BY {order_by}
        LIMIT %s OFFSET %s
    """
    
    with connection.cursor() as cursor:
        # Get total count
        cursor.execute(count_query, search_config['params'][:-1])  # Remove limit param
        total = cursor.fetchone()[0]
        
        # Get paginated results
        params = search_config['params'][:-1] + [page_size, offset]  # Remove limit, add pagination
        cursor.execute(paginated_query, params)
        
        columns = [col[0] for col in cursor.description]
        rows = cursor.fetchall()
        results = [dict(zip(columns, row)) for row in rows]
        product_ids = [r['id'] for r in results]
    
    # Fetch Product objects from Django ORM
    products_dict = {
        p.id: p for p in Product.objects.select_related('tag', 'brand')
        .filter(id__in=product_ids)
    }
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
    # Filter products where type array contains anything with 'gift' (case-insensitive)
    # Get all products with tags, annotate rank_if, then filter in Python for case-insensitive matching
    products = Product.objects.select_related('tag').filter(
        tag__isnull=False
    ).annotate(
        rank_if_value=Case(
            When(tag__isnull=False, then=F('tag__rank_if')),
            default=Value(0.0),
            output_field=FloatField()
        )
    ).order_by('-rank_if_value')
    
    # Filter for products where any type contains 'gift' (case-insensitive)
    gift_products = []
    for product in products:
        if product.type and isinstance(product.type, list):
            for type_item in product.type:
                if isinstance(type_item, str) and 'gift' in type_item.lower():
                    gift_products.append(product)
                    break
        # Stop once we have 8 products (already sorted by rank_if)
        if len(gift_products) >= 8:
            break
    
    serializer = ProductListSerializer(gift_products, many=True)
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
