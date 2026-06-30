import { Activity, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/features/teacher-ops/components/ui/badge";
import type { Teacher } from "@/features/teacher-ops/lib/types";
import { teacherHealthScore } from "@/features/teacher-ops/lib/data";

export function TeacherHealth({ teacher }: { teacher: Teacher }) {
  const score = teacherHealthScore(teacher);
  const tone = score >= 80 ? "success" : score >= 60 ? "warning" : "danger";
  const Icon = score >= 80 ? CheckCircle2 : AlertTriangle;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="rounded-md border border-zinc-800 bg-zinc-900 p-2 text-zinc-300">
            <Activity className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm text-zinc-500">Teacher health score</p>
            <p className="text-3xl font-semibold text-zinc-50">{score}</p>
          </div>
        </div>
        <Badge tone={tone}>
          <Icon className="mr-1 h-3.5 w-3.5" />
          {score >= 80 ? "Healthy" : score >= 60 ? "Watch" : "Needs action"}
        </Badge>
      </div>

      <div className="mt-5 h-2 rounded-full bg-zinc-900">
        <div
          className="h-2 rounded-full bg-emerald-400"
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="mt-3 text-sm text-zinc-500">
        Score reflects missed classes, unresolved issues, and progress gaps.
      </p>
    </div>
  );
}
