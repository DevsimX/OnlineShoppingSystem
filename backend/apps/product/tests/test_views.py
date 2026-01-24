from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from apps.brand.models import Brand
from apps.product.models import Product


class ProductTests(TestCase):
    def setUp(self):
        self.client = APIClient()
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

    def test_product_list(self):
        """Test getting product list"""
        response = self.client.get('/api/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)

    def test_product_list_with_pagination(self):
        """Test product list pagination"""
        response = self.client.get('/api/products/?page=1')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('count', response.data)

    def test_product_list_filter_by_availability(self):
        """Test filtering products by availability"""
        Product.objects.create(
            name='Unavailable Product',
            brand=self.brand,
            description='Test',
            price=19.99,
            profile_pic_link='https://example.com/image2.jpg',
            current_stock=0,
            status='unavailable'
        )
        response = self.client.get('/api/products/?available=true')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # All returned products should be available
        for product in response.data['results']:
            self.assertGreater(product['current_stock'], 0)

    def test_product_list_filter_by_price(self):
        """Test filtering products by price range"""
        response = self.client.get('/api/products/?minPrice=20&maxPrice=50')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for product in response.data['results']:
            self.assertGreaterEqual(float(product['price']), 20)
            self.assertLessEqual(float(product['price']), 50)

    def test_product_detail(self):
        """Test getting product detail"""
        response = self.client.get(f'/api/products/{self.product.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Product')

    def test_product_detail_not_found(self):
        """Test getting non-existent product"""
        response = self.client.get('/api/products/99999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_hot_products(self):
        """Test getting hot products"""
        response = self.client.get('/api/products/hot/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)

    def test_new_products(self):
        """Test getting new products"""
        response = self.client.get('/api/products/new/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)

    def test_search_products(self):
        """Test product search"""
        response = self.client.get('/api/products/search/?q=test')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
