from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from apps.order.models import Order

User = get_user_model()


class OrderTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='TestPass123!',
            phone='0412345678'
        )
        self.order = Order.objects.create(
            owner=self.user,
            amount=99.99,
            products={'1': 2, '2': 1},
            status='completed'
        )

    def test_get_orders_authenticated(self):
        """Test getting orders when authenticated"""
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/orders/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
        self.assertEqual(len(response.data['results']), 1)

    def test_get_orders_unauthenticated(self):
        """Test getting orders when not authenticated"""
        response = self.client.get('/api/orders/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_order_detail(self):
        """Test getting single order detail"""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f'/api/orders/{self.order.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(float(response.data['amount']), 99.99)

    def test_get_order_detail_not_found(self):
        """Test getting non-existent order"""
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/orders/99999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_orders_pagination(self):
        """Test orders list pagination"""
        # Create multiple orders
        for i in range(15):
            Order.objects.create(
                owner=self.user,
                amount=50.00,
                products={'1': 1},
                status='completed'
            )
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/orders/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('count', response.data)

    def test_orders_only_show_user_orders(self):
        """Test that users only see their own orders"""
        other_user = User.objects.create_user(
            username='otheruser',
            email='other@example.com',
            password='TestPass123!',
            phone='0423456789'
        )
        Order.objects.create(
            owner=other_user,
            amount=200.00,
            products={'1': 1},
            status='completed'
        )
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/orders/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should only see own order
        self.assertEqual(len(response.data['results']), 1)
