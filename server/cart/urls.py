from cart.views import CartListViewSet, PlaceOrder
from django.urls import path
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register("get-cart-list", CartListViewSet, basename="cart-list")

urlpatterns = [
    path("place-order/", PlaceOrder.as_view()),
] + router.urls
