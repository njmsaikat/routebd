from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets

from apps.core.utils import haversine_km

from .models import Area, City, Stop
from .serializers import AreaSerializer, CitySerializer, NearbyStopSerializer, StopSerializer


class CityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = City.objects.filter(is_active=True)
    serializer_class = CitySerializer
    lookup_field = "slug"


class AreaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Area.objects.select_related("city")
    serializer_class = AreaSerializer
    filterset_fields = ["city"]
    search_fields = ["name"]


class StopViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Stop.objects.filter(is_active=True).select_related("city", "area")
    serializer_class = StopSerializer
    filterset_fields = ["city", "area"]
    search_fields = ["name"]

    @action(detail=False, methods=["get"])
    def nearby(self, request):
        try:
            lat = float(request.query_params["lat"])
            lng = float(request.query_params["lng"])
        except (KeyError, ValueError):
            return Response(
                {"detail": "Query params 'lat' and 'lng' are required floats."}, status=400
            )
        radius_km = float(request.query_params.get("radius_km", 1.5))

        nearby = []
        for stop in self.get_queryset():
            distance = haversine_km(lat, lng, stop.latitude, stop.longitude)
            if distance <= radius_km:
                stop.distance_km = round(distance, 3)
                nearby.append(stop)
        nearby.sort(key=lambda s: s.distance_km)

        serializer = NearbyStopSerializer(nearby, many=True)
        return Response(serializer.data)
