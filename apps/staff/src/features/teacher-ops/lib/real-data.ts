import { getApiBaseUrl, getBrandHeaders } from "@/lib/brand-config";
import {
  getPlanSegments,
  getScheduledClassMinutesForRange,
} from "@/features/teacher-ops/lib/data";
import type {
  AssignmentSegment,
  Course,
  LeaveRequest,
  ScheduleBooking,
  Student,
  StudentCoursePlan,
  Teacher,
  TeacherFinancialSummary,
  TeacherMonthlyAssignmentSnapshot,
  TeacherMonthlySummary,
  TeacherSalaryBreakdown,
} from "@/features/teacher-ops/lib/types";

type ApiUser = {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  number?: string;
  phone?: string;
  whatsapp?: string;
  guardianName?: string;
  teacherId?: string;
  studentId?: string;
  isBlock?: boolean;
  joiningDate?: string;
  enrolledDate?: string;
  hourlySalaryRate?: number;
  Department?: string;
  monthlyFee?: number;
  durationMinutes?: number;
  startTime?: string;
  weeklyDays?: string[];
  status?: string;
  totalStudents?: string | number;
};

type ApiCurriculum = {
  _id?: string;
  title?: string;
  coverImage?: string;
  status?: string;
  version?: number;
};

type ApiAssignmentSegment = {
  _id?: string;
  id?: string;
  teacherId?: ApiUser | string;
  studentId?: ApiUser | string;
  courseId?: { _id?: string; title?: string; image?: string } | string;
  classLink?: string;
  weeklyDays?: string[];
  startTime?: string;
  durationMinutes?: number;
  monthlyFee?: number;
  teacherHourlyRate?: number;
  effectiveFrom?: string;
  effectiveTo?: string;
  changeReason?: string;
  createdAt?: string;
};

type ApiAssignment = {
  _id: string;
  curriculumId?: ApiCurriculum | string;
  curriculumVersion?: number;
  courseId?: { _id?: string; title?: string; image?: string } | string;
  teacherId?: ApiUser | string;
  studentIds?: Array<ApiUser | string>;
  teacherClassPlanId?: string;
  coursePlan?: {
    title?: string;
    description?: string;
    coverImage?: string;
  };
  schedule?: {
    days?: string[];
    startTime?: string;
    durationMinutes?: number;
    classLink?: string;
    monthlyFee?: number;
    teacherHourlyRate?: number;
    effectiveFrom?: string;
    effectiveTo?: string;
    endDate?: string;
  };
  assignmentSegments?: ApiAssignmentSegment[];
  assignedTo?: string;
  startDate?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  changeReason?: string;
  status?: string;
  teacherNote?: string;
  createdAt?: string;
  updatedAt?: string;
};

type ApiLeave = {
  _id?: string;
  id?: string;
  teacherId?: ApiUser | string;
  teacherCode?: string;
  requestType?: "leave" | "late_join";
  fromDate?: string;
  toDate?: string;
  daysCount?: number;
  reason?: string;
  note?: string;
  status?: "pending" | "approved" | "rejected";
  adminDecisionNote?: string;
  approvedBy?: ApiUser | string;
  approvedAt?: string;
};

export type TeacherOpsLiveData = {
  teachers: Teacher[];
  students: Student[];
  courses: Course[];
  plans: StudentCoursePlan[];
  bookings: ScheduleBooking[];
  leaves: LeaveRequest[];
  assignments: ApiAssignment[];
  loadIssues: string[];
};

const shortDayByName: Record<string, string> = {
  Saturday: "Sat",
  Sat: "Sat",
  Sunday: "Sun",
  Sun: "Sun",
  Monday: "Mon",
  Mon: "Mon",
  Tuesday: "Tue",
  Tue: "Tue",
  Wednesday: "Wed",
  Wed: "Wed",
  Thursday: "Thu",
  Thu: "Thu",
  Friday: "Fri",
  Fri: "Fri",
};

function authHeaders() {
  if (typeof window === "undefined") return {};
  const token = window.localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchApi(path: string) {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    headers: { ...getBrandHeaders(), ...authHeaders() },
    cache: "no-store",
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body?.message || body?.error || `Could not load ${path}`);
  }
  return body?.data || [];
}

function getId(value: string | { _id?: string; id?: string } | undefined) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value._id || value.id || "";
}

function userName(value: ApiUser | string | undefined, fallback = "Unnamed") {
  return typeof value === "object" && value?.name ? value.name : fallback;
}

function normalizeDays(days?: string[]) {
  return (days || []).map((day) => shortDayByName[day] || day).filter(Boolean);
}

function monthLabel(month: Date) {
  return month.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function previousMonth(month = new Date()) {
  return addMonths(monthStart(month), -1);
}

function monthsBetweenInclusive(from: Date, to: Date) {
  const start = monthStart(from);
  const end = monthStart(to);
  if (end < start) return 0;
  return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
}

function dateFromValue(value?: string) {
  if (!value) return null;
  const date = value.includes("T") ? new Date(value) : new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function mapTeacher(user: ApiUser): Teacher {
  return {
    id: getId(user),
    name: user.name || user.email || "Unnamed teacher",
    phone: user.number || user.phone || "",
    whatsapp: user.whatsapp || user.number || "",
    status: user.isBlock ? "paused" : "active",
    salaryType: "class_based",
    baseSalary: Number(user.hourlySalaryRate || 0),
    hourlySalaryRate: Number(user.hourlySalaryRate || 1700),
    joiningDate: user.joiningDate || new Date().toISOString().slice(0, 10),
    totalClassHours: 0,
    totalMissedClasses: 0,
    activeStudents: Number(user.totalStudents || 0),
    lastLeaveDate: "",
    lastUpdated: new Date().toISOString().slice(0, 10),
  };
}

function mapStudent(user: ApiUser, fallbackTeacherId = ""): Student {
  const duration = Number(user.durationMinutes || 60);
  return {
    id: getId(user),
    name: user.name || user.email || "Unnamed student",
    email: user.email || "",
    phone: user.number || user.phone || "",
    whatsapp: user.whatsapp || user.number || "",
    parentName: user.guardianName || "",
    address: "",
    age: "",
    department: user.Department || "",
    admissionDate: user.enrolledDate || "",
    classStartDate: user.enrolledDate || new Date().toISOString().slice(0, 10),
    monthlyFee: Number(user.monthlyFee || 0),
    durationMinutes: duration,
    durationLabel: `${duration} min`,
    startTime: user.startTime || "18:00",
    weeklyDays: normalizeDays(user.weeklyDays),
    assignedTeacherId: fallbackTeacherId,
    status: user.status === "paused" ? "paused" : "active",
  };
}

function segmentUserId(value: ApiUser | string | undefined, fallback = "") {
  return getId(value) || fallback;
}

function mapAssignmentToPlan(assignment: ApiAssignment): StudentCoursePlan | null {
  const firstStudent = assignment.studentIds?.[0];
  const studentId = segmentUserId(firstStudent);
  const teacherId = segmentUserId(assignment.teacherId);
  if (!studentId || !teacherId) return null;

  const coursePlanId =
    (typeof assignment.courseId === "object" && assignment.courseId?._id) ||
    `assignment-course-${assignment._id}`;
  const effectiveFrom = assignment.effectiveFrom || assignment.startDate || assignment.createdAt || new Date().toISOString();
  const rawSegments = assignment.assignmentSegments?.length
    ? assignment.assignmentSegments
    : [
        {
          teacherId: assignment.teacherId,
          studentId: firstStudent,
          courseId: assignment.courseId,
          classLink: assignment.schedule?.classLink,
          weeklyDays: assignment.schedule?.days,
          startTime: assignment.schedule?.startTime,
          durationMinutes: assignment.schedule?.durationMinutes,
          monthlyFee: assignment.schedule?.monthlyFee,
          teacherHourlyRate: assignment.schedule?.teacherHourlyRate,
          effectiveFrom,
          effectiveTo: assignment.effectiveTo || assignment.schedule?.effectiveTo || assignment.schedule?.endDate,
          changeReason: assignment.changeReason,
          createdAt: assignment.createdAt,
        },
      ];

  const segments = rawSegments.map<AssignmentSegment>((segment, index) => ({
    id: segment._id || segment.id || `${assignment._id}-segment-${index + 1}`,
    studentId: segmentUserId(segment.studentId, studentId),
    teacherId: segmentUserId(segment.teacherId, teacherId),
    courseId: segmentUserId(segment.courseId, coursePlanId),
    curriculumId: getId(assignment.curriculumId),
    classLink: segment.classLink || assignment.schedule?.classLink || "",
    weeklyDays: normalizeDays(segment.weeklyDays || assignment.schedule?.days),
    startTime: segment.startTime || assignment.schedule?.startTime || "18:00",
    durationMinutes: Number(segment.durationMinutes || assignment.schedule?.durationMinutes || 60),
    monthlyFee: Number(segment.monthlyFee || assignment.schedule?.monthlyFee || 0),
    teacherHourlyRate: Number(segment.teacherHourlyRate || assignment.schedule?.teacherHourlyRate || 0),
    effectiveFrom: segment.effectiveFrom || effectiveFrom,
    effectiveTo: segment.effectiveTo || assignment.effectiveTo || assignment.schedule?.effectiveTo || assignment.schedule?.endDate,
    changeReason: segment.changeReason || assignment.changeReason || "",
    createdAt: segment.createdAt || assignment.createdAt || effectiveFrom,
  }));
  const activeSegment = [...segments].reverse().find((segment) => !segment.effectiveTo) || segments.at(-1);

  return {
    id: assignment._id,
    studentId,
    teacherId: activeSegment?.teacherId || teacherId,
    courseId: activeSegment?.courseId || coursePlanId,
    curriculumId: getId(assignment.curriculumId),
    classLink: activeSegment?.classLink || assignment.schedule?.classLink || "",
    weeklyDays: activeSegment?.weeklyDays || normalizeDays(assignment.schedule?.days),
    startTime: activeSegment?.startTime || assignment.schedule?.startTime || "18:00",
    durationMinutes: Number(activeSegment?.durationMinutes || assignment.schedule?.durationMinutes || 60),
    monthlyFee: Number(activeSegment?.monthlyFee || assignment.schedule?.monthlyFee || 0),
    teacherHourlyRate: Number(activeSegment?.teacherHourlyRate || assignment.schedule?.teacherHourlyRate || 0),
    startDate: assignment.startDate || effectiveFrom.slice(0, 10),
    effectiveFrom,
    effectiveTo: assignment.effectiveTo,
    changeReason: assignment.changeReason,
    segments,
    currentLessonId: "",
    completedLessonIds: [],
    assignedLessonIds: [],
    updatedAt: assignment.updatedAt || assignment.createdAt || new Date().toISOString(),
    teacherNote: assignment.teacherNote || assignment.coursePlan?.description || "",
  };
}

function mapAssignmentToCourse(assignment: ApiAssignment): Course {
  const courseId =
    (typeof assignment.courseId === "object" && assignment.courseId?._id) ||
    `assignment-course-${assignment._id}`;
  const courseTitle =
    assignment.coursePlan?.title ||
    (typeof assignment.courseId === "object" ? assignment.courseId?.title : "") ||
    (typeof assignment.curriculumId === "object" ? assignment.curriculumId?.title : "") ||
    "Assigned course plan";
  return {
    id: courseId,
    name: courseTitle,
    description: assignment.coursePlan?.description || "",
    department: "",
    coverImage:
      assignment.coursePlan?.coverImage ||
      (typeof assignment.courseId === "object" ? assignment.courseId?.image : "") ||
      "",
  };
}

function mapLeave(leave: ApiLeave): LeaveRequest {
  const teacher = leave.teacherId;
  return {
    id: leave._id || leave.id || "",
    teacherId: getId(teacher) || leave.teacherCode || "",
    fromDate: leave.fromDate || "",
    toDate: leave.toDate || leave.fromDate || "",
    daysCount: Number(leave.daysCount || 1),
    requestType: leave.requestType || "leave",
    reason: leave.reason || "",
    note: leave.note || "",
    status: leave.status || "pending",
    adminDecisionNote: leave.adminDecisionNote || "",
    approvedBy: getId(leave.approvedBy) || "",
    approvedAt: leave.approvedAt || "",
  };
}

function monthStart(month = new Date()) {
  return new Date(month.getFullYear(), month.getMonth(), 1);
}

function monthEnd(month = new Date()) {
  return new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59, 999);
}

function salaryFromMinutes(totalMinutes: number, rate: number) {
  const classHours = totalMinutes / 60;
  const salaryUnit = classHours / 25;
  return {
    classHours,
    salaryUnit,
    payableSalary: salaryUnit * rate,
  };
}

function timeRange(from: string, durationMinutes: number) {
  const [fromHour = 0, fromMinute = 0] = from.split(":").map(Number);
  const start = fromHour * 60 + fromMinute;
  const end = start + durationMinutes;
  const values: string[] = [];

  for (let minute = start; minute < end; minute += 10) {
    values.push(`${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`);
  }

  return values;
}

function buildLiveScheduleBookings(plans: StudentCoursePlan[], students: Student[]): ScheduleBooking[] {
  const seenSlots = new Map<string, string>();
  return plans.flatMap((plan) => {
    const student = students.find((item) => item.id === plan.studentId);
    const activeSegments = getPlanSegments(plan).filter((segment) => segmentIsActiveNow(segment));
    if (!activeSegments.length) return [];

    return activeSegments.flatMap((activeSegment) =>
      activeSegment.weeklyDays.flatMap((day) =>
        timeRange(activeSegment.startTime, activeSegment.durationMinutes).map<ScheduleBooking>((time) => {
        const fullDay =
          Object.entries(shortDayByName).find(([, short]) => short === day && day.length === 3)?.[0] || day;
        const slotKey = `${activeSegment.teacherId}-${fullDay}-${time}`;
        const existingStudentId = seenSlots.get(slotKey);
        const isConflict = Boolean(existingStudentId && existingStudentId !== plan.studentId);
        seenSlots.set(slotKey, plan.studentId);
        return {
          id: `${activeSegment.teacherId}-${plan.id}-${fullDay}-${time}`,
          teacherId: activeSegment.teacherId,
          day: fullDay,
          time,
          status: isConflict ? "conflict" : "booked",
          studentId: plan.studentId,
          studentName: student?.name || "Assigned student",
          durationMinutes: activeSegment.durationMinutes,
          classLink: activeSegment.classLink,
        };
        }),
      ),
    );
  });
}

function rangesOverlap(start: Date, end: Date | null, rangeStart: Date, rangeEnd: Date) {
  return start <= rangeEnd && (!end || end >= rangeStart);
}

function segmentOverlapsMonth(segment: AssignmentSegment, month = new Date()) {
  const start = dateFromValue(segment.effectiveFrom) || monthStart(month);
  const end = segment.effectiveTo ? dateFromValue(segment.effectiveTo) : null;
  return rangesOverlap(start, end, monthStart(month), monthEnd(month));
}

function segmentIsActiveNow(segment: AssignmentSegment, at = new Date()) {
  const start = dateFromValue(segment.effectiveFrom) || at;
  const end = segment.effectiveTo ? dateFromValue(segment.effectiveTo) : null;
  return start <= at && (!end || end >= at);
}

function getTeacherSegmentsForMonth(teacherId: string, plans: StudentCoursePlan[], month = new Date()) {
  return plans.flatMap((plan) =>
    getPlanSegments(plan).filter(
      (segment) => segment.teacherId === teacherId && segmentOverlapsMonth(segment, month),
    ),
  );
}

function getTeacherActiveSegments(teacherId: string, plans: StudentCoursePlan[], at = new Date()) {
  return plans.flatMap((plan) =>
    getPlanSegments(plan).filter(
      (segment) => segment.teacherId === teacherId && segmentIsActiveNow(segment, at),
    ),
  );
}

function getStudentCountForTeacherMonth(teacherId: string, plans: StudentCoursePlan[], month = new Date()) {
  return new Set(getTeacherSegmentsForMonth(teacherId, plans, month).map((segment) => segment.studentId)).size;
}

function getTeacherCurrentBilling(teacherId: string, plans: StudentCoursePlan[], at = new Date()) {
  const feeByStudent = new Map<string, number>();
  getTeacherActiveSegments(teacherId, plans, at).forEach((segment) => {
    feeByStudent.set(segment.studentId, Number(segment.monthlyFee || 0));
  });
  return Array.from(feeByStudent.values()).reduce((sum, fee) => sum + fee, 0);
}

function getTeacherLifetimeBilling(teacherId: string, plans: StudentCoursePlan[], until = new Date()) {
  return plans.reduce((sum, plan) => {
    return (
      sum +
      getPlanSegments(plan)
        .filter((segment) => segment.teacherId === teacherId)
        .reduce((segmentSum, segment) => {
          const start = dateFromValue(segment.effectiveFrom) || until;
          const rawEnd = segment.effectiveTo ? dateFromValue(segment.effectiveTo) || until : until;
          const end = rawEnd > until ? until : rawEnd;
          return segmentSum + Number(segment.monthlyFee || 0) * monthsBetweenInclusive(start, end);
        }, 0)
    );
  }, 0);
}

function getTeacherSalaryForMonth(teacherId: string, teachers: Teacher[], plans: StudentCoursePlan[], month = new Date()) {
  const rangeStart = monthStart(month);
  const rangeEnd = monthEnd(month);
  const teacher = teachers.find((item) => item.id === teacherId);
  const breakdowns = getTeacherSegmentsForMonth(teacherId, plans, month).map((segment) => {
    const start = dateFromValue(segment.effectiveFrom) || rangeStart;
    const end = segment.effectiveTo ? dateFromValue(segment.effectiveTo) || rangeEnd : rangeEnd;
    const totalMinutes = getScheduledClassMinutesForRange({
      days: segment.weeklyDays,
      durationMinutes: segment.durationMinutes,
      startTime: segment.startTime,
      from: start > rangeStart ? start : rangeStart,
      to: end < rangeEnd ? end : rangeEnd,
    });
    const rate = Number(segment.teacherHourlyRate || teacher?.hourlySalaryRate || 0);
    return { totalMinutes, rate, salary: salaryFromMinutes(totalMinutes, rate) };
  });
  const totalMinutes = breakdowns.reduce((sum, item) => sum + item.totalMinutes, 0);
  const payableSalary = breakdowns.reduce((sum, item) => sum + item.salary.payableSalary, 0);
  const effectiveRate = totalMinutes ? (payableSalary * 25) / (totalMinutes / 60) : Number(teacher?.hourlySalaryRate || 0);
  const salary = salaryFromMinutes(totalMinutes, effectiveRate);

  return {
    totalMinutes,
    classHours: salary.classHours,
    salaryUnit: salary.salaryUnit,
    teacherHourlyRate: effectiveRate,
    payableSalary,
    source: "assigned_schedule" as const,
  };
}

export function getTeacherStudentsFromPlans(teacherId: string, students: Student[], plans: StudentCoursePlan[]) {
  const studentIds = new Set(
    getTeacherActiveSegments(teacherId, plans).map((segment) => segment.studentId),
  );
  return students.filter((student) => studentIds.has(student.id));
}

export function getTeacherFinancialSummaryFromPlans(
  teacherId: string,
  teachers: Teacher[],
  students: Student[],
  plans: StudentCoursePlan[],
  month = new Date(),
): TeacherFinancialSummary {
  const teacher = teachers.find((item) => item.id === teacherId);
  const salaryBreakdown: TeacherSalaryBreakdown = getTeacherSalaryForMonth(teacherId, teachers, plans, month);
  const joiningDate = dateFromValue(teacher?.joiningDate) || monthStart(month);
  const monthCount = monthsBetweenInclusive(joiningDate, month);
  const lifetimeSalary = Array.from({ length: monthCount }, (_, index) => addMonths(joiningDate, index)).reduce(
    (sum, monthCursor) => sum + getTeacherSalaryForMonth(teacherId, teachers, plans, monthCursor).payableSalary,
    0,
  );

  return {
    currentStudentBilling: getTeacherCurrentBilling(teacherId, plans, month),
    lifetimeStudentBilling: getTeacherLifetimeBilling(teacherId, plans, month),
    currentSalary: salaryBreakdown.payableSalary,
    lastMonthSalary: getTeacherSalaryForMonth(teacherId, teachers, plans, previousMonth(month)).payableSalary,
    lifetimeSalary,
    salaryBreakdown,
  };
}

export function getLiveTeacherMonthlySummaries(
  teachers: Teacher[],
  students: Student[],
  plans: StudentCoursePlan[],
  month = new Date(),
): TeacherMonthlySummary[] {
  return teachers.map((teacher) => {
    const snapshots = Array.from({ length: 6 }, (_, index) => {
      const snapshotMonth = addMonths(month, index - 5);
      const financial = getTeacherFinancialSummaryFromPlans(teacher.id, teachers, students, plans, snapshotMonth);
      const activeStudents = getStudentCountForTeacherMonth(teacher.id, plans, snapshotMonth);
      return {
        teacherId: teacher.id,
        month: monthLabel(snapshotMonth),
        activeStudents,
        assignedMonthlyValue: financial.currentStudentBilling,
        addedStudents: 0,
        droppedStudents: 0,
        reason: "Live assignment history from backend.",
      } satisfies TeacherMonthlyAssignmentSnapshot;
    });
    const previous = snapshots.at(-2);
    const current = snapshots.at(-1);
    const studentDelta = (current?.activeStudents || 0) - (previous?.activeStudents || 0);
    const valueDelta = (current?.assignedMonthlyValue || 0) - (previous?.assignedMonthlyValue || 0);

    return {
      teacher,
      current,
      previous,
      studentDelta,
      valueDelta,
      trend: studentDelta > 0 ? "up" : studentDelta < 0 ? "down" : "flat",
      snapshots,
    };
  });
}

export function getLiveAllTeacherStudentTrend(
  teachers: Teacher[],
  plans: StudentCoursePlan[],
  month = new Date(),
) {
  return Array.from({ length: 6 }, (_, index) => {
    const snapshotMonth = addMonths(month, index - 5);
    const count = teachers.reduce(
      (sum, teacher) => sum + getStudentCountForTeacherMonth(teacher.id, plans, snapshotMonth),
      0,
    );
    return {
      month: snapshotMonth.toLocaleDateString("en-US", { month: "short" }),
      count,
      reason: "Live backend teacher assignment count.",
    };
  });
}

export async function fetchTeacherOpsLiveData(): Promise<TeacherOpsLiveData> {
  const [teacherResult, studentResult, assignmentResult, leaveResult] = await Promise.allSettled([
    fetchApi("/user/role/teacher?limit=all"),
    fetchApi("/user/role/student?limit=all"),
    fetchApi("/teacher-assignments?status=all"),
    fetchApi("/teacher-leaves?status=all"),
  ]);

  if (teacherResult.status === "rejected") throw teacherResult.reason;
  if (studentResult.status === "rejected") throw studentResult.reason;

  const loadIssues = [
    assignmentResult.status === "rejected" ? `Assignments: ${assignmentResult.reason?.message || "could not load"}` : "",
    leaveResult.status === "rejected" ? `Leaves: ${leaveResult.reason?.message || "could not load"}` : "",
  ].filter(Boolean);

  const teacherUsers = teacherResult.value;
  const studentUsers = studentResult.value;
  const assignments = assignmentResult.status === "fulfilled" ? assignmentResult.value : [];
  const leaves = leaveResult.status === "fulfilled" ? leaveResult.value : [];
  const teachers = (teacherUsers as ApiUser[]).filter((user) => getId(user)).map(mapTeacher);
  const rawAssignments = assignments as ApiAssignment[];
  const plans = rawAssignments.map(mapAssignmentToPlan).filter(Boolean) as StudentCoursePlan[];
  const assignedTeacherByStudent = new Map<string, string>();
  plans.forEach((plan) => {
    assignedTeacherByStudent.set(plan.studentId, plan.teacherId);
  });
  const students = (studentUsers as ApiUser[])
    .filter((user) => getId(user))
    .map((user) => mapStudent(user, assignedTeacherByStudent.get(getId(user)) || ""));
  const courses = rawAssignments.map(mapAssignmentToCourse);

  return {
    teachers,
    students,
    courses,
    plans,
    bookings: buildLiveScheduleBookings(plans, students),
    leaves: (leaves as ApiLeave[]).map(mapLeave),
    assignments: rawAssignments,
    loadIssues,
  };
}
