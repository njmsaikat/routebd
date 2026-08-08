"use client";

import { useState } from "react";

import { AutocompleteInput } from "@/components/search/AutocompleteInput";
import { RecentSearches } from "@/components/search/RecentSearches";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface SearchFormProps {
  onSearch: (from: string, to: string) => void;
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (from.trim() && to.trim()) onSearch(from.trim(), to.trim());
  }

  function handleRecentSelect(recentFrom: string, recentTo: string) {
    setFrom(recentFrom);
    setTo(recentTo);
    onSearch(recentFrom, recentTo);
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <AutocompleteInput label="From" placeholder="e.g. Banani" value={from} onChange={setFrom} />
        <AutocompleteInput label="To" placeholder="e.g. Motijheel" value={to} onChange={setTo} />
        <Button type="submit">Find buses</Button>
      </form>
      <RecentSearches onSelect={handleRecentSelect} />
    </Card>
  );
}
