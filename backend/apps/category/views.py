from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Category
from .serializers import CategorySerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def category_list(request):
    """Get all categories"""
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def great_gift_categories(request):
    """Get all categories where great_gift is True"""
    categories = Category.objects.filter(great_gift=True)
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
