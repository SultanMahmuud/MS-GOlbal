import Link from "next/link";
import { Badge } from "@/features/teacher-ops/components/ui/badge";
import type { ProgressRecord, Student } from "@/features/teacher-ops/lib/types";
import { formatCurrency } from "@/features/teacher-ops/lib/utils";

export function StudentTable({
  students,
  progress,
}: {
  students: Student[];
  progress: ProgressRecord[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[920px] border-separate border-spacing-0 text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-slate-500 dark:text-zinc-400">
            <th className="border-b border-slate-200 px-4 py-3 dark:border-zinc-800">Student</th>
            <th className="border-b border-slate-200 px-4 py-3 dark:border-zinc-800">Routine</th>
            <th className="border-b border-slate-200 px-4 py-3 dark:border-zinc-800">Fee</th>
            <th className="border-b border-slate-200 px-4 py-3 dark:border-zinc-800">Current lesson</th>
            <th className="border-b border-slate-200 px-4 py-3 dark:border-zinc-800">Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => {
            const progressRecord = progress.find(
              (record) => record.studentId === student.id,
            );
            return (
              <tr key={student.id} className="text-slate-700 dark:text-zinc-200">
                <td className="border-b border-slate-100 px-4 py-4 dark:border-zinc-900">
                  <Link
                    href={`/dashboard/admin/teacher-assign/teachers/${student.assignedTeacherId}`}
                    className="font-medium text-slate-950 hover:text-emerald-600 dark:text-zinc-50 dark:hover:text-emerald-300"
                  >
                    {student.name}
                  </Link>
                  <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">
                    {student.id} - Parent: {student.parentName || "Missing"}
                  </p>
                </td>
                <td className="border-b border-slate-100 px-4 py-4 dark:border-zinc-900">
                  <p>{student.weeklyDays.join(", ")}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">
                    {student.startTime} - {student.durationLabel}
                  </p>
                </td>
                <td className="border-b border-slate-100 px-4 py-4 dark:border-zinc-900">
                  {formatCurrency(student.monthlyFee)}
                </td>
                <td className="max-w-[340px] border-b border-slate-100 px-4 py-4 dark:border-zinc-900">
                  <p className="line-clamp-2 text-slate-600 dark:text-zinc-300">
                    {progressRecord?.currentLesson || "Progress missing"}
                  </p>
                </td>
                <td className="border-b border-slate-100 px-4 py-4 dark:border-zinc-900">
                  <Badge
                    tone={
                      student.status === "active"
                        ? "success"
                        : student.status === "at_risk"
                          ? "warning"
                          : "neutral"
                    }
                  >
                    {student.status.replace("_", " ")}
                  </Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
