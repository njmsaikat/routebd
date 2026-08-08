"use client";

import { useState } from "react";

import { BusCard } from "@/components/directory/BusCard";
import { BusFilterBar } from "@/components/directory/BusFilterBar";
import { Skeleton } from "@/components/ui/Skeleton";
import { useBuses } from "@/lib/react-query/hooks/useBuses";

export default function BusDirectoryPage() {
  const [search, setSearch] = useState("");
  const [busType, setBusType] = useState("");
  const { data, isLoading } = useBuses({ search: search || undefined, bus_type: busType || undefined });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Bus Directory</h1>
      <BusFilterBar
        search={search}
        onSearchChange={setSearch}
        busType={busType}
        onBusTypeChange={setBusType}
      />
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      )}
      {data && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.results.map((bus) => (
            <BusCard key={bus.id} bus={bus} />
          ))}
        </div>
      )}
      {data && data.results.length === 0 && (
        <p className="text-sm text-slate-500">No buses match your filters.</p>
      )}
    </div>
  );
}
