from django.db import models

from apps.buses.models import Bus
from apps.core.models import BaseModel
from apps.routes.models import RouteGroup


class FareRule(BaseModel):
    route_group = models.ForeignKey(
        RouteGroup,
        on_delete=models.CASCADE,
        related_name="fare_rules",
        null=True,
        blank=True,
        help_text="Leave blank for a city-wide default rule for this bus type.",
    )
    bus_type = models.CharField(max_length=20, choices=Bus.BusType.choices)
    base_fare = models.DecimalField(max_digits=6, decimal_places=2)
    per_km_rate = models.DecimalField(max_digits=6, decimal_places=2)
    min_fare = models.DecimalField(max_digits=6, decimal_places=2)
    rounding_step = models.DecimalField(max_digits=4, decimal_places=2, default=5)

    class Meta:
        unique_together = ("route_group", "bus_type")

    def __str__(self):
        scope = self.route_group.name if self.route_group else "city-wide"
        return f"{self.bus_type} fare ({scope})"
