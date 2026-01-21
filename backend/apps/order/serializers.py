from rest_framework import serializers
from .models import Order


class OrderSerializer(serializers.ModelSerializer):
    """Serializer for Order model"""
    date = serializers.SerializerMethodField()
    total = serializers.SerializerMethodField()
    shipping = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = ('id', 'date', 'total', 'status', 'shipping', 'created_at', 'updated_at')
    
    def get_date(self, obj):
        """Format created_at as date string"""
        return obj.created_at.strftime('%Y-%m-%d')
    
    def get_total(self, obj):
        """Format amount as string with 2 decimal places"""
        return str(obj.amount)
    
    def get_shipping(self, obj):
        """Calculate shipping status based on order status"""
        if obj.status == 'completed':
            return 'Delivered'
        elif obj.status == 'processing':
            return 'In Transit'
        elif obj.status == 'pending':
            return 'Pending'
        elif obj.status == 'cancelled':
            return 'Cancelled'
        return 'Pending'
