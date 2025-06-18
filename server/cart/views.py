from cart.models import Cart
from cart.serializers import CartListSerializer, CartSerializer
from cart.services.cart_service import CartService
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView


# Create your views here.
class CartListViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CartListSerializer
    queryset = Cart.objects.all()

    def get_queryset(self):
        return self.queryset.select_related("inventory", "inventory__product")


class PlaceOrder(APIView):
    def post(self, request):
        cart = request.data
        serializer = CartSerializer(data={"cart": cart})
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        cart_service = CartService()
        cart_service.place_order(cart)

        return Response({"message": "Order Placed Successfully"})
