"use client";

import { useState } from "react";

import { FareBadge } from "@/components/results/FareBadge";
import { SelectedStop, StopPicker } from "@/components/search/StopPicker";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useFareCalculator } from "@/lib/react-query/hooks/useFareCalculator";

export default function FareCalculatorPage() {
  const [from, setFrom] = useState<SelectedStop | null>(null);
  const [to, setTo] = useState<SelectedStop | null>(null);
  const { data, isFetching } = useFareCalculator(from?.id ?? null, to?.id ?? null);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Fare Calculator</h1>
      <p className="mb-6 text-slate-500">Pick a start and destination stop to estimate the fare.</p>

      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <StopPicker label="Start stop" placeholder="e.g. Banani" selected={from} onSelect={setFrom} />
          <StopPicker
            label="Destination stop"
            placeholder="e.g. Motijheel"
            selected={to}
            onSelect={setTo}
          />
        </div>
      </Card>

      {isFetching && <Skeleton className="mt-6 h-16 w-full" />}

      {data && !isFetching && (
        <Card className="mt-6">
          {data.cheapest_fare === null ? (
            <p className="text-sm text-slate-500">
              No direct or single-transfer bus connects these two stops in the current dataset.
            </p>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  {data.direct ? "Direct route" : "Requires one transfer"} · {data.options.length}{" "}
                  option(s)
                </p>
                <p className="text-lg font-semibold">Estimated fare</p>
              </div>
              <FareBadge fare={data.cheapest_fare} />
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
