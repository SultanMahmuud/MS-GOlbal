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
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Current students</p>
          <p className="mt-2 text-2xl font-semibold text-zinc-50">{currentTotal}</p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Previous month</p>
          <p className="mt-2 text-2xl font-semibold text-zinc-50">{previousTotal}</p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Net change</p>
          <p
            className={cn(
              "mt-2 text-2xl font-semibold",
              currentTotal - previousTotal >= 0 ? "text-emerald-200" : "text-rose-200",
            )}
          >
            {signedNumber(currentTotal - previousTotal)}
          </p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Assigned value</p>
          <p className="mt-2 text-2xl font-semibold text-zinc-50">
            {formatCurrency(totalAssignedValue)}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1040px] border-separate border-spacing-0 text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-zinc-500">
              <th className="border-b border-zinc-800 px-4 py-3">Teacher</th>
              <th className="border-b border-zinc-800 px-4 py-3">Current</th>
              <th className="border-b border-zinc-800 px-4 py-3">Previous</th>
              <th className="border-b border-zinc-800 px-4 py-3">Change</th>
              <th className="border-b border-zinc-800 px-4 py-3">Added</th>
              <th className="border-b border-zinc-800 px-4 py-3">Dropped</th>
              <th className="border-b border-zinc-800 px-4 py-3">Assigned value</th>
              <th className="border-b border-zinc-800 px-4 py-3">6-month pattern</th>
              <th className="border-b border-zinc-800 px-4 py-3">Reason</th>
              <th className="border-b border-zinc-800 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {summaries.map((summary) => (
              <tr key={summary.teacher.id} className="text-zinc-200">
                <td className="border-b border-zinc-900 px-4 py-4">
                  <p className="font-medium text-zinc-50">{summary.teacher.name}</p>
                  <p className="mt-1 text-xs text-zinc-500">{summary.teacher.id}</p>
                </td>
                <td className="border-b border-zinc-900 px-4 py-4">
                  <p className="font-semibold text-zinc-50">
                    {summary.current?.activeStudents ?? 0}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">{summary.current?.month}</p>
                </td>
                <td className="border-b border-zinc-900 px-4 py-4">
                  <p>{summary.previous?.activeStudents ?? 0}</p>
                  <p className="mt-1 text-xs text-zinc-500">{summary.previous?.month}</p>
                </td>
                <td className="border-b border-zinc-900 px-4 py-4">
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
                <td className="border-b border-zinc-900 px-4 py-4 text-emerald-200">
                  +{summary.current?.addedStudents ?? 0}
                </td>
                <td className="border-b border-zinc-900 px-4 py-4 text-rose-200">
                  -{summary.current?.droppedStudents ?? 0}
                </td>
                <td className="border-b border-zinc-900 px-4 py-4">
                  <p className="font-medium text-zinc-50">
                    {formatCurrency(summary.current?.assignedMonthlyValue ?? 0)}
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-xs",
                      summary.valueDelta >= 0 ? "text-emerald-200" : "text-rose-200",
                    )}
                  >
                    {summary.valueDelta >= 0 ? "+" : ""}
                    {formatCurrency(summary.valueDelta)}
                  </p>
                </td>
                <td className="border-b border-zinc-900 px-4 py-4">
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
                        <span className="text-[10px] text-zinc-500">
                          {snapshot.month.slice(0, 3)}
                        </span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="max-w-xs border-b border-zinc-900 px-4 py-4 text-zinc-400">
                  {summary.current?.reason ?? "No monthly reason logged yet."}
                </td>
                <td className="border-b border-zinc-900 px-4 py-4">
                  <ButtonLink href={`/admin/teachers/${summary.teacher.id}`} variant="ghost">
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
