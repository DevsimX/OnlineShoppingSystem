from rest_framework import serializers
from .models import Product, ProductTag


class ProductListSerializer(serializers.ModelSerializer):
    """Serializer for product list views - minimal fields"""
    new = serializers.SerializerMethodField()
    hot = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ('id', 'name', 'company', 'price', 'profile_pic_link', 'new', 'hot')

    def get_new(self, obj):
        """Get new status from ProductTag"""
        try:
            return obj.tag.new
        except ProductTag.DoesNotExist:
            return False

    def get_hot(self, obj):
        """Get hot status from ProductTag"""
        try:
            return obj.tag.hot
        except ProductTag.DoesNotExist:
            return False


class ProductDetailSerializer(serializers.ModelSerializer):
    """Serializer for single product detail view - all fields"""
    new = serializers.SerializerMethodField()
    hot = serializers.SerializerMethodField()
    gift_box = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = (
            'id', 'name', 'company', 'description', 'price', 'profile_pic_link',
            'detail_pic_links', 'category', 'category_name', 'current_stock',
            'status', 'new', 'hot', 'gift_box', 'created_at', 'updated_at'
        )

    def get_new(self, obj):
        """Get new status from ProductTag"""
        try:
            return obj.tag.new
        except ProductTag.DoesNotExist:
            return False

    def get_hot(self, obj):
        """Get hot status from ProductTag"""
        try:
            return obj.tag.hot
        except ProductTag.DoesNotExist:
            return False

    def get_gift_box(self, obj):
        """Get gift_box status from ProductTag"""
        try:
            return obj.tag.gift_box
        except ProductTag.DoesNotExist:
            return False
