from rest_framework import serializers

from apps.companies.serializers import CompanySerializer

from .models import Bus


class BusSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)

    class Meta:
        model = Bus
        fields = (
            "id",
            "name",
            "slug",
            "company",
            "bus_type",
            "color_hex",
            "image_url",
            "operating_hours_start",
            "operating_hours_end",
            "is_active",
        )
