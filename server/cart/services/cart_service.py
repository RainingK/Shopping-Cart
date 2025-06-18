from cart.models import Order
from cart.services.base_cart_service import BaseCartService
from django.db import transaction
from inventory.models import Inventory


class CartService(BaseCartService):
    def __init__(self):
        pass

    def place_order(self, cart: dict):
        with transaction.atomic():
            self._bulk_reduce_inventory_stock(cart)
            self._create_order_object(cart)
