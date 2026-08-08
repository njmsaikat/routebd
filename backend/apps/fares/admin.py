from django.contrib import admin

from .models import FareRule


@admin.register(FareRule)
class FareRuleAdmin(admin.ModelAdmin):
    list_display = ("bus_type", "route_group", "base_fare", "per_km_rate", "min_fare")
    list_filter = ("bus_type",)
