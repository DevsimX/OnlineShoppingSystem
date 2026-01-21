from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from .models import Order
from .serializers import OrderSerializer


class OrderPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_list(request):
    """Get orders for authenticated user with pagination"""
    orders = Order.objects.filter(owner=request.user).order_by('-created_at')
    
    paginator = OrderPagination()
    page = paginator.paginate_queryset(orders, request)
    
    if page is not None:
        serializer = OrderSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)
    
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_detail(request, order_id):
    """Get single order detail"""
    try:
        order = Order.objects.get(id=order_id, owner=request.user)
        serializer = OrderSerializer(order)
        return Response(serializer.data)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
