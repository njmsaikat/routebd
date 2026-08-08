from django.urls import path

from .views import AutocompleteView

urlpatterns = [
    path("search/autocomplete/", AutocompleteView.as_view(), name="search-autocomplete"),
]
