# Endpoints will be implemented later
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status


@api_view(['GET'])
@permission_classes([AllowAny])
def payment_list(request):
    """Placeholder for payment list endpoint"""
    return Response({'message': 'Endpoint not implemented yet'}, status=status.HTTP_501_NOT_IMPLEMENTED)
