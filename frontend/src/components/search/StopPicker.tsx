"use client";

import { useState } from "react";

import { Input } from "@/components/ui/Input";
import { useAutocomplete } from "@/lib/react-query/hooks/useAutocomplete";

export interface SelectedStop {
  id: number;
  name: string;
}

interface StopPickerProps {
  label: string;
  placeholder: string;
  onSelect: (stop: SelectedStop) => void;
  selected: SelectedStop | null;
}

export function StopPicker({ label, placeholder, onSelect, selected }: StopPickerProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const { data: suggestions } = useAutocomplete(query);
  const stopSuggestions = suggestions?.filter((s) => s.type === "stop") ?? [];

  return (
    <div className="relative">
      <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </label>
      <Input
        placeholder={placeholder}
        value={selected ? selected.name : query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
      />
      {focused && stopSuggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
          {stopSuggestions.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => {
                  onSelect({ id: s.id, name: s.label });
                  setQuery("");
                }}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
