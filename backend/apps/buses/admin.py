from django.contrib import admin

from .models import Bus


@admin.register(Bus)
class BusAdmin(admin.ModelAdmin):
    list_display = ("name", "company", "bus_type", "color_hex", "is_active")
    list_filter = ("company", "bus_type", "is_active")
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}
