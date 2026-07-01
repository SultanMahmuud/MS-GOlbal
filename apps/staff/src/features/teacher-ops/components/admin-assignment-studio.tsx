"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarPlus,
  CheckCircle2,
  Clock3,
  ImageIcon,
  LinkIcon,
  Upload,
  UserRoundCheck,
} from "lucide-react";
import { Badge } from "@/features/teacher-ops/components/ui/badge";
import { Button } from "@/features/teacher-ops/components/ui/button";
import { FieldLabel, TextArea, TextInput } from "@/features/teacher-ops/components/ui/field";
import { ScheduleGrid } from "@/features/teacher-ops/components/schedule-grid";
import { addMinutes, getCurrentPlanSegment, getPlanSegments } from "@/features/teacher-ops/lib/data";
import type { Course, ScheduleBooking, Student, StudentCoursePlan, Teacher } from "@/features/teacher-ops/lib/types";
import { cn, formatCurrency } from "@/features/teacher-ops/lib/utils";
import { getApiBaseUrl, getBrandHeaders } from "@/lib/brand-config";

const days = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
const dayNames: Record<string, string> = {
  Sat: "Saturday",
  Sun: "Sunday",
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
};

type CurriculumOption = {
  _id: string;
  title: string;
  status: string;
  coverImage?: string;
  semesters?: Array<{
    _id?: string;
    title: string;
    modules?: Array<{
      _id?: string;
      title: string;
      items?: Array<{
        _id?: string;
        title: string;
        type: string;
      }>;
    }>;
  }>;
};

const isMongoId = (value: string) => /^[a-f\d]{24}$/i.test(value);

const selectClass =
  "mt-2 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100";

const getAuthHeaders = () => {
  if (typeof window === "undefined") return {};
  const token = window.localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

function toDateTimeLocalValue(date = new Date()) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 16);
}

function isoFromDateTimeLocal(value: string) {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function closeBefore(isoValue: string) {
  const date = new Date(isoValue);
  return new Date(date.getTime() - 60_000).toISOString();
}

function slotRange(start: string, duration: number) {
  const [hour, minute] = start.split(":").map(Number);
  const startMinute = hour * 60 + minute;
  return Array.from({ length: Math.ceil(duration / 10) }, (_, index) => {
    const total = startMinute + index * 10;
    return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
  });
}

function countCurriculumItems(curriculum?: CurriculumOption) {
  return (curriculum?.semesters || []).reduce(
    (total, semester) =>
      total +
      (semester.modules || []).reduce(
        (moduleTotal, module) => moduleTotal + (module.items || []).length,
        0,
      ),
    0,
  );
}

function createPreviewBookings({
  teacherId,
  student,
  selectedDays,
  startTime,
  durationMinutes,
  classLink,
  existingBookings,
}: {
  teacherId: string;
  student: Student;
  selectedDays: string[];
  startTime: string;
  durationMinutes: number;
  classLink: string;
  existingBookings: ScheduleBooking[];
}) {
  return selectedDays.flatMap((day) =>
    slotRange(startTime, durationMinutes).map<ScheduleBooking>((time) => {
      const fullDay = dayNames[day];
      const hasConflict = existingBookings.some(
        (booking) =>
          booking.teacherId === teacherId &&
          booking.day === fullDay &&
          booking.time === time,
      );

      return {
        id: `preview-${teacherId}-${student.id}-${fullDay}-${time}`,
        teacherId,
        day: fullDay,
        time,
        status: hasConflict ? "conflict" : "booked",
        studentId: student.id,
        studentName: student.name,
        durationMinutes,
        classLink,
      };
    }),
  );
}

function getPlanMonthlyFee(plan: StudentCoursePlan | undefined, student: Student | undefined) {
  const segment = plan ? getCurrentPlanSegment(plan) : null;
  return segment?.monthlyFee ?? plan?.monthlyFee ?? student?.monthlyFee ?? 0;
}

function getPlanTeacherRate(plan: StudentCoursePlan | undefined, teacher: Teacher | undefined) {
  const segment = plan ? getCurrentPlanSegment(plan) : null;
  return segment?.teacherHourlyRate ?? plan?.teacherHourlyRate ?? teacher?.hourlySalaryRate ?? 1700;
}

function extractUploadUrl(body: unknown) {
  if (typeof body === "string") return body;
  if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;
    return String(record.url || record.imageUrl || record.secure_url || record.data || "");
  }
  return "";
}

export function AdminAssignmentStudio({
  teachers,
  students,
  courses,
  plans,
  initialBookings,
  onSaved,
}: {
  teachers: Teacher[];
  students: Student[];
  courses: Course[];
  plans: StudentCoursePlan[];
  initialBookings: ScheduleBooking[];
  onSaved?: () => Promise<void> | void;
}) {
  const [localPlans, setLocalPlans] = useState<StudentCoursePlan[]>(plans);
  const [teacherId, setTeacherId] = useState(teachers[0]?.id ?? "");
  const [studentId, setStudentId] = useState(students[0]?.id ?? "");
  const [selectedDays, setSelectedDays] = useState<string[]>(["Sat", "Mon", "Wed"]);
  const [startTime, setStartTime] = useState("18:00");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [monthlyFee, setMonthlyFee] = useState(2500);
  const [teacherHourlyRate, setTeacherHourlyRate] = useState(teachers[0]?.hourlySalaryRate ?? 1700);
  const [classLink, setClassLink] = useState("https://meet.google.com/new-class-demo");
  const [effectiveAt, setEffectiveAt] = useState(toDateTimeLocalValue());
  const [changeReason, setChangeReason] = useState("New schedule assignment");
  const [courseTitle, setCourseTitle] = useState("Quran Class Live");
  const [courseDescription, setCourseDescription] = useState(
    "Personal learning plan assigned from central curriculum.",
  );
  const [courseImage, setCourseImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [curriculums, setCurriculums] = useState<CurriculumOption[]>([]);
  const [selectedCurriculumId, setSelectedCurriculumId] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [curriculumMessage, setCurriculumMessage] = useState("Loading saved curriculums...");
  const [saving, setSaving] = useState(false);

  const student = students.find((item) => item.id === studentId) ?? students[0];
  const teacher = teachers.find((item) => item.id === teacherId) ?? teachers[0];
  const selectedPlan = localPlans.find(
    (plan) =>
      plan.studentId === studentId &&
      getPlanSegments(plan).some((segment) => segment.teacherId === teacherId),
  );
  const studentPlanForHistory = selectedPlan || localPlans.find((plan) => plan.studentId === studentId);
  const existingBookings = useMemo(
    () => initialBookings,
    [initialBookings],
  );
  const boardBaseBookings = useMemo(
    () =>
      existingBookings.filter(
        (booking) => !(booking.teacherId === teacherId && booking.studentId === studentId),
      ),
    [existingBookings, studentId, teacherId],
  );
  const previewBookings = useMemo(
    () =>
      createPreviewBookings({
        teacherId,
        student,
        selectedDays,
        startTime,
        durationMinutes,
        classLink,
        existingBookings: boardBaseBookings,
      }),
    [boardBaseBookings, classLink, durationMinutes, selectedDays, startTime, student, teacherId],
  );
  const visibleBookings = useMemo(
    () => [...boardBaseBookings, ...previewBookings],
    [boardBaseBookings, previewBookings],
  );
  const conflictCount = previewBookings.filter((booking) => booking.status === "conflict").length;
  const selectedCurriculum = curriculums.find((item) => item._id === selectedCurriculumId);
  const isEditingExistingPlan = Boolean(studentPlanForHistory);

  useEffect(() => {
    setLocalPlans(plans);
  }, [plans]);

  useEffect(() => {
    if (!teacherId && teachers[0]?.id) setTeacherId(teachers[0].id);
    if (!studentId && students[0]?.id) setStudentId(students[0].id);
  }, [studentId, students, teacherId, teachers]);

  function applyPlanToForm(plan: StudentCoursePlan, nextTeacherId = plan.teacherId) {
    const segment =
      [...getPlanSegments(plan)].reverse().find((item) => item.teacherId === nextTeacherId) ||
      getCurrentPlanSegment(plan) ||
      getPlanSegments(plan)[0];
    const segmentTeacherId = segment?.teacherId || nextTeacherId;
    const nextTeacher = teachers.find((item) => item.id === segmentTeacherId);
    const nextStudent = students.find((item) => item.id === plan.studentId);
    const planCourse = courses.find((course) => course.id === plan.courseId);

    setTeacherId(segmentTeacherId);
    setSelectedDays(segment?.weeklyDays || plan.weeklyDays);
    setStartTime(segment?.startTime || plan.startTime);
    setDurationMinutes(segment?.durationMinutes || plan.durationMinutes);
    setMonthlyFee(getPlanMonthlyFee(plan, nextStudent));
    setTeacherHourlyRate(getPlanTeacherRate(plan, nextTeacher));
    setClassLink(segment?.classLink || plan.classLink);
    setEffectiveAt(toDateTimeLocalValue());
    setChangeReason(segment?.changeReason || "Schedule update");
    if (plan.curriculumId) setSelectedCurriculumId(plan.curriculumId);
    setCourseTitle(planCourse?.name || "Course plan");
    setCourseDescription(planCourse?.description || plan.teacherNote || "Personal learning plan assigned from central curriculum.");
    setCourseImage(planCourse?.coverImage || "");
    setImagePreview(planCourse?.coverImage || "");
    setSavedMessage(`${nextStudent?.name || "Student"}'s existing schedule loaded for editing.`);
  }

  function loadStudentPlan(nextStudentId: string, preferredTeacherId = teacherId) {
    const planForTeacher = localPlans.find(
      (plan) => plan.studentId === nextStudentId && plan.teacherId === preferredTeacherId,
    );
    const firstStudentPlan = localPlans.find((plan) => plan.studentId === nextStudentId);
    const nextPlan = planForTeacher || firstStudentPlan;
    setStudentId(nextStudentId);

    if (nextPlan) {
      applyPlanToForm(nextPlan, nextPlan.teacherId);
      return;
    }

    const nextStudent = students.find((item) => item.id === nextStudentId);
    setMonthlyFee(nextStudent?.monthlyFee ?? monthlyFee);
    setSelectedDays(nextStudent?.weeklyDays ?? selectedDays);
    setStartTime(nextStudent?.startTime ?? startTime);
    setDurationMinutes(nextStudent?.durationMinutes ?? durationMinutes);
    setEffectiveAt(toDateTimeLocalValue());
    setChangeReason("New schedule assignment");
    setSavedMessage("No existing assignment found. Create a new schedule for this student.");
  }

  function loadTeacherPlan(nextTeacherId: string) {
    const nextTeacher = teachers.find((item) => item.id === nextTeacherId);
    const planForTeacher = localPlans.find(
      (plan) => plan.studentId === studentId && plan.teacherId === nextTeacherId,
    );
    setTeacherId(nextTeacherId);
    setTeacherHourlyRate(nextTeacher?.hourlySalaryRate ?? teacherHourlyRate);

    if (planForTeacher) {
      applyPlanToForm(planForTeacher, nextTeacherId);
      return;
    }

    setEffectiveAt(toDateTimeLocalValue());
    setChangeReason("Teacher changed");
    setSavedMessage("No schedule exists for this teacher/student pair yet. Create a new one below.");
  }

  useEffect(() => {
    let isMounted = true;

    async function loadCurriculums() {
      try {
        const response = await fetch(`${getApiBaseUrl()}/curriculums?status=published`, {
          headers: { ...getBrandHeaders(), ...getAuthHeaders() },
          cache: "no-store",
        });
        const body = await response.json();
        const data = body?.data || [];
        if (!isMounted) return;
        setCurriculums(data);
        setSelectedCurriculumId(data[0]?._id || "");
        if (!response.ok) {
          setCurriculumMessage("Admin session is needed to load central curriculums.");
        } else if (data.length) {
          setCurriculumMessage(`${data.length} saved curriculum${data.length === 1 ? "" : "s"} loaded.`);
        } else {
          setCurriculumMessage("No published curriculum found. Publish one in Curriculum Management first.");
        }
      } catch {
        if (isMounted) {
          setCurriculums([]);
          setCurriculumMessage("Could not load curriculums. Check admin login and backend connection.");
        }
      }
    }

    loadCurriculums();
    return () => {
      isMounted = false;
    };
  }, []);

  function toggleDay(day: string) {
    setSelectedDays((current) =>
      current.includes(day)
        ? current.filter((item) => item !== day)
        : [...current, day],
    );
  }

  useEffect(() => {
    const firstPlan = localPlans.find((plan) => plan.studentId === studentId) || localPlans[0];
    if (firstPlan) {
      setStudentId(firstPlan.studentId);
      applyPlanToForm(firstPlan, firstPlan.teacherId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function uploadCourseImage(file: File) {
    setImagePreview(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    setSavedMessage("");

    try {
      const response = await fetch(`${getApiBaseUrl()}/images`, {
        method: "POST",
        headers: { ...getBrandHeaders(), ...getAuthHeaders() },
        body: formData,
      });
      const body = await response.json().catch(() => null);
      const nextUrl = extractUploadUrl(body);
      if (!response.ok || !nextUrl) {
        throw new Error("Upload failed");
      }
      setCourseImage(nextUrl);
      setImagePreview(nextUrl);
      setSavedMessage("Course plan image uploaded.");
    } catch {
      setSavedMessage("Image preview added, but upload did not finish. Try again before saving.");
    } finally {
      setUploading(false);
    }
  }

  async function saveAssignment() {
    if (!teacher || !student) {
      setSavedMessage("Teacher and student data must load before assigning.");
      return;
    }
    if (!selectedDays.length || !courseTitle.trim() || !selectedCurriculumId || conflictCount > 0) {
      setSavedMessage("Fix course title, central curriculum, selected days, or schedule conflict before assigning.");
      return;
    }
    if (!isMongoId(teacherId) || !isMongoId(studentId)) {
      setSavedMessage("This assignment needs real backend teacher and student records. Demo IDs will not be saved.");
      return;
    }
    setSaving(true);
    setSavedMessage("Saving assignment to backend...");

    const effectiveFromIso = isoFromDateTimeLocal(effectiveAt);
    const effectiveDate = new Date(effectiveFromIso);
    const previousSegmentClosedAt = closeBefore(effectiveFromIso);
    const basePlan = studentPlanForHistory;
    const nextSegment = {
      id: `${basePlan?.id || `LOCAL-${teacherId}-${studentId}`}-SEG-${Date.now()}`,
      studentId,
      teacherId,
      courseId: basePlan?.courseId || courses[0]?.id || "COURSE-CUSTOM",
      classLink,
      weeklyDays: selectedDays,
      startTime,
      durationMinutes,
      monthlyFee,
      teacherHourlyRate,
      effectiveFrom: effectiveFromIso,
      changeReason: changeReason.trim() || "Schedule update",
      createdAt: new Date().toISOString(),
    };
    const previousSegments = basePlan
      ? getPlanSegments(basePlan)
          .filter((segment) => new Date(segment.effectiveFrom).getTime() !== effectiveDate.getTime())
          .map((segment) => {
            const segmentStart = new Date(segment.effectiveFrom);
            const segmentEnd = segment.effectiveTo ? new Date(segment.effectiveTo) : null;
            const shouldClose = segmentStart < effectiveDate && (!segmentEnd || segmentEnd >= effectiveDate);
            return shouldClose ? { ...segment, effectiveTo: previousSegmentClosedAt } : segment;
          })
      : [];
    const nextPlan: StudentCoursePlan = {
      id: basePlan?.id || `LOCAL-${teacherId}-${studentId}-${Date.now()}`,
      studentId,
      teacherId,
      courseId: nextSegment.courseId,
      classLink,
      weeklyDays: selectedDays,
      startTime,
      durationMinutes,
      monthlyFee,
      teacherHourlyRate,
      startDate: basePlan?.startDate || effectiveFromIso.slice(0, 10),
      endDate: undefined,
      effectiveFrom: effectiveFromIso,
      effectiveTo: undefined,
      changeReason: nextSegment.changeReason,
      segments: [...previousSegments, nextSegment],
      currentLessonId: basePlan?.currentLessonId || "",
      completedLessonIds: basePlan?.completedLessonIds || [],
      assignedLessonIds: basePlan?.assignedLessonIds || [],
      updatedAt: new Date().toISOString().slice(0, 10),
      teacherNote: `Course plan: ${courseTitle}. ${courseDescription}`,
    };
    try {
      const response = await fetch(`${getApiBaseUrl()}/teacher-assignments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getBrandHeaders(),
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          curriculumId: selectedCurriculumId,
          teacherId: isMongoId(teacherId) ? teacherId : undefined,
          studentIds: isMongoId(studentId) ? [studentId] : [],
          assignedTo: "teacherClassPlan",
          startDate: effectiveFromIso,
          effectiveFrom: effectiveFromIso,
          changeReason: nextSegment.changeReason,
          teacherClassPlanId: basePlan?.id || `${teacherId}-${studentId}-${Date.now()}`,
          coursePlan: {
            title: courseTitle.trim(),
            description: courseDescription.trim(),
            coverImage: courseImage,
          },
          schedule: {
            days: selectedDays.map((day) => dayNames[day]),
            startTime,
            durationMinutes,
            classLink,
            monthlyFee,
            teacherHourlyRate,
            effectiveFrom: effectiveFromIso,
          },
          assignmentSegment: nextSegment,
          teacherNote: `Class link: ${classLink}`,
        }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(body?.message || body?.error || "Backend did not save the assignment.");
      }
      setLocalPlans((current) => {
        const exists = current.some((plan) => plan.id === nextPlan.id);
        return exists ? current.map((plan) => (plan.id === nextPlan.id ? nextPlan : plan)) : [...current, nextPlan];
      });
      await onSaved?.();
      setSavedMessage(
        `${isEditingExistingPlan ? "Updated" : "Assigned"} ${student.name} for ${teacher.name}. ${courseTitle} uses ${
          selectedCurriculum?.title || "selected curriculum"
        } from ${new Date(effectiveFromIso).toLocaleString()} with ${countCurriculumItems(selectedCurriculum)} lesson items. Backend saved and refreshed.`,
      );
    } catch (error) {
      setSavedMessage(error instanceof Error ? error.message : "Assignment was not saved. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!teachers.length || !students.length) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
        Real teacher/student data could not be loaded. Check admin login and backend connection.
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <FieldLabel htmlFor="assign-teacher">Teacher</FieldLabel>
            <select
              id="assign-teacher"
              value={teacherId}
              onChange={(event) => loadTeacherPlan(event.target.value)}
              className={selectClass}
            >
              {teachers.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel htmlFor="assign-student">Student</FieldLabel>
            <select
              id="assign-student"
              value={studentId}
              onChange={(event) => loadStudentPlan(event.target.value)}
              className={selectClass}
            >
              {students.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="grid gap-4 md:grid-cols-[1fr_180px]">
            <div className="space-y-4">
              <div>
                <FieldLabel htmlFor="course-title">Course plan title</FieldLabel>
                <TextInput
                  id="course-title"
                  value={courseTitle}
                  className="mt-2"
                  onChange={(event) => setCourseTitle(event.target.value)}
                />
              </div>
              <div>
                <FieldLabel htmlFor="course-description">Course plan description</FieldLabel>
                <TextArea
                  id="course-description"
                  value={courseDescription}
                  className="mt-2"
                  onChange={(event) => setCourseDescription(event.target.value)}
                />
              </div>
            </div>
            <div>
              <FieldLabel>Course image</FieldLabel>
              <div className="mt-2 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-white dark:border-zinc-700 dark:bg-zinc-900">
                {imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imagePreview} alt="" className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon className="h-10 w-10 text-slate-300 dark:text-zinc-600" />
                )}
              </div>
              <label className="mt-3 inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800">
                <Upload className="h-4 w-4" />
                {uploading ? "Uploading..." : "Upload image"}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) uploadCourseImage(file);
                  }}
                />
              </label>
            </div>
          </div>
        </div>

        <div>
          <FieldLabel>Weekly class days</FieldLabel>
          <div className="mt-2 grid grid-cols-7 gap-2">
            {days.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={cn(
                  "h-9 rounded-md border text-xs font-medium transition",
                  selectedDays.includes(day)
                    ? "border-emerald-400 bg-emerald-400 text-emerald-950"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:border-zinc-600",
                )}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950 sm:grid-cols-[240px_1fr]">
          <div>
            <FieldLabel htmlFor="effective-at">Effective from</FieldLabel>
            <TextInput
              id="effective-at"
              type="datetime-local"
              value={effectiveAt}
              className="mt-2"
              onChange={(event) => setEffectiveAt(event.target.value)}
            />
            <p className="mt-2 text-xs text-slate-500 dark:text-zinc-500">
              Salary minutes count only from this exact timestamp.
            </p>
          </div>
          <div>
            <FieldLabel htmlFor="change-reason">Change reason</FieldLabel>
            <TextInput
              id="change-reason"
              value={changeReason}
              className="mt-2"
              onChange={(event) => setChangeReason(event.target.value)}
              placeholder="Teacher changed, day changed, duration changed..."
            />
            <p className="mt-2 text-xs text-slate-500 dark:text-zinc-500">
              The old schedule will close one minute before this timestamp.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
            <FieldLabel htmlFor="start-time">Start time</FieldLabel>
            <TextInput
              id="start-time"
              type="time"
              value={startTime}
              className="mt-2"
              onChange={(event) => setStartTime(event.target.value)}
            />
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
            <FieldLabel htmlFor="duration">Duration</FieldLabel>
            <select
              id="duration"
              value={durationMinutes}
              onChange={(event) => setDurationMinutes(Number(event.target.value))}
              className={selectClass}
            >
              <option value={30}>30 min</option>
              <option value={40}>40 min</option>
              <option value={60}>60 min</option>
              <option value={90}>90 min</option>
            </select>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
            <FieldLabel htmlFor="fee">Student monthly fee</FieldLabel>
            <TextInput
              id="fee"
              type="number"
              value={monthlyFee}
              className="mt-2"
              onChange={(event) => setMonthlyFee(Number(event.target.value))}
            />
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
            <FieldLabel htmlFor="teacher-rate">Teacher salary rate</FieldLabel>
            <TextInput
              id="teacher-rate"
              type="number"
              value={teacherHourlyRate}
              className="mt-2"
              onChange={(event) => setTeacherHourlyRate(Number(event.target.value))}
            />
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="class-link">Class link</FieldLabel>
          <TextInput
            id="class-link"
            value={classLink}
            className="mt-2"
            onChange={(event) => setClassLink(event.target.value)}
          />
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <FieldLabel htmlFor="curriculum-plan">Central curriculum</FieldLabel>
          <select
            id="curriculum-plan"
            value={selectedCurriculumId}
            onChange={(event) => setSelectedCurriculumId(event.target.value)}
            className={selectClass}
          >
            <option value="">Select one curriculum</option>
            {curriculums.map((curriculum) => (
              <option key={curriculum._id} value={curriculum._id}>
                {curriculum.title}
              </option>
            ))}
          </select>
          <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
            {selectedCurriculum
              ? `${selectedCurriculum.semesters?.length || 0} semesters and ${countCurriculumItems(selectedCurriculum)} lesson items will be visible to the student and teacher.`
              : curriculumMessage}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={isEditingExistingPlan ? "info" : "neutral"}>
              {isEditingExistingPlan ? "Editing existing schedule" : "New assignment"}
            </Badge>
            <Badge tone={conflictCount ? "danger" : "success"}>
              {conflictCount ? `${conflictCount} conflict slots` : "No conflict"}
            </Badge>
            <Badge tone="info">
              {selectedDays.length} days, {startTime}-{addMinutes(startTime, durationMinutes)}
            </Badge>
            <Badge tone="neutral">Effective: {effectiveAt.replace("T", " ")}</Badge>
            <Badge tone="neutral">Fee admin-only: BDT {monthlyFee}</Badge>
            <Badge tone="neutral">Teacher rate: {formatCurrency(teacherHourlyRate)}/hour</Badge>
          </div>
          <div className="mt-4 grid gap-3 text-sm text-slate-500 dark:text-zinc-400 sm:grid-cols-3">
            <p className="flex items-center gap-2">
              <UserRoundCheck className="h-4 w-4 text-emerald-500 dark:text-emerald-300" />
              {teacher.name}
            </p>
            <p className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-emerald-500 dark:text-emerald-300" />
              {student.name}
            </p>
            <p className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-emerald-500 dark:text-emerald-300" />
              Class link saved
            </p>
          </div>
        </div>

        {savedMessage ? (
          <p className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
            {savedMessage}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={saveAssignment} disabled={saving}>
            <CalendarPlus className="h-4 w-4" />
            {saving ? "Saving..." : isEditingExistingPlan ? "Update schedule" : "Assign and book"}
          </Button>
        </div>
      </div>

      <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-zinc-500">
              Auto booking preview
            </p>
            <h3 className="mt-1 text-base font-semibold text-slate-950 dark:text-zinc-50">
              Weekly board from assignments
            </h3>
          </div>
          <CheckCircle2 className="h-5 w-5 text-emerald-500 dark:text-emerald-300" />
        </div>
        <ScheduleGrid bookings={visibleBookings.filter((booking) => booking.teacherId === teacherId)} />
      </div>
    </div>
  );
}
