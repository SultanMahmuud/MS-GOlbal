import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { Badge } from "@/features/teacher-ops/components/ui/badge";
import type { TeacherMonthlyAssignmentSnapshot } from "@/features/teacher-ops/lib/types";
import { cn } from "@/features/teacher-ops/lib/utils";

function signedNumber(value: number) {
  if (value > 0) return `+${value}`;
  return String(value);
}

export function TeacherStudentCountTrend({
  snapshots,
}: {
  snapshots: TeacherMonthlyAssignmentSnapshot[];
}) {
  const current = snapshots.at(-1);
  const previous = snapshots.at(-2);
  const studentDelta = (current?.activeStudents ?? 0) - (previous?.activeStudents ?? 0);
  const trend = studentDelta > 0 ? "up" : studentDelta < 0 ? "down" : "flat";
  const maxStudents = Math.max(1, ...snapshots.map((snapshot) => snapshot.activeStudents));
  const TrendIcon =
    trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : ArrowRight;

  if (!current) {
    return <p className="text-sm text-zinc-500">No monthly student history has been logged yet.</p>;
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Current month</p>
          <p className="mt-2 text-2xl font-semibold text-zinc-50">
            {current.activeStudents}
          </p>
          <p className="mt-1 text-xs text-zinc-500">{current.month}</p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Previous month</p>
          <p className="mt-2 text-2xl font-semibold text-zinc-50">
            {previous?.activeStudents ?? 0}
          </p>
          <p className="mt-1 text-xs text-zinc-500">{previous?.month ?? "No previous data"}</p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Student change</p>
          <Badge
            tone={trend === "up" ? "success" : trend === "down" ? "danger" : "neutral"}
            className="mt-2"
          >
            <TrendIcon className="h-4 w-4" />
            {signedNumber(studentDelta)}
          </Badge>
          <p className="mt-2 text-xs text-zinc-500">
            +{current.addedStudents} added, -{current.droppedStudents} dropped
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
        <div className="flex h-24 items-end gap-2">
          {snapshots.map((snapshot) => (
            <div
              key={snapshot.month}
              className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2"
              title={`${snapshot.month}: ${snapshot.activeStudents} students`}
            >
              <div
                className={cn(
                  "w-full max-w-12 rounded-t",
                  snapshot.month === current.month ? "bg-emerald-400" : "bg-emerald-500/35",
                )}
                style={{
                  height: `${Math.max(16, (snapshot.activeStudents / maxStudents) * 72)}px`,
                }}
              />
              <div className="text-center">
                <p className="text-xs font-medium text-zinc-100">{snapshot.activeStudents}</p>
                <p className="text-[10px] text-zinc-500">{snapshot.month.slice(0, 3)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-400">
        {current.reason}
      </p>
    </div>
  );
}
