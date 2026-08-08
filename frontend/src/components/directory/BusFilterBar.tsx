"use client";

import { Input } from "@/components/ui/Input";

interface BusFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  busType: string;
  onBusTypeChange: (value: string) => void;
}

const BUS_TYPES = [
  { value: "", label: "All types" },
  { value: "local", label: "Local" },
  { value: "sitting", label: "Sitting" },
  { value: "ac", label: "AC" },
];

export function BusFilterBar({ search, onSearchChange, busType, onBusTypeChange }: BusFilterBarProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row">
      <Input
        placeholder="Search by bus or company name"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="sm:max-w-xs"
      />
      <select
        value={busType}
        onChange={(e) => onBusTypeChange(e.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900"
      >
        {BUS_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
    </div>
  );
}
