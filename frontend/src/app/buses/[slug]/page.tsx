"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useBus } from "@/lib/react-query/hooks/useBuses";
import { useRoutes } from "@/lib/react-query/hooks/useRoutes";

export default function BusDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: bus, isLoading } = useBus(slug);
  const { data: routes } = useRoutes({ bus: bus?.id }, !!bus?.id);

  if (isLoading || !bus) return <Skeleton className="h-40 w-full" />;

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <span className="h-4 w-4 rounded-full" style={{ backgroundColor: bus.color_hex }} />
        <div>
          <h1 className="text-2xl font-bold">{bus.name}</h1>
          <p className="text-sm text-slate-500">{bus.company.name}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs uppercase text-slate-500">Type</p>
          <p className="mt-1 font-semibold capitalize">{bus.bus_type}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase text-slate-500">Operating hours</p>
          <p className="mt-1 font-semibold">
            {bus.operating_hours_start.slice(0, 5)} – {bus.operating_hours_end.slice(0, 5)}
          </p>
        </Card>
        <Card>
          <p className="text-xs uppercase text-slate-500">Company phone</p>
          <p className="mt-1 font-semibold">{bus.company.phone || "—"}</p>
        </Card>
      </div>

      <h2 className="mb-3 mt-8 text-lg font-semibold">Routes</h2>
      <div className="grid gap-3">
        {routes?.results.map((group) => (
          <Link key={group.id} href={`/routes/${group.slug}`}>
            <Card className="hover:shadow-md">
              <p className="font-medium">{group.name}</p>
              <p className="text-xs text-slate-500">
                {group.routes.map((r) => `${r.origin_label} → ${r.destination_label}`).join(" · ")}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
