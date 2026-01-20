"""
Business service layer for collection interpretation and filtering
"""
from decimal import Decimal
from django.db.models import Q, Value, CharField
from django.db.models.functions import Lower, Cast
from django.contrib.postgres.fields import ArrayField


class CollectionInterpreter:
    """
    Interprets collection slugs and builds query filters.
    
    Handles formats like:
    - cooking-condiments
    - gifts-under-100
    - gifts-for-women
    - under-20
    - for-man
    - for-woman
    """
    
    # Price range keywords
    PRICE_KEYWORDS = {
        'under': ['under', 'below', 'less-than', 'cheaper-than'],
        'over': ['over', 'above', 'more-than', 'greater-than'],
        'between': ['between', 'range'],
    }
    
    # Gender keywords
    GENDER_KEYWORDS = {
        'man': ['man', 'men', 'male', 'gentleman', 'gentlemen'],
        'woman': ['woman', 'women', 'female', 'lady', 'ladies'],
    }
    
    # Common collection types that should match product types
    TYPE_KEYWORDS = [
        'gift', 'gifts', 'condiment', 'condiments', 'cooking', 'kitchen',
        'drink', 'drinks', 'beverage', 'beverages', 'food', 'snack', 'snacks',
        'art', 'print', 'prints', 'artwork', 'candle', 'candles',
    ]
    
    # Related keywords for broader matching (e.g., "food" should also match "snack", "jerky", etc.)
    KEYWORD_SYNONYMS = {
        'food': ['food', 'snack', 'snacks', 'jerky', 'chips', 'crisps', 'candy', 'sweets', 'treat', 'treats', 'meal', 'meals'],
        'drinks': ['drink', 'drinks', 'beverage', 'beverages', 'juice', 'soda', 'water', 'coffee', 'tea'],
        'drink': ['drink', 'drinks', 'beverage', 'beverages', 'juice', 'soda', 'water', 'coffee', 'tea'],
        'snack': ['snack', 'snacks', 'food', 'jerky', 'chips', 'crisps', 'candy', 'sweets', 'treat', 'treats'],
        'snacks': ['snack', 'snacks', 'food', 'jerky', 'chips', 'crisps', 'candy', 'sweets', 'treat', 'treats'],
    }
    
    def __init__(self, slug: str):
        """
        Initialize interpreter with a collection slug.
        
        Args:
            slug: Collection slug like 'cooking-condiments' or 'gifts-under-100'
        """
        self.slug = slug
        self.parts = slug.lower().split('-')
        self.query_filters = Q()
        self.price_filters = Q()
        self.type_filters = Q()
        self.name_search_filters = Q()
        
    def interpret(self) -> dict:
        """
        Interpret the slug and return filter configuration.
        
        Returns:
            dict with 'query_filters' (Q object), 'order_by' (list), and metadata
        """
        self._parse_price_ranges()
        self._parse_gender()
        self._parse_types()
        self._parse_name_search()
        
        # Combine all filters
        # Use OR logic: if we have type filters OR name search, combine them with OR
        # Then AND with price filters if they exist
        final_filter = Q()
        
        # Combine type and name search with OR (products matching either)
        # This ensures products are found even if they don't have the exact type in the type array
        type_or_name_filter = Q()
        if self.type_filters:
            type_or_name_filter |= self.type_filters
        if self.name_search_filters:
            type_or_name_filter |= self.name_search_filters
        
        # If we have type/name filters, use them
        if type_or_name_filter:
            final_filter = type_or_name_filter
            # AND with price filters if they exist
            if self.price_filters:
                final_filter &= self.price_filters
        elif self.price_filters:
            # If only price filters exist, use them
            final_filter = self.price_filters
        else:
            # If no filters were applied, return empty Q to avoid returning all products
            final_filter = Q(pk__isnull=True)  # This will match nothing
        
        return {
            'query_filters': final_filter,
            'price_filter_applied': bool(self.price_filters),
            'type_filter_applied': bool(self.type_filters),
            'gender_filter_applied': bool(getattr(self, '_gender_applied', False)),
            'search_terms': getattr(self, '_search_terms', []),
            'jsonb_keywords': getattr(self, '_jsonb_keywords', []),
        }
    
    def _parse_price_ranges(self):
        """Parse price-related keywords from slug"""
        slug_lower = self.slug.lower()
        
        # Check for price keywords
        for part in self.parts:
            # Handle dollar amounts like $20, 20, under-20, etc.
            if part.startswith('$') or part.replace('.', '').isdigit():
                # Extract numeric value
                price_str = part.replace('$', '').replace(',', '')
                try:
                    price_value = Decimal(price_str)
                    
                    # Check if previous part indicates "under" or "over"
                    part_index = self.parts.index(part)
                    if part_index > 0:
                        prev_part = self.parts[part_index - 1]
                        if prev_part in self.PRICE_KEYWORDS['under']:
                            self.price_filters &= Q(price__lt=price_value)
                            return
                        elif prev_part in self.PRICE_KEYWORDS['over']:
                            self.price_filters &= Q(price__gt=price_value)
                            return
                    
                    # Default to "under" if no keyword but number present
                    # Common pattern: "under-20" becomes "under-20"
                    if 'under' in slug_lower or 'below' in slug_lower:
                        self.price_filters &= Q(price__lt=price_value)
                    elif 'over' in slug_lower or 'above' in slug_lower:
                        self.price_filters &= Q(price__gt=price_value)
                    else:
                        # If just a number, default to "under"
                        self.price_filters &= Q(price__lt=price_value)
                    
                except (ValueError, TypeError):
                    pass
    
    def _parse_gender(self):
        """Parse gender-related keywords"""
        slug_lower = self.slug.lower()
        
        for keyword_type, keywords in self.GENDER_KEYWORDS.items():
            for keyword in keywords:
                if keyword in slug_lower:
                    self._gender_applied = True
                    # For now, we could search in product name or description
                    # In the future, this could be a product attribute
                    if keyword_type == 'man' or keyword_type == 'men':
                        self.name_search_filters |= Q(name__icontains='men') | Q(name__icontains='man') | Q(name__icontains='male')
                        self.name_search_filters |= Q(description__icontains='men') | Q(description__icontains='man') | Q(description__icontains='male')
                    elif keyword_type == 'woman' or keyword_type == 'women':
                        self.name_search_filters |= Q(name__icontains='women') | Q(name__icontains='woman') | Q(name__icontains='female') | Q(name__icontains='lady') | Q(name__icontains='ladies')
                        self.name_search_filters |= Q(description__icontains='women') | Q(description__icontains='woman') | Q(description__icontains='female') | Q(description__icontains='lady') | Q(description__icontains='ladies')
                    return
    
    def _parse_types(self):
        """Parse product type keywords"""
        slug_lower = self.slug.lower()
        
        # Check if any part matches type keywords
        for part in self.parts:
            if part in self.TYPE_KEYWORDS:
                # Match against product type field (JSONField array)
                # Normalize keyword (e.g., "gifts" -> "Gift Box")
                normalized = self._normalize_type_keyword(part)
                if normalized:
                    # Build variations to match different forms in the database
                    variations = set()
                    
                    # Add base variations
                    variations.add(normalized)  # "Gift Box"
                    variations.add(normalized.lower())  # "gift box"
                    variations.add(normalized.upper())  # "GIFT BOX"
                    variations.add(normalized.title())  # "Gift Box"
                    
                    # Add plural variations based on the normalized form
                    if normalized.endswith('Box'):
                        variations.add(normalized + 'es')  # "Gift Boxes"
                        variations.add(normalized.lower() + 'es')  # "gift boxes"
                        variations.add(normalized.upper() + 'ES')  # "GIFT BOXES"
                    elif normalized.endswith('y'):
                        variations.add(normalized[:-1] + 'ies')  # "Candy" -> "Candies"
                        variations.add(normalized.lower()[:-1] + 'ies')
                    elif not normalized.endswith('s'):  # Don't add 's' if already ends in 's'
                        variations.add(normalized + 's')  # "Gift" -> "Gifts"
                        variations.add(normalized.lower() + 's')
                    
                    # Also add the original part and its variations for broader matching
                    # This helps match products that have "gifts" or "Gifts" directly in their type array
                    variations.add(part)
                    variations.add(part.title())
                    variations.add(part.upper())
                    if not part.endswith('s'):  # Don't add 's' if already ends in 's'
                        variations.add(part + 's')  # "gift" -> "gifts"
                        variations.add(part.title() + 's')  # "Gift" -> "Gifts"
                    
                    # Build OR query for all variations
                    # Note: type__contains for JSONField checks if array contains exact value (case-sensitive)
                    # So we check all case variations explicitly
                    type_query = Q()
                    for variation in variations:
                        # Check exact match for each variation
                        type_query |= Q(type__contains=[variation])
                    
                    self.type_filters |= type_query
                
                # Enhanced fuzzy name/description matching with synonyms
                # Get synonyms for broader matching (e.g., "food" should match "snack", "jerky", etc.)
                search_terms = [part]
                if part in self.KEYWORD_SYNONYMS:
                    search_terms.extend(self.KEYWORD_SYNONYMS[part])
                
                # Search in name, description, and brand name for all related terms
                for term in search_terms:
                    if len(term) > 2:  # Only search terms longer than 2 characters
                        self.name_search_filters |= (
                            Q(name__icontains=term) | 
                            Q(description__icontains=term) |
                            Q(brand__name__icontains=term)
                        )
                
                # Store the keyword for case-insensitive JSONB matching in the view
                if not hasattr(self, '_jsonb_keywords'):
                    self._jsonb_keywords = []
                self._jsonb_keywords.append(part)
    
    def _normalize_type_keyword(self, keyword: str) -> str | None:
        """
        Normalize a keyword to match product type values.
        
        For example: "gifts" -> "Gift Box", "condiment" -> might match a type
        """
        type_mappings = {
            'gift': 'Gift Box',
            'gifts': 'Gift Box',
            'condiment': 'Condiment',
            'condiments': 'Condiment',
            'cooking': 'Cooking',
            'kitchen': 'Kitchen',
            'drink': 'Beverage',
            'drinks': 'Beverage',
            'beverage': 'Beverage',
            'beverages': 'Beverage',
            'food': 'Food',
            'snack': 'Snack',
            'snacks': 'Snack',
            'art': 'Art',
            'print': 'Print',
            'prints': 'Print',
            'artwork': 'Art',
            'candle': 'Candle',
            'candles': 'Candle',
        }
        
        return type_mappings.get(keyword.lower())
    
    def _parse_name_search(self):
        """Parse general search terms that should match product names/descriptions"""
        # Always add search terms for parts that aren't already handled by type/gender filters
        # This ensures we catch products even if they don't have the exact type in the type array
        
        # Add all non-keyword parts as search terms
        excluded_parts = set()
        
        # Exclude price-related parts
        for keyword_list in self.PRICE_KEYWORDS.values():
            excluded_parts.update(keyword_list)
        
        # Exclude gender-related parts (already handled in _parse_gender)
        for keyword_list in self.GENDER_KEYWORDS.values():
            excluded_parts.update(keyword_list)
        
        # Exclude common connectors
        excluded_parts.update(['for', 'the', 'a', 'an', 'and', 'or', 'under', 'over', 'below', 'above'])
        
        # Build search terms from remaining parts that aren't in TYPE_KEYWORDS
        # (TYPE_KEYWORDS are already handled in _parse_types with synonyms)
        search_terms = [
            part for part in self.parts 
            if part not in excluded_parts 
            and part not in self.TYPE_KEYWORDS  # Skip TYPE_KEYWORDS as they're handled in _parse_types
            and not part.replace('.', '').replace('$', '').isdigit()
        ]
        
        if search_terms:
            self._search_terms = search_terms
            # Create fuzzy search on name and description
            for term in search_terms:
                if len(term) > 2:  # Only search terms longer than 2 characters
                    self.name_search_filters |= Q(name__icontains=term) | Q(description__icontains=term)
                    # Also search in brand name
                    self.name_search_filters |= Q(brand__name__icontains=term)


def get_collection_filters(slug: str) -> dict:
    """
    Public function to get collection filters from a slug.
    
    Args:
        slug: Collection slug (e.g., 'cooking-condiments', 'gifts-under-100')
    
    Returns:
        dict with 'query_filters' (Q object) and 'jsonb_keywords' (list) for case-insensitive matching
    """
    interpreter = CollectionInterpreter(slug)
    result = interpreter.interpret()
    query_filters = result['query_filters']
    
    # If no filters were applied, return a filter that matches nothing
    # This prevents returning all products for ambiguous slugs
    if not query_filters:
        query_filters = Q(pk__isnull=True)
    
    return {
        'query_filters': query_filters,
        'jsonb_keywords': result.get('jsonb_keywords', []),
    }
