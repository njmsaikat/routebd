import { useQuery } from "@tanstack/react-query";

import { getBus, listBuses } from "@/lib/api/buses";

export function useBuses(params?: { search?: string; bus_type?: string }) {
  return useQuery({
    queryKey: ["buses", params],
    queryFn: () => listBuses(params),
  });
}

export function useBus(slug: string) {
  return useQuery({
    queryKey: ["bus", slug],
    queryFn: () => getBus(slug),
    enabled: !!slug,
  });
}
