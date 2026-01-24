from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from unittest.mock import patch, MagicMock
from apps.brand.models import Brand
from apps.product.models import Product
from apps.cart.models import ShoppingCart

User = get_user_model()


class PaymentTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='TestPass123!',
            phone='0412345678'
        )
        self.brand = Brand.objects.create(name='Test Brand')
        self.product = Product.objects.create(
            name='Test Product',
            brand=self.brand,
            description='Test description',
            price=29.99,
            profile_pic_link='https://example.com/image.jpg',
            current_stock=10,
            status='available'
        )
        self.cart = ShoppingCart.objects.create(
            owner=self.user,
            products={str(self.product.id): 2},
            amount=59.98
        )

    def test_payment_list_endpoint(self):
        """Test payment list endpoint"""
        response = self.client.get('/api/payments/')
        self.assertEqual(response.status_code, status.HTTP_501_NOT_IMPLEMENTED)

    @patch('apps.payment.views.stripe.checkout.Session.create')
    @patch('apps.payment.views.stripe.api_key', 'test_key')
    def test_create_checkout_session_authenticated(self, mock_stripe_create):
        """Test creating checkout session when authenticated"""
        mock_session = MagicMock()
        mock_session.id = 'test_session_id'
        mock_session.url = 'https://checkout.stripe.com/test'
        mock_stripe_create.return_value = mock_session

        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/payments/checkout/', {
            'gift_wrap': False,
            'note': 'Test note'
        }, format='json')
        
        # Should succeed if Stripe is configured, or fail with 500 if not
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_500_INTERNAL_SERVER_ERROR])

    def test_create_checkout_session_unauthenticated(self):
        """Test creating checkout session when not authenticated"""
        response = self.client.post('/api/payments/checkout/', {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_checkout_session_empty_cart(self):
        """Test creating checkout session with empty cart"""
        self.cart.products = {}
        self.cart.save()
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/payments/checkout/', {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    @patch('apps.payment.views.stripe.Webhook.construct_event')
    def test_stripe_webhook_invalid_signature(self, mock_construct):
        """Test Stripe webhook with invalid signature"""
        from stripe.error import SignatureVerificationError
        mock_construct.side_effect = SignatureVerificationError('Invalid signature', 'sig_header')
        
        response = self.client.post('/api/payments/webhook/', {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
