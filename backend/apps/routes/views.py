from rest_framework import viewsets

from .models import RouteGroup
from .serializers import RouteGroupSerializer


class RouteGroupViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = RouteGroup.objects.select_related("bus", "bus__company").prefetch_related(
        "routes__route_stops__stop"
    )
    serializer_class = RouteGroupSerializer
    lookup_field = "slug"
    filterset_fields = ["bus"]
    search_fields = ["name"]
