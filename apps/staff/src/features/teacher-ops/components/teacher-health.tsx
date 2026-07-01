import { Activity, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/features/teacher-ops/components/ui/badge";
import type { Teacher } from "@/features/teacher-ops/lib/types";
import { teacherHealthBreakdown } from "@/features/teacher-ops/lib/data";

const scoreRows = [
  ["Class reliability", "classReliability", 30],
  ["Attendance update", "attendanceUpdate", 20],
  ["Progress discipline", "progressDiscipline", 15],
  ["Weekly feedback", "weeklyFeedback", 15],
  ["Complaint quality", "complaintQuality", 20],
] as const;

export function TeacherHealth({ teacher }: { teacher: Teacher }) {
  const breakdown = teacherHealthBreakdown(teacher);
  const score = breakdown.score;
  const tone = score >= 80 ? "success" : score >= 60 ? "warning" : "danger";
  const Icon = score >= 80 ? CheckCircle2 : AlertTriangle;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="rounded-md border border-slate-200 bg-slate-50 p-2 text-slate-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
            <Activity className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm text-slate-500 dark:text-zinc-400">Teacher health score</p>
            <p className="text-3xl font-semibold text-slate-950 dark:text-zinc-50">{score}</p>
          </div>
        </div>
        <Badge tone={tone}>
          <Icon className="mr-1 h-3.5 w-3.5" />
          {score >= 80 ? "Healthy" : score >= 60 ? "Watch" : "Needs action"}
        </Badge>
      </div>

      <div className="mt-5 h-2 rounded-full bg-slate-100 dark:bg-zinc-900">
        <div
          className="h-2 rounded-full bg-emerald-400"
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="mt-3 text-sm text-slate-500 dark:text-zinc-400">
        Score uses class reliability, attendance update timing, curriculum progress,
        weekly feedback, and complaint quality.
      </p>

      <div className="mt-4 grid gap-2">
        {scoreRows.map(([label, key, max]) => (
          <div key={key} className="rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/70">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="font-medium text-slate-700 dark:text-zinc-200">{label}</span>
              <span className="text-slate-500 dark:text-zinc-400">
                {breakdown[key]}/{max}
              </span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-white dark:bg-zinc-950">
              <div
                className="h-1.5 rounded-full bg-emerald-400"
                style={{ width: `${Math.min(100, (breakdown[key] / max) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
