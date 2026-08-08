from django.urls import path

from .views import FareCalculateView

urlpatterns = [
    path("fare/calculate/", FareCalculateView.as_view(), name="fare-calculate"),
]
