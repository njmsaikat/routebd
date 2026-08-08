from django.urls import include, path

urlpatterns = [
    path("auth/", include("apps.accounts.urls")),
    path("", include("apps.companies.urls")),
    path("", include("apps.buses.urls")),
    path("", include("apps.stops.urls")),
    path("", include("apps.routes.urls")),
    path("", include("apps.journey.urls")),
    path("", include("apps.fares.urls")),
    path("", include("apps.search.urls")),
]
