from rest_framework import serializers

from apps.buses.serializers import BusSerializer
from apps.stops.serializers import StopSerializer

from .models import Route, RouteGroup, RouteStop


class RouteStopSerializer(serializers.ModelSerializer):
    stop = StopSerializer(read_only=True)

    class Meta:
        model = RouteStop
        fields = ("id", "stop", "sequence", "distance_from_start_km")


class RouteSerializer(serializers.ModelSerializer):
    route_stops = RouteStopSerializer(many=True, read_only=True)

    class Meta:
        model = Route
        fields = (
            "id",
            "direction",
            "origin_label",
            "destination_label",
            "distance_km",
            "avg_speed_kmph",
            "is_active",
            "route_stops",
        )


class RouteGroupSerializer(serializers.ModelSerializer):
    bus = BusSerializer(read_only=True)
    routes = RouteSerializer(many=True, read_only=True)

    class Meta:
        model = RouteGroup
        fields = ("id", "name", "slug", "bus", "routes")
