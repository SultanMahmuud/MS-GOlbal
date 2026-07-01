"use client";

import { useMemo, useState } from "react";
import {
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  ExternalLink,
  MessageSquareWarning,
  Send,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import { Badge } from "@/features/teacher-ops/components/ui/badge";
import { Button } from "@/features/teacher-ops/components/ui/button";
import { Card, CardContent, CardHeader } from "@/features/teacher-ops/components/ui/card";
import { FieldLabel, TextArea } from "@/features/teacher-ops/components/ui/field";
import { addMinutes, getPlanRoutineLabel } from "@/features/teacher-ops/lib/data";
import type {
  AttendanceSummary,
  ClassSession,
  Course,
  CurriculumModule,
  Issue,
  Lesson,
  Student,
  StudentCoursePlan,
  Teacher,
} from "@/features/teacher-ops/lib/types";
import { cn, statusLabel } from "@/features/teacher-ops/lib/utils";

function attendancePercent(summary: AttendanceSummary) {
  if (!summary.scheduledClasses) return 0;
  return Math.round((summary.attendedClasses / summary.scheduledClasses) * 100);
}

export function StudentParentPortal({
  student,
  teachers,
  plans,
  courses,
  modules,
  lessons,
  attendance,
  sessions,
  issues,
}: {
  student: Student;
  teachers: Teacher[];
  plans: StudentCoursePlan[];
  courses: Course[];
  modules: CurriculumModule[];
  lessons: Lesson[];
  attendance: AttendanceSummary;
  sessions: ClassSession[];
  issues: Issue[];
}) {
  const [selectedPlanId, setSelectedPlanId] = useState(plans[0]?.id ?? "");
  const [complaintTarget, setComplaintTarget] = useState("selected-plan");
  const [complaint, setComplaint] = useState("");
  const [weeklyFeedback, setWeeklyFeedback] = useState("");
  const [notice, setNotice] = useState("");
  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedPlanId) ?? plans[0],
    [plans, selectedPlanId],
  );
  const selectedCourse = courses.find((course) => course.id === selectedPlan?.courseId);
  const selectedTeacher = teachers.find((teacher) => teacher.id === selectedPlan?.teacherId);
  const currentLesson = lessons.find((lesson) => lesson.id === selectedPlan?.currentLessonId);
  const assignedLessons = lessons.filter((lesson) => selectedPlan?.assignedLessonIds.includes(lesson.id));
  const assignedModuleIds = new Set(assignedLessons.map((lesson) => lesson.moduleId));
  const assignedModules = modules.filter((module) => assignedModuleIds.has(module.id));
  const selectedSessions = sessions.filter(
    (session) => !selectedPlan || session.teacherId === selectedPlan.teacherId,
  );

  function submitComplaint() {
    if (!complaint.trim()) {
      setNotice("Please write the complaint before submitting.");
      return;
    }

    const target =
      complaintTarget === "admin"
        ? "admin/support"
        : complaintTarget === "general"
          ? "general student support"
          : `${selectedCourse?.name ?? "selected course"} with ${selectedTeacher?.name ?? "teacher"}`;

    setNotice(`Complaint submitted for ${target}. Admin will see this in the issue queue.`);
    setComplaint("");
  }

  function submitWeeklyFeedback() {
    if (!weeklyFeedback.trim()) {
      setNotice("Please write this week's feedback before submitting.");
      return;
    }

    setNotice(
      `Weekly feedback submitted for ${selectedTeacher?.name ?? "teacher"}. Admin can use it in teacher health review.`,
    );
    setWeeklyFeedback("");
  }

  if (!selectedPlan) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Card>
          <CardHeader title={student.name} eyebrow="Student and parent portal" />
          <CardContent>
            <p className="text-sm text-zinc-500">No course plan has been assigned yet.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm text-zinc-500">Student and parent portal</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50">
            {student.name}
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-zinc-400">
            One student can study different subjects with different teachers. Select
            a course card to see that teacher, class link, routine, and progress.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="info">Logged in as student/parent</Badge>        </div>
      </header>

      <section className="mt-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
          <BookOpenCheck className="h-5 w-5 text-emerald-300" />
          <p className="mt-3 text-sm text-zinc-500">Courses</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-50">{plans.length}</p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
          <UsersRound className="h-5 w-5 text-emerald-300" />
          <p className="mt-3 text-sm text-zinc-500">Teachers</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-50">{teachers.length}</p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
          <BarChart3 className="h-5 w-5 text-emerald-300" />
          <p className="mt-3 text-sm text-zinc-500">Attendance</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-50">
            {attendancePercent(attendance)}%
          </p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
          <ExternalLink className="h-5 w-5 text-emerald-300" />
          <p className="mt-3 text-sm text-zinc-500">Selected link</p>
          <p className="mt-1 truncate text-sm font-medium text-emerald-200">
            {selectedPlan.classLink}
          </p>
        </div>
      </section>

      <section className="mt-6 grid gap-3 lg:grid-cols-2">
        {plans.map((plan) => {
          const course = courses.find((item) => item.id === plan.courseId);
          const teacher = teachers.find((item) => item.id === plan.teacherId);
          const lesson = lessons.find((item) => item.id === plan.currentLessonId);
          const selected = selectedPlan.id === plan.id;

          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => {
                setSelectedPlanId(plan.id);
                setComplaintTarget("selected-plan");
              }}
              className={cn(
                "rounded-lg border p-4 text-left transition",
                selected
                  ? "border-emerald-500 bg-emerald-950/30"
                  : "border-zinc-800 bg-zinc-950 hover:border-zinc-700",
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-zinc-50">{course?.name ?? plan.courseId}</p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-zinc-500">
                    <UserRoundCheck className="h-4 w-4 text-emerald-300" />
                    {teacher?.name ?? "Teacher not assigned"}
                  </p>
                </div>
                <Badge tone={selected ? "success" : "neutral"}>
                  {plan.completedLessonIds.length}/{plan.assignedLessonIds.length} lessons
                </Badge>
              </div>
              <p className="mt-3 text-xs text-zinc-500">{getPlanRoutineLabel(plan)}</p>
              <p className="mt-2 truncate text-xs text-emerald-200">{plan.classLink}</p>
              <p className="mt-2 text-xs text-zinc-400">
                Current: {lesson?.title ?? "Not started"}
              </p>
            </button>
          );
        })}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader title="Selected class routine" eyebrow="Course-specific assignment" />
            <CardContent>
              <div className="flex items-start gap-3">
                <UserRoundCheck className="mt-0.5 h-5 w-5 text-emerald-300" />
                <div>
                  <p className="font-medium text-zinc-50">
                    {selectedTeacher?.name ?? "Teacher not assigned"}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">{selectedCourse?.name}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-zinc-300">{getPlanRoutineLabel(selectedPlan)}</p>
              <p className="mt-3 text-sm text-zinc-500">
                Class time: {selectedPlan.startTime}-{addMinutes(selectedPlan.startTime, selectedPlan.durationMinutes)}
              </p>
              <p className="mt-3 flex items-center gap-2 text-sm text-emerald-200">
                <ExternalLink className="h-4 w-4" />
                {selectedPlan.classLink}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Attendance summary" eyebrow="Student analytics" />
            <CardContent>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-zinc-500">Scheduled</dt>
                  <dd className="mt-1 text-xl font-semibold text-zinc-50">
                    {attendance.scheduledClasses}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Attended</dt>
                  <dd className="mt-1 text-xl font-semibold text-emerald-200">
                    {attendance.attendedClasses}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Missed</dt>
                  <dd className="mt-1 text-xl font-semibold text-rose-200">
                    {attendance.missedClasses}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Rescheduled</dt>
                  <dd className="mt-1 text-xl font-semibold text-sky-200">
                    {attendance.rescheduledClasses}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Submit complaint" eyebrow="Parent/student support" />
            <CardContent>
              <div className="space-y-4">
                <div>
                  <FieldLabel htmlFor="complaint-target">Complaint about</FieldLabel>
                  <select
                    id="complaint-target"
                    value={complaintTarget}
                    onChange={(event) => setComplaintTarget(event.target.value)}
                    className="mt-2 h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none focus:border-emerald-500"
                  >
                    <option value="selected-plan">
                      {selectedCourse?.name} - {selectedTeacher?.name}
                    </option>
                    <option value="admin">Admin/support team</option>
                    <option value="general">General student support</option>
                  </select>
                </div>
                <div>
                  <FieldLabel htmlFor="parent-complaint">Complaint details</FieldLabel>
                  <TextArea
                    id="parent-complaint"
                    value={complaint}
                    onChange={(event) => setComplaint(event.target.value)}
                    placeholder="Write a complaint about teacher, class timing, progress update, or admin support."
                  />
                </div>
                {notice ? (
                  <p className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-300">
                    {notice}
                  </p>
                ) : null}
                <Button type="button" variant="secondary" onClick={submitComplaint}>
                  <Send className="h-4 w-4" />
                  Submit complaint
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Weekly feedback" eyebrow="Teacher health signal" />
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-slate-500 dark:text-zinc-400">
                  Share a short weekly note about class quality, timing, teacher
                  support, or progress. This helps admin review teacher health.
                </p>
                <div>
                  <FieldLabel htmlFor="weekly-feedback">Feedback for this week</FieldLabel>
                  <TextArea
                    id="weekly-feedback"
                    value={weeklyFeedback}
                    onChange={(event) => setWeeklyFeedback(event.target.value)}
                    placeholder="Example: Teacher joined on time and corrected recitation clearly."
                  />
                </div>
                <Button type="button" variant="secondary" onClick={submitWeeklyFeedback}>
                  <Send className="h-4 w-4" />
                  Submit weekly feedback
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Lesson progress" eyebrow="Selected course" />
            <CardContent>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Badge tone="info">{selectedCourse?.name ?? "Course plan"}</Badge>
                <Badge tone="neutral">
                  Current: {currentLesson?.title ?? "Not started"}
                </Badge>
              </div>

              <div className="space-y-4">
                {assignedModules.map((module) => {
                  const moduleLessons = assignedLessons.filter((lesson) => lesson.moduleId === module.id);
                  return (
                    <section key={module.id} className="rounded-lg border border-zinc-800 bg-zinc-950">
                      <div className="border-b border-zinc-800 px-4 py-3">
                        <p className="text-xs text-zinc-500">{module.semester}</p>
                        <h3 className="mt-1 text-sm font-semibold text-zinc-50">{module.title}</h3>
                      </div>
                      <div className="divide-y divide-zinc-900">
                        {moduleLessons.map((lesson) => {
                          const isComplete = selectedPlan.completedLessonIds.includes(lesson.id);
                          const isCurrent = selectedPlan.currentLessonId === lesson.id;
                          return (
                            <div key={lesson.id} className="flex items-center gap-3 px-4 py-3">
                              <CheckCircle2
                                className={`h-4 w-4 ${
                                  isComplete ? "text-emerald-300" : "text-zinc-700"
                                }`}
                              />
                              <div className="min-w-0 flex-1">
                                <p className="text-sm text-zinc-100">{lesson.title}</p>
                                <p className="mt-1 text-xs text-zinc-500">
                                  {isCurrent ? "Current lesson" : isComplete ? "Completed" : "Pending"}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Recent classes and issues" eyebrow="Selected teacher view" />
            <CardContent>
              <div className="space-y-3">
                {selectedSessions.map((session) => (
                  <div key={session.id} className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-zinc-50">{session.date}</p>
                      <Badge tone={session.status === "missed" ? "danger" : "neutral"}>
                        {statusLabel(session.status)}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-zinc-500">
                      {session.day}, {session.startsAt} - {session.note}
                    </p>
                  </div>
                ))}
                {issues.slice(0, 3).map((issue) => (
                  <div key={issue.id} className="rounded-lg border border-amber-800 bg-amber-950/20 p-3">
                    <p className="flex items-center gap-2 text-sm font-medium text-amber-100">
                      <MessageSquareWarning className="h-4 w-4" />
                      {issue.title}
                    </p>
                    <p className="mt-1 text-xs text-amber-200/70">{issue.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
