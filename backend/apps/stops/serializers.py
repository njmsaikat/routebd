from rest_framework import serializers

from .models import Area, City, Stop


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ("id", "name", "slug", "is_active")


class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = ("id", "name", "slug", "city", "latitude", "longitude")


class StopSerializer(serializers.ModelSerializer):
    area_name = serializers.CharField(source="area.name", read_only=True, default=None)

    class Meta:
        model = Stop
        fields = (
            "id",
            "name",
            "slug",
            "city",
            "area",
            "area_name",
            "latitude",
            "longitude",
            "landmarks_note",
            "is_active",
        )


class NearbyStopSerializer(StopSerializer):
    distance_km = serializers.FloatField(read_only=True)

    class Meta(StopSerializer.Meta):
        fields = StopSerializer.Meta.fields + ("distance_km",)
