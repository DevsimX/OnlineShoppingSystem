from django.db import models
from apps.category.models import Category
from apps.brand.models import Brand


class ProductDetailPic(models.Model):
    """Product detail picture model"""
    small_pic_link = models.URLField(max_length=500, help_text="Small thumbnail image URL (e.g., 100x100)")
    big_pic_link = models.URLField(max_length=500, help_text="Large image URL (e.g., 700x780)")
    extra_big_pic_link = models.URLField(max_length=500, help_text="Extra large image URL for modal/zoom view")

    class Meta:
        db_table = 'product_detail_pics'
        ordering = ['id']

    def __str__(self):
        return f"Detail Pic {self.id}"


class Product(models.Model):
    """Product model"""
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('unavailable', 'Unavailable'),
    ]

    name = models.CharField(max_length=200)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name='products', help_text="Brand or producer/artist that makes the product")
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Price in .xx format")
    profile_pic_link = models.URLField(max_length=500)
    detail_pics = models.ManyToManyField(ProductDetailPic, blank=True, related_name='products', help_text="Array of product detail picture IDs")
    type = models.JSONField(default=list, help_text="Array of product types (e.g., ['Gift Box', 'Limited Edition'])")
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    current_stock = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'products'
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class ProductTag(models.Model):
    """Product tag model for tracking new, hot status and impact factors"""
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name='tag')
    new = models.BooleanField(default=False)
    new_if = models.FloatField(default=0.0)
    hot = models.BooleanField(default=False)
    hot_if = models.FloatField(default=0.0)
    rank_if = models.FloatField(default=0.0)

    class Meta:
        db_table = 'product_tags'

    def __str__(self):
        return f"Tag for {self.product.name}"
