from rest_framework.response import Response
from rest_framework.views import APIView

from .services import search_journeys


class JourneySearchView(APIView):
    def get(self, request):
        from_query = request.query_params.get("from", "")
        to_query = request.query_params.get("to", "")
        if not from_query or not to_query:
            return Response(
                {"detail": "Query params 'from' and 'to' are both required."}, status=400
            )
        return Response(search_journeys(from_query, to_query))
