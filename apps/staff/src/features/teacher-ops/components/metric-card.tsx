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
    <section className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-md border border-zinc-800 bg-zinc-900 p-2 text-zinc-300">
          {icon}
        </div>
        {trend && trend !== "flat" ? (
          <Badge tone={trend === "up" ? "success" : "warning"}>
            <TrendIcon className="mr-1 h-3 w-3" />
            {trend}
          </Badge>
        ) : null}
      </div>
      <p className="mt-5 text-sm text-zinc-500">{label}</p>
      <p
        className={cn(
          "mt-1 text-3xl font-semibold tracking-tight",
          tone === "danger" && "text-rose-200",
          tone === "warning" && "text-amber-200",
          tone === "success" && "text-emerald-200",
          tone === "neutral" && "text-zinc-50",
        )}
      >
        {value}
      </p>
      <p className="mt-2 text-sm text-zinc-500">{detail}</p>
    </section>
  );
}
