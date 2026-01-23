from django.db import models
from decimal import Decimal
from apps.authentication.models import User


class ShoppingCart(models.Model):
    """Shopping cart model"""
    owner = models.OneToOneField(User, on_delete=models.CASCADE, related_name='shopping_cart')
    products = models.JSONField(default=dict, help_text="Format: {product_id: quantity}")
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'), help_text="Total price to pay")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'shopping_carts'
        ordering = ['-updated_at']

    def __str__(self):
        return f"Cart for {self.owner.username}"
