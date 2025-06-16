from django.contrib import admin
from inventory.models import Inventory, Product


# Register your models here.
@admin.register(Product)
class __ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "created_at", "updated_at")
    list_filter = ("name",)
    search_fields = ("name",)
    ordering = ("name",)


@admin.register(Inventory)
class __InventoryAdmin(admin.ModelAdmin):
    list_display = ("product__name", "stock", "price", "created_at", "updated_at")
    list_filter = ("product__name", "price")
    search_fields = ("product__name", "stock", "price")
    ordering = ("product__name",)
    list_select_related = ("product",)
    list_editable = ("stock", "price")
