"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

import { Skeleton } from "@/components/ui/Skeleton";
import type { DirectJourneyResult, JourneySearchResponse, TransferJourneyResult } from "@/lib/types";

import { RouteResultCard } from "./RouteResultCard";

const RouteMap = dynamic(() => import("@/components/map/RouteMap").then((m) => m.RouteMap), {
  ssr: false,
  loading: () => <Skeleton className="h-96 w-full" />,
});

interface JourneyResultsProps {
  data: JourneySearchResponse;
}

function isTransfer(
  result: DirectJourneyResult | TransferJourneyResult
): result is TransferJourneyResult {
  return "leg1" in result;
}

export function JourneyResults({ data }: JourneyResultsProps) {
  const allResults = useMemo<(DirectJourneyResult | TransferJourneyResult)[]>(
    () => [...data.direct, ...data.transfers],
    [data]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!data.resolved) {
    return (
      <p className="mt-6 text-sm text-slate-500">
        {data.message ?? "Could not resolve one of the locations. Try a nearby stop or area name."}
      </p>
    );
  }

  if (allResults.length === 0) {
    return (
      <p className="mt-6 text-sm text-slate-500">
        No direct or single-transfer bus route found between these two points in the current
        dataset.
      </p>
    );
  }

  const selected = allResults[selectedIndex];
  const legs = isTransfer(selected)
    ? [
        { geometry: selected.leg1.geometry, color: selected.leg1.color_hex },
        { geometry: selected.leg2.geometry, color: selected.leg2.color_hex },
      ]
    : [{ geometry: selected.geometry, color: selected.color_hex }];

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      <div className="space-y-3">
        {data.direct.length > 0 && (
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Direct buses ({data.direct.length})
          </p>
        )}
        {allResults.map((result, index) => (
          <RouteResultCard
            key={index}
            result={result}
            selected={index === selectedIndex}
            onSelect={() => setSelectedIndex(index)}
          />
        ))}
      </div>
      <RouteMap legs={legs} />
    </div>
  );
}
