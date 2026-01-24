from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from apps.brand.models import Brand
from apps.product.models import Product
from apps.cart.models import ShoppingCart

User = get_user_model()


class CartTests(TestCase):
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

    def test_get_cart_authenticated(self):
        """Test getting cart when authenticated"""
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/cart/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('items', response.data)

    def test_get_cart_unauthenticated(self):
        """Test getting cart when not authenticated"""
        response = self.client.get('/api/cart/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_add_to_cart(self):
        """Test adding product to cart"""
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/cart/add/', {
            'product_id': self.product.id,
            'quantity': 2
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        cart = ShoppingCart.objects.get(owner=self.user)
        self.assertEqual(cart.products[str(self.product.id)], 2)

    def test_add_to_cart_invalid_product(self):
        """Test adding non-existent product to cart"""
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/cart/add/', {
            'product_id': 99999,
            'quantity': 1
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_cart_item(self):
        """Test updating cart item quantity"""
        self.client.force_authenticate(user=self.user)
        # First add item
        self.client.post('/api/cart/add/', {
            'product_id': self.product.id,
            'quantity': 2
        }, format='json')
        # Then update
        response = self.client.post('/api/cart/update/', {
            'product_id': self.product.id,
            'quantity': 5
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        cart = ShoppingCart.objects.get(owner=self.user)
        self.assertEqual(cart.products[str(self.product.id)], 5)

    def test_remove_from_cart(self):
        """Test removing product from cart"""
        self.client.force_authenticate(user=self.user)
        # First add item
        self.client.post('/api/cart/add/', {
            'product_id': self.product.id,
            'quantity': 2
        }, format='json')
        # Then remove
        response = self.client.post('/api/cart/remove/', {
            'product_id': self.product.id
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        cart = ShoppingCart.objects.get(owner=self.user)
        self.assertNotIn(str(self.product.id), cart.products)

    def test_cart_calculates_total(self):
        """Test cart calculates total correctly"""
        self.client.force_authenticate(user=self.user)
        self.client.post('/api/cart/add/', {
            'product_id': self.product.id,
            'quantity': 3
        }, format='json')
        response = self.client.get('/api/cart/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Cart returns subtotal (29.99 * 3 = 89.97)
        subtotal = float(response.data.get('subtotal', 0))
        self.assertGreater(subtotal, 0)
        self.assertAlmostEqual(subtotal, 89.97, places=2)
