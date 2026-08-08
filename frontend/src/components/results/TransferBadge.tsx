export function TransferBadge({ stopName }: { stopName: string }) {
  return (
    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
      Transfer at {stopName}
    </span>
  );
}
