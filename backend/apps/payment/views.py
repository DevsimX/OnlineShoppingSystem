from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from decimal import Decimal
from django.conf import settings
import stripe
from apps.cart.views import get_or_create_cart, calculate_cart_total


@api_view(['GET'])
@permission_classes([AllowAny])
def payment_list(request):
    """Placeholder for payment list endpoint"""
    return Response({'message': 'Endpoint not implemented yet'}, status=status.HTTP_501_NOT_IMPLEMENTED)


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
    
    # Calculate shipping (free if subtotal >= 100, otherwise $15)
    FREE_SHIPPING_THRESHOLD = Decimal('100.00')
    SHIPPING_COST = Decimal('15.00')
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
        
        # Add shipping options based on subtotal
        # Free shipping if subtotal >= $100, otherwise $15 shipping
        if subtotal >= FREE_SHIPPING_THRESHOLD:
            # Free shipping option
            session_params['shipping_options'] = [
                {
                    'shipping_rate_data': {
                        'type': 'fixed_amount',
                        'fixed_amount': {
                            'amount': 0,
                            'currency': 'aud',
                        },
                        'display_name': 'Free shipping',
                        'delivery_estimate': {
                            'minimum': {
                                'unit': 'business_day',
                                'value': 5,
                            },
                            'maximum': {
                                'unit': 'business_day',
                                'value': 7,
                            },
                        },
                    },
                },
            ]
        else:
            # Standard shipping option ($15)
            session_params['shipping_options'] = [
                {
                    'shipping_rate_data': {
                        'type': 'fixed_amount',
                        'fixed_amount': {
                            'amount': int(SHIPPING_COST * 100),  # Convert to cents
                            'currency': 'aud',
                        },
                        'display_name': 'Standard shipping',
                        'delivery_estimate': {
                            'minimum': {
                                'unit': 'business_day',
                                'value': 5,
                            },
                            'maximum': {
                                'unit': 'business_day',
                                'value': 7,
                            },
                        },
                    },
                },
            ]
        
        checkout_session = stripe.checkout.Session.create(**session_params)
        
        return Response({
            'session_id': checkout_session.id,
            'url': checkout_session.url,
        })
    except stripe.error.StripeError as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
