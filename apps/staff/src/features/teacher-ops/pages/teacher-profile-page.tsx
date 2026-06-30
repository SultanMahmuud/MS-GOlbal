import { notFound } from "next/navigation";
import { CalendarDays, CircleDollarSign, ClipboardList, UsersRound } from "lucide-react";
import { Badge } from "@/features/teacher-ops/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/features/teacher-ops/components/ui/card";
import { IssueQueue } from "@/features/teacher-ops/components/issue-queue";
import { ScheduleGrid } from "@/features/teacher-ops/components/schedule-grid";
import { StudentTable } from "@/features/teacher-ops/components/student-table";
import { TeacherHealth } from "@/features/teacher-ops/components/teacher-health";
import {
  appData,
  getTeacher,
  getTeacherIssues,
  getTeacherMonthlySnapshots,
  getTeacherProgress,
  getTeacherStudents,
  teachers,
} from "@/features/teacher-ops/lib/data";
import { formatCurrency } from "@/features/teacher-ops/lib/utils";

export function TeacherOpsTeacherProfilePage({ id }: { id: string }) {
  const teacher = getTeacher(id);

  if (!teachers.some((item) => item.id === id)) {
    notFound();
  }

  const students = getTeacherStudents(teacher.id);
  const progress = getTeacherProgress(teacher.id);
  const issues = getTeacherIssues(teacher.id);
  const grossMonthly = students.reduce((sum, student) => sum + student.monthlyFee, 0);
  const monthlySnapshots = getTeacherMonthlySnapshots(teacher.id);

  return (
    <div className="min-h-[calc(100vh-2.5rem)] rounded-lg bg-zinc-950 text-zinc-100">
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm text-zinc-500">Teacher profile</p>
              <Badge tone={teacher.status === "active" ? "success" : "warning"}>
                {teacher.status.replace("_", " ")}
              </Badge>
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50">
              {teacher.name}
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              {teacher.id} - Phone {teacher.phone} - WhatsApp {teacher.whatsapp}
            </p>
          </div>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
            <UsersRound className="h-5 w-5 text-emerald-300" />
            <p className="mt-4 text-sm text-zinc-500">Students</p>
            <p className="mt-1 text-2xl font-semibold text-zinc-50">{students.length}</p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
            <CalendarDays className="h-5 w-5 text-emerald-300" />
            <p className="mt-4 text-sm text-zinc-500">Class hours</p>
            <p className="mt-1 text-2xl font-semibold text-zinc-50">
              {teacher.totalClassHours}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
            <ClipboardList className="h-5 w-5 text-emerald-300" />
            <p className="mt-4 text-sm text-zinc-500">Open issues</p>
            <p className="mt-1 text-2xl font-semibold text-zinc-50">
              {issues.filter((issue) => issue.status !== "resolved").length}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
            <CircleDollarSign className="h-5 w-5 text-emerald-300" />
            <p className="mt-4 text-sm text-zinc-500">Student billing</p>
            <p className="mt-1 text-2xl font-semibold text-zinc-50">
              {formatCurrency(grossMonthly)}
            </p>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
          <Card>
            <CardHeader title="Health and salary" eyebrow="Overview" />
            <CardContent>
              <TeacherHealth teacher={teacher} />
              <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                <p className="text-sm font-medium text-zinc-50">Salary reconciliation</p>
                <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-zinc-500">Base salary</dt>
                    <dd className="mt-1 text-zinc-100">
                      {formatCurrency(teacher.baseSalary)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500">Missed classes</dt>
                    <dd className="mt-1 text-zinc-100">{teacher.totalMissedClasses}</dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500">Last leave</dt>
                    <dd className="mt-1 text-zinc-100">{teacher.lastLeaveDate}</dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500">Last update</dt>
                    <dd className="mt-1 text-zinc-100">{teacher.lastUpdated}</dd>
                  </div>
                </dl>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Schedule" eyebrow="Booked vs free slots" />
            <CardContent>
              <ScheduleGrid
                bookings={appData.bookings.filter(
                  (booking) => booking.teacherId === teacher.id,
                )}
              />
            </CardContent>
          </Card>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader title="Students and progress" eyebrow="Syllabus" />
            <CardContent className="p-0">
              <StudentTable students={students} progress={progress} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader title="Issues" eyebrow="Complaints and rule logs" />
            <CardContent>
              <IssueQueue issues={issues} />
            </CardContent>
          </Card>
        </section>

        <section className="mt-6">
          <Card>
            <CardHeader title="Monthly assignment history" eyebrow="Admin-only financial view" />
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-separate border-spacing-0 text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-zinc-500">
                      <th className="border-b border-zinc-800 px-4 py-3">Month</th>
                      <th className="border-b border-zinc-800 px-4 py-3">Active students</th>
                      <th className="border-b border-zinc-800 px-4 py-3">Assigned value</th>
                      <th className="border-b border-zinc-800 px-4 py-3">Added</th>
                      <th className="border-b border-zinc-800 px-4 py-3">Dropped</th>
                      <th className="border-b border-zinc-800 px-4 py-3">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlySnapshots.map((snapshot) => (
                      <tr key={snapshot.month} className="text-zinc-200">
                        <td className="border-b border-zinc-900 px-4 py-4">{snapshot.month}</td>
                        <td className="border-b border-zinc-900 px-4 py-4">
                          {snapshot.activeStudents}
                        </td>
                        <td className="border-b border-zinc-900 px-4 py-4">
                          {formatCurrency(snapshot.assignedMonthlyValue)}
                        </td>
                        <td className="border-b border-zinc-900 px-4 py-4 text-emerald-200">
                          +{snapshot.addedStudents}
                        </td>
                        <td className="border-b border-zinc-900 px-4 py-4 text-rose-200">
                          -{snapshot.droppedStudents}
                        </td>
                        <td className="border-b border-zinc-900 px-4 py-4 text-zinc-400">
                          {snapshot.reason}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
