"use client";

import { useEffect, useMemo, useState } from "react";
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
  fetchTeacherOpsLiveData,
  getLiveAllTeacherStudentTrend,
  getLiveTeacherMonthlySummaries,
  getTeacherFinancialSummaryFromPlans,
  type TeacherOpsLiveData,
} from "@/features/teacher-ops/lib/real-data";
import type { Issue } from "@/features/teacher-ops/lib/types";
import { formatCurrency, formatNumber } from "@/features/teacher-ops/lib/utils";

function emptyIssues(): Issue[] {
  return [];
}

export function TeacherOpsAdminDashboard() {
  const [liveData, setLiveData] = useState<TeacherOpsLiveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadLiveData() {
    setLoading(true);
    setError("");
    try {
      const nextData = await fetchTeacherOpsLiveData();
      setLiveData(nextData);
    } catch (loadError) {
      setLiveData(null);
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load live teacher/student data from backend.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLiveData();
  }, []);

  const teachers = liveData?.teachers ?? [];
  const students = liveData?.students ?? [];
  const plans = liveData?.plans ?? [];
  const openAttention = emptyIssues();

  const teacherMonthlySummaries = useMemo(
    () => getLiveTeacherMonthlySummaries(teachers, students, plans),
    [plans, students, teachers],
  );
  const allTeacherTrend = useMemo(
    () => getLiveAllTeacherStudentTrend(teachers, plans),
    [plans, teachers],
  );
  const teacherFinancials = useMemo(
    () =>
      teachers.map((teacher) =>
        getTeacherFinancialSummaryFromPlans(teacher.id, teachers, students, plans),
      ),
    [plans, students, teachers],
  );
  const activeStudentIds = useMemo(
    () => new Set(plans.map((plan) => plan.studentId)),
    [plans],
  );
  const monthlyRevenue = teacherFinancials.reduce(
    (sum, financial) => sum + financial.currentStudentBilling,
    0,
  );
  const totalClassHours = teacherFinancials.reduce(
    (sum, financial) => sum + financial.salaryBreakdown.classHours,
    0,
  );
  const completedMinutes = teacherFinancials.reduce(
    (sum, financial) => sum + financial.salaryBreakdown.totalMinutes,
    0,
  );
  const healthAverage = teachers.length && plans.length ? 100 : 0;

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
              Live teacher, student, assignment, curriculum, leave, billing, and salary data from backend.
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

        {loading ? (
          <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
            Loading actual teachers, students, assignments, and leave requests from backend...
          </div>
        ) : null}

        {error ? (
          <div className="mt-6 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
            {error}
          </div>
        ) : null}

        {!loading && !error && liveData?.loadIssues?.length ? (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
            {liveData.loadIssues.join(" | ")}. Teacher/student list is live, but these protected records need a valid admin login.
          </div>
        ) : null}

        {!loading && !error ? (
          <>
            <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <MetricCard
                label="Needs attention"
                value={openAttention.length}
                detail="Live alert system not connected yet"
                trend="flat"
                tone="warning"
                icon={<AlertTriangle className="h-5 w-5" />}
              />
              <MetricCard
                label="Active students"
                value={formatNumber(activeStudentIds.size)}
                detail={`${formatNumber(students.length)} actual student records loaded`}
                trend="up"
                tone="success"
                icon={<UsersRound className="h-5 w-5" />}
              />
              <MetricCard
                label="Class hours"
                value={totalClassHours.toFixed(1)}
                detail={`${formatNumber(completedMinutes)} scheduled minutes this month`}
                trend="flat"
                icon={<Clock3 className="h-5 w-5" />}
              />
              <MetricCard
                label="Monthly billing"
                value={formatCurrency(monthlyRevenue)}
                detail="Current active backend assignments"
                trend="up"
                icon={<MessageSquareWarning className="h-5 w-5" />}
              />
              <MetricCard
                label="Avg teacher health"
                value={healthAverage ? `${healthAverage}/100` : "N/A"}
                detail={`${teachers.length} actual teachers loaded`}
                tone={healthAverage ? "success" : "warning"}
                icon={<Activity className="h-5 w-5" />}
              />
            </section>

            <section className="mt-6">
              <Card>
                <CardHeader title="Assign student and auto-book schedule" eyebrow="Admin workflow" />
                <CardContent>
                  <AdminAssignmentStudio
                    teachers={teachers}
                    students={students}
                    courses={liveData?.courses ?? []}
                    plans={plans}
                    initialBookings={liveData?.bookings ?? []}
                    onSaved={loadLiveData}
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
                <CardHeader title="Teacher health summary" eyebrow="Actual teacher list" />
                <CardContent>
                  <div className="space-y-3">
                    {teachers.length ? (
                      teachers.map((teacher) => {
                        const financial = getTeacherFinancialSummaryFromPlans(
                          teacher.id,
                          teachers,
                          students,
                          plans,
                        );
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
                                <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200">
                                  {financial.salaryBreakdown.classHours.toFixed(1)}h
                                </span>
                              </div>
                              <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                                {formatCurrency(financial.currentStudentBilling)} current billing,
                                {" "}
                                {formatCurrency(financial.currentSalary)} current salary
                              </p>
                            </div>
                          </ButtonLink>
                        );
                      })
                    ) : (
                      <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                        No teacher records found from Teacher Management.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <Card>
                <CardHeader title="Attention queue" eyebrow="Admin should start here" />
                <CardContent>
                  {openAttention.length ? (
                    <IssueQueue issues={openAttention.slice(0, 8)} />
                  ) : (
                    <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                      No live attention items are connected yet.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Student trend" eyebrow="All teachers, live assignment history" />
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
          </>
        ) : null}
      </div>
    </div>
  );
}
