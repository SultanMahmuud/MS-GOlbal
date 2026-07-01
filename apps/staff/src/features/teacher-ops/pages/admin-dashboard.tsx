import {
  Activity,
  AlertTriangle,
  CalendarClock,
  Clock3,
  GraduationCap,
  MessageSquareWarning,
  UsersRound,
} from "lucide-react";
import { AdminAssignmentStudio } from "@/features/teacher-ops/components/admin-assignment-studio";
import { Card, CardContent, CardHeader } from "@/features/teacher-ops/components/ui/card";
import { ButtonLink } from "@/features/teacher-ops/components/ui/button";
import { IssueQueue } from "@/features/teacher-ops/components/issue-queue";
import { MetricCard } from "@/features/teacher-ops/components/metric-card";
import { StudentTrendChart } from "@/features/teacher-ops/components/student-trend-chart";
import { TeacherMonthlyReport } from "@/features/teacher-ops/components/teacher-monthly-report";
import {
  appData,
  attentionItems,
  averageTeacherHealthScore,
  getAllTeacherStudentTrend,
  getAllTeacherStudents,
  getTeacherIssues,
  getTeacherMonthlySummaries,
  teacherHealthBreakdown,
} from "@/features/teacher-ops/lib/data";
import { cn, formatCurrency, formatNumber, minutesToHours } from "@/features/teacher-ops/lib/utils";

export function TeacherOpsAdminDashboard() {
  const { teachers, students, sessions } = appData;
  const allTeacherStudents = getAllTeacherStudents();
  const teacherMonthlySummaries = getTeacherMonthlySummaries();
  const openAttention = attentionItems().filter((issue) => issue.status !== "resolved");
  const monthlyRevenue = allTeacherStudents.reduce(
    (sum, student) => sum + student.monthlyFee,
    0,
  );
  const totalClassHours = teachers.reduce(
    (sum, teacher) => sum + Number(teacher.totalClassHours || 0),
    0,
  );
  const completedMinutes = sessions
    .filter((session) => session.status === "completed")
    .reduce((sum, session) => sum + session.durationMinutes, 0);
  const healthAverage = averageTeacherHealthScore();
  const allTeacherTrend = getAllTeacherStudentTrend();

  return (
    <div className="min-h-[calc(100vh-2.5rem)] rounded-lg bg-slate-50 text-slate-950 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              Admin overview
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">
              Teacher operations dashboard
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-zinc-400">
              Track all teacher health, billing, active students, progress gaps,
              complaints, and student-count movement from one admin screen.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/dashboard/admin/teacher-assign/import">
              <CalendarClock className="h-4 w-4" />
              Import sheet
            </ButtonLink>
            <ButtonLink href="/dashboard/admin/teacher-assign/teachers" variant="primary">
              <GraduationCap className="h-4 w-4" />
              Open teacher profile
            </ButtonLink>
          </div>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <MetricCard
            label="Needs attention"
            value={openAttention.length}
            detail="Open issues across all teachers"
            trend="down"
            tone="warning"
            icon={<AlertTriangle className="h-5 w-5" />}
          />
          <MetricCard
            label="Active students"
            value={formatNumber(allTeacherStudents.length)}
            detail={`${formatNumber(students.length)} total student records`}
            trend="up"
            tone="success"
            icon={<UsersRound className="h-5 w-5" />}
          />
          <MetricCard
            label="Class hours"
            value={totalClassHours.toFixed(1)}
            detail={`${minutesToHours(completedMinutes)}h completed in imported sessions`}
            trend="flat"
            icon={<Clock3 className="h-5 w-5" />}
          />
          <MetricCard
            label="Monthly billing"
            value={formatCurrency(monthlyRevenue)}
            detail="All active teacher assignments"
            trend="up"
            icon={<MessageSquareWarning className="h-5 w-5" />}
          />
          <MetricCard
            label="Avg teacher health"
            value={`${healthAverage}/100`}
            detail={`${teachers.length} teachers included`}
            tone={healthAverage >= 80 ? "success" : healthAverage >= 60 ? "warning" : "danger"}
            icon={<Activity className="h-5 w-5" />}
          />
        </section>

        <section className="mt-6">
          <Card>
            <CardHeader title="Assign student and auto-book schedule" eyebrow="Admin workflow" />
            <CardContent>
              <AdminAssignmentStudio
                teachers={appData.teachers}
                students={appData.students}
                courses={appData.courses}
                plans={appData.studentCoursePlans}
                initialBookings={appData.bookings}
              />
            </CardContent>
          </Card>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <CardHeader
              title="Teacher growth and drop report"
              eyebrow="All-teacher monthly student-count variation"
            />
            <CardContent>
              <TeacherMonthlyReport summaries={teacherMonthlySummaries} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Teacher health summary" eyebrow="Average and individual score" />
            <CardContent>
              <div className="space-y-3">
                {teachers.map((teacher) => {
                  const breakdown = teacherHealthBreakdown(teacher);
                  return (
                    <ButtonLink
                      key={teacher.id}
                      href={`/dashboard/admin/teacher-assign/teachers/${teacher.id}`}
                      variant="ghost"
                      className="h-auto w-full justify-start rounded-lg border-slate-200 bg-slate-50 p-4 text-left hover:bg-slate-100 dark:border-zinc-800 dark:bg-zinc-900/70 dark:hover:bg-zinc-900"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="truncate text-sm font-semibold text-slate-950 dark:text-zinc-50">
                            {teacher.name}
                          </p>
                          <span
                            className={cn(
                              "rounded-full px-2 py-1 text-xs font-semibold",
                              breakdown.score >= 80 &&
                                "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200",
                              breakdown.score >= 60 &&
                                breakdown.score < 80 &&
                                "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-200",
                              breakdown.score < 60 &&
                                "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-200",
                            )}
                          >
                            {breakdown.score}/100
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                          {getTeacherIssues(teacher.id).filter((issue) => issue.status !== "resolved").length} open issues,
                          {" "}
                          {teacher.activeStudents} active students
                        </p>
                      </div>
                    </ButtonLink>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <Card>
            <CardHeader title="Attention queue" eyebrow="Admin should start here" />
            <CardContent>
              <IssueQueue issues={openAttention.slice(0, 8)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Student trend" eyebrow="All teachers, last months" />
            <CardContent>
              <StudentTrendChart data={allTeacherTrend} />
              <div className="mt-4 space-y-2">
                {allTeacherTrend.slice(-3).map((month) => (
                  <p key={month.month} className="text-sm text-slate-500 dark:text-zinc-400">
                    <span className="font-medium text-slate-700 dark:text-zinc-300">
                      {month.month}:
                    </span>{" "}
                    {month.reason}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
