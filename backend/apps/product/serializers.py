from rest_framework import serializers
from .models import Product, ProductTag, ProductDetailPic


class ProductDetailPicSerializer(serializers.ModelSerializer):
    """Serializer for product detail pictures"""
    class Meta:
        model = ProductDetailPic
        fields = ('id', 'small_pic_link', 'big_pic_link', 'extra_big_pic_link')


class ProductListSerializer(serializers.ModelSerializer):
    """Serializer for product list views - minimal fields"""
    new = serializers.SerializerMethodField()
    hot = serializers.SerializerMethodField()
    brand = serializers.StringRelatedField()

    class Meta:
        model = Product
        fields = ('id', 'name', 'brand', 'price', 'profile_pic_link', 'new', 'hot')

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
    brand = serializers.StringRelatedField()
    brand_id = serializers.IntegerField(source='brand.id', read_only=True)
    detail_pics = ProductDetailPicSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = (
            'id', 'name', 'brand', 'brand_id', 'description', 'price', 'profile_pic_link',
            'detail_pics', 'type', 'category', 'category_name', 'current_stock',
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
        """Get gift_box status by checking if 'Gift Box' is in product type array"""
        if obj.type and isinstance(obj.type, list):
            return 'Gift Box' in obj.type
        return False
