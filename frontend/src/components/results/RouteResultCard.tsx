import { Card } from "@/components/ui/Card";
import type { DirectJourneyResult, TransferJourneyResult } from "@/lib/types";

import { FareBadge } from "./FareBadge";
import { TransferBadge } from "./TransferBadge";

interface RouteResultCardProps {
  result: DirectJourneyResult | TransferJourneyResult;
  selected: boolean;
  onSelect: () => void;
}

function isTransfer(
  result: DirectJourneyResult | TransferJourneyResult
): result is TransferJourneyResult {
  return "leg1" in result;
}

export function RouteResultCard({ result, selected, onSelect }: RouteResultCardProps) {
  const transfer = isTransfer(result);

  const fare = transfer ? result.total_fare : result.fare;
  const duration = transfer ? result.total_duration_min : result.duration_min;
  const distance = transfer ? result.total_distance_km : result.distance_km;
  const stopsCount = transfer ? result.leg1.stops_count + result.leg2.stops_count : result.stops_count;

  return (
    <button type="button" onClick={onSelect} className="block w-full text-left">
      <Card
        className={`transition-shadow ${selected ? "ring-2 ring-brand-500" : "hover:shadow-md"}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            {transfer ? (
              <div className="flex items-center gap-2 text-sm font-semibold">
                <span style={{ color: result.leg1.color_hex }}>{result.leg1.bus_name}</span>
                <span className="text-slate-400">→</span>
                <span style={{ color: result.leg2.color_hex }}>{result.leg2.bus_name}</span>
              </div>
            ) : (
              <div className="text-sm font-semibold" style={{ color: result.color_hex }}>
                {result.bus_name}
                <span className="ml-2 text-xs font-normal text-slate-500">{result.company_name}</span>
              </div>
            )}
            <p className="mt-1 text-xs text-slate-500">
              {stopsCount} stops · {distance} km · ~{Math.round(duration)} min
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <FareBadge fare={fare} />
            {transfer && <TransferBadge stopName={result.transfer_stop_name} />}
          </div>
        </div>
      </Card>
    </button>
  );
}
