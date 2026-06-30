import type {
  AppData,
  AttendanceSummary,
  ClassSession,
  Course,
  CurriculumModule,
  DemoUser,
  Issue,
  Lesson,
  MonthlyStudentSnapshot,
  ProgressRecord,
  ScheduleBooking,
  Student,
  StudentCoursePlan,
  Teacher,
  TeacherMonthlyAssignmentSnapshot,
  TeacherMonthlySummary,
} from "./types";

const dayNames: Record<string, string> = {
  Sat: "Saturday",
  Sun: "Sunday",
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
};

function dayName(day: string) {
  return dayNames[day] ?? day;
}

export const primaryTeacher: Teacher = {
  id: "TID2511",
  name: "Noor Mohammad",
  phone: "1600068045",
  whatsapp: "1600068045",
  status: "needs_attention",
  salaryType: "monthly",
  baseSalary: 36000,
  totalClassHours: 135.3,
  totalMissedClasses: 3,
  activeStudents: 8,
  lastLeaveDate: "2026-05-08",
  lastUpdated: "2026-06-24",
};

export const teachers: Teacher[] = [
  primaryTeacher,
  {
    id: "TID2512",
    name: "Fatema Akter",
    phone: "01800000000",
    whatsapp: "01800000000",
    status: "active",
    salaryType: "class_based",
    baseSalary: 28000,
    totalClassHours: 91.8,
    totalMissedClasses: 1,
    activeStudents: 11,
    lastLeaveDate: "2026-06-03",
    lastUpdated: "2026-06-24",
  },
  {
    id: "TID2513",
    name: "Mahmud Hasan",
    phone: "01700000000",
    whatsapp: "01700000000",
    status: "active",
    salaryType: "monthly",
    baseSalary: 32000,
    totalClassHours: 118.4,
    totalMissedClasses: 0,
    activeStudents: 14,
    lastLeaveDate: "2026-05-21",
    lastUpdated: "2026-06-24",
  },
];

export const demoUsers: DemoUser[] = [
  {
    id: "USR-ADMIN-1",
    role: "admin",
    name: "Operations Admin",
    email: "admin@teacherops.local",
    password: "admin123",
  },
  {
    id: "USR-TEACHER-1",
    role: "teacher",
    name: primaryTeacher.name,
    email: "teacher@teacherops.local",
    password: "teacher123",
    teacherId: primaryTeacher.id,
  },
  {
    id: "USR-TEACHER-2",
    role: "teacher",
    name: "Fatema Akter",
    email: "fatema@teacherops.local",
    password: "teacher123",
    teacherId: "TID2512",
  },
  {
    id: "USR-TEACHER-3",
    role: "teacher",
    name: "Mahmud Hasan",
    email: "mahmud@teacherops.local",
    password: "teacher123",
    teacherId: "TID2513",
  },
  {
    id: "USR-PARENT-1",
    role: "parent",
    name: "Parent - Badhon",
    email: "parent@teacherops.local",
    password: "parent123",
    studentId: "SID25484",
  },
  {
    id: "USR-PARENT-2",
    role: "parent",
    name: "Parent - Arif Uddin",
    email: "arif.parent@teacherops.local",
    password: "parent123",
    studentId: "SID25533",
  },
];

export const students: Student[] = [
  {
    id: "MSID26572",
    name: "Afif Hossain ayan",
    email: "nai@gamil.com",
    phone: "329793044444",
    whatsapp: "329793044444",
    parentName: "Zakir hossain",
    address: "Rome, Italy",
    age: "7",
    department: "Hifz review",
    admissionDate: "2026-04-19",
    classStartDate: "2026-04-19",
    monthlyFee: 1500,
    durationMinutes: 60,
    durationLabel: "60 min",
    startTime: "16:00",
    weeklyDays: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu"],
    assignedTeacherId: "TID2511",
    status: "at_risk",
  },
  {
    id: "SID24465",
    name: "Abdur Rhaman",
    email: "nai@gamil.com",
    phone: "329793044444",
    whatsapp: "329793044444",
    parentName: "MD.Karim Uddin",
    address: "United Arab Emirates",
    age: "11",
    department: "Quran / Qaida",
    admissionDate: "2024-12-02",
    classStartDate: "2025-03-01",
    monthlyFee: 2500,
    durationMinutes: 60,
    durationLabel: "60 min",
    startTime: "17:30",
    weeklyDays: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu"],
    assignedTeacherId: "TID2511",
    status: "active",
  },
  {
    id: "SID24466",
    name: "Abdullah al Ariyan",
    email: "nai@gamil.com",
    phone: "329793044444",
    whatsapp: "329793044444",
    parentName: "MD Karin Uddin",
    address: "United Arab Emirates",
    age: "6",
    department: "Quran / Qaida",
    admissionDate: "2024-12-02",
    classStartDate: "2025-04-01",
    monthlyFee: 2500,
    durationMinutes: 60,
    durationLabel: "60 min",
    startTime: "22:30",
    weeklyDays: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu"],
    assignedTeacherId: "TID2511",
    status: "active",
  },
  {
    id: "SID23266",
    name: "শাহরিয়ার আল আদিত",
    email: "nai@gamil.com",
    phone: "329793044444",
    whatsapp: "329793044444",
    parentName: "মানুনুর রশিদ রিয়াজ",
    address: "দুবাই",
    age: "11",
    department: "Quran / Qaida",
    admissionDate: "2023-02-15",
    classStartDate: "2025-02-24",
    monthlyFee: 2500,
    durationMinutes: 40,
    durationLabel: "40 min",
    startTime: "20:20",
    weeklyDays: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu"],
    assignedTeacherId: "TID2511",
    status: "active",
  },
  {
    id: "SID25484",
    name: "বাঁধন",
    email: "nai@gamil.com",
    phone: "329793044444",
    whatsapp: "329793044444",
    parentName: "রুমি",
    address: "United States",
    age: "21",
    department: "Quran / Qaida",
    admissionDate: "2025-02-18",
    classStartDate: "2025-02-21",
    monthlyFee: 4500,
    durationMinutes: 60,
    durationLabel: "60 min",
    startTime: "09:00",
    weeklyDays: ["Sat", "Sun", "Fri"],
    assignedTeacherId: "TID2511",
    status: "active",
  },
  {
    id: "SID25533",
    name: "Arif Uddin",
    email: "nai@gamil.com",
    phone: "329793044444",
    whatsapp: "329793044444",
    parentName: "Arif Uddin",
    address: "Chittagong",
    age: "25",
    department: "Quran / Qaida",
    admissionDate: "2025-11-03",
    classStartDate: "2025-11-03",
    monthlyFee: 2200,
    durationMinutes: 60,
    durationLabel: "60 min",
    startTime: "12:00",
    weeklyDays: ["Sat", "Mon", "Tue", "Wed", "Thu", "Fri"],
    assignedTeacherId: "TID2511",
    status: "active",
  },
  {
    id: "MSID25564",
    name: "নাইমুল ইসলাম",
    email: "nai@gamil.com",
    phone: "329793044444",
    whatsapp: "329793044444",
    parentName: "bayzid bepari",
    address: "madaripur",
    age: "25",
    department: "Hifz review",
    admissionDate: "2026-05-06",
    classStartDate: "2026-05-06",
    monthlyFee: 1750,
    durationMinutes: 60,
    durationLabel: "60 min",
    startTime: "04:00",
    weeklyDays: ["Mon", "Tue", "Wed"],
    assignedTeacherId: "TID2511",
    status: "at_risk",
  },
  {
    id: "MSID26578",
    name: "Jihan",
    email: "nai@gamil.com",
    phone: "329793044444",
    whatsapp: "329793044444",
    parentName: "",
    address: "Unknown",
    age: "",
    department: "Hifz review",
    admissionDate: "2026-05-07",
    classStartDate: "2026-05-18",
    monthlyFee: 2300,
    durationMinutes: 60,
    durationLabel: "60 min",
    startTime: "23:00",
    weeklyDays: ["Sat", "Mon", "Wed", "Fri"],
    assignedTeacherId: "TID2511",
    status: "active",
  },
];

export const courses: Course[] = [
  {
    id: "COURSE-QURAN",
    name: "Quran Recitation and Hifz",
    description: "Qaida, recitation, para revision, memorization, and daily dua.",
    department: "Quran / Qaida",
  },
  {
    id: "COURSE-ARABIC",
    name: "Arabic Language",
    description: "Reading, vocabulary, sentence practice, and conversation basics.",
    department: "Arabic",
  },
];

export const modules: CurriculumModule[] = [
  { id: "MOD-Q-1", courseId: "COURSE-QURAN", semester: "Semester 1", title: "Qaida and Makharij", order: 1 },
  { id: "MOD-Q-2", courseId: "COURSE-QURAN", semester: "Semester 1", title: "Short Surah Practice", order: 2 },
  { id: "MOD-Q-3", courseId: "COURSE-QURAN", semester: "Semester 2", title: "Para Revision", order: 3 },
  { id: "MOD-A-1", courseId: "COURSE-ARABIC", semester: "Semester 1", title: "Arabic Letters and Words", order: 1 },
  { id: "MOD-A-2", courseId: "COURSE-ARABIC", semester: "Semester 1", title: "Daily Conversation", order: 2 },
];

export const lessons: Lesson[] = [
  { id: "LES-Q-1", moduleId: "MOD-Q-1", title: "Letter recognition and sound check", order: 1, estimatedMinutes: 60 },
  { id: "LES-Q-2", moduleId: "MOD-Q-1", title: "Makharij practice with teacher feedback", order: 2, estimatedMinutes: 60 },
  { id: "LES-Q-3", moduleId: "MOD-Q-1", title: "Qaida lesson 25-30 review", order: 3, estimatedMinutes: 90 },
  { id: "LES-Q-4", moduleId: "MOD-Q-2", title: "Surah Naba to Asr revision", order: 1, estimatedMinutes: 120 },
  { id: "LES-Q-5", moduleId: "MOD-Q-2", title: "Surah Mulk fluency practice", order: 2, estimatedMinutes: 120 },
  { id: "LES-Q-6", moduleId: "MOD-Q-3", title: "30th para revision cycle", order: 1, estimatedMinutes: 180 },
  { id: "LES-Q-7", moduleId: "MOD-Q-3", title: "29th para current reading", order: 2, estimatedMinutes: 180 },
  { id: "LES-A-1", moduleId: "MOD-A-1", title: "Arabic alphabet writing and sound", order: 1, estimatedMinutes: 60 },
  { id: "LES-A-2", moduleId: "MOD-A-1", title: "Common words and short phrases", order: 2, estimatedMinutes: 60 },
  { id: "LES-A-3", moduleId: "MOD-A-2", title: "Greeting and classroom conversation", order: 1, estimatedMinutes: 60 },
  { id: "LES-A-4", moduleId: "MOD-A-2", title: "Family and daily routine sentences", order: 2, estimatedMinutes: 90 },
];

export const studentCoursePlans: StudentCoursePlan[] = [
  {
    id: "PLAN-BADHON-QURAN",
    studentId: "SID25484",
    teacherId: "TID2511",
    courseId: "COURSE-QURAN",
    classLink: "https://meet.google.com/quran-badhon-demo",
    weeklyDays: ["Sat", "Sun", "Fri"],
    startTime: "09:00",
    durationMinutes: 60,
    currentLessonId: "LES-Q-4",
    completedLessonIds: ["LES-Q-1", "LES-Q-2", "LES-Q-3"],
    assignedLessonIds: ["LES-Q-1", "LES-Q-2", "LES-Q-3", "LES-Q-4", "LES-Q-5"],
    updatedAt: "2026-06-24",
    teacherNote: "Revision is improving. Needs one parent follow-up after Friday class.",
  },
  {
    id: "PLAN-BADHON-ARABIC",
    studentId: "SID25484",
    teacherId: "TID2512",
    courseId: "COURSE-ARABIC",
    classLink: "https://meet.google.com/arabic-badhon-demo",
    weeklyDays: ["Mon", "Wed"],
    startTime: "18:30",
    durationMinutes: 40,
    currentLessonId: "LES-A-2",
    completedLessonIds: ["LES-A-1"],
    assignedLessonIds: ["LES-A-1", "LES-A-2", "LES-A-3", "LES-A-4"],
    updatedAt: "2026-06-24",
    teacherNote: "Arabic reading is separate from Quran and handled by Fatema Akter.",
  },
  {
    id: "PLAN-NAIMUL-QURAN",
    studentId: "MSID25564",
    teacherId: "TID2511",
    courseId: "COURSE-QURAN",
    classLink: "https://meet.google.com/quran-naimul-demo",
    weeklyDays: ["Mon", "Tue", "Wed"],
    startTime: "04:00",
    durationMinutes: 60,
    currentLessonId: "LES-Q-7",
    completedLessonIds: ["LES-Q-6"],
    assignedLessonIds: ["LES-Q-6", "LES-Q-7"],
    updatedAt: "2026-06-18",
    teacherNote: "Attendance follow-up needed before next progress update.",
  },
  {
    id: "PLAN-AFIF-QURAN",
    studentId: "MSID26572",
    teacherId: "TID2511",
    courseId: "COURSE-QURAN",
    classLink: "https://meet.google.com/quran-afif-demo",
    weeklyDays: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu"],
    startTime: "16:00",
    durationMinutes: 60,
    currentLessonId: "LES-Q-7",
    completedLessonIds: ["LES-Q-1", "LES-Q-2", "LES-Q-3", "LES-Q-4", "LES-Q-5", "LES-Q-6"],
    assignedLessonIds: ["LES-Q-1", "LES-Q-2", "LES-Q-3", "LES-Q-4", "LES-Q-5", "LES-Q-6", "LES-Q-7"],
    updatedAt: "2026-06-23",
    teacherNote: "Currently reading 29th para after completing 30th para cycle.",
  },
  {
    id: "PLAN-ABDUR-QURAN",
    studentId: "SID24465",
    teacherId: "TID2511",
    courseId: "COURSE-QURAN",
    classLink: "https://meet.google.com/quran-abdur-demo",
    weeklyDays: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu"],
    startTime: "17:30",
    durationMinutes: 60,
    currentLessonId: "LES-Q-6",
    completedLessonIds: ["LES-Q-1", "LES-Q-2", "LES-Q-3", "LES-Q-4", "LES-Q-5"],
    assignedLessonIds: ["LES-Q-1", "LES-Q-2", "LES-Q-3", "LES-Q-4", "LES-Q-5", "LES-Q-6", "LES-Q-7"],
    updatedAt: "2026-06-24",
    teacherNote: "Good pace. Keep the revision cycle stable.",
  },
  {
    id: "PLAN-ABDULLAH-QURAN",
    studentId: "SID24466",
    teacherId: "TID2511",
    courseId: "COURSE-QURAN",
    classLink: "https://meet.google.com/quran-abdullah-demo",
    weeklyDays: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu"],
    startTime: "22:30",
    durationMinutes: 60,
    currentLessonId: "LES-Q-5",
    completedLessonIds: ["LES-Q-1", "LES-Q-2"],
    assignedLessonIds: ["LES-Q-1", "LES-Q-2", "LES-Q-3", "LES-Q-4", "LES-Q-5"],
    updatedAt: "2026-06-21",
    teacherNote: "Pronunciation needs a focused week.",
  },
  {
    id: "PLAN-ADIT-QURAN",
    studentId: "SID23266",
    teacherId: "TID2511",
    courseId: "COURSE-QURAN",
    classLink: "https://meet.google.com/quran-adit-demo",
    weeklyDays: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu"],
    startTime: "20:20",
    durationMinutes: 40,
    currentLessonId: "LES-Q-6",
    completedLessonIds: ["LES-Q-1", "LES-Q-2", "LES-Q-3", "LES-Q-4", "LES-Q-5"],
    assignedLessonIds: ["LES-Q-1", "LES-Q-2", "LES-Q-3", "LES-Q-4", "LES-Q-5", "LES-Q-6", "LES-Q-7"],
    updatedAt: "2026-06-24",
    teacherNote: "Strong progress; schedule a milestone review.",
  },
  {
    id: "PLAN-ARIF-ARABIC",
    studentId: "SID25533",
    teacherId: "TID2511",
    courseId: "COURSE-ARABIC",
    classLink: "https://meet.google.com/arabic-arif-demo",
    weeklyDays: ["Sat", "Mon", "Tue", "Wed", "Thu", "Fri"],
    startTime: "12:00",
    durationMinutes: 60,
    currentLessonId: "LES-A-2",
    completedLessonIds: ["LES-A-1"],
    assignedLessonIds: ["LES-A-1", "LES-A-2", "LES-A-3", "LES-A-4"],
    updatedAt: "2026-06-22",
    teacherNote: "Vocabulary practice needs consistency.",
  },
  {
    id: "PLAN-ARIF-QURAN",
    studentId: "SID25533",
    teacherId: "TID2511",
    courseId: "COURSE-QURAN",
    classLink: "https://meet.google.com/quran-arif-demo",
    weeklyDays: ["Sat", "Mon", "Tue", "Wed", "Thu", "Fri"],
    startTime: "12:00",
    durationMinutes: 60,
    currentLessonId: "LES-Q-3",
    completedLessonIds: ["LES-Q-1", "LES-Q-2"],
    assignedLessonIds: ["LES-Q-1", "LES-Q-2", "LES-Q-3", "LES-Q-4"],
    updatedAt: "2026-06-22",
    teacherNote: "Same teacher handles Quran and Arabic in the same weekly routine.",
  },
  {
    id: "PLAN-JIHAN-QURAN",
    studentId: "MSID26578",
    teacherId: "TID2511",
    courseId: "COURSE-QURAN",
    classLink: "https://meet.google.com/quran-jihan-demo",
    weeklyDays: ["Sat", "Mon", "Wed", "Fri"],
    startTime: "23:00",
    durationMinutes: 60,
    currentLessonId: "LES-Q-4",
    completedLessonIds: ["LES-Q-1", "LES-Q-2", "LES-Q-3"],
    assignedLessonIds: ["LES-Q-1", "LES-Q-2", "LES-Q-3", "LES-Q-4", "LES-Q-5"],
    updatedAt: "2026-06-20",
    teacherNote: "Late-night routine is stable for now.",
  },
  {
    id: "PLAN-JIHAN-HIFZ-REVIEW",
    studentId: "MSID26578",
    teacherId: "TID2513",
    courseId: "COURSE-QURAN",
    classLink: "https://meet.google.com/hifz-jihan-mahmud-demo",
    weeklyDays: ["Tue", "Thu"],
    startTime: "19:00",
    durationMinutes: 40,
    currentLessonId: "LES-Q-7",
    completedLessonIds: ["LES-Q-6"],
    assignedLessonIds: ["LES-Q-6", "LES-Q-7"],
    updatedAt: "2026-06-24",
    teacherNote: "Mahmud handles the separate Hifz review track twice a week.",
  },
];

export const attendanceSummaries: AttendanceSummary[] = [
  { studentId: "SID25484", scheduledClasses: 100, attendedClasses: 84, missedClasses: 12, rescheduledClasses: 4 },
  { studentId: "MSID25564", scheduledClasses: 28, attendedClasses: 19, missedClasses: 7, rescheduledClasses: 2 },
  { studentId: "MSID26572", scheduledClasses: 42, attendedClasses: 35, missedClasses: 5, rescheduledClasses: 2 },
  { studentId: "SID24465", scheduledClasses: 120, attendedClasses: 109, missedClasses: 8, rescheduledClasses: 3 },
  { studentId: "SID25533", scheduledClasses: 64, attendedClasses: 51, missedClasses: 10, rescheduledClasses: 3 },
  { studentId: "MSID26578", scheduledClasses: 36, attendedClasses: 31, missedClasses: 3, rescheduledClasses: 2 },
];

export const teacherMonthlySnapshots: TeacherMonthlyAssignmentSnapshot[] = [
  { teacherId: "TID2511", month: "Jan 2026", activeStudents: 7, assignedMonthlyValue: 17700, addedStudents: 1, droppedStudents: 2, reason: "Exam season caused two pauses." },
  { teacherId: "TID2511", month: "Feb 2026", activeStudents: 8, assignedMonthlyValue: 22200, addedStudents: 2, droppedStudents: 1, reason: "One new parent referral and one schedule mismatch fixed." },
  { teacherId: "TID2511", month: "Mar 2026", activeStudents: 9, assignedMonthlyValue: 24700, addedStudents: 1, droppedStudents: 0, reason: "Trial student converted to regular class." },
  { teacherId: "TID2511", month: "Apr 2026", activeStudents: 10, assignedMonthlyValue: 29200, addedStudents: 2, droppedStudents: 1, reason: "Ramadan demand increased Quran classes." },
  { teacherId: "TID2511", month: "May 2026", activeStudents: 8, assignedMonthlyValue: 21750, addedStudents: 0, droppedStudents: 2, reason: "Two students changed time zone availability." },
  { teacherId: "TID2511", month: "Jun 2026", activeStudents: 8, assignedMonthlyValue: 21750, addedStudents: 1, droppedStudents: 1, reason: "Stable count, but progress updates need admin follow-up." },
  { teacherId: "TID2512", month: "Jan 2026", activeStudents: 5, assignedMonthlyValue: 13200, addedStudents: 1, droppedStudents: 0, reason: "Arabic trial classes started with a small batch." },
  { teacherId: "TID2512", month: "Feb 2026", activeStudents: 6, assignedMonthlyValue: 15700, addedStudents: 1, droppedStudents: 0, reason: "One Quran student added Arabic as a second course." },
  { teacherId: "TID2512", month: "Mar 2026", activeStudents: 7, assignedMonthlyValue: 18100, addedStudents: 2, droppedStudents: 1, reason: "Two new vocabulary students joined, one paused for exams." },
  { teacherId: "TID2512", month: "Apr 2026", activeStudents: 9, assignedMonthlyValue: 23600, addedStudents: 2, droppedStudents: 0, reason: "Ramadan Arabic reading demand increased." },
  { teacherId: "TID2512", month: "May 2026", activeStudents: 10, assignedMonthlyValue: 26100, addedStudents: 1, droppedStudents: 0, reason: "Retention improved after routine reminders." },
  { teacherId: "TID2512", month: "Jun 2026", activeStudents: 11, assignedMonthlyValue: 28600, addedStudents: 2, droppedStudents: 1, reason: "Badhon added Arabic while one student moved to weekend-only." },
  { teacherId: "TID2513", month: "Jan 2026", activeStudents: 13, assignedMonthlyValue: 31800, addedStudents: 2, droppedStudents: 1, reason: "Strong Hifz review demand after winter break." },
  { teacherId: "TID2513", month: "Feb 2026", activeStudents: 14, assignedMonthlyValue: 34200, addedStudents: 1, droppedStudents: 0, reason: "One sibling referral joined the same time block." },
  { teacherId: "TID2513", month: "Mar 2026", activeStudents: 15, assignedMonthlyValue: 36900, addedStudents: 2, droppedStudents: 1, reason: "Added two revision students, one family paused during exams." },
  { teacherId: "TID2513", month: "Apr 2026", activeStudents: 15, assignedMonthlyValue: 36900, addedStudents: 1, droppedStudents: 1, reason: "Stable month with one replacement assignment." },
  { teacherId: "TID2513", month: "May 2026", activeStudents: 13, assignedMonthlyValue: 31600, addedStudents: 0, droppedStudents: 2, reason: "Two students completed their review package." },
  { teacherId: "TID2513", month: "Jun 2026", activeStudents: 14, assignedMonthlyValue: 34100, addedStudents: 1, droppedStudents: 0, reason: "One new Hifz review student assigned after trial." },
];

export const progress: ProgressRecord[] = [
  {
    id: "prg-1",
    studentId: "MSID26572",
    studentName: "Afif Hossain ayan",
    currentLesson:
      "আলহামদুলিল্লাহ ৩০ নম্বর পারা শেষ করে এখন ২৯ নম্বর পারার সূরা মুলক এর তৃতীয় নম্বর পৃষ্ঠা পড়ছে।",
    lastMonth: "30th para revision",
    examScore: "82",
    hadith: "",
    surah: "Surah Mulk",
    duaMasala: "",
    teacherNote: "Needs parent reminder for daily revision.",
    parentAdvocacy: "",
    completionPercent: 64,
    updatedAt: "2026-06-23",
  },
  {
    id: "prg-2",
    studentId: "SID24465",
    studentName: "Abdur Rhaman",
    currentLesson:
      "২৭ থেকে ৩০ নম্বর পারা এবং ১ পারা থেকে ৪ নম্বর পারা শেষ করে ৫ নম্বর পারার ১০ নম্বর পৃষ্ঠাতে পড়ছে",
    lastMonth: "Para 4",
    examScore: "76",
    hadith: "",
    surah: "",
    duaMasala:
      "সাথে সাথে তার মুখস্ত কৃত ৩০ নম্বর পারা রিভাইস দেওয়া এবং মাসলা মাসায়েল শুরু করেছে।",
    teacherNote: "Good pace, keep revision cycle stable.",
    parentAdvocacy: "",
    completionPercent: 72,
    updatedAt: "2026-06-24",
  },
  {
    id: "prg-3",
    studentId: "SID24466",
    studentName: "Abdullah al Ariyan",
    currentLesson: "০ নম্বর পারার সূরা বালাদ পড়ছে।",
    lastMonth: "Qaida lesson 28",
    examScore: "68",
    hadith: "",
    surah: "Surah Balad",
    duaMasala: "",
    teacherNote: "Pronunciation needs a focused week.",
    parentAdvocacy: "",
    completionPercent: 47,
    updatedAt: "2026-06-21",
  },
  {
    id: "prg-4",
    studentId: "SID23266",
    studentName: "শাহরিয়ার আল আদিত",
    currentLesson:
      "৩০ নম্বর পারা থেকে শুরু করে গতকাল ৮ নম্বর পাড়া শেষ করেছে আলহামদুলিল্লাহ অর্থাৎ মোট ২২ পারা পড়েছে",
    lastMonth: "Para 10",
    examScore: "91",
    hadith: "",
    surah: "",
    duaMasala:
      "সাথে সাথে আমপারা থেকে ১৭ টি সূরা মুখস্ত করেছে এবং দৈনন্দিন জীবনের দোয়া শিখছে।",
    teacherNote: "Strong progress; schedule a milestone review.",
    parentAdvocacy: "",
    completionPercent: 88,
    updatedAt: "2026-06-24",
  },
  {
    id: "prg-5",
    studentId: "SID25484",
    studentName: "বাঁধন",
    currentLesson: "৩০ নম্বর পারার সূরা নাবা থেকে শুরু করে এখন সূরা আসর পড়ছে।",
    lastMonth: "Surah Takathur",
    examScore: "74",
    hadith: "",
    surah: "Surah Asr",
    duaMasala:
      "নামাজের দোয়া শেষ করে এখন মোনাজাত শিখছে, তিনটি দোয়া শেষ।",
    teacherNote: "Late-night classes are causing missed revisions.",
    parentAdvocacy: "",
    completionPercent: 58,
    updatedAt: "2026-06-20",
  },
  {
    id: "prg-6",
    studentId: "SID25533",
    studentName: "Arif Uddin",
    currentLesson: "কায়দার ৩০ নম্বর সবক পড়ছে",
    lastMonth: "Qaida lesson 25",
    examScore: "70",
    hadith: "",
    surah: "",
    duaMasala: "নামাজের সানা থেকে দোয়া শেখা শুরু করেছে।",
    teacherNote: "Needs consistent attendance.",
    parentAdvocacy: "",
    completionPercent: 52,
    updatedAt: "2026-06-22",
  },
  {
    id: "prg-7",
    studentId: "MSID25564",
    studentName: "নাইমুল ইসলাম",
    currentLesson: "",
    lastMonth: "",
    examScore: "",
    hadith: "",
    surah: "",
    duaMasala: "",
    teacherNote: "Progress update missing after recent class.",
    parentAdvocacy: "",
    completionPercent: 22,
    updatedAt: "2026-06-16",
  },
];

export function addMinutes(time: string, minutesToAdd: number) {
  const [hour, minute] = time.split(":").map(Number);
  const total = hour * 60 + minute + minutesToAdd;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

function timeRange(from: string, durationMinutes: number) {
  const [fromHour, fromMinute] = from.split(":").map(Number);
  const start = fromHour * 60 + fromMinute;
  const end = start + durationMinutes;
  const values: string[] = [];

  for (let minute = start; minute < end; minute += 10) {
    const hour = Math.floor(minute / 60);
    const mins = minute % 60;
    values.push(`${String(hour).padStart(2, "0")}:${String(mins).padStart(2, "0")}`);
  }

  return values;
}

export function buildScheduleBookings(plansForBooking: StudentCoursePlan[] = studentCoursePlans) {
  const seenSlots = new Map<string, string>();

  return plansForBooking.flatMap((plan) => {
    const student = getStudent(plan.studentId);

    return plan.weeklyDays.flatMap((day) => {
      const fullDay = dayName(day);

      return timeRange(plan.startTime, plan.durationMinutes).map<ScheduleBooking>((time) => {
        const slotKey = `${plan.teacherId}-${fullDay}-${time}`;
        const existingStudentId = seenSlots.get(slotKey);
        const isConflict = Boolean(existingStudentId && existingStudentId !== student.id);
        seenSlots.set(slotKey, student.id);

        return {
          id: `${plan.teacherId}-${plan.id}-${fullDay}-${time}`,
          teacherId: plan.teacherId,
          day: fullDay,
          time,
          status: isConflict ? "conflict" : "booked",
          studentId: student.id,
          studentName: student.name,
          durationMinutes: plan.durationMinutes,
          classLink: plan.classLink,
        };
      });
    });
  });
}

export const bookings: ScheduleBooking[] = buildScheduleBookings();

export const sessions: ClassSession[] = [
  {
    id: "cls-1",
    teacherId: "TID2511",
    studentId: "SID25484",
    studentName: "বাঁধন",
    date: "2026-06-24",
    day: "Wednesday",
    startsAt: "09:00",
    durationMinutes: 60,
    status: "completed",
    progressUpdated: false,
    note: "Attendance done, progress pending.",
  },
  {
    id: "cls-2",
    teacherId: "TID2511",
    studentId: "SID23266",
    studentName: "শাহরিয়ার আল আদিত",
    date: "2026-06-24",
    day: "Wednesday",
    startsAt: "20:20",
    durationMinutes: 40,
    status: "scheduled",
    progressUpdated: true,
    note: "Milestone review after class.",
  },
  {
    id: "cls-3",
    teacherId: "TID2511",
    studentId: "MSID25564",
    studentName: "নাইমুল ইসলাম",
    date: "2026-06-23",
    day: "Tuesday",
    startsAt: "04:00",
    durationMinutes: 60,
    status: "missed",
    progressUpdated: false,
    note: "No reason submitted by teacher.",
  },
  {
    id: "cls-4",
    teacherId: "TID2511",
    studentId: "SID24466",
    studentName: "Abdullah al Ariyan",
    date: "2026-06-24",
    day: "Wednesday",
    startsAt: "22:30",
    durationMinutes: 60,
    status: "scheduled",
    progressUpdated: false,
    note: "Pronunciation focus.",
  },
  {
    id: "cls-5",
    teacherId: "TID2512",
    studentId: "SID25484",
    studentName: "Badhon",
    date: "2026-06-24",
    day: "Wednesday",
    startsAt: "18:30",
    durationMinutes: 40,
    status: "completed",
    progressUpdated: true,
    note: "Arabic vocabulary practice completed with Fatema Akter.",
  },
  {
    id: "cls-6",
    teacherId: "TID2513",
    studentId: "MSID26578",
    studentName: "Jihan",
    date: "2026-06-24",
    day: "Wednesday",
    startsAt: "19:00",
    durationMinutes: 40,
    status: "scheduled",
    progressUpdated: true,
    note: "Hifz review checkpoint with Mahmud Hasan.",
  },
];

export const issues: Issue[] = [
  {
    id: "iss-1",
    type: "missed_class",
    title: "Missed class needs reason",
    teacherId: "TID2511",
    studentId: "MSID25564",
    studentName: "নাইমুল ইসলাম",
    source: "admin",
    status: "new",
    priority: "high",
    createdAt: "2026-06-23",
    dueAt: "2026-06-24",
    description: "Teacher missed a scheduled class and no reason was logged.",
  },
  {
    id: "iss-2",
    type: "progress_gap",
    title: "Progress not updated after class",
    teacherId: "TID2511",
    studentId: "SID25484",
    studentName: "বাঁধন",
    source: "admin",
    status: "in_review",
    priority: "medium",
    createdAt: "2026-06-24",
    description: "Attendance is marked complete but lesson progress is empty.",
  },
  {
    id: "iss-3",
    type: "student_complaint",
    title: "Parent wants clearer monthly report",
    teacherId: "TID2511",
    studentId: "MSID26572",
    studentName: "Afif Hossain ayan",
    source: "parent",
    status: "new",
    priority: "medium",
    createdAt: "2026-06-22",
    description: "Parent asked for a short WhatsApp summary after weekly review.",
  },
  {
    id: "iss-4",
    type: "late_join",
    title: "Teacher joined 8 minutes late",
    teacherId: "TID2511",
    studentId: "SID24466",
    studentName: "Abdullah al Ariyan",
    source: "import",
    status: "resolved",
    priority: "low",
    createdAt: "2026-06-19",
    description: "Late join was logged from the imported sheet and resolved by admin.",
  },
];

export const leaves = [
  {
    id: "lv-1",
    teacherId: "TID2511",
    date: "2026-06-26",
    reason: "Family commitment",
    status: "pending" as const,
  },
  {
    id: "lv-2",
    teacherId: "TID2512",
    date: "2026-06-27",
    reason: "Medical appointment",
    status: "approved" as const,
  },
];

export const monthlyTrend: MonthlyStudentSnapshot[] = [
  { month: "Jan", count: 7, reason: "Two students paused during exam season." },
  { month: "Feb", count: 8, reason: "One new referral from parent." },
  { month: "Mar", count: 9, reason: "Better trial conversion." },
  { month: "Apr", count: 10, reason: "Ramadan schedule increased demand." },
  { month: "May", count: 8, reason: "Two students moved to another time zone." },
  { month: "Jun", count: 8, reason: "Stable, but progress updates delayed." },
  { month: "Jul", count: 11, reason: "Target based on open teacher capacity." },
];

export const appData: AppData = {
  teacher: primaryTeacher,
  teachers,
  students,
  demoUsers,
  courses,
  modules,
  lessons,
  studentCoursePlans,
  attendanceSummaries,
  teacherMonthlySnapshots,
  progress,
  bookings,
  sessions,
  issues,
  leaves,
  monthlyTrend,
};

export function getTeacher(id: string) {
  return teachers.find((teacher) => teacher.id === id) ?? primaryTeacher;
}

export function getTeacherStudents(teacherId: string) {
  const studentIds = new Set(
    studentCoursePlans
      .filter((plan) => plan.teacherId === teacherId)
      .map((plan) => plan.studentId),
  );
  return students.filter((student) => studentIds.has(student.id));
}

export function getTeacherProgress(teacherId: string) {
  const studentIds = new Set(getTeacherStudents(teacherId).map((student) => student.id));
  return progress.filter((record) => studentIds.has(record.studentId));
}

export function getTeacherIssues(teacherId: string) {
  return issues.filter((issue) => issue.teacherId === teacherId);
}

export function getStudent(id: string) {
  return students.find((student) => student.id === id) ?? students[0];
}

export function getStudentTeacher(studentId: string) {
  return getStudentTeachers(studentId)[0] ?? getTeacher(getStudent(studentId).assignedTeacherId);
}

export function getStudentTeachers(studentId: string) {
  const teacherIds = new Set(getStudentCoursePlans(studentId).map((plan) => plan.teacherId));
  return teachers.filter((teacher) => teacherIds.has(teacher.id));
}

export function getStudentCoursePlans(studentId: string) {
  return studentCoursePlans.filter((plan) => plan.studentId === studentId);
}

export function getTeacherCoursePlans(teacherId: string) {
  return studentCoursePlans.filter((plan) => plan.teacherId === teacherId);
}

export function getCourse(id: string) {
  return courses.find((course) => course.id === id);
}

export function getLesson(id: string) {
  return lessons.find((lesson) => lesson.id === id);
}

export function getModule(id: string) {
  return modules.find((module) => module.id === id);
}

export function getCourseLessons(courseId: string) {
  const moduleIds = new Set(
    modules.filter((module) => module.courseId === courseId).map((module) => module.id),
  );
  return lessons.filter((lesson) => moduleIds.has(lesson.moduleId));
}

export function getStudentAttendance(studentId: string) {
  return (
    attendanceSummaries.find((summary) => summary.studentId === studentId) ?? {
      studentId,
      scheduledClasses: 0,
      attendedClasses: 0,
      missedClasses: 0,
      rescheduledClasses: 0,
    }
  );
}

export function getStudentIssues(studentId: string) {
  return issues.filter((issue) => issue.studentId === studentId);
}

export function getTeacherMonthlySnapshots(teacherId: string) {
  return teacherMonthlySnapshots
    .filter((snapshot) => snapshot.teacherId === teacherId)
    .sort((current, next) => Date.parse(`1 ${current.month}`) - Date.parse(`1 ${next.month}`));
}

export function getTeacherMonthlySummary(teacherId: string): TeacherMonthlySummary {
  const snapshots = getTeacherMonthlySnapshots(teacherId);
  const current = snapshots.at(-1);
  const previous = snapshots.at(-2);
  const studentDelta = (current?.activeStudents ?? 0) - (previous?.activeStudents ?? 0);
  const valueDelta = (current?.assignedMonthlyValue ?? 0) - (previous?.assignedMonthlyValue ?? 0);
  const trend = studentDelta > 0 ? "up" : studentDelta < 0 ? "down" : "flat";

  return {
    teacher: getTeacher(teacherId),
    current,
    previous,
    studentDelta,
    valueDelta,
    trend,
    snapshots,
  };
}

export function getTeacherMonthlySummaries() {
  return teachers.map((teacher) => getTeacherMonthlySummary(teacher.id));
}

export function getPrimaryClassLink(studentId: string) {
  return getStudentCoursePlans(studentId)[0]?.classLink ?? "Class link not assigned";
}

export function getRoutineLabel(student: Student) {
  return `${student.weeklyDays.map(dayName).join(", ")} at ${student.startTime} for ${student.durationMinutes} min`;
}

export function getPlanRoutineLabel(plan: StudentCoursePlan) {
  return `${plan.weeklyDays.map(dayName).join(", ")} at ${plan.startTime} for ${plan.durationMinutes} min`;
}

export function attentionItems() {
  return [
    ...issues.filter((issue) => issue.status !== "resolved"),
    ...sessions
      .filter((session) => session.status === "missed" || !session.progressUpdated)
      .map<Issue>((session) => ({
        id: `auto-${session.id}`,
        type: session.status === "missed" ? "missed_class" : "progress_gap",
        title:
          session.status === "missed"
            ? "Missed class without reason"
            : "Progress update missing",
        teacherId: session.teacherId,
        studentId: session.studentId,
        studentName: session.studentName,
        source: "admin",
        status: "new",
        priority: session.status === "missed" ? "high" : "medium",
        createdAt: session.date,
        description: session.note,
      })),
  ];
}

export function teacherHealthScore(teacher: Teacher) {
  const openIssues = getTeacherIssues(teacher.id).filter((issue) => issue.status !== "resolved").length;
  const progressGaps = sessions.filter(
    (session) => session.teacherId === teacher.id && !session.progressUpdated,
  ).length;
  const missedPenalty = teacher.totalMissedClasses * 8;
  const issuePenalty = openIssues * 7;
  const progressPenalty = progressGaps * 5;

  return Math.max(0, Math.min(100, 100 - missedPenalty - issuePenalty - progressPenalty));
}
