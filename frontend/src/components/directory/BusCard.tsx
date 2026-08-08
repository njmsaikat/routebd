import Link from "next/link";

import { Card } from "@/components/ui/Card";
import type { Bus } from "@/lib/types";

export function BusCard({ bus }: { bus: Bus }) {
  return (
    <Link href={`/buses/${bus.slug}`}>
      <Card className="h-full hover:shadow-md">
        <div className="flex items-center gap-3">
          <span
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: bus.color_hex }}
          />
          <div>
            <p className="font-semibold">{bus.name}</p>
            <p className="text-xs text-slate-500">{bus.company.name}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span className="capitalize">{bus.bus_type}</span>
          <span>
            {bus.operating_hours_start.slice(0, 5)} – {bus.operating_hours_end.slice(0, 5)}
          </span>
        </div>
      </Card>
    </Link>
  );
}
