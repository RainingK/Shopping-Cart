from cart.models import Cart, Order, OrderItem
from django.contrib import admin


# Register your models here.
@admin.register(Cart)
class __CartAdmin(admin.ModelAdmin):
    list_display = ("inventory__product__name", "quantity", "created_at", "updated_at")
    list_filter = ("inventory__product__name", "quantity")
    search_fields = ("inventory__product__name", "quantity")
    ordering = ("inventory__product__name",)
    list_select_related = ("inventory, inventory__product",)


@admin.register(Order)
class __OrderAdmin(admin.ModelAdmin):
    list_display = ("order_number", "created_at", "updated_at")
    list_filter = ("order_number",)
    search_fields = ("order_number",)
    ordering = ("-order_number",)


@admin.register(OrderItem)
class __OrderItem(admin.ModelAdmin):
    list_display = (
        "order__order_number",
        "product__name",
        "quantity",
        "price",
        "created_at",
        "updated_at",
    )
    list_filter = ("order__order_number", "product__name")
    search_fields = ("order__order_number", "product__name", "quantity", "price")
    ordering = ("-order__order_number", "product__name")
    list_select_related = ("order", "product")
