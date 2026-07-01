"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarPlus,
  CheckCircle2,
  Clock3,
  LinkIcon,
  Route,
  UserRoundCheck,
} from "lucide-react";
import { Badge } from "@/features/teacher-ops/components/ui/badge";
import { Button } from "@/features/teacher-ops/components/ui/button";
import { FieldLabel, TextInput } from "@/features/teacher-ops/components/ui/field";
import { ScheduleGrid } from "@/features/teacher-ops/components/schedule-grid";
import { addMinutes } from "@/features/teacher-ops/lib/data";
import type { Course, ScheduleBooking, Student, Teacher } from "@/features/teacher-ops/lib/types";
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

const getAuthHeaders = () => {
  if (typeof window === "undefined") return {};
  const token = window.localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

function slotRange(start: string, duration: number) {
  const [hour, minute] = start.split(":").map(Number);
  const startMinute = hour * 60 + minute;
  return Array.from({ length: Math.ceil(duration / 10) }, (_, index) => {
    const total = startMinute + index * 10;
    return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
  });
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

export function AdminAssignmentStudio({
  teachers,
  students,
  courses,
  initialBookings,
}: {
  teachers: Teacher[];
  students: Student[];
  courses: Course[];
  initialBookings: ScheduleBooking[];
}) {
  const [teacherId, setTeacherId] = useState(teachers[0]?.id ?? "");
  const [studentId, setStudentId] = useState(students[0]?.id ?? "");
  const [selectedDays, setSelectedDays] = useState<string[]>(["Sat", "Mon", "Wed"]);
  const [startTime, setStartTime] = useState("18:00");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [monthlyFee, setMonthlyFee] = useState(2500);
  const [classLink, setClassLink] = useState("https://meet.google.com/new-class-demo");
  const [selectedCourses, setSelectedCourses] = useState<string[]>(["COURSE-QURAN"]);
  const [curriculums, setCurriculums] = useState<CurriculumOption[]>([]);
  const [selectedCurriculumId, setSelectedCurriculumId] = useState("");
  const [selectedSemesterId, setSelectedSemesterId] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [savedBookings, setSavedBookings] = useState<ScheduleBooking[]>([]);
  const [savedMessage, setSavedMessage] = useState("");

  const student = students.find((item) => item.id === studentId) ?? students[0];
  const teacher = teachers.find((item) => item.id === teacherId) ?? teachers[0];
  const existingBookings = useMemo(
    () => [...initialBookings, ...savedBookings],
    [initialBookings, savedBookings],
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
        existingBookings,
      }),
    [classLink, durationMinutes, existingBookings, selectedDays, startTime, student, teacherId],
  );
  const visibleBookings = useMemo(
    () => [...existingBookings, ...previewBookings],
    [existingBookings, previewBookings],
  );
  const conflictCount = previewBookings.filter((booking) => booking.status === "conflict").length;
  const selectedCurriculum = curriculums.find((item) => item._id === selectedCurriculumId);
  const selectedSemester = selectedCurriculum?.semesters?.find((item) => item._id === selectedSemesterId);
  const selectedModule = selectedSemester?.modules?.find((item) => item._id === selectedModuleId);

  useEffect(() => {
    let isMounted = true;

    async function loadCurriculums() {
      try {
        const response = await fetch(`${getApiBaseUrl()}/curriculums?status=all`, {
          headers: { ...getBrandHeaders(), ...getAuthHeaders() },
          cache: "no-store",
        });
        const body = await response.json();
        const data = body?.data || [];
        if (!isMounted) return;
        setCurriculums(data);
        setSelectedCurriculumId(data[0]?._id || "");
        setSelectedSemesterId(data[0]?.semesters?.[0]?._id || "");
        setSelectedModuleId(data[0]?.semesters?.[0]?.modules?.[0]?._id || "");
        setSelectedItemId(data[0]?.semesters?.[0]?.modules?.[0]?.items?.[0]?._id || "");
      } catch {
        if (isMounted) setCurriculums([]);
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

  function toggleCourse(courseId: string) {
    setSelectedCourses((current) =>
      current.includes(courseId)
        ? current.filter((item) => item !== courseId)
        : [...current, courseId],
    );
  }

  async function saveAssignment() {
    if (!selectedDays.length || !selectedCourses.length || conflictCount > 0) {
      setSavedMessage("Fix the selected days, courses, or schedule conflict before assigning.");
      return;
    }

    setSavedBookings((current) => [...current, ...previewBookings]);
    if (selectedCurriculumId) {
      await fetch(`${getApiBaseUrl()}/teacher-assignments`, {
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
          selectedSemesterId,
          selectedModuleId,
          selectedItemId,
          startDate: new Date().toISOString(),
          teacherClassPlanId: `${teacherId}-${studentId}-${Date.now()}`,
          teacherNote: `Class link: ${classLink}`,
        }),
      }).catch(() => null);
    }
    setSavedMessage(
      `${student.name} assigned to ${teacher.name}. ${selectedDays.length} weekly class days booked.${
        selectedCurriculum ? ` Curriculum: ${selectedCurriculum.title}.` : ""
      }`,
    );
    setSelectedDays([]);
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
              onChange={(event) => setTeacherId(event.target.value)}
              className="mt-2 h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none focus:border-emerald-500"
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
              onChange={(event) => setStudentId(event.target.value)}
              className="mt-2 h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none focus:border-emerald-500"
            >
              {students.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
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
                className={`h-9 rounded-md border text-xs font-medium transition ${
                  selectedDays.includes(day)
                    ? "border-emerald-400 bg-emerald-400 text-emerald-950"
                    : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-600"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <FieldLabel htmlFor="start-time">Start time</FieldLabel>
            <TextInput
              id="start-time"
              type="time"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
            />
          </div>
          <div>
            <FieldLabel htmlFor="duration">Duration</FieldLabel>
            <select
              id="duration"
              value={durationMinutes}
              onChange={(event) => setDurationMinutes(Number(event.target.value))}
              className="mt-2 h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none focus:border-emerald-500"
            >
              <option value={30}>30 min</option>
              <option value={40}>40 min</option>
              <option value={60}>60 min</option>
              <option value={90}>90 min</option>
            </select>
          </div>
          <div>
            <FieldLabel htmlFor="fee">Monthly fee</FieldLabel>
            <TextInput
              id="fee"
              type="number"
              value={monthlyFee}
              onChange={(event) => setMonthlyFee(Number(event.target.value))}
            />
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="class-link">Class link</FieldLabel>
          <TextInput
            id="class-link"
            value={classLink}
            onChange={(event) => setClassLink(event.target.value)}
          />
        </div>

        <div>
          <FieldLabel>Course plan</FieldLabel>
          <div className="mt-2 grid gap-2 md:grid-cols-2">
            {courses.map((course) => (
              <button
                key={course.id}
                type="button"
                onClick={() => toggleCourse(course.id)}
                className={`rounded-lg border p-3 text-left transition ${
                  selectedCourses.includes(course.id)
                    ? "border-emerald-500 bg-emerald-950/40"
                    : "border-zinc-800 bg-zinc-950 hover:border-zinc-600"
                }`}
              >
                <p className="text-sm font-medium text-zinc-50">{course.name}</p>
                <p className="mt-1 text-xs text-zinc-500">{course.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 rounded-lg border border-zinc-800 bg-zinc-950 p-4 md:grid-cols-2">
          <div>
            <FieldLabel htmlFor="curriculum-plan">Central curriculum</FieldLabel>
            <select
              id="curriculum-plan"
              value={selectedCurriculumId}
              onChange={(event) => {
                const nextCurriculum = curriculums.find((item) => item._id === event.target.value);
                setSelectedCurriculumId(event.target.value);
                setSelectedSemesterId(nextCurriculum?.semesters?.[0]?._id || "");
                setSelectedModuleId(nextCurriculum?.semesters?.[0]?.modules?.[0]?._id || "");
                setSelectedItemId(nextCurriculum?.semesters?.[0]?.modules?.[0]?.items?.[0]?._id || "");
              }}
              className="mt-2 h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none focus:border-emerald-500"
            >
              <option value="">No curriculum selected</option>
              {curriculums.map((curriculum) => (
                <option key={curriculum._id} value={curriculum._id}>
                  {curriculum.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel htmlFor="semester-plan">Semester</FieldLabel>
            <select
              id="semester-plan"
              value={selectedSemesterId}
              onChange={(event) => {
                const nextSemester = selectedCurriculum?.semesters?.find(
                  (item) => item._id === event.target.value,
                );
                setSelectedSemesterId(event.target.value);
                setSelectedModuleId(nextSemester?.modules?.[0]?._id || "");
                setSelectedItemId(nextSemester?.modules?.[0]?.items?.[0]?._id || "");
              }}
              className="mt-2 h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none focus:border-emerald-500"
            >
              {(selectedCurriculum?.semesters || []).map((semester) => (
                <option key={semester._id} value={semester._id}>
                  {semester.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel htmlFor="module-plan">Module</FieldLabel>
            <select
              id="module-plan"
              value={selectedModuleId}
              onChange={(event) => {
                const nextModule = selectedSemester?.modules?.find(
                  (item) => item._id === event.target.value,
                );
                setSelectedModuleId(event.target.value);
                setSelectedItemId(nextModule?.items?.[0]?._id || "");
              }}
              className="mt-2 h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none focus:border-emerald-500"
            >
              {(selectedSemester?.modules || []).map((module) => (
                <option key={module._id} value={module._id}>
                  {module.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel htmlFor="lesson-plan">Next lesson item</FieldLabel>
            <select
              id="lesson-plan"
              value={selectedItemId}
              onChange={(event) => setSelectedItemId(event.target.value)}
              className="mt-2 h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none focus:border-emerald-500"
            >
              {(selectedModule?.items || []).map((item) => (
                <option key={item._id} value={item._id}>
                  {item.title} ({item.type})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={conflictCount ? "danger" : "success"}>
              {conflictCount ? `${conflictCount} conflict slots` : "No conflict"}
            </Badge>
            <Badge tone="info">
              {selectedDays.length} days, {startTime}-{addMinutes(startTime, durationMinutes)}
            </Badge>
            <Badge tone="neutral">Fee admin-only: BDT {monthlyFee}</Badge>
          </div>
          <div className="mt-4 grid gap-3 text-sm text-zinc-400 sm:grid-cols-3">
            <p className="flex items-center gap-2">
              <UserRoundCheck className="h-4 w-4 text-emerald-300" />
              {teacher.name}
            </p>
            <p className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-emerald-300" />
              {student.name}
            </p>
            <p className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-emerald-300" />
              Class link saved
            </p>
          </div>
        </div>

        {savedMessage ? (
          <p className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-300">
            {savedMessage}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={saveAssignment}>
            <CalendarPlus className="h-4 w-4" />
            Assign and book
          </Button>
          <Button type="button" variant="secondary">
            <Route className="h-4 w-4" />
            Create lesson plan
          </Button>
        </div>
      </div>

      <div className="min-w-0 rounded-lg border border-zinc-800 bg-zinc-950 p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Auto booking preview
            </p>
            <h3 className="mt-1 text-base font-semibold text-zinc-50">
              Weekly board from assignments
            </h3>
          </div>
          <CheckCircle2 className="h-5 w-5 text-emerald-300" />
        </div>
        <ScheduleGrid bookings={visibleBookings.filter((booking) => booking.teacherId === teacherId)} />
      </div>
    </div>
  );
}
