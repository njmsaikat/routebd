import { apiFetch } from "./client";
import type { NearbyStop, Paginated, Stop } from "@/lib/types";

export function listStops(params?: { search?: string }) {
  return apiFetch<Paginated<Stop>>("/stops/", params as Record<string, string>);
}

export function getStop(id: number) {
  return apiFetch<Stop>(`/stops/${id}/`);
}

export function nearbyStops(lat: number, lng: number, radiusKm = 1.5) {
  return apiFetch<NearbyStop[]>("/stops/nearby/", { lat, lng, radius_km: radiusKm });
}
