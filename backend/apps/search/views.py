from django.contrib.postgres.search import TrigramSimilarity
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.buses.models import Bus
from apps.stops.models import Area, Stop

SIMILARITY_THRESHOLD = 0.25
RESULTS_PER_TYPE = 5


class AutocompleteView(APIView):
    def get(self, request, **kwargs):
        query = request.query_params.get("q", "").strip()
        if len(query) < 2:
            return Response([])

        results = []

        stops = (
            Stop.objects.filter(is_active=True)
            .annotate(sim=TrigramSimilarity("name", query))
            .filter(sim__gt=SIMILARITY_THRESHOLD)
            .order_by("-sim")[:RESULTS_PER_TYPE]
        )
        results += [
            {"type": "stop", "id": s.id, "label": s.name, "similarity": round(s.sim, 3)}
            for s in stops
        ]

        areas = (
            Area.objects.annotate(sim=TrigramSimilarity("name", query))
            .filter(sim__gt=SIMILARITY_THRESHOLD)
            .order_by("-sim")[:RESULTS_PER_TYPE]
        )
        results += [
            {"type": "area", "id": a.id, "label": a.name, "similarity": round(a.sim, 3)}
            for a in areas
        ]

        buses = (
            Bus.objects.filter(is_active=True)
            .annotate(sim=TrigramSimilarity("name", query))
            .filter(sim__gt=SIMILARITY_THRESHOLD)
            .order_by("-sim")[:RESULTS_PER_TYPE]
        )
        results += [
            {"type": "bus", "id": b.id, "label": b.name, "similarity": round(b.sim, 3)}
            for b in buses
        ]

        results.sort(key=lambda r: r["similarity"], reverse=True)
        return Response(results[:10])
