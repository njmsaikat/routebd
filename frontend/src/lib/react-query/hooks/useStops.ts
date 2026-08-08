import { useQuery } from "@tanstack/react-query";

import { getStop } from "@/lib/api/stops";

export function useStop(id: number) {
  return useQuery({
    queryKey: ["stop", id],
    queryFn: () => getStop(id),
    enabled: !!id,
  });
}
