import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { Badge } from "@/features/teacher-ops/components/ui/badge";
import { ButtonLink } from "@/features/teacher-ops/components/ui/button";
import type { TeacherMonthlySummary } from "@/features/teacher-ops/lib/types";
import { cn, formatCurrency } from "@/features/teacher-ops/lib/utils";

function signedNumber(value: number) {
  if (value > 0) return `+${value}`;
  return String(value);
}

function TrendIcon({ trend }: { trend: TeacherMonthlySummary["trend"] }) {
  if (trend === "up") return <ArrowUpRight className="h-4 w-4" />;
  if (trend === "down") return <ArrowDownRight className="h-4 w-4" />;
  return <ArrowRight className="h-4 w-4" />;
}

export function TeacherMonthlyReport({
  summaries,
}: {
  summaries: TeacherMonthlySummary[];
}) {
  const currentTotal = summaries.reduce(
    (sum, summary) => sum + (summary.current?.activeStudents ?? 0),
    0,
  );
  const previousTotal = summaries.reduce(
    (sum, summary) => sum + (summary.previous?.activeStudents ?? 0),
    0,
  );
  const totalAssignedValue = summaries.reduce(
    (sum, summary) => sum + (summary.current?.assignedMonthlyValue ?? 0),
    0,
  );
  const maxStudents = Math.max(
    1,
    ...summaries.flatMap((summary) =>
      summary.snapshots.map((snapshot) => snapshot.activeStudents),
    ),
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-zinc-500">Current students</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-zinc-50">{currentTotal}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-zinc-500">Previous month</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-zinc-50">{previousTotal}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-zinc-500">Net change</p>
          <p
            className={cn(
              "mt-2 text-2xl font-semibold",
              currentTotal - previousTotal >= 0 ? "text-emerald-600 dark:text-emerald-200" : "text-rose-600 dark:text-rose-200",
            )}
          >
            {signedNumber(currentTotal - previousTotal)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-zinc-500">Assigned value</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-zinc-50">
            {formatCurrency(totalAssignedValue)}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1040px] border-separate border-spacing-0 text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500 dark:text-zinc-500">
              <th className="border-b border-slate-200 px-4 py-3 dark:border-zinc-800">Teacher</th>
              <th className="border-b border-slate-200 px-4 py-3 dark:border-zinc-800">Current</th>
              <th className="border-b border-slate-200 px-4 py-3 dark:border-zinc-800">Previous</th>
              <th className="border-b border-slate-200 px-4 py-3 dark:border-zinc-800">Change</th>
              <th className="border-b border-slate-200 px-4 py-3 dark:border-zinc-800">Added</th>
              <th className="border-b border-slate-200 px-4 py-3 dark:border-zinc-800">Dropped</th>
              <th className="border-b border-slate-200 px-4 py-3 dark:border-zinc-800">Assigned value</th>
              <th className="border-b border-slate-200 px-4 py-3 dark:border-zinc-800">6-month pattern</th>
              <th className="border-b border-slate-200 px-4 py-3 dark:border-zinc-800">Reason</th>
              <th className="border-b border-slate-200 px-4 py-3 dark:border-zinc-800" />
            </tr>
          </thead>
          <tbody>
            {summaries.map((summary) => (
              <tr key={summary.teacher.id} className="text-slate-700 dark:text-zinc-200">
                <td className="border-b border-slate-100 px-4 py-4 dark:border-zinc-900">
                  <p className="font-medium text-slate-950 dark:text-zinc-50">{summary.teacher.name}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">{summary.teacher.id}</p>
                </td>
                <td className="border-b border-slate-100 px-4 py-4 dark:border-zinc-900">
                  <p className="font-semibold text-slate-950 dark:text-zinc-50">
                    {summary.current?.activeStudents ?? 0}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">{summary.current?.month}</p>
                </td>
                <td className="border-b border-slate-100 px-4 py-4 dark:border-zinc-900">
                  <p>{summary.previous?.activeStudents ?? 0}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">{summary.previous?.month}</p>
                </td>
                <td className="border-b border-slate-100 px-4 py-4 dark:border-zinc-900">
                  <Badge
                    tone={
                      summary.trend === "up"
                        ? "success"
                        : summary.trend === "down"
                          ? "danger"
                          : "neutral"
                    }
                  >
                    <TrendIcon trend={summary.trend} />
                    {signedNumber(summary.studentDelta)}
                  </Badge>
                </td>
                <td className="border-b border-slate-100 px-4 py-4 text-emerald-600 dark:border-zinc-900 dark:text-emerald-200">
                  +{summary.current?.addedStudents ?? 0}
                </td>
                <td className="border-b border-slate-100 px-4 py-4 text-rose-600 dark:border-zinc-900 dark:text-rose-200">
                  -{summary.current?.droppedStudents ?? 0}
                </td>
                <td className="border-b border-slate-100 px-4 py-4 dark:border-zinc-900">
                  <p className="font-medium text-slate-950 dark:text-zinc-50">
                    {formatCurrency(summary.current?.assignedMonthlyValue ?? 0)}
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-xs",
                      summary.valueDelta >= 0 ? "text-emerald-600 dark:text-emerald-200" : "text-rose-600 dark:text-rose-200",
                    )}
                  >
                    {summary.valueDelta >= 0 ? "+" : ""}
                    {formatCurrency(summary.valueDelta)}
                  </p>
                </td>
                <td className="border-b border-slate-100 px-4 py-4 dark:border-zinc-900">
                  <div className="flex h-12 items-end gap-1.5">
                    {summary.snapshots.map((snapshot) => (
                      <div
                        key={`${summary.teacher.id}-${snapshot.month}`}
                        className="flex w-8 flex-col items-center justify-end gap-1"
                        title={`${snapshot.month}: ${snapshot.activeStudents} students`}
                      >
                        <div
                          className="w-full rounded-t bg-emerald-500/70"
                          style={{
                            height: `${Math.max(12, (snapshot.activeStudents / maxStudents) * 42)}px`,
                          }}
                        />
                        <span className="text-[10px] text-slate-500 dark:text-zinc-500">
                          {snapshot.month.slice(0, 3)}
                        </span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="max-w-xs border-b border-slate-100 px-4 py-4 text-slate-600 dark:border-zinc-900 dark:text-zinc-400">
                  {summary.current?.reason ?? "No monthly reason logged yet."}
                </td>
                <td className="border-b border-slate-100 px-4 py-4 dark:border-zinc-900">
                  <ButtonLink href={`/dashboard/admin/teacher-assign/teachers/${summary.teacher.id}`} variant="ghost">
                    Open
                  </ButtonLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
