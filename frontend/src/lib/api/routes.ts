import { apiFetch } from "./client";
import type { Paginated, RouteGroup } from "@/lib/types";

export function listRoutes(params?: { search?: string; bus?: number }) {
  return apiFetch<Paginated<RouteGroup>>("/routes/", params as Record<string, string>);
}

export function getRoute(slug: string) {
  return apiFetch<RouteGroup>(`/routes/${slug}/`);
}
