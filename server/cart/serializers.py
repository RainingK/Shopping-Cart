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
    id = serializers.UUIDField()
    inventory_id = serializers.UUIDField()
    quantity = serializers.IntegerField()
    product_id = serializers.UUIDField()
    product_name = serializers.CharField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2)


class CartSerializer(serializers.Serializer):
    cart = CartItemSerializer(many=True)

    def validate(self, data):
        cart_items = data["cart"]
        inventory_ids = [item["inventory_id"] for item in cart_items]
        inventories = Inventory.objects.filter(id__in=inventory_ids)
        inventory_dict = {str(inventory.id): inventory for inventory in inventories}

        errors = []

        for item in cart_items:
            id = str(item["id"])
            inventory_id = str(item["inventory_id"])
            quantity = item["quantity"]
            product_name = item["product_name"]
            error = {}

            if quantity < 1:
                error["quantity"] = {
                    "id": id,
                    "message": f"Quantity for {product_name} cannot be less than 1",
                }
            else:
                inventory = inventory_dict[inventory_id]
                if inventory.stock == 0:
                    error["quantity"] = {
                        "id": id,
                        "message": f"I'm sorry but we are out of stock for {product_name}",
                    }
                elif inventory.stock < quantity:
                    error["quantity"] = {
                        "id": id,
                        "message": f"I'm sorry but we only have {inventory.stock}kg of {product_name} left.",
                    }

            errors.append(error)

        if any(errors) > 0:
            raise serializers.ValidationError({"carts": errors})

        return data
