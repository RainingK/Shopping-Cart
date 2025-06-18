from cart.models import Order, OrderItem
from inventory.models import Inventory


class BaseCartService:
    def __init__(self):
        pass

    def _reduce_inventory_stock(self, inventory: Inventory, quantity: int) -> Inventory:
        """
        Reduced the stock in the inventory of a single object
        """
        inventory.stock -= quantity
        inventory.save()

        return inventory

    def _bulk_reduce_inventory_stock(self, cart: dict):
        """
        Reducing the stock of a group of inventories
        """
        inventory_dict = {item["inventory_id"]: item["quantity"] for item in cart}
        inventories = Inventory.objects.filter(id__in=inventory_dict.keys())

        for inventory in inventories:
            inventory.stock -= inventory_dict[str(inventory.id)]

        Inventory.objects.bulk_update(inventories, ["stock"])

        return inventories

    def _create_order_object(self, cart: dict):
        """
        Creates an order object along with the items for it
        """
        order = Order.objects.create()

        self._bulk_create_order_items(order.id, cart)

        return order

    def _bulk_create_order_items(self, order_id: str, cart: dict):
        """
        Bulk creates order items for a specific order
        """
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
