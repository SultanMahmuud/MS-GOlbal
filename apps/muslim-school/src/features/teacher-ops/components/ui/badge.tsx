import type { ReactNode } from "react";
import { cn } from "@/features/teacher-ops/lib/utils";

type BadgeTone = "neutral" | "success" | "warning" | "danger" | "info";

const toneClass: Record<BadgeTone, string> = {
  neutral:
    "border-slate-200 bg-slate-100 text-slate-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300",
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-200",
  warning:
    "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200",
  danger:
    "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-700 dark:bg-rose-950 dark:text-rose-200",
  info:
    "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-700 dark:bg-sky-950 dark:text-sky-200",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
