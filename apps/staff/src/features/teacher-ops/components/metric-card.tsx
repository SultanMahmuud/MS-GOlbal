import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Badge } from "@/features/teacher-ops/components/ui/badge";
import { cn } from "@/features/teacher-ops/lib/utils";

export function MetricCard({
  label,
  value,
  detail,
  trend,
  icon,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  detail: string;
  trend?: "up" | "down" | "flat";
  icon: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger";
}) {
  const TrendIcon = trend === "down" ? ArrowDownRight : ArrowUpRight;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-md border border-slate-200 bg-slate-50 p-2 text-slate-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
          {icon}
        </div>
        {trend && trend !== "flat" ? (
          <Badge tone={trend === "up" ? "success" : "warning"}>
            <TrendIcon className="mr-1 h-3 w-3" />
            {trend}
          </Badge>
        ) : null}
      </div>
      <p className="mt-5 text-sm text-slate-500 dark:text-zinc-400">{label}</p>
      <p
        className={cn(
          "mt-1 text-3xl font-semibold tracking-tight",
          tone === "danger" && "text-rose-600 dark:text-rose-200",
          tone === "warning" && "text-amber-600 dark:text-amber-200",
          tone === "success" && "text-emerald-600 dark:text-emerald-200",
          tone === "neutral" && "text-slate-950 dark:text-zinc-50",
        )}
      >
        {value}
      </p>
      <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">{detail}</p>
    </section>
  );
}
