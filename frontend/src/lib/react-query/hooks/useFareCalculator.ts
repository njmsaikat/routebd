import { useQuery } from "@tanstack/react-query";

import { calculateFare } from "@/lib/api/journey";

export function useFareCalculator(fromStopId: number | null, toStopId: number | null) {
  return useQuery({
    queryKey: ["fare-calculate", fromStopId, toStopId],
    queryFn: () => calculateFare(fromStopId as number, toStopId as number),
    enabled: !!fromStopId && !!toStopId && fromStopId !== toStopId,
  });
}
