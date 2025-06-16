import uuid

from django.core.validators import MinValueValidator
from django.db import models


# Create your models here.
class BaseModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Product(BaseModel):
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name}"


class Inventory(BaseModel):
    product = models.OneToOneField(
        Product, on_delete=models.CASCADE, related_name="inventory_product"
    )
    stock = models.IntegerField(validators=[MinValueValidator(0)])
    price = models.DecimalField(
        max_digits=10, decimal_places=2, validators=[MinValueValidator(0)]
    )
