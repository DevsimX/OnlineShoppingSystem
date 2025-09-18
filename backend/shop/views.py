from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Category, Product, Cart, CartItem, Order
from .serializers import (
    CategorySerializer,
    ProductSerializer,
    CartSerializer,
    CartItemSerializer,
    OrderSerializer,
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = "slug"


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(is_active=True).select_related("category")
    serializer_class = ProductSerializer
    lookup_field = "slug"

    def get_queryset(self):
        qs = super().get_queryset()
        category_slug = self.request.query_params.get("category")
        if category_slug:
            qs = qs.filter(category__slug=category_slug)
        return qs


class CartViewSet(viewsets.GenericViewSet, mixins.RetrieveModelMixin):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    lookup_field = "session_key"

    @action(detail=True, methods=["post"], url_path="add")
    def add_item(self, request, session_key=None):
        product_slug = request.data.get("product")
        quantity = int(request.data.get("quantity", 1))
        try:
            product = Product.objects.get(slug=product_slug, is_active=True)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        cart, _ = Cart.objects.get_or_create(session_key=session_key)
        item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        item.quantity = item.quantity + quantity if not created else quantity
        item.save()
        return Response(CartSerializer(cart).data)

    @action(detail=True, methods=["post"], url_path="remove")
    def remove_item(self, request, session_key=None):
        product_slug = request.data.get("product")
        try:
            product = Product.objects.get(slug=product_slug)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            cart = Cart.objects.get(session_key=session_key)
        except Cart.DoesNotExist:
            return Response({"detail": "Cart not found"}, status=status.HTTP_404_NOT_FOUND)

        CartItem.objects.filter(cart=cart, product=product).delete()
        return Response(CartSerializer(cart).data)


class OrderViewSet(viewsets.GenericViewSet, mixins.RetrieveModelMixin, mixins.CreateModelMixin):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def create(self, request, *args, **kwargs):
        session_key = request.data.get("session_key")
        try:
            cart = Cart.objects.get(session_key=session_key)
        except Cart.DoesNotExist:
            return Response({"detail": "Cart not found"}, status=status.HTTP_404_NOT_FOUND)

        total_cents = 0
        for item in cart.items.select_related("product"):
            total_cents += item.product.price_cents * item.quantity

        order = Order.objects.create(
            cart=cart,
            email=request.data.get("email"),
            full_name=request.data.get("full_name"),
            address=request.data.get("address"),
            city=request.data.get("city"),
            postal_code=request.data.get("postal_code"),
            country=request.data.get("country"),
            total_cents=total_cents,
            status="placed",
        )

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

# Create your views here.
