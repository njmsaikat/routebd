import { Card } from "@/components/ui/Card";
import type { Stop } from "@/lib/types";

export function StopCard({ stop }: { stop: Stop }) {
  return (
    <Card>
      <p className="font-semibold">{stop.name}</p>
      {stop.area_name && <p className="text-xs text-slate-500">{stop.area_name} area</p>}
      {stop.landmarks_note && <p className="mt-2 text-sm text-slate-600">{stop.landmarks_note}</p>}
    </Card>
  );
}
