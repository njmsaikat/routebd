from rest_framework.routers import DefaultRouter

from .views import AreaViewSet, CityViewSet, StopViewSet

router = DefaultRouter()
router.register("cities", CityViewSet, basename="city")
router.register("areas", AreaViewSet, basename="area")
router.register("stops", StopViewSet, basename="stop")

urlpatterns = router.urls
