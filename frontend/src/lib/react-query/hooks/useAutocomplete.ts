import { useQuery } from "@tanstack/react-query";

import { autocomplete } from "@/lib/api/journey";

export function useAutocomplete(query: string) {
  return useQuery({
    queryKey: ["autocomplete", query],
    queryFn: () => autocomplete(query),
    enabled: query.trim().length >= 2,
    staleTime: 60 * 1000,
  });
}
