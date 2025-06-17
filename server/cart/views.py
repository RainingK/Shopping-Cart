from cart.models import Cart
from cart.serializers import CartListSerializer
from rest_framework import viewsets


# Create your views here.
class CartListViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CartListSerializer
    queryset = Cart.objects.all()

    def get_queryset(self):
        return self.queryset.select_related("inventory", "inventory__product")
