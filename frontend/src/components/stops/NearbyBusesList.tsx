import Link from "next/link";

import { Card } from "@/components/ui/Card";
import type { RouteGroup } from "@/lib/types";

export function NearbyBusesList({ routeGroups }: { routeGroups: RouteGroup[] }) {
  if (routeGroups.length === 0) {
    return <p className="text-sm text-slate-500">No buses currently pass through this stop.</p>;
  }

  return (
    <div className="grid gap-3">
      {routeGroups.map((group) => (
        <Link key={group.id} href={`/routes/${group.slug}`}>
          <Card className="flex items-center justify-between hover:shadow-md">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: group.bus.color_hex }} />
              <span className="font-medium">{group.bus.name}</span>
            </div>
            <span className="text-xs text-slate-500">{group.name}</span>
          </Card>
        </Link>
      ))}
    </div>
  );
}
