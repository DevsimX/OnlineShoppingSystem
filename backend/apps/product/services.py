"""
Business service layer for collection search using PostgreSQL FTS and pg_trgm
Uses raw SQL queries - no ORM Q objects, no manual interpretation
"""
import json
from decimal import Decimal
from django.db import connection


def get_collection_search_query(slug: str, filters: dict = None) -> dict:
    """
    Build PostgreSQL FTS + pg_trgm search query from a slug.
    Relies purely on PostgreSQL's FTS and pg_trgm for fuzzy matching.
    
    Args:
        slug: Collection slug (e.g., 'cooking-condiments', 'gifts-under-100', 'whats-hot', 'new-stuff')
    
    Returns:
        dict with 'sql_query' (SQL string), 'params' (query parameters), 
        'order_by' (ORDER BY clause), and metadata
    """
    slug_lower = slug.lower()
    
    # Handle special collection slugs: whats-hot and new-stuff
    if slug_lower == 'whats-hot':
        where_conditions = ["pt.hot = TRUE AND pt.hot_if IS NOT NULL"]
        params = []
        order_by = "COALESCE(pt.hot_if, 0) DESC, p.created_at DESC"
        
        # Apply additional filters from query parameters
        if filters:
            if 'available' in filters and filters['available'] is not None:
                if filters['available']:
                    where_conditions.append("p.current_stock > 0 AND p.status = 'available'")
                else:
                    where_conditions.append("(p.current_stock = 0 OR p.status = 'unavailable')")
            
            if 'min_price' in filters and filters['min_price'] is not None:
                where_conditions.append("p.price >= %s")
                params.append(float(filters['min_price']))
            if 'max_price' in filters and filters['max_price'] is not None:
                where_conditions.append("p.price <= %s")
                params.append(float(filters['max_price']))
            
            if 'product_type' in filters and filters['product_type']:
                type_conditions = []
                for product_type in filters['product_type']:
                    type_conditions.append("(p.type @> %s::jsonb OR p.type::text ILIKE %s)")
                    params.append(json.dumps([product_type]))
                    params.append(f'%{product_type}%')
                if type_conditions:
                    where_conditions.append(f"({' OR '.join(type_conditions)})")
            
            if 'brand' in filters and filters['brand']:
                brand_conditions = []
                for brand_name in filters['brand']:
                    brand_name_clean = str(brand_name).strip()
                    if brand_name_clean:
                        brand_conditions.append("b.name ILIKE %s")
                        params.append(f'%{brand_name_clean}%')
                if brand_conditions:
                    where_conditions.append(f"({' OR '.join(brand_conditions)})")
        
        where_clause = ' AND '.join(where_conditions)
        select_fields = (
            "p.id, p.name, p.brand_id, p.description, p.price, p.profile_pic_link, "
            "p.type, p.current_stock, p.status, p.created_at, p.updated_at, "
            "pt.rank_if"
        )
        
        sql_query = f"""
            SELECT {select_fields}
            FROM products p
            LEFT JOIN brands b ON p.brand_id = b.id
            LEFT JOIN product_tags pt ON p.id = pt.product_id
            WHERE {where_clause}
            ORDER BY {order_by}
        """
        
        return {
            'sql_query': sql_query,
            'params': params,
            'order_by': order_by,
        }
    
    if slug_lower == 'new-stuff':
        where_conditions = ["pt.new = TRUE AND pt.new_if IS NOT NULL"]
        params = []
        order_by = "COALESCE(pt.new_if, 0) DESC, p.created_at DESC"
        
        # Apply additional filters from query parameters
        if filters:
            if 'available' in filters and filters['available'] is not None:
                if filters['available']:
                    where_conditions.append("p.current_stock > 0 AND p.status = 'available'")
                else:
                    where_conditions.append("(p.current_stock = 0 OR p.status = 'unavailable')")
            
            if 'min_price' in filters and filters['min_price'] is not None:
                where_conditions.append("p.price >= %s")
                params.append(float(filters['min_price']))
            if 'max_price' in filters and filters['max_price'] is not None:
                where_conditions.append("p.price <= %s")
                params.append(float(filters['max_price']))
            
            if 'product_type' in filters and filters['product_type']:
                type_conditions = []
                for product_type in filters['product_type']:
                    type_conditions.append("(p.type @> %s::jsonb OR p.type::text ILIKE %s)")
                    params.append(json.dumps([product_type]))
                    params.append(f'%{product_type}%')
                if type_conditions:
                    where_conditions.append(f"({' OR '.join(type_conditions)})")
            
            if 'brand' in filters and filters['brand']:
                brand_conditions = []
                for brand_name in filters['brand']:
                    brand_name_clean = str(brand_name).strip()
                    if brand_name_clean:
                        brand_conditions.append("b.name ILIKE %s")
                        params.append(f'%{brand_name_clean}%')
                if brand_conditions:
                    where_conditions.append(f"({' OR '.join(brand_conditions)})")
        
        where_clause = ' AND '.join(where_conditions)
        select_fields = (
            "p.id, p.name, p.brand_id, p.description, p.price, p.profile_pic_link, "
            "p.type, p.current_stock, p.status, p.created_at, p.updated_at, "
            "pt.rank_if"
        )
        
        sql_query = f"""
            SELECT {select_fields}
            FROM products p
            LEFT JOIN brands b ON p.brand_id = b.id
            LEFT JOIN product_tags pt ON p.id = pt.product_id
            WHERE {where_clause}
            ORDER BY {order_by}
        """
        
        return {
            'sql_query': sql_query,
            'params': params,
            'order_by': order_by,
        }
    
    # Regular collection slug handling (existing logic)
    parts = slug_lower.split('-')
    where_conditions = []
    params = []
    
    # Extract search terms (exclude common words and numbers)
    excluded_words = {'for', 'the', 'a', 'an', 'and', 'or', 'under', 'over', 'below', 'above', 'to', 'of', 'in', 'on', 'at'}
    search_terms = []
    price_value = None
    price_operator = None
    
    for part in parts:
        # Check if it's a price number
        if part.startswith('$') or part.replace('.', '').isdigit():
            try:
                price_value = float(part.replace('$', '').replace(',', ''))
                # Check if previous part indicates "under" or "over"
                part_index = parts.index(part)
                if part_index > 0:
                    prev_part = parts[part_index - 1]
                    if prev_part in ['under', 'below', 'less']:
                        price_operator = 'lt'
                    elif prev_part in ['over', 'above', 'more', 'greater']:
                        price_operator = 'gt'
                if not price_operator:
                    # Default to "under" if no keyword
                    price_operator = 'lt'
            except (ValueError, TypeError):
                pass
        elif part not in excluded_words and len(part) > 2:
            search_terms.append(part)
    
    # Build search conditions using PostgreSQL FTS and pg_trgm
    # Best practice: Prioritize FTS (more semantic, fewer false positives)
    # Use similarity with higher threshold (0.2) to reduce false positives
    # Use ILIKE for exact substring matches (most reliable)
    search_conditions = []
    
    if search_terms:
        # Combine search terms
        search_text = ' '.join(search_terms)
        
        # Primary: FTS and ILIKE (most reliable, semantic matching)
        # Secondary: Similarity with higher threshold (0.2) to reduce false positives
        search_conditions.append(
            "(to_tsvector('english', p.name || ' ' || p.description || ' ' || COALESCE(b.name, '')) @@ plainto_tsquery('english', %s) OR "
            "p.name ILIKE %s OR "
            "p.description ILIKE %s OR "
            "b.name ILIKE %s OR "
            "p.type::text ILIKE %s OR "
            "similarity(p.name, %s) > 0.2 OR "
            "similarity(p.description, %s) > 0.2 OR "
            "similarity(b.name, %s) > 0.2)"
        )
        params.extend([
            search_text,  # FTS query (prioritized)
            f'%{search_text}%', f'%{search_text}%', f'%{search_text}%',  # ILIKE params (exact matches)
            f'%{search_text}%',  # type search
            search_text, search_text, search_text,  # similarity params (with higher threshold)
        ])
        
        # Also search individual terms for better matching
        # Use higher threshold (0.2) for individual terms to reduce false positives
        for term in search_terms:
            if len(term) > 3:
                search_conditions.append(
                    "(p.name ILIKE %s OR "
                    "p.description ILIKE %s OR "
                    "similarity(p.name, %s) > 0.2 OR "
                    "similarity(p.description, %s) > 0.2)"
                )
                params.extend([f'%{term}%', f'%{term}%', term, term])
    
    if search_conditions:
        where_conditions.append(f"({' OR '.join(search_conditions)})")
    
    # Price filter from slug
    if price_value is not None and price_operator:
        if price_operator == 'lt':
            where_conditions.append("p.price < %s")
            params.append(price_value)
        elif price_operator == 'gt':
            where_conditions.append("p.price > %s")
            params.append(price_value)
    
    # Apply additional filters from query parameters
    if filters:
        # Availability filter
        if 'available' in filters and filters['available'] is not None:
            if filters['available']:
                where_conditions.append("p.current_stock > 0 AND p.status = 'available'")
            else:
                where_conditions.append("(p.current_stock = 0 OR p.status = 'unavailable')")
        
        # Price range filters
        if 'min_price' in filters and filters['min_price'] is not None:
            where_conditions.append("p.price >= %s")
            params.append(float(filters['min_price']))
        if 'max_price' in filters and filters['max_price'] is not None:
            where_conditions.append("p.price <= %s")
            params.append(float(filters['max_price']))
        
        # Product type filter (type is a JSON array)
        if 'product_type' in filters and filters['product_type']:
            type_conditions = []
            for product_type in filters['product_type']:
                # Use JSON containment operator for exact match in array
                # Also use ILIKE as fallback for partial matching
                type_conditions.append("(p.type @> %s::jsonb OR p.type::text ILIKE %s)")
                # JSON array format: ["Air Freshener"]
                import json
                params.append(json.dumps([product_type]))
                params.append(f'%{product_type}%')
            if type_conditions:
                where_conditions.append(f"({' OR '.join(type_conditions)})")
        
        # Brand filter
        if 'brand' in filters and filters['brand']:
            brand_conditions = []
            for brand_name in filters['brand']:
                # brand_name is already decoded from views.py, but ensure it's a string
                brand_name_clean = str(brand_name).strip()
                if brand_name_clean:
                    brand_conditions.append("b.name ILIKE %s")
                    params.append(f'%{brand_name_clean}%')
            if brand_conditions:
                where_conditions.append(f"({' OR '.join(brand_conditions)})")
    
    # Build ORDER BY clause based on relevance
    # Use pg_trgm similarity score for ranking
    order_by = "COALESCE(pt.rank_if, 0) DESC, p.created_at DESC"
    similarity_expr = None
    if search_terms:
        search_text = ' '.join(search_terms)
        # Add similarity-based ordering
        search_text_escaped = search_text.replace("'", "''")
        similarity_expr = (
            f"GREATEST("
            f"similarity(p.name, '{search_text_escaped}'), "
            f"similarity(p.description, '{search_text_escaped}'), "
            f"similarity(b.name, '{search_text_escaped}')"
            f")"
        )
        order_by = "similarity_score DESC, COALESCE(pt.rank_if, 0) DESC, p.created_at DESC"
    
    # Build SQL query
    where_clause = ' AND '.join(where_conditions) if where_conditions else 'TRUE'
    
    # Use explicit column list
    select_fields = (
        "p.id, p.name, p.brand_id, p.description, p.price, p.profile_pic_link, "
        "p.type, p.current_stock, p.status, p.created_at, p.updated_at, "
        "pt.rank_if"
    )
    if similarity_expr:
        select_fields = f"{select_fields}, {similarity_expr} AS similarity_score"
    
    sql_query = f"""
        SELECT {select_fields}
        FROM products p
        LEFT JOIN brands b ON p.brand_id = b.id
        LEFT JOIN product_tags pt ON p.id = pt.product_id
        WHERE {where_clause}
        ORDER BY {order_by}
    """
    
    return {
        'sql_query': sql_query,
        'params': params,
        'order_by': order_by,
    }


def get_search_query(query: str, limit: int = 8) -> dict:
    """
    Build PostgreSQL FTS + pg_trgm search query for products and suggestions.
    
    Args:
        query: Search query string
        limit: Maximum number of results to return
    
    Returns:
        dict with 'sql_query' (SQL string), 'params' (query parameters), 
        'order_by' (ORDER BY clause), and metadata
    """
    if not query or len(query.strip()) < 1:
        return {
            'sql_query': "SELECT p.id, p.name, p.brand_id, p.description, p.price, p.profile_pic_link, p.type, p.current_stock, p.status, p.created_at, p.updated_at, pt.rank_if FROM products p LEFT JOIN brands b ON p.brand_id = b.id LEFT JOIN product_tags pt ON p.id = pt.product_id WHERE FALSE",
            'params': [],
            'order_by': '',
        }
    
    search_text = query.strip()
    where_conditions = []
    params = []
    
    # For very short queries (1-2 chars), use ILIKE only (similarity threshold too strict)
    # For longer queries, use FTS + ILIKE + similarity
    is_short_query = len(search_text) <= 2
    
    if is_short_query:
        # Short query: Use ILIKE only (most reliable for single characters)
        search_conditions = [
            "p.name ILIKE %s OR "
            "p.description ILIKE %s OR "
            "b.name ILIKE %s OR "
            "p.type::text ILIKE %s"
        ]
        params.extend([
            f'%{search_text}%', f'%{search_text}%', f'%{search_text}%',
            f'%{search_text}%',
        ])
    else:
        # Longer query: Use FTS + ILIKE + similarity
        search_conditions = [
            "(to_tsvector('english', p.name || ' ' || p.description || ' ' || COALESCE(b.name, '')) @@ plainto_tsquery('english', %s) OR "
            "p.name ILIKE %s OR "
            "p.description ILIKE %s OR "
            "b.name ILIKE %s OR "
            "p.type::text ILIKE %s OR "
            "similarity(p.name, %s) > 0.2 OR "
            "similarity(p.description, %s) > 0.2 OR "
            "similarity(b.name, %s) > 0.2)"
        ]
        params.extend([
            search_text,
            f'%{search_text}%', f'%{search_text}%', f'%{search_text}%',
            f'%{search_text}%',
            search_text, search_text, search_text,
        ])
        
        # Also search individual words (only for words longer than 3 chars)
        words = search_text.split()
        for word in words:
            if len(word) > 3:
                search_conditions.append(
                    "(p.name ILIKE %s OR "
                    "p.description ILIKE %s OR "
                    "b.name ILIKE %s OR "
                    "similarity(p.name, %s) > 0.2 OR "
                    "similarity(p.description, %s) > 0.2 OR "
                    "similarity(b.name, %s) > 0.2)"
                )
                params.extend([f'%{word}%', f'%{word}%', f'%{word}%', word, word, word])
    
    where_conditions.append(f"({' OR '.join(search_conditions)})")
    
    where_clause = ' AND '.join(where_conditions)
    
    # For short queries, don't use similarity for ordering (it will be too low)
    if is_short_query:
        order_by = "COALESCE(pt.rank_if, 0) DESC, p.created_at DESC"
        select_fields = (
            f"p.id, p.name, p.brand_id, p.description, p.price, p.profile_pic_link, "
            f"p.type, p.current_stock, p.status, p.created_at, p.updated_at, "
            f"pt.rank_if"
        )
    else:
        # Build similarity expression for ordering
        search_text_escaped = search_text.replace("'", "''")
        similarity_expr = (
            f"GREATEST("
            f"similarity(p.name, '{search_text_escaped}'), "
            f"similarity(p.description, '{search_text_escaped}'), "
            f"similarity(b.name, '{search_text_escaped}')"
            f")"
        )
        order_by = "similarity_score DESC, COALESCE(pt.rank_if, 0) DESC, p.created_at DESC"
        select_fields = (
            f"p.id, p.name, p.brand_id, p.description, p.price, p.profile_pic_link, "
            f"p.type, p.current_stock, p.status, p.created_at, p.updated_at, "
            f"pt.rank_if, {similarity_expr} AS similarity_score"
        )
    
    sql_query = f"""
        SELECT {select_fields}
        FROM products p
        LEFT JOIN brands b ON p.brand_id = b.id
        LEFT JOIN product_tags pt ON p.id = pt.product_id
        WHERE {where_clause}
        ORDER BY {order_by}
        LIMIT %s
    """
    params.append(limit)
    
    return {
        'sql_query': sql_query,
        'params': params,
        'order_by': order_by,
    }


def get_search_suggestions(query: str, limit: int = 8) -> list:
    """
    Get search suggestions (brands/collections) based on query.
    Returns unique brand names that match the search.
    
    Args:
        query: Search query string
        limit: Maximum number of suggestions
    
    Returns:
        List of brand names (as suggestions)
    """
    if not query or len(query.strip()) < 1:
        return []
    
    search_text = query.strip()
    is_short_query = len(search_text) <= 2
    
    with connection.cursor() as cursor:
        if is_short_query:
            # For short queries, use ILIKE only
            cursor.execute("""
                SELECT DISTINCT b.name
                FROM brands b
                WHERE b.name ILIKE %s
                ORDER BY b.name
                LIMIT %s
            """, [f'%{search_text}%', limit])
        else:
            # For longer queries, use ILIKE + similarity
            # Need to include similarity in SELECT for ORDER BY to work
            search_text_escaped = search_text.replace("'", "''")
            cursor.execute(f"""
                SELECT DISTINCT b.name, similarity(b.name, '{search_text_escaped}') AS sim_score
                FROM brands b
                WHERE b.name ILIKE %s OR similarity(b.name, %s) > 0.2
                ORDER BY sim_score DESC, b.name
                LIMIT %s
            """, [f'%{search_text}%', search_text, limit])
        
        suggestions = [row[0] for row in cursor.fetchall()]
        return suggestions
