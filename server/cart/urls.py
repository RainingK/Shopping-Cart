from cart.views import CartListViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register("get-cart-list", CartListViewSet, basename="cart-list")

urlpatterns = [] + router.urls
