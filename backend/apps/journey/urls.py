from django.urls import path

from .views import JourneySearchView

urlpatterns = [
    path("journey/search/", JourneySearchView.as_view(), name="journey-search"),
]
