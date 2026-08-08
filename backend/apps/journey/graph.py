from collections import defaultdict
from dataclasses import dataclass
from decimal import Decimal

from django.core.cache import cache

from apps.core.cache_keys import ROUTE_GRAPH_CACHE_KEY, ROUTE_GRAPH_CACHE_TTL
from apps.routes.models import Route, RouteStop


@dataclass(frozen=True)
class RouteStopNode:
    stop_id: int
    sequence: int
    distance_from_start_km: Decimal


@dataclass(frozen=True)
class RouteGraph:
    # route_id -> ordered list of nodes (by sequence)
    route_stops: dict
    # stop_id -> set of route_ids serving that stop
    stop_routes: dict


def build_route_graph() -> RouteGraph:
    route_stops = defaultdict(list)
    stop_routes = defaultdict(set)

    qs = (
        RouteStop.objects.filter(route__is_active=True)
        .order_by("route_id", "sequence")
        .values("route_id", "stop_id", "sequence", "distance_from_start_km")
    )
    for row in qs:
        route_stops[row["route_id"]].append(
            RouteStopNode(
                stop_id=row["stop_id"],
                sequence=row["sequence"],
                distance_from_start_km=row["distance_from_start_km"],
            )
        )
        stop_routes[row["stop_id"]].add(row["route_id"])

    return RouteGraph(route_stops=dict(route_stops), stop_routes=dict(stop_routes))


def get_route_graph() -> RouteGraph:
    graph = cache.get(ROUTE_GRAPH_CACHE_KEY)
    if graph is None:
        graph = build_route_graph()
        cache.set(ROUTE_GRAPH_CACHE_KEY, graph, ROUTE_GRAPH_CACHE_TTL)
    return graph


def get_route_metadata():
    """route_id -> Route instance, fetched fresh (small table, not worth caching)."""
    return {
        r.id: r
        for r in Route.objects.filter(is_active=True).select_related(
            "route_group", "route_group__bus", "route_group__bus__company"
        )
    }
