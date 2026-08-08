import { useQuery } from "@tanstack/react-query";

import { getRoute, listRoutes } from "@/lib/api/routes";

export function useRoutes(params?: { search?: string; bus?: number }, enabled = true) {
  return useQuery({
    queryKey: ["routes", params],
    queryFn: () => listRoutes(params),
    enabled,
  });
}

export function useRoute(slug: string) {
  return useQuery({
    queryKey: ["route", slug],
    queryFn: () => getRoute(slug),
    enabled: !!slug,
  });
}
