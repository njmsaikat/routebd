"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useState } from "react";

import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useRoute } from "@/lib/react-query/hooks/useRoutes";

const RouteMap = dynamic(() => import("@/components/map/RouteMap").then((m) => m.RouteMap), {
  ssr: false,
  loading: () => <Skeleton className="h-96 w-full" />,
});

export default function RouteDetailPage() {
  const { id: slug } = useParams<{ id: string }>();
  const { data: group, isLoading } = useRoute(slug);
  const [directionIndex, setDirectionIndex] = useState(0);

  if (isLoading || !group) return <Skeleton className="h-96 w-full" />;

  const route = group.routes[directionIndex] ?? group.routes[0];
  const geometry = route.route_stops.map((rs) => ({
    stop_id: rs.stop.id,
    name: rs.stop.name,
    lat: Number(rs.stop.latitude),
    lng: Number(rs.stop.longitude),
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold">{group.name}</h1>
      <p className="text-sm text-slate-500">
        {group.bus.name} · {group.bus.company.name}
      </p>

      <div className="my-4 flex gap-2">
        {group.routes.map((r, index) => (
          <button
            key={r.id}
            onClick={() => setDirectionIndex(index)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              index === directionIndex
                ? "bg-brand-600 text-white"
                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
            }`}
          >
            {r.origin_label} → {r.destination_label}
          </button>
        ))}
      </div>

      <RouteMap legs={[{ geometry, color: group.bus.color_hex }]} heightClassName="h-[28rem]" />

      <h2 className="mb-3 mt-8 text-lg font-semibold">Stops ({route.route_stops.length})</h2>
      <div className="space-y-2">
        {route.route_stops.map((rs) => (
          <Card key={rs.id} className="flex items-center justify-between py-2">
            <span className="font-medium">
              {rs.sequence}. {rs.stop.name}
            </span>
            <span className="text-xs text-slate-500">{rs.distance_from_start_km} km</span>
          </Card>
        ))}
      </div>
    </div>
  );
}
