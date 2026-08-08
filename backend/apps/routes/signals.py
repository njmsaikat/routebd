from django.core.cache import cache
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from apps.core.cache_keys import ROUTE_GRAPH_CACHE_KEY

from .models import Route, RouteStop


@receiver([post_save, post_delete], sender=RouteStop)
@receiver([post_save, post_delete], sender=Route)
def invalidate_route_graph_cache(sender, **kwargs):
    cache.delete(ROUTE_GRAPH_CACHE_KEY)
