from django.contrib import admin

from .models import Route, RouteGroup, RouteStop


class RouteStopInline(admin.TabularInline):
    model = RouteStop
    extra = 1
    ordering = ["sequence"]


class RouteInline(admin.StackedInline):
    model = Route
    extra = 0


@admin.register(RouteGroup)
class RouteGroupAdmin(admin.ModelAdmin):
    list_display = ("name", "bus")
    list_filter = ("bus__company",)
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}
    inlines = [RouteInline]


@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):
    list_display = ("route_group", "direction", "origin_label", "destination_label", "is_active")
    list_filter = ("direction", "is_active")
    inlines = [RouteStopInline]
