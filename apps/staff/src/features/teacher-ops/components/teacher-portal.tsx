"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  ExternalLink,
  MessageSquareWarning,
  Send,
  TimerReset,
} from "lucide-react";
import { Badge } from "@/features/teacher-ops/components/ui/badge";
import { Button } from "@/features/teacher-ops/components/ui/button";
import { Card, CardContent, CardHeader } from "@/features/teacher-ops/components/ui/card";
import { FieldLabel, TextArea, TextInput } from "@/features/teacher-ops/components/ui/field";
import { TeacherStudentCountTrend } from "@/features/teacher-ops/components/teacher-student-count-trend";
import type {
  AttendanceSummary,
  ClassSession,
  Course,
  CurriculumModule,
  Lesson,
  ProgressRecord,
  Student,
  StudentCoursePlan,
  Teacher,
  TeacherMonthlyAssignmentSnapshot,
} from "@/features/teacher-ops/lib/types";
import { cn, statusLabel } from "@/features/teacher-ops/lib/utils";
import { addMinutes, getPlanRoutineLabel, getRoutineLabel } from "@/features/teacher-ops/lib/data";

type LocalSessionStatus = "completed" | "missed" | "rescheduled";

function percent(summary?: AttendanceSummary) {
  if (!summary || !summary.scheduledClasses) return 0;
  return Math.round((summary.attendedClasses / summary.scheduledClasses) * 100);
}

export function TeacherPortal({
  teacher,
  students,
  sessions,
  progress,
  courses,
  modules,
  lessons,
  plans,
  attendanceSummaries,
  monthlySnapshots,
}: {
  teacher: Teacher;
  students: Student[];
  sessions: ClassSession[];
  progress: ProgressRecord[];
  courses: Course[];
  modules: CurriculumModule[];
  lessons: Lesson[];
  plans: StudentCoursePlan[];
  attendanceSummaries: AttendanceSummary[];
  monthlySnapshots: TeacherMonthlyAssignmentSnapshot[];
}) {
  const [sessionUpdates, setSessionUpdates] = useState<Record<string, LocalSessionStatus>>({});
  const [selectedStudent, setSelectedStudent] = useState(students[0]?.id ?? "");
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [completedLessons, setCompletedLessons] = useState<Record<string, string[]>>({});
  const [currentLessons, setCurrentLessons] = useState<Record<string, string>>({});
  const [complaintText, setComplaintText] = useState("");
  const [savedNotice, setSavedNotice] = useState("");

  const selectedStudentData = students.find((student) => student.id === selectedStudent) ?? students[0];
  const studentPlans = plans.filter((plan) => plan.studentId === selectedStudentData?.id);
  const selectedPlan = useMemo(
    () => studentPlans.find((plan) => plan.id === selectedPlanId) ?? studentPlans[0],
    [selectedPlanId, studentPlans],
  );
  const selectedCourse = courses.find((course) => course.id === selectedPlan?.courseId);
  const selectedProgress = progress.find((record) => record.studentId === selectedStudentData?.id);
  const selectedAttendance = attendanceSummaries.find(
    (summary) => summary.studentId === selectedStudentData?.id,
  );
  const lessonStatus = completedLessons[selectedPlan?.id ?? ""] ?? selectedPlan?.completedLessonIds ?? [];
  const currentLessonId = currentLessons[selectedPlan?.id ?? ""] ?? selectedPlan?.currentLessonId;
  const assignedLessons = lessons.filter((lesson) =>
    selectedPlan?.assignedLessonIds.includes(lesson.id),
  );
  const assignedModuleIds = new Set(assignedLessons.map((lesson) => lesson.moduleId));
  const assignedModules = modules.filter((module) => assignedModuleIds.has(module.id));

  function markSession(sessionId: string, status: LocalSessionStatus) {
    setSessionUpdates((current) => ({ ...current, [sessionId]: status }));
  }

  function markLessonComplete(lessonId: string) {
    if (!selectedPlan) return;
    setCompletedLessons((current) => {
      const existing = current[selectedPlan.id] ?? selectedPlan.completedLessonIds;
      return {
        ...current,
        [selectedPlan.id]: existing.includes(lessonId) ? existing : [...existing, lessonId],
      };
    });
    setCurrentLessons((current) => ({ ...current, [selectedPlan.id]: lessonId }));
    setSavedNotice("Lesson progress saved for teacher, admin, and parent view.");
  }

  function raiseComplaint() {
    if (!complaintText.trim()) {
      setSavedNotice("Write a short complaint or note before submitting.");
      return;
    }
    setSavedNotice(`Complaint created for ${selectedStudentData.name}. Admin can review it in the issue queue.`);
    setComplaintText("");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-zinc-500">Teacher portal</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50">
            Assalamu alaikum, {teacher.name}
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-zinc-400">
            See assigned students, class routine, class links, attendance, lesson
            progress, leave requests, and student complaints from one mobile-ready portal.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="info">Logged in as teacher</Badge>        </div>
      </header>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-sm text-zinc-500">Assigned students</p>
          <p className="mt-2 text-2xl font-semibold text-zinc-50">{students.length}</p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-sm text-zinc-500">Today visible classes</p>
          <p className="mt-2 text-2xl font-semibold text-zinc-50">{sessions.length}</p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-sm text-zinc-500">Progress plans</p>
          <p className="mt-2 text-2xl font-semibold text-zinc-50">{plans.length}</p>
        </div>
      </section>

      <section className="mt-6">
        <Card>
          <CardHeader title="Student count trend" eyebrow="Your monthly assignment history" />
          <CardContent>
            <TeacherStudentCountTrend snapshots={monthlySnapshots} />
          </CardContent>
        </Card>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader title="Class attendance" eyebrow="Teacher action" />
          <CardContent>
            <div className="grid gap-3">
              {sessions.map((session) => {
                const effectiveStatus = sessionUpdates[session.id] ?? session.status;
                return (
                  <article
                    key={session.id}
                    className={cn(
                      "rounded-lg border p-4",
                      effectiveStatus === "completed" &&
                        "border-emerald-800 bg-emerald-950/30",
                      effectiveStatus === "missed" && "border-rose-800 bg-rose-950/30",
                      effectiveStatus !== "completed" &&
                        effectiveStatus !== "missed" &&
                        "border-zinc-800 bg-zinc-950",
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-zinc-50">{session.studentName}</p>
                        <p className="mt-1 text-sm text-zinc-500">
                          {session.day}, {session.startsAt}-
                          {addMinutes(session.startsAt, session.durationMinutes)}
                        </p>
                      </div>
                      <Badge tone={effectiveStatus === "missed" ? "danger" : "neutral"}>
                        {statusLabel(effectiveStatus)}
                      </Badge>
                    </div>
                    <p className="mt-3 text-sm text-zinc-400">{session.note}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={effectiveStatus === "completed" ? "primary" : "secondary"}
                        onClick={() => markSession(session.id, "completed")}
                      >
                        <Check className="h-4 w-4" />
                        Attended
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={effectiveStatus === "missed" ? "danger" : "secondary"}
                        onClick={() => markSession(session.id, "missed")}
                      >
                        <AlertTriangle className="h-4 w-4" />
                        Missed
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => markSession(session.id, "rescheduled")}
                      >
                        <TimerReset className="h-4 w-4" />
                        Rescheduled
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Assigned students" eyebrow="Routine and class link" />
          <CardContent>
            <div className="space-y-3">
              {students.map((student) => {
                const studentPlan = plans.find((plan) => plan.studentId === student.id);
                const attendance = attendanceSummaries.find((summary) => summary.studentId === student.id);
                return (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => {
                      setSelectedStudent(student.id);
                      setSelectedPlanId("");
                    }}
                    className={cn(
                      "w-full rounded-lg border p-4 text-left transition",
                      selectedStudent === student.id
                        ? "border-emerald-500 bg-emerald-950/30"
                        : "border-zinc-800 bg-zinc-950 hover:border-zinc-700",
                    )}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-zinc-50">{student.name}</p>
                        <p className="mt-1 text-xs text-zinc-500">
                          {studentPlan ? getPlanRoutineLabel(studentPlan) : getRoutineLabel(student)}
                        </p>
                      </div>
                      <Badge tone={student.status === "at_risk" ? "warning" : "success"}>
                        {percent(attendance)}% attendance
                      </Badge>
                    </div>
                    <p className="mt-3 flex items-center gap-2 text-xs text-emerald-200">
                      <ExternalLink className="h-3.5 w-3.5" />
                      {studentPlan?.classLink ?? "Class link not assigned"}
                    </p>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader title="Lesson progress" eyebrow="Student course plan" />
          <CardContent>
            <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
              <div className="space-y-4">
                <div>
                  <FieldLabel htmlFor="student">Student</FieldLabel>
                  <select
                    id="student"
                    value={selectedStudent}
                    onChange={(event) => {
                      setSelectedStudent(event.target.value);
                      setSelectedPlanId("");
                    }}
                    className="mt-2 h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none focus:border-emerald-500"
                  >
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <FieldLabel htmlFor="course-plan">Course</FieldLabel>
                  <select
                    id="course-plan"
                    value={selectedPlan?.id ?? ""}
                    onChange={(event) => setSelectedPlanId(event.target.value)}
                    className="mt-2 h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none focus:border-emerald-500"
                  >
                    {studentPlans.map((plan) => {
                      const course = courses.find((item) => item.id === plan.courseId);
                      return (
                        <option key={plan.id} value={plan.id}>
                          {course?.name ?? plan.courseId}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                  <p className="text-sm font-medium text-zinc-50">{selectedStudentData.name}</p>
                  <p className="mt-2 text-sm text-zinc-500">
                    {selectedPlan ? getPlanRoutineLabel(selectedPlan) : getRoutineLabel(selectedStudentData)}
                  </p>
                  <p className="mt-2 text-sm text-emerald-200">{selectedPlan?.classLink}</p>
                  <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <dt className="text-zinc-600">Attendance</dt>
                      <dd className="mt-1 text-zinc-100">{percent(selectedAttendance)}%</dd>
                    </div>
                    <div>
                      <dt className="text-zinc-600">Current note</dt>
                      <dd className="mt-1 text-zinc-100">
                        {selectedProgress?.teacherNote ?? selectedPlan?.teacherNote}
                      </dd>
                    </div>
                  </dl>
                </div>

                {savedNotice ? (
                  <p className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-300">
                    {savedNotice}
                  </p>
                ) : null}
              </div>

              <div className="space-y-4">
                <div>
                  <Badge tone="info">{selectedCourse?.name ?? "Course"}</Badge>
                </div>
                {assignedModules.map((module) => {
                  const moduleLessons = assignedLessons.filter((lesson) => lesson.moduleId === module.id);
                  return (
                    <div key={module.id} className="rounded-lg border border-zinc-800 bg-zinc-950">
                      <div className="border-b border-zinc-800 px-4 py-3">
                        <p className="text-xs text-zinc-500">{module.semester}</p>
                        <h3 className="mt-1 text-sm font-semibold text-zinc-50">{module.title}</h3>
                      </div>
                      <div className="divide-y divide-zinc-900">
                        {moduleLessons.map((lesson) => {
                          const isComplete = lessonStatus.includes(lesson.id);
                          const isCurrent = currentLessonId === lesson.id;
                          return (
                            <div key={lesson.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                              <div className="min-w-0 flex-1">
                                <p className="text-sm text-zinc-100">{lesson.title}</p>
                                <p className="mt-1 text-xs text-zinc-500">
                                  {isCurrent ? "Current lesson" : isComplete ? "Completed" : "Pending"}
                                </p>
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                variant={isComplete ? "primary" : "secondary"}
                                onClick={() => markLessonComplete(lesson.id)}
                              >
                                <Check className="h-4 w-4" />
                                {isComplete ? "Done" : "Complete"}
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Student complaint" eyebrow="Teacher to admin" />
            <CardContent>
              <div className="space-y-4">
                <div>
                  <FieldLabel htmlFor="complaint">Complaint or concern</FieldLabel>
                  <TextArea
                    id="complaint"
                    value={complaintText}
                    onChange={(event) => setComplaintText(event.target.value)}
                    placeholder="Example: Student is not joining class regularly or homework is incomplete."
                  />
                </div>
                <Button type="button" variant="secondary" onClick={raiseComplaint}>
                  <MessageSquareWarning className="h-4 w-4" />
                  Raise complaint
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Leave or late join" eyebrow="Teacher request" />
            <CardContent>
              <div className="space-y-4">
                <div>
                  <FieldLabel htmlFor="leave-date">Date</FieldLabel>
                  <TextInput id="leave-date" type="date" />
                </div>
                <div>
                  <FieldLabel htmlFor="leave-reason">Reason</FieldLabel>
                  <TextArea
                    id="leave-reason"
                    placeholder="Leave request, late join reason, or note for admin"
                  />
                </div>
                <Button type="button">
                  <Send className="h-4 w-4" />
                  Submit request
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
