"use client";

import { useEffect, useState } from "react";

import { getRecentSearches, type RecentSearch } from "@/lib/recentSearches";

export function RecentSearches({ onSelect }: { onSelect: (from: string, to: string) => void }) {
  const [recent, setRecent] = useState<RecentSearch[]>([]);

  useEffect(() => {
    setRecent(getRecentSearches());
  }, []);

  if (recent.length === 0) return null;

  return (
    <div className="mt-4">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
        Recent searches
      </p>
      <div className="flex flex-wrap gap-2">
        {recent.map((s) => (
          <button
            key={`${s.from}-${s.to}-${s.searchedAt}`}
            onClick={() => onSelect(s.from, s.to)}
            className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            {s.from} → {s.to}
          </button>
        ))}
      </div>
    </div>
  );
}
