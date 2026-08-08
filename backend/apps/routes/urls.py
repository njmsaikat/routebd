from rest_framework.routers import DefaultRouter

from .views import RouteGroupViewSet

router = DefaultRouter()
router.register("routes", RouteGroupViewSet, basename="route")

urlpatterns = router.urls
