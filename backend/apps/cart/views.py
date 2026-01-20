from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from decimal import Decimal
from django.db import transaction
from apps.product.models import Product


def get_or_create_cart(user):
    """Get or create shopping cart for user"""
    from apps.cart.models import ShoppingCart
    cart, created = ShoppingCart.objects.get_or_create(owner=user)
    return cart


def calculate_cart_total(cart):
    """Calculate total amount and item count from cart products"""
    from apps.product.models import Product
    
    total = Decimal('0.00')
    total_items = 0
    items = []
    
    if isinstance(cart.products, dict):
        for product_id_str, quantity in cart.products.items():
            try:
                product_id = int(product_id_str)
                quantity = int(quantity)
                
                if quantity <= 0:
                    continue
                    
                try:
                    product = Product.objects.select_related('brand').get(id=product_id)
                    item_total = product.price * quantity
                    total += item_total
                    total_items += quantity
                    
                    items.append({
                        'id': len(items) + 1,  # Simple sequential ID
                        'product_id': product.id,
                        'product_name': product.name,
                        'product_image': product.profile_pic_link,
                        'product_price': str(product.price),
                        'brand_name': product.brand.name if product.brand else '',
                        'quantity': quantity,
                        'subtotal': str(item_total),
                    })
                except Product.DoesNotExist:
                    continue
            except (ValueError, TypeError):
                continue
    
    return items, total, total_items


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def cart_list(request):
    """Get shopping cart for authenticated user"""
    cart = get_or_create_cart(request.user)
    items, total, total_items = calculate_cart_total(cart)
    
    return Response({
        'items': items,
        'subtotal': str(total),
        'total_items': total_items,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    """Add item to cart"""
    product_id = request.data.get('product_id')
    quantity = request.data.get('quantity', 1)
    
    if not product_id:
        return Response({'error': 'product_id is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        product_id = int(product_id)
        quantity = int(quantity)
    except (ValueError, TypeError):
        return Response({'error': 'Invalid product_id or quantity'}, status=status.HTTP_400_BAD_REQUEST)
    
    if quantity <= 0:
        return Response({'error': 'Quantity must be greater than 0'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        product = Product.objects.get(id=product_id)
        if quantity > product.current_stock:
            return Response({'error': 'Not enough stock'}, status=status.HTTP_400_BAD_REQUEST)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    
    with transaction.atomic():
        cart = get_or_create_cart(request.user)
        if not isinstance(cart.products, dict):
            cart.products = {}
        
        current_quantity = cart.products.get(str(product_id), 0)
        new_quantity = current_quantity + quantity
        
        if new_quantity > product.current_stock:
            return Response({'error': 'Not enough stock'}, status=status.HTTP_400_BAD_REQUEST)
        
        cart.products[str(product_id)] = new_quantity
        cart.save()
    
    items, total, total_items = calculate_cart_total(cart)
    
    return Response({
        'items': items,
        'subtotal': str(total),
        'total_items': total_items,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_cart_item(request):
    """Update cart item quantity"""
    product_id = request.data.get('product_id')
    quantity = request.data.get('quantity')
    
    if product_id is None:
        return Response({'error': 'product_id is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    if quantity is None:
        return Response({'error': 'quantity is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        product_id = int(product_id)
        quantity = int(quantity)
    except (ValueError, TypeError):
        return Response({'error': 'Invalid product_id or quantity'}, status=status.HTTP_400_BAD_REQUEST)
    
    if quantity < 0:
        return Response({'error': 'Quantity cannot be negative'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        product = Product.objects.get(id=product_id)
        if quantity > product.current_stock:
            return Response({'error': 'Not enough stock'}, status=status.HTTP_400_BAD_REQUEST)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    
    with transaction.atomic():
        cart = get_or_create_cart(request.user)
        if not isinstance(cart.products, dict):
            cart.products = {}
        
        if quantity == 0:
            cart.products.pop(str(product_id), None)
        else:
            cart.products[str(product_id)] = quantity
        
        cart.save()
    
    items, total, total_items = calculate_cart_total(cart)
    
    return Response({
        'items': items,
        'subtotal': str(total),
        'total_items': total_items,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_cart_item(request):
    """Remove item from cart"""
    product_id = request.data.get('product_id')
    
    if not product_id:
        return Response({'error': 'product_id is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        product_id = int(product_id)
    except (ValueError, TypeError):
        return Response({'error': 'Invalid product_id'}, status=status.HTTP_400_BAD_REQUEST)
    
    with transaction.atomic():
        cart = get_or_create_cart(request.user)
        if isinstance(cart.products, dict):
            cart.products.pop(str(product_id), None)
            cart.save()
    
    items, total, total_items = calculate_cart_total(cart)
    
    return Response({
        'items': items,
        'subtotal': str(total),
        'total_items': total_items,
    })
