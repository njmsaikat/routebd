from django.db import models

from apps.core.models import BaseModel


class City(BaseModel):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "cities"

    def __str__(self):
        return self.name


class Area(BaseModel):
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name="areas")
    name = models.CharField(max_length=150)
    slug = models.SlugField(max_length=170)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)

    class Meta:
        ordering = ["name"]
        unique_together = ("city", "slug")

    def __str__(self):
        return f"{self.name} ({self.city.name})"


class Stop(BaseModel):
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name="stops")
    area = models.ForeignKey(
        Area, on_delete=models.SET_NULL, null=True, blank=True, related_name="stops"
    )
    name = models.CharField(max_length=150)
    slug = models.SlugField(max_length=170)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    landmarks_note = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["name"]
        unique_together = ("city", "slug")

    def __str__(self):
        return self.name
