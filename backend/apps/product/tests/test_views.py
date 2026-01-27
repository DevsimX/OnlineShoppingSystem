from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from apps.brand.models import Brand
from apps.product.models import Product, ProductTag


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
        self.assertIn('products', response.data)
        self.assertIn('total', response.data)

    def test_collection_whats_hot(self):
        """Test whats-hot collection returns products with hot=True ordered by hot_if"""
        # Create products with different hot_if values
        hot_product_1 = Product.objects.create(
            name='Hot Product 1',
            brand=self.brand,
            description='Very hot product',
            price=39.99,
            profile_pic_link='https://example.com/hot1.jpg',
            current_stock=5,
            status='available'
        )
        ProductTag.objects.create(product=hot_product_1, hot=True, hot_if=0.9, new=False, new_if=0.0)

        hot_product_2 = Product.objects.create(
            name='Hot Product 2',
            brand=self.brand,
            description='Another hot product',
            price=49.99,
            profile_pic_link='https://example.com/hot2.jpg',
            current_stock=3,
            status='available'
        )
        ProductTag.objects.create(product=hot_product_2, hot=True, hot_if=0.7, new=False, new_if=0.0)

        # Create a product that is not hot
        not_hot_product = Product.objects.create(
            name='Not Hot Product',
            brand=self.brand,
            description='Regular product',
            price=19.99,
            profile_pic_link='https://example.com/not_hot.jpg',
            current_stock=10,
            status='available'
        )
        ProductTag.objects.create(product=not_hot_product, hot=False, hot_if=0.0, new=False, new_if=0.0)

        response = self.client.get('/api/products/collections/whats-hot/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
        self.assertIn('count', response.data)
        
        # Should return at least 2 hot products
        self.assertGreaterEqual(response.data['count'], 2)
        
        # All returned products should be hot
        for product in response.data['results']:
            self.assertTrue(product['hot'])
        
        # Verify ordering: hot_product_1 (hot_if=0.9) should come before hot_product_2 (hot_if=0.7)
        product_ids = [p['id'] for p in response.data['results']]
        if hot_product_1.id in product_ids and hot_product_2.id in product_ids:
            self.assertLess(
                product_ids.index(hot_product_1.id),
                product_ids.index(hot_product_2.id),
                "Products should be ordered by hot_if DESC (highest first)"
            )

    def test_collection_new_stuff(self):
        """Test new-stuff collection returns products with new=True ordered by new_if"""
        # Create products with different new_if values
        new_product_1 = Product.objects.create(
            name='New Product 1',
            brand=self.brand,
            description='Very new product',
            price=29.99,
            profile_pic_link='https://example.com/new1.jpg',
            current_stock=8,
            status='available'
        )
        ProductTag.objects.create(product=new_product_1, new=True, new_if=0.95, hot=False, hot_if=0.0)

        new_product_2 = Product.objects.create(
            name='New Product 2',
            brand=self.brand,
            description='Another new product',
            price=34.99,
            profile_pic_link='https://example.com/new2.jpg',
            current_stock=6,
            status='available'
        )
        ProductTag.objects.create(product=new_product_2, new=True, new_if=0.8, hot=False, hot_if=0.0)

        # Create a product that is not new
        not_new_product = Product.objects.create(
            name='Not New Product',
            brand=self.brand,
            description='Old product',
            price=15.99,
            profile_pic_link='https://example.com/not_new.jpg',
            current_stock=12,
            status='available'
        )
        ProductTag.objects.create(product=not_new_product, new=False, new_if=0.0, hot=False, hot_if=0.0)

        response = self.client.get('/api/products/collections/new-stuff/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
        self.assertIn('count', response.data)
        
        # Should return at least 2 new products
        self.assertGreaterEqual(response.data['count'], 2)
        
        # All returned products should be new
        for product in response.data['results']:
            self.assertTrue(product['new'])
        
        # Verify ordering: new_product_1 (new_if=0.95) should come before new_product_2 (new_if=0.8)
        product_ids = [p['id'] for p in response.data['results']]
        if new_product_1.id in product_ids and new_product_2.id in product_ids:
            self.assertLess(
                product_ids.index(new_product_1.id),
                product_ids.index(new_product_2.id),
                "Products should be ordered by new_if DESC (highest first)"
            )

    def test_collection_whats_hot_with_filters(self):
        """Test whats-hot collection supports filters"""
        hot_product = Product.objects.create(
            name='Hot Expensive Product',
            brand=self.brand,
            description='Hot but expensive',
            price=100.00,
            profile_pic_link='https://example.com/hot_expensive.jpg',
            current_stock=2,
            status='available'
        )
        ProductTag.objects.create(product=hot_product, hot=True, hot_if=0.85, new=False, new_if=0.0)

        hot_cheap_product = Product.objects.create(
            name='Hot Cheap Product',
            brand=self.brand,
            description='Hot and affordable',
            price=15.00,
            profile_pic_link='https://example.com/hot_cheap.jpg',
            current_stock=7,
            status='available'
        )
        ProductTag.objects.create(product=hot_cheap_product, hot=True, hot_if=0.75, new=False, new_if=0.0)

        # Filter by max price
        response = self.client.get('/api/products/collections/whats-hot/?maxPrice=50')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # All returned products should be hot and within price range
        for product in response.data['results']:
            self.assertTrue(product['hot'])
            self.assertLessEqual(float(product['price']), 50)

    def test_collection_new_stuff_with_filters(self):
        """Test new-stuff collection supports filters"""
        new_available_product = Product.objects.create(
            name='New Available Product',
            brand=self.brand,
            description='New and in stock',
            price=25.99,
            profile_pic_link='https://example.com/new_available.jpg',
            current_stock=10,
            status='available'
        )
        ProductTag.objects.create(product=new_available_product, new=True, new_if=0.9, hot=False, hot_if=0.0)

        new_out_of_stock = Product.objects.create(
            name='New Out of Stock',
            brand=self.brand,
            description='New but sold out',
            price=19.99,
            profile_pic_link='https://example.com/new_oos.jpg',
            current_stock=0,
            status='available'
        )
        ProductTag.objects.create(product=new_out_of_stock, new=True, new_if=0.6, hot=False, hot_if=0.0)

        # Filter by availability
        response = self.client.get('/api/products/collections/new-stuff/?available=true')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # All returned products should be new and available
        for product in response.data['results']:
            self.assertTrue(product['new'])
            self.assertGreater(product['current_stock'], 0)

    def test_collection_regular_slug(self):
        """Test that regular collection slugs still work with fuzzy search"""
        # Create a product that matches a regular collection slug
        cooking_product = Product.objects.create(
            name='Cooking Condiments',
            brand=self.brand,
            description='Great for cooking',
            price=12.99,
            profile_pic_link='https://example.com/cooking.jpg',
            current_stock=15,
            status='available'
        )

        response = self.client.get('/api/products/collections/cooking-condiments/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
        self.assertIn('count', response.data)
