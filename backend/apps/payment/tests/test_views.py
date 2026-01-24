from django.test import TestCase, override_settings
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

    @override_settings(STRIPE_SECRET_KEY='sk_test_dummy')
    @patch('apps.payment.views.stripe.checkout.Session.create')
    def test_create_checkout_session_authenticated(self, mock_stripe_create):
        """Test creating checkout session when authenticated"""
        mock_session = MagicMock()
        mock_session.id = 'test_session_id'
        mock_session.url = 'https://checkout.stripe.com/test'
        mock_stripe_create.return_value = mock_session

        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/payments/checkout/', {
            'gift_wrap': False,
            'note': 'Test note',
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['session_id'], 'test_session_id')
        self.assertEqual(response.data['url'], 'https://checkout.stripe.com/test')

        call_kwargs = mock_stripe_create.call_args[1]
        self.assertIn('success_url', call_kwargs)
        self.assertIn('cancel_url', call_kwargs)
        self.assertIn('CHECKOUT_SESSION_ID', call_kwargs['success_url'])
        self.assertIn('/checkout/success', call_kwargs['success_url'])
        self.assertIn('session_id=', call_kwargs['success_url'])
        self.assertIn('/checkout/cancel', call_kwargs['cancel_url'])

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

    @override_settings(STRIPE_SECRET_KEY='sk_test_dummy')
    @patch('apps.payment.views.stripe.checkout.Session.create')
    def test_create_checkout_session_uses_frontend_base_url(self, mock_stripe_create):
        """Test checkout session uses frontend success/cancel URLs when frontend_base_url passed"""
        mock_session = MagicMock()
        mock_session.id = 'cs_123'
        mock_session.url = 'https://checkout.stripe.com/test'
        mock_stripe_create.return_value = mock_session

        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/payments/checkout/', {
            'gift_wrap': False,
            'note': '',
            'frontend_base_url': 'https://my-app.vercel.app',
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        call_kwargs = mock_stripe_create.call_args[1]
        self.assertEqual(
            call_kwargs['success_url'],
            'https://my-app.vercel.app/checkout/success?session_id={CHECKOUT_SESSION_ID}',
        )
        self.assertEqual(
            call_kwargs['cancel_url'],
            'https://my-app.vercel.app/checkout/cancel',
        )

    @override_settings(STRIPE_SECRET_KEY='sk_test_dummy', FRONTEND_BASE_URL='https://app.example.com')
    @patch('apps.payment.views.stripe.checkout.Session.create')
    def test_create_checkout_session_uses_frontend_base_url_from_settings(self, mock_stripe_create):
        """Test checkout uses FRONTEND_BASE_URL from settings when not in request"""
        mock_session = MagicMock()
        mock_session.id = 'cs_456'
        mock_session.url = 'https://checkout.stripe.com/test'
        mock_stripe_create.return_value = mock_session

        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/payments/checkout/', {
            'gift_wrap': False,
            'note': '',
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        call_kwargs = mock_stripe_create.call_args[1]
        self.assertEqual(
            call_kwargs['success_url'],
            'https://app.example.com/checkout/success?session_id={CHECKOUT_SESSION_ID}',
        )
        self.assertEqual(call_kwargs['cancel_url'], 'https://app.example.com/checkout/cancel')

    @override_settings(STRIPE_SECRET_KEY='sk_test_dummy')
    @patch('apps.payment.views.stripe.checkout.Session.create')
    def test_create_checkout_session_frontend_base_url_strips_trailing_slash(self, mock_stripe_create):
        """Test frontend_base_url trailing slash is stripped"""
        mock_session = MagicMock()
        mock_session.id = 'cs_789'
        mock_session.url = 'https://checkout.stripe.com/test'
        mock_stripe_create.return_value = mock_session

        self.client.force_authenticate(user=self.user)
        self.client.post('/api/payments/checkout/', {
            'gift_wrap': False,
            'note': '',
            'frontend_base_url': 'https://localhost:3000/',
        }, format='json')

        call_kwargs = mock_stripe_create.call_args[1]
        self.assertEqual(
            call_kwargs['success_url'],
            'https://localhost:3000/checkout/success?session_id={CHECKOUT_SESSION_ID}',
        )
        self.assertFalse(call_kwargs['success_url'].startswith('https://localhost:3000//'))

    @override_settings(
        STRIPE_WEBHOOK_SECRET='whsec_test',
        STRIPE_SECRET_KEY='sk_test_dummy',
    )
    @patch('apps.payment.views.stripe.Webhook.construct_event')
    def test_stripe_webhook_invalid_signature(self, mock_construct):
        """Test Stripe webhook with invalid signature"""
        import stripe
        mock_construct.side_effect = stripe.SignatureVerificationError(
            'Invalid signature', 'sig_header'
        )

        response = self.client.post(
            '/api/payments/webhook/',
            {},
            format='json',
            HTTP_STRIPE_SIGNATURE='test_sig',
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
