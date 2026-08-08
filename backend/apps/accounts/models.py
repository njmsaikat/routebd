from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        GUEST = "guest", "Guest"
        REGISTERED = "registered", "Registered"
        MODERATOR = "moderator", "Moderator"
        ADMIN = "admin", "Administrator"

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.REGISTERED)

    def __str__(self):
        return self.username
