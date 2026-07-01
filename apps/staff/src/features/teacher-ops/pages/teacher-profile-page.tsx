"use client";

import { useEffect, useMemo, useState } from "react";
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
import {
  fetchTeacherOpsLiveData,
  getLiveTeacherMonthlySummaries,
  getTeacherFinancialSummaryFromPlans,
  getTeacherStudentsFromPlans,
  type TeacherOpsLiveData,
} from "@/features/teacher-ops/lib/real-data";
import type { Issue, LeaveRequest } from "@/features/teacher-ops/lib/types";
import { formatCurrency, formatCurrencyPrecise, formatNumber } from "@/features/teacher-ops/lib/utils";
import { getApiBaseUrl, getBrandHeaders } from "@/lib/brand-config";

const isMongoId = (value: string) => /^[a-f\d]{24}$/i.test(value);

function getAuthHeaders() {
  if (typeof window === "undefined") return {};
  const token = window.localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function parseDate(value?: string) {
  if (!value) return null;
  const date = value.includes("T") ? new Date(value) : new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function sameMonth(value: string | undefined, month = new Date()) {
  const date = parseDate(value);
  return Boolean(date && date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth());
}

function previousMonth(month = new Date()) {
  return new Date(month.getFullYear(), month.getMonth() - 1, 1);
}

function leaveSummaryFor(teacherId: string, leaves: LeaveRequest[], month = new Date()) {
  const teacherLeaves = leaves.filter((leave) => leave.teacherId === teacherId);
  const approvedLeaves = teacherLeaves.filter((leave) => leave.status === "approved");
  const pending = teacherLeaves.filter((leave) => leave.status === "pending");
  const lastApproved = [...approvedLeaves].sort(
    (current, next) =>
      Date.parse(next.toDate || next.fromDate) - Date.parse(current.toDate || current.fromDate),
  )[0];
  const lastMonth = previousMonth(month);

  return {
    lastLeave: lastApproved?.toDate || lastApproved?.fromDate || "",
    lastMonthLeave: approvedLeaves
      .filter((leave) => sameMonth(leave.fromDate, lastMonth) || sameMonth(leave.toDate, lastMonth))
      .reduce((sum, leave) => sum + leave.daysCount, 0),
    totalLeave: approvedLeaves.reduce((sum, leave) => sum + leave.daysCount, 0),
    pending,
    all: teacherLeaves,
  };
}

function emptyIssues(): Issue[] {
  return [];
}

export function TeacherOpsTeacherProfilePage({ id }: { id: string }) {
  const router = useRouter();
  const [liveData, setLiveData] = useState<TeacherOpsLiveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

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
          : "Could not load actual teacher profile data.",
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
  const selectedTeacher = teachers.find((teacher) => teacher.id === id) ?? teachers[0];
  const selectedTeacherId = selectedTeacher?.id ?? "";
  const teacherStudents = selectedTeacher
    ? getTeacherStudentsFromPlans(selectedTeacher.id, students, plans)
    : [];
  const progress = [];
  const issues = emptyIssues();
  const openIssues = issues.filter((issue) => issue.status !== "resolved");
  const financial = selectedTeacher
    ? getTeacherFinancialSummaryFromPlans(selectedTeacher.id, teachers, students, plans)
    : null;
  const leaveSummary = selectedTeacher
    ? leaveSummaryFor(selectedTeacher.id, liveData?.leaves ?? [])
    : { lastLeave: "", lastMonthLeave: 0, totalLeave: 0, pending: [], all: [] };
  const monthlySummary = useMemo(
    () =>
      selectedTeacher
        ? getLiveTeacherMonthlySummaries(teachers, students, plans).find(
            (summary) => summary.teacher.id === selectedTeacher.id,
          )
        : undefined,
    [plans, selectedTeacher, students, teachers],
  );
  const studentTrend = (monthlySummary?.snapshots ?? []).map((snapshot) => ({
    month: snapshot.month.slice(0, 3),
    count: snapshot.activeStudents,
    reason: snapshot.reason,
  }));

  async function decideLeave(leaveId: string, status: "approved" | "rejected") {
    setNotice("");
    if (!isMongoId(leaveId)) {
      setNotice("This leave request is not a backend record, so it was not changed.");
      return;
    }

    try {
      const response = await fetch(`${getApiBaseUrl()}/teacher-leaves/${leaveId}/decision`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getBrandHeaders(),
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ status }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(body?.message || body?.error || "Leave decision was not saved.");
      }
      setNotice(`Leave request ${status}. Reload-safe backend data refreshed.`);
      await loadLiveData();
    } catch (decisionError) {
      setNotice(
        decisionError instanceof Error
          ? decisionError.message
          : "Could not save leave decision.",
      );
    }
  }

  return (
    <div className="min-h-[calc(100vh-2.5rem)] rounded-lg bg-slate-50 text-slate-950 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
            Loading actual teacher profile from backend...
          </div>
        ) : null}

        {error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
            {error}
          </div>
        ) : null}

        {!loading && !error && liveData?.loadIssues?.length ? (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
            {liveData.loadIssues.join(" | ")}. Teacher/student list is live, but these protected records need a valid admin login.
          </div>
        ) : null}

        {!loading && !error && selectedTeacher && financial ? (
          <>
            <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                    Teacher profile
                  </p>
                  <Badge tone={selectedTeacher.status === "active" ? "success" : "warning"}>
                    {selectedTeacher.status.replace("_", " ")}
                  </Badge>
                  <Badge tone="info">Live backend data</Badge>
                </div>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">
                  {selectedTeacher.name}
                </h1>
                <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
                  {selectedTeacher.id} - Phone {selectedTeacher.phone || "Missing"} - WhatsApp{" "}
                  {selectedTeacher.whatsapp || "Missing"}
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
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name} ({teacher.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </header>

            {notice ? (
              <p className="mt-4 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
                {notice}
              </p>
            ) : null}

            <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
              <MetricTile icon={<UsersRound className="h-5 w-5" />} label="Students" value={teacherStudents.length} />
              <MetricTile icon={<CalendarDays className="h-5 w-5" />} label="Class hours" value={financial.salaryBreakdown.classHours.toFixed(1)} />
              <MetricTile icon={<CircleDollarSign className="h-5 w-5" />} label="Current student billing" value={formatCurrency(financial.currentStudentBilling)} />
              <MetricTile icon={<CircleDollarSign className="h-5 w-5" />} label="Lifetime student billing" value={formatCurrency(financial.lifetimeStudentBilling)} />
              <MetricTile icon={<Banknote className="h-5 w-5" />} label="Current salary" value={formatCurrencyPrecise(financial.currentSalary)} />
              <MetricTile icon={<Banknote className="h-5 w-5" />} label="Lifetime salary" value={formatCurrency(financial.lifetimeSalary)} />
            </section>

            <section className="mt-6 grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
              <Card>
                <CardHeader title="Teacher Data" eyebrow="Selected teacher operations" />
                <CardContent>
                  <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-950 dark:text-zinc-50">
                          Salary and leave snapshot
                        </p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                          Calculated from timestamped assignment history.
                        </p>
                      </div>
                      <Badge tone="info">
                        {financial.salaryBreakdown.source === "actual_sessions" ? "Actual class minutes" : "Assignment schedule"}
                      </Badge>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <DataTile label="Last leave" value={leaveSummary.lastLeave || "No approved leave"} />
                      <DataTile label="Last month leave" value={`${leaveSummary.lastMonthLeave} day${leaveSummary.lastMonthLeave === 1 ? "" : "s"}`} />
                      <DataTile label="Total leave" value={`${leaveSummary.totalLeave} day${leaveSummary.totalLeave === 1 ? "" : "s"}`} />
                      <DataTile label="Last month salary" value={formatCurrencyPrecise(financial.lastMonthSalary)} />
                      <DataTile label="Missed classes" value={selectedTeacher.totalMissedClasses} />
                      <DataTile label="Last update" value={selectedTeacher.lastUpdated} />
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
                        <Badge tone={leaveSummary.pending.length ? "warning" : "success"}>
                          {leaveSummary.pending.length ? `${leaveSummary.pending.length} pending` : "No pending"}
                        </Badge>
                      </div>
                      <div className="mt-3 space-y-2">
                        {(leaveSummary.pending.length ? leaveSummary.pending : leaveSummary.all.slice(0, 3)).map((leave) => (
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
                                <p className="mt-1 text-slate-500 dark:text-zinc-400">{leave.reason || "No reason added"}</p>
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
                        {!leaveSummary.all.length ? (
                          <p className="rounded-md border border-slate-100 bg-slate-50 p-3 text-sm text-slate-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                            No leave requests found for this teacher.
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Schedule" eyebrow="Roster and booked/free slots" />
                <CardContent>
                  <ScheduleGrid
                    bookings={(liveData?.bookings ?? []).filter(
                      (booking) => booking.teacherId === selectedTeacher.id,
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
                  {openIssues.length ? (
                    <IssueQueue issues={openIssues} />
                  ) : (
                    <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                      No live attention items are connected for this teacher yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </section>

            <section className="mt-6">
              <Card>
                <CardHeader title="Students and syllabus position" eyebrow="Roster" />
                <CardContent className="p-0">
                  <StudentTable students={teacherStudents} progress={progress} />
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
                          <th className="border-b border-slate-200 px-4 py-3 dark:border-zinc-800">Reason</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(monthlySummary?.snapshots ?? []).map((snapshot) => (
                          <tr key={snapshot.month} className="text-slate-700 dark:text-zinc-200">
                            <td className="border-b border-slate-100 px-4 py-4 dark:border-zinc-900">{snapshot.month}</td>
                            <td className="border-b border-slate-100 px-4 py-4 dark:border-zinc-900">
                              {snapshot.activeStudents}
                            </td>
                            <td className="border-b border-slate-100 px-4 py-4 dark:border-zinc-900">
                              {formatCurrency(snapshot.assignedMonthlyValue)}
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
          </>
        ) : null}

        {!loading && !error && !selectedTeacher ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
            No teacher records found from Teacher Management.
          </div>
        ) : null}
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
