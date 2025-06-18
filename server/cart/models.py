from django.core.validators import MinValueValidator
from django.db import models
from django.db.models import Max
from inventory.models import BaseModel


# Create your models here.
class Cart(BaseModel):
    inventory = models.ForeignKey(
        "inventory.Inventory", on_delete=models.CASCADE, related_name="cart_inventory"
    )
    quantity = models.IntegerField(validators=[MinValueValidator(0)])


class Order(BaseModel):
    order_number = models.IntegerField(unique=True)

    @property
    def total_price(self):
        return sum(item.quantity * item.price for item in self.order_item_order.all())

    def __str__(self):
        return f"Order Number: {self.order_number}"

    def save(self, *args, **kwargs):
        if self._state.adding and self.order_number is None:
            last_order_number = (
                Order.objects.aggregate(last_order=Max("order_number"))["last_order"]
                or 0
            )
            self.order_number = last_order_number + 1

        super().save(*args, **kwargs)


class OrderItem(BaseModel):
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, related_name="order_item_order"
    )
    product = models.ForeignKey(
        "inventory.Product", on_delete=models.CASCADE, related_name="order_item_product"
    )
    quantity = models.IntegerField(validators=[MinValueValidator(0)])
    price = models.DecimalField(
        max_digits=10, decimal_places=2, validators=[MinValueValidator(0)]
    )
