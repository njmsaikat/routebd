from rest_framework.response import Response
from rest_framework.views import APIView

from apps.journey.services import find_direct_routes, find_transfer_routes


class FareCalculateView(APIView):
    def get(self, request, **kwargs):
        try:
            from_stop_id = int(request.query_params["from_stop"])
            to_stop_id = int(request.query_params["to_stop"])
        except (KeyError, ValueError):
            return Response(
                {"detail": "Query params 'from_stop' and 'to_stop' (stop IDs) are required."},
                status=400,
            )

        direct = find_direct_routes(from_stop_id, to_stop_id)
        if direct:
            cheapest = min(direct, key=lambda r: r["fare"])
            return Response({"direct": True, "options": direct, "cheapest_fare": cheapest["fare"]})

        transfers = find_transfer_routes(from_stop_id, to_stop_id)
        if transfers:
            cheapest = min(transfers, key=lambda r: r["total_fare"])
            return Response(
                {"direct": False, "options": transfers, "cheapest_fare": cheapest["total_fare"]}
            )

        return Response({"direct": False, "options": [], "cheapest_fare": None})
