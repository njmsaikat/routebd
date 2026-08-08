"use client";

import { useState } from "react";

import { JourneyResults } from "@/components/results/JourneyResults";
import { SearchForm } from "@/components/search/SearchForm";
import { Skeleton } from "@/components/ui/Skeleton";
import { addRecentSearch } from "@/lib/recentSearches";
import { useJourneySearch } from "@/lib/react-query/hooks/useJourneySearch";

export default function HomePage() {
  const [query, setQuery] = useState<{ from: string; to: string } | null>(null);
  const { data, isFetching, isError } = useJourneySearch(
    query?.from ?? "",
    query?.to ?? "",
    !!query
  );

  function handleSearch(from: string, to: string) {
    setQuery({ from, to });
    addRecentSearch(from, to);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          How do I get from <span className="text-brand-600">A</span> to{" "}
          <span className="text-brand-600">B</span>?
        </h1>
        <p className="mt-2 text-slate-500">
          Search real Dhaka bus routes for direct and single-transfer journeys with fare and time
          estimates.
        </p>
      </div>

      <SearchForm onSearch={handleSearch} />

      {isFetching && (
        <div className="mt-6 grid gap-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      )}

      {isError && (
        <p className="mt-6 text-sm text-red-500">
          Something went wrong reaching the API. Is the backend running?
        </p>
      )}

      {data && !isFetching && <JourneyResults data={data} />}
    </div>
  );
}
