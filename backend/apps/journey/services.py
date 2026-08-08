from decimal import Decimal

from django.contrib.postgres.search import TrigramSimilarity
from django.db.models import Q

from apps.core.utils import haversine_km
from apps.fares.services import calculate_fare
from apps.stops.models import Area, Stop

from .graph import get_route_graph, get_route_metadata

SIMILARITY_THRESHOLD = 0.3
MAX_CANDIDATE_STOPS = 5
DWELL_SECONDS_PER_STOP = 30
WALKING_SPEED_KMPH = Decimal("5")


def resolve_endpoint(query: str):
    """Resolve a free-text From/To query to candidate (stop, walking_km) pairs."""
    query = (query or "").strip()
    if not query:
        return []

    stops = list(
        Stop.objects.filter(is_active=True)
        .annotate(sim=TrigramSimilarity("name", query))
        .filter(Q(sim__gt=SIMILARITY_THRESHOLD) | Q(name__iexact=query))
        .order_by("-sim")[:MAX_CANDIDATE_STOPS]
    )
    if stops:
        return [(stop, Decimal("0")) for stop in stops]

    areas = list(
        Area.objects.annotate(sim=TrigramSimilarity("name", query))
        .filter(Q(sim__gt=SIMILARITY_THRESHOLD) | Q(name__iexact=query))
        .order_by("-sim")[:2]
    )
    candidates = []
    for area in areas:
        for stop in area.stops.filter(is_active=True):
            walking_km = haversine_km(
                area.latitude, area.longitude, stop.latitude, stop.longitude
            )
            candidates.append((stop, Decimal(str(round(walking_km, 3)))))
    return candidates


def _leg_summary(route_meta, from_node, to_node):
    distance_km = to_node.distance_from_start_km - from_node.distance_from_start_km
    stops_count = to_node.sequence - from_node.sequence
    avg_speed = route_meta.avg_speed_kmph or Decimal("18")
    duration_min = (distance_km / avg_speed) * 60 + (
        stops_count * DWELL_SECONDS_PER_STOP / Decimal("60")
    )
    bus = route_meta.route_group.bus
    fare = calculate_fare(distance_km, bus.bus_type, route_meta.route_group)
    return {
        "distance_km": round(float(distance_km), 2),
        "stops_count": stops_count,
        "duration_min": round(float(duration_min), 1),
        "fare": float(fare),
    }


def _geometry(graph, route_id, from_seq, to_seq):
    nodes = [n for n in graph.route_stops[route_id] if from_seq <= n.sequence <= to_seq]
    stops = Stop.objects.in_bulk([n.stop_id for n in nodes])
    ordered = sorted(nodes, key=lambda n: n.sequence)
    return [
        {
            "stop_id": n.stop_id,
            "name": stops[n.stop_id].name,
            "lat": float(stops[n.stop_id].latitude),
            "lng": float(stops[n.stop_id].longitude),
        }
        for n in ordered
        if n.stop_id in stops
    ]


def _route_meta_summary(route_meta):
    bus = route_meta.route_group.bus
    return {
        "route_id": route_meta.id,
        "route_group_id": route_meta.route_group_id,
        "route_group_name": route_meta.route_group.name,
        "direction": route_meta.direction,
        "bus_name": bus.name,
        "bus_type": bus.bus_type,
        "color_hex": bus.color_hex,
        "company_name": bus.company.name,
    }


def find_direct_routes(from_stop_id: int, to_stop_id: int):
    """Routes where from_stop_id appears before to_stop_id on the same route."""
    graph = get_route_graph()
    route_meta = get_route_metadata()

    from_routes = graph.stop_routes.get(from_stop_id, set())
    to_routes = graph.stop_routes.get(to_stop_id, set())
    results = []

    for route_id in from_routes & to_routes:
        if route_id not in route_meta:
            continue
        nodes_by_stop = {n.stop_id: n for n in graph.route_stops[route_id]}
        from_node = nodes_by_stop.get(from_stop_id)
        to_node = nodes_by_stop.get(to_stop_id)
        if not from_node or not to_node or from_node.sequence >= to_node.sequence:
            continue

        summary = _leg_summary(route_meta[route_id], from_node, to_node)
        results.append(
            {
                **_route_meta_summary(route_meta[route_id]),
                **summary,
                "geometry": _geometry(graph, route_id, from_node.sequence, to_node.sequence),
            }
        )

    return results


def find_transfer_routes(from_stop_id: int, to_stop_id: int, exclude_direct_routes=frozenset()):
    """Single-transfer journeys: leg1 on route A to a transfer stop, leg2 on route B."""
    graph = get_route_graph()
    route_meta = get_route_metadata()
    from_routes = graph.stop_routes.get(from_stop_id, set()) - exclude_direct_routes
    to_routes = graph.stop_routes.get(to_stop_id, set())

    results = []
    seen = set()

    for route_a_id in from_routes:
        if route_a_id not in route_meta:
            continue
        nodes_a = {n.stop_id: n for n in graph.route_stops[route_a_id]}
        from_node = nodes_a.get(from_stop_id)
        if not from_node:
            continue

        for transfer_node in graph.route_stops[route_a_id]:
            if transfer_node.sequence <= from_node.sequence:
                continue
            transfer_stop_id = transfer_node.stop_id
            candidate_routes_b = (
                graph.stop_routes.get(transfer_stop_id, set()) & to_routes
            ) - {route_a_id}

            for route_b_id in candidate_routes_b:
                if route_b_id not in route_meta:
                    continue
                nodes_b = {n.stop_id: n for n in graph.route_stops[route_b_id]}
                transfer_node_b = nodes_b.get(transfer_stop_id)
                to_node = nodes_b.get(to_stop_id)
                if not transfer_node_b or not to_node:
                    continue
                if transfer_node_b.sequence >= to_node.sequence:
                    continue

                key = (route_a_id, transfer_stop_id, route_b_id)
                if key in seen:
                    continue
                seen.add(key)

                leg1 = _leg_summary(route_meta[route_a_id], from_node, transfer_node)
                leg2 = _leg_summary(route_meta[route_b_id], transfer_node_b, to_node)

                results.append(
                    {
                        "transfer_stop_id": transfer_stop_id,
                        "transfer_stop_name": Stop.objects.only("name").get(
                            id=transfer_stop_id
                        ).name,
                        "total_distance_km": round(
                            leg1["distance_km"] + leg2["distance_km"], 2
                        ),
                        "total_duration_min": round(
                            leg1["duration_min"] + leg2["duration_min"], 1
                        ),
                        "total_fare": round(leg1["fare"] + leg2["fare"], 2),
                        "leg1": {
                            **_route_meta_summary(route_meta[route_a_id]),
                            **leg1,
                            "geometry": _geometry(
                                graph, route_a_id, from_node.sequence, transfer_node.sequence
                            ),
                        },
                        "leg2": {
                            **_route_meta_summary(route_meta[route_b_id]),
                            **leg2,
                            "geometry": _geometry(
                                graph, route_b_id, transfer_node_b.sequence, to_node.sequence
                            ),
                        },
                    }
                )

    return results


def search_journeys(from_query: str, to_query: str, max_transfer_results: int = 5):
    from_candidates = resolve_endpoint(from_query)
    to_candidates = resolve_endpoint(to_query)

    if not from_candidates or not to_candidates:
        return {
            "resolved": False,
            "direct": [],
            "transfers": [],
            "message": "Could not match one or both locations to a known stop or area.",
        }

    direct_results = []
    transfer_results = []
    direct_route_ids = set()

    for from_stop, walking_from in from_candidates:
        for to_stop, walking_to in to_candidates:
            if from_stop.id == to_stop.id:
                continue
            for result in find_direct_routes(from_stop.id, to_stop.id):
                result["from_stop"] = {"id": from_stop.id, "name": from_stop.name}
                result["to_stop"] = {"id": to_stop.id, "name": to_stop.name}
                result["walking_from_km"] = float(walking_from)
                result["walking_to_km"] = float(walking_to)
                direct_results.append(result)
                direct_route_ids.add(result["route_id"])

    if not direct_results:
        for from_stop, walking_from in from_candidates:
            for to_stop, walking_to in to_candidates:
                if from_stop.id == to_stop.id:
                    continue
                for result in find_transfer_routes(from_stop.id, to_stop.id):
                    result["from_stop"] = {"id": from_stop.id, "name": from_stop.name}
                    result["to_stop"] = {"id": to_stop.id, "name": to_stop.name}
                    result["walking_from_km"] = float(walking_from)
                    result["walking_to_km"] = float(walking_to)
                    transfer_results.append(result)

    direct_results.sort(key=lambda r: (r["fare"], r["duration_min"]))
    transfer_results.sort(key=lambda r: (r["total_fare"], r["total_duration_min"]))

    return {
        "resolved": True,
        "direct": direct_results,
        "transfers": transfer_results[:max_transfer_results],
    }
