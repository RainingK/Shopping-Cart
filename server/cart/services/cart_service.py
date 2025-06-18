from cart.services.base_cart_service import BaseCartService
from django.db import transaction


class CartService(BaseCartService):
    def __init__(self):
        pass

    def place_order(self, cart: dict):
        """
        Given a dict of items. It created an order object along with subtracting the stock from the inventory.
        Does not clear the cart so it's easier to place an order again
        """
        with transaction.atomic():
            self._bulk_reduce_inventory_stock(cart)
            self._create_order_object(cart)
