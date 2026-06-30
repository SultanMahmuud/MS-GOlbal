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
          <tr className="text-left text-xs uppercase tracking-wide text-zinc-500">
            <th className="border-b border-zinc-800 px-4 py-3">Student</th>
            <th className="border-b border-zinc-800 px-4 py-3">Routine</th>
            <th className="border-b border-zinc-800 px-4 py-3">Fee</th>
            <th className="border-b border-zinc-800 px-4 py-3">Current lesson</th>
            <th className="border-b border-zinc-800 px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => {
            const progressRecord = progress.find(
              (record) => record.studentId === student.id,
            );
            return (
              <tr key={student.id} className="text-zinc-200">
                <td className="border-b border-zinc-900 px-4 py-4">
                  <Link
                    href={`/admin/teachers/${student.assignedTeacherId}`}
                    className="font-medium text-zinc-50 hover:text-emerald-300"
                  >
                    {student.name}
                  </Link>
                  <p className="mt-1 text-xs text-zinc-500">
                    {student.id} - Parent: {student.parentName || "Missing"}
                  </p>
                </td>
                <td className="border-b border-zinc-900 px-4 py-4">
                  <p>{student.weeklyDays.join(", ")}</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {student.startTime} - {student.durationLabel}
                  </p>
                </td>
                <td className="border-b border-zinc-900 px-4 py-4">
                  {formatCurrency(student.monthlyFee)}
                </td>
                <td className="max-w-[340px] border-b border-zinc-900 px-4 py-4">
                  <p className="line-clamp-2 text-zinc-300">
                    {progressRecord?.currentLesson || "Progress missing"}
                  </p>
                </td>
                <td className="border-b border-zinc-900 px-4 py-4">
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
