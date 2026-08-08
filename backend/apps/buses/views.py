from rest_framework import viewsets

from .models import Bus
from .serializers import BusSerializer


class BusViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Bus.objects.filter(is_active=True).select_related("company")
    serializer_class = BusSerializer
    lookup_field = "slug"
    filterset_fields = ["company", "bus_type"]
    search_fields = ["name", "company__name"]
    ordering_fields = ["name"]
