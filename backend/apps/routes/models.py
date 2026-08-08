from django.db import models

from apps.buses.models import Bus
from apps.core.models import BaseModel
from apps.stops.models import Stop


class RouteGroup(BaseModel):
    bus = models.ForeignKey(Bus, on_delete=models.CASCADE, related_name="route_groups")
    name = models.CharField(max_length=150)
    slug = models.SlugField(max_length=170, unique=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.bus.name})"


class Route(BaseModel):
    class Direction(models.TextChoices):
        OUTBOUND = "outbound", "Outbound"
        INBOUND = "inbound", "Inbound"

    route_group = models.ForeignKey(RouteGroup, on_delete=models.CASCADE, related_name="routes")
    direction = models.CharField(max_length=20, choices=Direction.choices)
    origin_label = models.CharField(max_length=150)
    destination_label = models.CharField(max_length=150)
    distance_km = models.DecimalField(max_digits=6, decimal_places=2)
    avg_speed_kmph = models.DecimalField(max_digits=5, decimal_places=2, default=18)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ("route_group", "direction")

    def __str__(self):
        return f"{self.route_group.name} [{self.direction}]"


class RouteStop(BaseModel):
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name="route_stops")
    stop = models.ForeignKey(Stop, on_delete=models.CASCADE, related_name="route_stops")
    sequence = models.PositiveIntegerField()
    distance_from_start_km = models.DecimalField(max_digits=6, decimal_places=2)

    class Meta:
        ordering = ["route", "sequence"]
        unique_together = (("route", "sequence"), ("route", "stop"))

    def __str__(self):
        return f"{self.route} #{self.sequence} {self.stop.name}"
