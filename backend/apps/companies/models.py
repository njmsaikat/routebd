from django.db import models

from apps.core.models import BaseModel


class Company(BaseModel):
    name = models.CharField(max_length=150)
    slug = models.SlugField(max_length=170, unique=True)
    logo_url = models.URLField(blank=True)
    phone = models.CharField(max_length=30, blank=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "companies"

    def __str__(self):
        return self.name
