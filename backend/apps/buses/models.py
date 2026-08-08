from django.db import models

from apps.core.models import BaseModel
from apps.companies.models import Company


class Bus(BaseModel):
    class BusType(models.TextChoices):
        LOCAL = "local", "Local"
        SITTING = "sitting", "Sitting"
        AC = "ac", "AC"

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="buses")
    name = models.CharField(max_length=150)
    slug = models.SlugField(max_length=170, unique=True)
    bus_type = models.CharField(max_length=20, choices=BusType.choices, default=BusType.LOCAL)
    color_hex = models.CharField(max_length=7, default="#2563eb")
    image_url = models.URLField(blank=True)
    operating_hours_start = models.TimeField(default="06:00")
    operating_hours_end = models.TimeField(default="22:00")
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name
