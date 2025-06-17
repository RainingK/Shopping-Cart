from cart.models import Cart
from rest_framework import serializers


class _CartBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = "__all__"


class CartListSerializer(_CartBaseSerializer):
    product_name = serializers.CharField(source="inventory.product.name")
    price = serializers.DecimalField(
        source="inventory.price", max_digits=10, decimal_places=2
    )

    class Meta:
        model = Cart
        fields = ["id", "quantity", "product_name", "price", "created_at", "updated_at"]
