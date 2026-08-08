import { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/60 bg-white/70 p-4 shadow-sm backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/60 ${className}`}
      {...props}
    />
  );
}
