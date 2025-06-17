from django.core.validators import MinValueValidator
from django.db import models
from inventory.models import BaseModel


# Create your models here.
class Cart(BaseModel):
    inventory = models.ForeignKey(
        "inventory.Inventory", on_delete=models.CASCADE, related_name="cart_inventory"
    )
    quantity = models.IntegerField(validators=[MinValueValidator(0)])
