from cart.models import Cart
from inventory.models import Inventory
from rest_framework import serializers


class _CartBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = "__all__"


class CartListSerializer(_CartBaseSerializer):
    product_id = serializers.UUIDField(source="inventory.product.id")
    product_name = serializers.CharField(source="inventory.product.name")
    price = serializers.DecimalField(
        source="inventory.price", max_digits=10, decimal_places=2
    )

    class Meta:
        model = Cart
        fields = [
            "id",
            "quantity",
            "product_id",
            "product_name",
            "price",
            "inventory_id",
            "created_at",
            "updated_at",
        ]


class CartItemSerializer(serializers.Serializer):
    inventory_id = serializers.UUIDField()
    quantity = serializers.IntegerField()
    product_id = serializers.UUIDField()
    product_name = serializers.CharField()
    price = serializers.IntegerField()
    quantity = serializers.DecimalField(max_digits=10, decimal_places=2)


class CartSerializer(serializers.Serializer):
    cart = CartItemSerializer(many=True)

    def validate(self, data):
        cart_items = data["cart"]
        inventory_ids = [item["inventory_id"] for item in cart_items]
        inventories = Inventory.objects.filter(id__in=inventory_ids)
        inventory_dict = {str(inventory.id): inventory for inventory in inventories}

        for item in cart_items:
            inventory_id = str(item["inventory_id"])
            quantity = item["quantity"]
            product_name = item["product_name"]

            if quantity < 1:
                raise serializers.ValidationError(
                    {"quantity": f"Quantity for {product_name} cannot be less than 1"}
                )

            inventory: Inventory = inventory_dict[inventory_id]
            if quantity > inventory.stock:
                raise serializers.ValidationError(
                    {
                        "quantity": f"I'm sorry but we only have {inventory.stock}kg of {product_name} left."
                    }
                )

        return data
