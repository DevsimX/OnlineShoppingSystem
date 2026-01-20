"""
Business service layer for collection search using PostgreSQL FTS and pg_trgm
Uses raw SQL queries - no ORM Q objects, no manual interpretation
"""
from decimal import Decimal
from django.db import connection


def get_collection_search_query(slug: str) -> dict:
    """
    Build PostgreSQL FTS + pg_trgm search query from a slug.
    Relies purely on PostgreSQL's FTS and pg_trgm for fuzzy matching.
    
    Args:
        slug: Collection slug (e.g., 'cooking-condiments', 'gifts-under-100')
    
    Returns:
        dict with 'sql_query' (SQL string), 'params' (query parameters), 
        'order_by' (ORDER BY clause), and metadata
    """
    parts = slug.lower().split('-')
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
    
    # Price filter
    if price_value is not None and price_operator:
        if price_operator == 'lt':
            where_conditions.append("p.price < %s")
            params.append(price_value)
        elif price_operator == 'gt':
            where_conditions.append("p.price > %s")
            params.append(price_value)
    
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
