from django.core.validators import MinValueValidator
from django.db import models
from inventory.models import BaseModel


# Create your models here.
class Cart(BaseModel):
    product = models.ForeignKey(
        "inventory.Product", on_delete=models.CASCADE, related_name="cart_product"
    )
    quantity = models.IntegerField(validators=[MinValueValidator(0)])
