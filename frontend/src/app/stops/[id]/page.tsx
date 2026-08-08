"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useMemo } from "react";

import { NearbyBusesList } from "@/components/stops/NearbyBusesList";
import { StopCard } from "@/components/stops/StopCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { useRoutes } from "@/lib/react-query/hooks/useRoutes";
import { useStop } from "@/lib/react-query/hooks/useStops";

const RouteMap = dynamic(() => import("@/components/map/RouteMap").then((m) => m.RouteMap), {
  ssr: false,
  loading: () => <Skeleton className="h-72 w-full" />,
});

export default function StopDetailPage() {
  const { id } = useParams<{ id: string }>();
  const stopId = Number(id);
  const { data: stop, isLoading } = useStop(stopId);
  const { data: allRoutes } = useRoutes();

  const connectedGroups = useMemo(() => {
    if (!allRoutes) return [];
    return allRoutes.results.filter((group) =>
      group.routes.some((route) => route.route_stops.some((rs) => rs.stop.id === stopId))
    );
  }, [allRoutes, stopId]);

  if (isLoading || !stop) return <Skeleton className="h-72 w-full" />;

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">{stop.name}</h1>
      <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <StopCard stop={stop} />
        <RouteMap
          legs={[
            {
              geometry: [
                { stop_id: stop.id, name: stop.name, lat: Number(stop.latitude), lng: Number(stop.longitude) },
              ],
              color: "#2563eb",
            },
          ]}
          heightClassName="h-64"
        />
      </div>

      <h2 className="mb-3 mt-8 text-lg font-semibold">Buses serving this stop</h2>
      <NearbyBusesList routeGroups={connectedGroups} />
    </div>
  );
}
