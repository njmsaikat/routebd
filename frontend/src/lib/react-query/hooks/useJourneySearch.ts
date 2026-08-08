import { useQuery } from "@tanstack/react-query";

import { searchJourney } from "@/lib/api/journey";

export function useJourneySearch(from: string, to: string, enabled: boolean) {
  return useQuery({
    queryKey: ["journey-search", from, to],
    queryFn: () => searchJourney(from, to),
    enabled,
  });
}
