import { StudentParentPortal } from "@/features/teacher-ops/components/student-parent-portal";
import {
  appData,
  getStudent,
  getStudentAttendance,
  getStudentCoursePlans,
  getStudentIssues,
  getStudentTeachers,
} from "@/features/teacher-ops/lib/data";

const demoStudentId = "SID25484";

export default function Page() {
  const student = getStudent(demoStudentId);

  return (
    <div className="min-h-[calc(100vh-2.5rem)] rounded-lg bg-zinc-950 text-zinc-100">
      <StudentParentPortal
        student={student}
        teachers={getStudentTeachers(student.id)}
        plans={getStudentCoursePlans(student.id)}
        courses={appData.courses}
        modules={appData.modules}
        lessons={appData.lessons}
        attendance={getStudentAttendance(student.id)}
        sessions={appData.sessions.filter((session) => session.studentId === student.id)}
        issues={getStudentIssues(student.id)}
      />
    </div>
  );
}
