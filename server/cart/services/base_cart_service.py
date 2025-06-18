from cart.models import Order, OrderItem
from inventory.models import Inventory


class BaseCartService:
    def __init__(self):
        pass

    def _reduce_inventory_stock(self, inventory: Inventory, quantity: int) -> Inventory:
        inventory.stock -= quantity
        inventory.save()

        return inventory

    def _bulk_reduce_inventory_stock(self, cart: dict):
        inventory_dict = {item["inventory_id"]: item["quantity"] for item in cart}
        inventories = Inventory.objects.filter(id__in=inventory_dict.keys())

        for inventory in inventories:
            inventory.stock -= inventory_dict[str(inventory.id)]

        Inventory.objects.bulk_update(inventories, ["stock"])

        return inventories

    def _create_order_object(self, cart: dict):
        order = Order.objects.create()

        self._bulk_create_order_items(order.id, cart)

        return order

    def _bulk_create_order_items(self, order_id: str, cart: dict):
        order_items = []
        for item in cart:
            order_item = OrderItem(
                order_id=order_id,
                product_id=item["product_id"],
                price=item["price"],
                quantity=item["quantity"],
            )

            order_items.append(order_item)

        return OrderItem.objects.bulk_create(order_items)
