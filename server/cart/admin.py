from cart.models import Cart
from django.contrib import admin


# Register your models here.
@admin.register(Cart)
class __CartAdmin(admin.ModelAdmin):
    list_display = ("product__name", "quantity", "created_at", "updated_at")
    list_filter = ("product__name", "quantity")
    search_fields = ("product__name", "quantity")
    ordering = ("product__name",)
    list_select_related = ("product",)
