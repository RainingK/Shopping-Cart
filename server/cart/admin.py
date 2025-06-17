from cart.models import Cart
from django.contrib import admin


# Register your models here.
@admin.register(Cart)
class __CartAdmin(admin.ModelAdmin):
    list_display = ("inventory__product__name", "quantity", "created_at", "updated_at")
    list_filter = ("inventory__product__name", "quantity")
    search_fields = ("inventory__product__name", "quantity")
    ordering = ("inventory__product__name",)
    list_select_related = ("inventory, inventory__product",)
