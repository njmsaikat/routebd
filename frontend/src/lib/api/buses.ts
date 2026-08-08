import { apiFetch } from "./client";
import type { Bus, Paginated } from "@/lib/types";

export function listBuses(params?: { search?: string; bus_type?: string; ordering?: string }) {
  return apiFetch<Paginated<Bus>>("/buses/", params as Record<string, string>);
}

export function getBus(slug: string) {
  return apiFetch<Bus>(`/buses/${slug}/`);
}
