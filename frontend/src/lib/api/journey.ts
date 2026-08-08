import { apiFetch } from "./client";
import type { AutocompleteResult, FareCalculationResponse, JourneySearchResponse } from "@/lib/types";

export function searchJourney(from: string, to: string) {
  return apiFetch<JourneySearchResponse>("/journey/search/", { from, to });
}

export function autocomplete(query: string) {
  return apiFetch<AutocompleteResult[]>("/search/autocomplete/", { q: query });
}

export function calculateFare(fromStopId: number, toStopId: number) {
  return apiFetch<FareCalculationResponse>("/fare/calculate/", {
    from_stop: fromStopId,
    to_stop: toStopId,
  });
}
