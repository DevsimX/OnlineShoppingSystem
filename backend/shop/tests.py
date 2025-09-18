from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from .models import Category, Product


class CatalogTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.cat = Category.objects.create(name="Snacks & Sauces", slug="snacks-sauces")
        self.prod = Product.objects.create(
            category=self.cat,
            name="Sample Sauce",
            slug="sample-sauce",
            price_cents=1299,
        )

    def test_list_categories(self):
        resp = self.client.get("/api/categories/")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data["count"], 1)

    def test_list_products(self):
        resp = self.client.get("/api/products/")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data["count"], 1)

# Create your tests here.
