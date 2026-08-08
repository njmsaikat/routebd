export function FareBadge({ fare }: { fare: number }) {
  return (
    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
      ৳{fare}
    </span>
  );
}
