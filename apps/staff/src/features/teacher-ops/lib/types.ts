export type UserRole = "admin" | "teacher" | "parent";

export type IssueStatus = "new" | "in_review" | "resolved";

export type IssueType =
  | "rule_break"
  | "late_join"
  | "teacher_complaint"
  | "student_complaint"
  | "missed_class"
  | "progress_gap"
  | "admin_support";

export type SessionStatus =
  | "scheduled"
  | "completed"
  | "missed"
  | "cancelled"
  | "rescheduled";

export type Teacher = {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  status: "active" | "needs_attention" | "paused";
  salaryType: "monthly" | "class_based";
  baseSalary: number;
  hourlySalaryRate: number;
  joiningDate: string;
  totalClassHours: number;
  totalMissedClasses: number;
  activeStudents: number;
  lastLeaveDate: string;
  lastUpdated: string;
};

export type Student = {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  parentName: string;
  address: string;
  age: string;
  department: string;
  admissionDate: string;
  classStartDate: string;
  monthlyFee: number;
  durationMinutes: number;
  durationLabel: string;
  startTime: string;
  weeklyDays: string[];
  assignedTeacherId: string;
  status: "active" | "paused" | "at_risk";
};

export type DemoUser = {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  password: string;
  teacherId?: string;
  studentId?: string;
};

export type Course = {
  id: string;
  name: string;
  description: string;
  department: string;
  coverImage?: string;
};

export type CurriculumModule = {
  id: string;
  courseId: string;
  semester: string;
  title: string;
  order: number;
};

export type Lesson = {
  id: string;
  moduleId: string;
  title: string;
  order: number;
  estimatedMinutes: number;
};

export type AssignmentSegment = {
  id: string;
  studentId: string;
  teacherId: string;
  courseId: string;
  curriculumId?: string;
  classLink: string;
  weeklyDays: string[];
  startTime: string;
  durationMinutes: number;
  monthlyFee?: number;
  teacherHourlyRate?: number;
  effectiveFrom: string;
  effectiveTo?: string;
  changeReason?: string;
  createdAt: string;
};

export type StudentCoursePlan = {
  id: string;
  studentId: string;
  teacherId: string;
  courseId: string;
  curriculumId?: string;
  classLink: string;
  weeklyDays: string[];
  startTime: string;
  durationMinutes: number;
  monthlyFee?: number;
  teacherHourlyRate?: number;
  startDate?: string;
  endDate?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  changeReason?: string;
  segments?: AssignmentSegment[];
  currentLessonId: string;
  completedLessonIds: string[];
  assignedLessonIds: string[];
  updatedAt: string;
  teacherNote: string;
};

export type AttendanceSummary = {
  studentId: string;
  scheduledClasses: number;
  attendedClasses: number;
  missedClasses: number;
  rescheduledClasses: number;
};

export type TeacherMonthlyAssignmentSnapshot = {
  teacherId: string;
  month: string;
  activeStudents: number;
  assignedMonthlyValue: number;
  addedStudents: number;
  droppedStudents: number;
  reason: string;
};

export type TeacherMonthlySummary = {
  teacher: Teacher;
  current?: TeacherMonthlyAssignmentSnapshot;
  previous?: TeacherMonthlyAssignmentSnapshot;
  studentDelta: number;
  valueDelta: number;
  trend: "up" | "down" | "flat";
  snapshots: TeacherMonthlyAssignmentSnapshot[];
};

export type ProgressRecord = {
  id: string;
  studentId: string;
  studentName: string;
  currentLesson: string;
  lastMonth: string;
  examScore: string;
  hadith: string;
  surah: string;
  duaMasala: string;
  teacherNote: string;
  parentAdvocacy: string;
  completionPercent: number;
  updatedAt: string;
};

export type ScheduleBooking = {
  id: string;
  teacherId: string;
  day: string;
  time: string;
  status: "booked" | "available" | "conflict";
  studentId?: string;
  studentName?: string;
  durationMinutes?: number;
  classLink?: string;
};

export type ClassSession = {
  id: string;
  teacherId: string;
  studentId: string;
  studentName: string;
  date: string;
  day: string;
  startsAt: string;
  durationMinutes: number;
  status: SessionStatus;
  progressUpdated: boolean;
  note: string;
};

export type Issue = {
  id: string;
  type: IssueType;
  title: string;
  teacherId: string;
  studentId?: string;
  studentName?: string;
  source: "admin" | "teacher" | "parent" | "student" | "import";
  status: IssueStatus;
  priority: "low" | "medium" | "high";
  createdAt: string;
  dueAt?: string;
  description: string;
};

export type LeaveRequest = {
  id: string;
  teacherId: string;
  date?: string;
  fromDate: string;
  toDate: string;
  daysCount: number;
  requestType: "leave" | "late_join";
  reason: string;
  note?: string;
  status: "pending" | "approved" | "rejected";
  adminDecisionNote?: string;
  approvedBy?: string;
  approvedAt?: string;
};

export type MonthlyStudentSnapshot = {
  month: string;
  count: number;
  reason: string;
};

export type TeacherHealthBreakdown = {
  score: number;
  classReliability: number;
  attendanceUpdate: number;
  progressDiscipline: number;
  weeklyFeedback: number;
  complaintQuality: number;
  missedClasses: number;
  openIssues: number;
  progressGaps: number;
  lateJoins: number;
  feedbackMissing: number;
};

export type TeacherSalaryBreakdown = {
  totalMinutes: number;
  classHours: number;
  salaryUnit: number;
  teacherHourlyRate: number;
  payableSalary: number;
  source: "actual_sessions" | "assigned_schedule";
};

export type TeacherFinancialSummary = {
  currentStudentBilling: number;
  lifetimeStudentBilling: number;
  currentSalary: number;
  lastMonthSalary: number;
  lifetimeSalary: number;
  salaryBreakdown: TeacherSalaryBreakdown;
};

export type TeacherLeaveSummary = {
  lastLeave: string;
  lastMonthLeave: number;
  totalLeave: number;
  pending: LeaveRequest[];
};

export type AppData = {
  teacher: Teacher;
  teachers: Teacher[];
  students: Student[];
  demoUsers: DemoUser[];
  courses: Course[];
  modules: CurriculumModule[];
  lessons: Lesson[];
  studentCoursePlans: StudentCoursePlan[];
  attendanceSummaries: AttendanceSummary[];
  teacherMonthlySnapshots: TeacherMonthlyAssignmentSnapshot[];
  progress: ProgressRecord[];
  bookings: ScheduleBooking[];
  sessions: ClassSession[];
  issues: Issue[];
  leaves: LeaveRequest[];
  monthlyTrend: MonthlyStudentSnapshot[];
};
