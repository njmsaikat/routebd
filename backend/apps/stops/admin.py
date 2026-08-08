from django.contrib import admin

from .models import Area, City, Stop


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ("name", "is_active")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Area)
class AreaAdmin(admin.ModelAdmin):
    list_display = ("name", "city")
    list_filter = ("city",)
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Stop)
class StopAdmin(admin.ModelAdmin):
    list_display = ("name", "city", "area", "is_active")
    list_filter = ("city", "is_active")
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}
