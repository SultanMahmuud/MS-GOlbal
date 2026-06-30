import {
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
import { ScheduleGrid } from "@/features/teacher-ops/components/schedule-grid";
import { StudentTable } from "@/features/teacher-ops/components/student-table";
import { StudentTrendChart } from "@/features/teacher-ops/components/student-trend-chart";
import { TeacherHealth } from "@/features/teacher-ops/components/teacher-health";
import { TeacherMonthlyReport } from "@/features/teacher-ops/components/teacher-monthly-report";
import {
  appData,
  attentionItems,
  getTeacherIssues,
  getTeacherMonthlySummaries,
  getTeacherProgress,
  getTeacherStudents,
} from "@/features/teacher-ops/lib/data";
import { formatCurrency, formatNumber, minutesToHours } from "@/features/teacher-ops/lib/utils";

export function TeacherOpsAdminDashboard() {
  const { teacher, bookings, monthlyTrend, sessions } = appData;
  const teacherStudents = getTeacherStudents(teacher.id);
  const teacherProgress = getTeacherProgress(teacher.id);
  const teacherMonthlySummaries = getTeacherMonthlySummaries();
  const openAttention = attentionItems().filter((issue) => issue.status !== "resolved");
  const monthlyRevenue = teacherStudents.reduce(
    (sum, student) => sum + student.monthlyFee,
    0,
  );
  const completedMinutes = sessions
    .filter((session) => session.status === "completed")
    .reduce((sum, session) => sum + session.durationMinutes, 0);

  return (
    <div className="min-h-[calc(100vh-2.5rem)] rounded-lg bg-zinc-950 text-zinc-100">
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm text-zinc-500">Admin overview</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50">
              Teacher operations dashboard
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-zinc-400">
              Track teacher health, student routines, schedule occupancy, progress
              gaps, and parent complaints from one admin screen.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/dashboard/admin/teacher-ops/import">
              <CalendarClock className="h-4 w-4" />
              Import sheet
            </ButtonLink>
            <ButtonLink href="/dashboard/admin/teacher-ops/teachers/TID2511" variant="primary">
              <GraduationCap className="h-4 w-4" />
              Open profile
            </ButtonLink>
          </div>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Needs attention"
            value={openAttention.length}
            detail="Open issues, missed classes, progress gaps"
            trend="down"
            tone="warning"
            icon={<AlertTriangle className="h-5 w-5" />}
          />
          <MetricCard
            label="Active students"
            value={formatNumber(teacherStudents.length)}
            detail={`${monthlyTrend.at(-1)?.count ?? teacherStudents.length} target in next month`}
            trend="up"
            tone="success"
            icon={<UsersRound className="h-5 w-5" />}
          />
          <MetricCard
            label="Class hours"
            value={teacher.totalClassHours}
            detail={`${minutesToHours(completedMinutes)}h completed in visible sessions`}
            trend="flat"
            icon={<Clock3 className="h-5 w-5" />}
          />
          <MetricCard
            label="Monthly billing"
            value={formatCurrency(monthlyRevenue)}
            detail="From active students in this teacher profile"
            trend="up"
            icon={<MessageSquareWarning className="h-5 w-5" />}
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
                initialBookings={appData.bookings}
              />
            </CardContent>
          </Card>
        </section>

        <section className="mt-6">
          <Card>
            <CardHeader
              title="Teacher growth and drop report"
              eyebrow="Monthly student-count variation"
            />
            <CardContent>
              <TeacherMonthlyReport summaries={teacherMonthlySummaries} />
            </CardContent>
          </Card>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <Card>
            <CardHeader title="Attention queue" eyebrow="Admin should start here" />
            <CardContent>
              <IssueQueue issues={openAttention.slice(0, 5)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Student trend" eyebrow="Last 7 months" />
            <CardContent>
              <StudentTrendChart data={monthlyTrend} />
              <div className="mt-4 space-y-2">
                {monthlyTrend.slice(-3).map((month) => (
                  <p key={month.month} className="text-sm text-zinc-500">
                    <span className="font-medium text-zinc-300">{month.month}:</span>{" "}
                    {month.reason}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[0.65fr_1.35fr]">
          <Card>
            <CardHeader title={teacher.name} eyebrow="Teacher health" />
            <CardContent>
              <TeacherHealth teacher={teacher} />
              <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-zinc-500">Teacher ID</dt>
                  <dd className="mt-1 font-medium text-zinc-50">{teacher.id}</dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Missed classes</dt>
                  <dd className="mt-1 font-medium text-zinc-50">
                    {teacher.totalMissedClasses}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Last leave</dt>
                  <dd className="mt-1 font-medium text-zinc-50">{teacher.lastLeaveDate}</dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Open issues</dt>
                  <dd className="mt-1 font-medium text-zinc-50">
                    {getTeacherIssues(teacher.id).filter((issue) => issue.status !== "resolved").length}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Weekly schedule grid" eyebrow="Imported 10-minute slots" />
            <CardContent>
              <ScheduleGrid bookings={bookings} />
            </CardContent>
          </Card>
        </section>

        <section className="mt-6">
          <Card>
            <CardHeader title="Students and syllabus position" eyebrow="Roster" />
            <CardContent className="p-0">
              <StudentTable students={teacherStudents} progress={teacherProgress} />
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
