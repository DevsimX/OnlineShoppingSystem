from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from decimal import Decimal
from django.db import transaction
from django.conf import settings
from apps.product.models import Product
import stripe


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


def update_cart_amount(cart):
    """Calculate and update cart amount based on product prices"""
    _, total, _ = calculate_cart_total(cart)
    cart.amount = total
    cart.save(update_fields=['amount'])


def get_or_create_cart(user):
    """Get or create shopping cart for user"""
    from apps.cart.models import ShoppingCart
    cart, created = ShoppingCart.objects.get_or_create(
        owner=user,
        defaults={'amount': Decimal('0.00')}
    )
    # Recalculate and update amount based on current products
    update_cart_amount(cart)
    return cart


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
        # Recalculate and update cart amount
        update_cart_amount(cart)
    
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
        # Recalculate and update cart amount
        update_cart_amount(cart)
    
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
            # Recalculate and update cart amount
            update_cart_amount(cart)
    
    items, total, total_items = calculate_cart_total(cart)
    
    return Response({
        'items': items,
        'subtotal': str(total),
        'total_items': total_items,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_checkout_session(request):
    """Create Stripe checkout session"""
    gift_wrap = request.data.get('gift_wrap', False)
    note = request.data.get('note', '')
    
    # Get user's cart
    cart = get_or_create_cart(request.user)
    items, subtotal, total_items = calculate_cart_total(cart)
    
    if total_items == 0:
        return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Get user's default postal address
    from apps.authentication.models import UserPostalAddress
    try:
        address = UserPostalAddress.objects.filter(user=request.user, is_default=True).first()
        if not address:
            address = UserPostalAddress.objects.filter(user=request.user).first()
    except UserPostalAddress.DoesNotExist:
        address = None
    
    # Calculate shipping (free if subtotal >= 100, otherwise $10)
    FREE_SHIPPING_THRESHOLD = Decimal('100.00')
    SHIPPING_COST = Decimal('10.00')
    shipping = Decimal('0.00') if subtotal >= FREE_SHIPPING_THRESHOLD else SHIPPING_COST
    
    # Add gift wrap cost if selected
    GIFT_WRAP_COST = Decimal('5.00')
    gift_wrap_amount = GIFT_WRAP_COST if gift_wrap else Decimal('0.00')
    
    total_amount = subtotal + shipping + gift_wrap_amount
    
    # Initialize Stripe
    stripe.api_key = getattr(settings, 'STRIPE_SECRET_KEY', None)
    if not stripe.api_key:
        return Response({'error': 'Stripe not configured'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # Build line items for Stripe
    line_items = []
    for item in items:
        line_items.append({
            'price_data': {
                'currency': 'aud',
                'product_data': {
                    'name': item['product_name'],
                    'description': f"{item['brand_name']} - Quantity: {item['quantity']}",
                    'images': [item['product_image']] if item['product_image'] else [],
                },
                'unit_amount': int(Decimal(item['product_price']) * 100),  # Convert to cents
            },
            'quantity': item['quantity'],
        })
    
    # Note: Shipping is handled via shipping_options, not as a line item
    
    # Add gift wrap as line item if selected
    if gift_wrap:
        line_items.append({
            'price_data': {
                'currency': 'aud',
                'product_data': {
                    'name': 'Gift Wrapping',
                },
                'unit_amount': int(gift_wrap_amount * 100),  # Convert to cents
            },
            'quantity': 1,
        })
    
    # Build customer email and shipping address collection
    customer_email = request.user.email
    
    # Create Stripe checkout session
    try:
        session_params = {
            'payment_method_types': ['card'],
            'line_items': line_items,
            'mode': 'payment',
            'customer_email': customer_email,
            'shipping_address_collection': {
                'allowed_countries': ['AU'],
            },
            'success_url': request.build_absolute_uri('/checkout/success?session_id={CHECKOUT_SESSION_ID}'),
            'cancel_url': request.build_absolute_uri('/checkout/cancel'),
            'metadata': {
                'user_id': str(request.user.id),
                'cart_id': str(cart.id),
                'gift_wrap': str(gift_wrap),
                'note': note[:500],  # Limit note length
            },
        }
        
        # Add shipping options if shipping is applicable (shipping > 0)
        if shipping > 0:
            session_params['shipping_options'] = [
                {
                    'shipping_amount': int(shipping * 100),  # Convert to cents (non-negative integer)
                    # shipping_rate is optional - we're using shipping_amount directly
                }
            ]
        
        checkout_session = stripe.checkout.Session.create(**session_params)
        
        return Response({
            'session_id': checkout_session.id,
            'url': checkout_session.url,
        })
    except stripe.error.StripeError as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
