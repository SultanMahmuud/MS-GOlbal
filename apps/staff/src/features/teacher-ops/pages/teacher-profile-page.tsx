"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Banknote, CalendarDays, CircleDollarSign, Search, UsersRound } from "lucide-react";
import { Badge } from "@/features/teacher-ops/components/ui/badge";
import { Button } from "@/features/teacher-ops/components/ui/button";
import { Card, CardContent, CardHeader } from "@/features/teacher-ops/components/ui/card";
import { IssueQueue } from "@/features/teacher-ops/components/issue-queue";
import { ScheduleGrid } from "@/features/teacher-ops/components/schedule-grid";
import { StudentTable } from "@/features/teacher-ops/components/student-table";
import { StudentTrendChart } from "@/features/teacher-ops/components/student-trend-chart";
import { TeacherHealth } from "@/features/teacher-ops/components/teacher-health";
import {
  appData,
  getTeacherFinancialSummary,
  getTeacher,
  getTeacherIssues,
  getTeacherLeaveSummary,
  getTeacherMonthlySnapshots,
  getTeacherProgress,
  getTeacherStudentTrend,
  getTeacherStudents,
  teacherHealthBreakdown,
  teachers,
} from "@/features/teacher-ops/lib/data";
import type { LeaveRequest } from "@/features/teacher-ops/lib/types";
import { formatCurrency, formatCurrencyPrecise, formatNumber } from "@/features/teacher-ops/lib/utils";
import { getApiBaseUrl, getBrandHeaders } from "@/lib/brand-config";

const isMongoId = (value: string) => /^[a-f\d]{24}$/i.test(value);

function getAuthHeaders() {
  if (typeof window === "undefined") return {};
  const token = window.localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function TeacherOpsTeacherProfilePage({ id }: { id: string }) {
  const router = useRouter();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(appData.leaves);
  const teacher = getTeacher(id);
  const students = getTeacherStudents(teacher.id);
  const progress = getTeacherProgress(teacher.id);
  const issues = getTeacherIssues(teacher.id);
  const grossMonthly = students.reduce((sum, student) => sum + student.monthlyFee, 0);
  const monthlySnapshots = getTeacherMonthlySnapshots(teacher.id);
  const studentTrend = getTeacherStudentTrend(teacher.id);
  const health = teacherHealthBreakdown(teacher);
  const openIssues = issues.filter((issue) => issue.status !== "resolved");
  const financial = getTeacherFinancialSummary(teacher.id);
  const leaveSummary = getTeacherLeaveSummary(teacher.id, undefined, leaveRequests);
  const selectedTeacherLeaves = leaveRequests.filter((leave) => leave.teacherId === teacher.id);
  const pendingLeaves = selectedTeacherLeaves.filter((leave) => leave.status === "pending");

  const selectedTeacherId = useMemo(
    () => teachers.find((item) => item.id === id)?.id ?? teacher.id,
    [id, teacher.id],
  );

  async function decideLeave(leaveId: string, status: "approved" | "rejected") {
    setLeaveRequests((current) =>
      current.map((leave) =>
        leave.id === leaveId
          ? {
              ...leave,
              status,
              approvedBy: "admin",
              approvedAt: new Date().toISOString().slice(0, 10),
              adminDecisionNote: status === "approved" ? "Approved from admin profile." : "Rejected from admin profile.",
            }
          : leave,
      ),
    );

    if (!isMongoId(leaveId)) return;
    await fetch(`${getApiBaseUrl()}/teacher-leaves/${leaveId}/decision`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getBrandHeaders(),
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ status }),
    }).catch(() => null);
  }

  return (
    <div className="min-h-[calc(100vh-2.5rem)] rounded-lg bg-slate-50 text-slate-950 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                Teacher profile
              </p>
              <Badge tone={teacher.status === "active" ? "success" : "warning"}>
                {teacher.status.replace("_", " ")}
              </Badge>
              <Badge tone={health.score >= 80 ? "success" : health.score >= 60 ? "warning" : "danger"}>
                Health {health.score}/100
              </Badge>
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">
              {teacher.name}
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
              {teacher.id} - Phone {teacher.phone} - WhatsApp {teacher.whatsapp}
            </p>
          </div>

          <div className="w-full max-w-sm">
            <label htmlFor="teacher-profile-picker" className="text-sm font-medium text-slate-700 dark:text-zinc-200">
              Select teacher profile
            </label>
            <div className="relative mt-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                id="teacher-profile-picker"
                value={selectedTeacherId}
                onChange={(event) =>
                  router.push(`/dashboard/admin/teacher-assign/teachers/${event.target.value}`)
                }
                className="h-11 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
              >
                {teachers.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.id})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <MetricTile icon={<UsersRound className="h-5 w-5" />} label="Students" value={students.length} />
          <MetricTile icon={<CalendarDays className="h-5 w-5" />} label="Class hours" value={teacher.totalClassHours} />
          <MetricTile icon={<CircleDollarSign className="h-5 w-5" />} label="Current student billing" value={formatCurrency(financial.currentStudentBilling || grossMonthly)} />
          <MetricTile icon={<CircleDollarSign className="h-5 w-5" />} label="Lifetime student billing" value={formatCurrency(financial.lifetimeStudentBilling)} />
          <MetricTile icon={<Banknote className="h-5 w-5" />} label="Current salary" value={formatCurrencyPrecise(financial.currentSalary)} />
          <MetricTile icon={<Banknote className="h-5 w-5" />} label="Lifetime salary" value={formatCurrency(financial.lifetimeSalary)} />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
          <Card>
            <CardHeader title="Health and Teacher Data" eyebrow="Selected teacher overview" />
            <CardContent>
              <TeacherHealth teacher={teacher} />
              <div className="mt-6 space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-950 dark:text-zinc-50">
                      Teacher Data
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                      Salary, student billing, leave, and calculation snapshot.
                    </p>
                  </div>
                  <Badge tone="info">
                    {financial.salaryBreakdown.source === "actual_sessions" ? "Actual class minutes" : "Schedule estimate"}
                  </Badge>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <DataTile label="Current salary" value={formatCurrencyPrecise(financial.currentSalary)} />
                  <DataTile label="Last month salary" value={formatCurrencyPrecise(financial.lastMonthSalary)} />
                  <DataTile label="Lifetime salary" value={formatCurrency(financial.lifetimeSalary)} />
                  <DataTile label="Teacher hourly rate" value={formatCurrencyPrecise(financial.salaryBreakdown.teacherHourlyRate)} />
                  <DataTile label="Current student billing" value={formatCurrency(financial.currentStudentBilling || grossMonthly)} />
                  <DataTile label="Lifetime student billing" value={formatCurrency(financial.lifetimeStudentBilling)} />
                  <DataTile label="Last leave" value={leaveSummary.lastLeave || "No approved leave"} />
                  <DataTile label="Last month leave" value={`${leaveSummary.lastMonthLeave} day${leaveSummary.lastMonthLeave === 1 ? "" : "s"}`} />
                  <DataTile label="Total leave" value={`${leaveSummary.totalLeave} day${leaveSummary.totalLeave === 1 ? "" : "s"}`} />
                  <DataTile label="Missed classes" value={teacher.totalMissedClasses} />
                  <DataTile label="Last update" value={teacher.lastUpdated} />
                  <DataTile label="Open issues" value={openIssues.length} />
                </div>

                <div className="rounded-md border border-slate-200 bg-white p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="font-medium text-slate-900 dark:text-zinc-50">Salary calculation</p>
                  <div className="mt-3 grid gap-2 text-slate-600 dark:text-zinc-300 sm:grid-cols-2">
                    <Info label="Total class minutes" value={`${formatNumber(financial.salaryBreakdown.totalMinutes)} min`} />
                    <Info label="Class hours" value={financial.salaryBreakdown.classHours.toFixed(3)} />
                    <Info label="Salary unit" value={financial.salaryBreakdown.salaryUnit.toFixed(3)} />
                    <Info label="Formula" value={`${financial.salaryBreakdown.classHours.toFixed(3)} / 25 x ${formatCurrencyPrecise(financial.salaryBreakdown.teacherHourlyRate)}`} />
                  </div>
                  <p className="mt-3 rounded-md bg-emerald-50 px-3 py-2 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200">
                    Payable salary: {formatCurrencyPrecise(financial.salaryBreakdown.payableSalary)}
                  </p>
                </div>

                <div className="rounded-md border border-slate-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-slate-900 dark:text-zinc-50">Leave requests</p>
                    <Badge tone={pendingLeaves.length ? "warning" : "success"}>
                      {pendingLeaves.length ? `${pendingLeaves.length} pending` : "No pending"}
                    </Badge>
                  </div>
                  <div className="mt-3 space-y-2">
                    {(pendingLeaves.length ? pendingLeaves : selectedTeacherLeaves.slice(0, 3)).map((leave) => (
                      <div
                        key={leave.id}
                        className="rounded-md border border-slate-100 bg-slate-50 p-3 text-sm dark:border-zinc-800 dark:bg-zinc-950"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="font-medium text-slate-900 dark:text-zinc-50">
                              {leave.requestType === "late_join" ? "Late join" : "Leave"}: {leave.fromDate}
                              {leave.toDate !== leave.fromDate ? ` to ${leave.toDate}` : ""}
                            </p>
                            <p className="mt-1 text-slate-500 dark:text-zinc-400">{leave.reason}</p>
                          </div>
                          <Badge tone={leave.status === "approved" ? "success" : leave.status === "rejected" ? "danger" : "warning"}>
                            {leave.status}
                          </Badge>
                        </div>
                        {leave.status === "pending" ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Button type="button" size="sm" onClick={() => decideLeave(leave.id, "approved")}>
                              Approve
                            </Button>
                            <Button type="button" size="sm" variant="secondary" onClick={() => decideLeave(leave.id, "rejected")}>
                              Reject
                            </Button>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Schedule" eyebrow="Roster and booked/free slots" />
            <CardContent>
              <ScheduleGrid
                bookings={appData.bookings.filter(
                  (booking) => booking.teacherId === teacher.id,
                )}
              />
            </CardContent>
          </Card>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
          <Card>
            <CardHeader title="Student trend" eyebrow="Selected teacher monthly movement" />
            <CardContent>
              <StudentTrendChart data={studentTrend} />
              <div className="mt-4 space-y-2">
                {studentTrend.slice(-3).map((month) => (
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

          <Card>
            <CardHeader title="Attention" eyebrow="Complaints and progress alerts" />
            <CardContent>
              <IssueQueue issues={openIssues.length ? openIssues : issues.slice(0, 4)} />
            </CardContent>
          </Card>
        </section>

        <section className="mt-6">
          <Card>
            <CardHeader title="Students and syllabus position" eyebrow="Roster" />
            <CardContent className="p-0">
              <StudentTable students={students} progress={progress} />
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
                    <tr className="text-left text-xs uppercase tracking-wide text-slate-500 dark:text-zinc-500">
                      <th className="border-b border-slate-200 px-4 py-3 dark:border-zinc-800">Month</th>
                      <th className="border-b border-slate-200 px-4 py-3 dark:border-zinc-800">Active students</th>
                      <th className="border-b border-slate-200 px-4 py-3 dark:border-zinc-800">Assigned value</th>
                      <th className="border-b border-slate-200 px-4 py-3 dark:border-zinc-800">Added</th>
                      <th className="border-b border-slate-200 px-4 py-3 dark:border-zinc-800">Dropped</th>
                      <th className="border-b border-slate-200 px-4 py-3 dark:border-zinc-800">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlySnapshots.map((snapshot) => (
                      <tr key={snapshot.month} className="text-slate-700 dark:text-zinc-200">
                        <td className="border-b border-slate-100 px-4 py-4 dark:border-zinc-900">{snapshot.month}</td>
                        <td className="border-b border-slate-100 px-4 py-4 dark:border-zinc-900">
                          {snapshot.activeStudents}
                        </td>
                        <td className="border-b border-slate-100 px-4 py-4 dark:border-zinc-900">
                          {formatCurrency(snapshot.assignedMonthlyValue)}
                        </td>
                        <td className="border-b border-slate-100 px-4 py-4 text-emerald-600 dark:border-zinc-900 dark:text-emerald-200">
                          +{snapshot.addedStudents}
                        </td>
                        <td className="border-b border-slate-100 px-4 py-4 text-rose-600 dark:border-zinc-900 dark:text-rose-200">
                          -{snapshot.droppedStudents}
                        </td>
                        <td className="border-b border-slate-100 px-4 py-4 text-slate-600 dark:border-zinc-900 dark:text-zinc-400">
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

function MetricTile({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="text-emerald-600 dark:text-emerald-300">{icon}</div>
      <p className="mt-4 text-sm text-slate-500 dark:text-zinc-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-950 dark:text-zinc-50">{value}</p>
    </div>
  );
}

function DataTile({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-zinc-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-950 dark:text-zinc-50">
        {value}
      </p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="text-slate-500 dark:text-zinc-500">{label}</dt>
      <dd className="mt-1 text-slate-950 dark:text-zinc-100">{value}</dd>
    </div>
  );
}
