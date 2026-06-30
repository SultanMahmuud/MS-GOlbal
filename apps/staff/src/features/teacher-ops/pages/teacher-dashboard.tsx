import { TeacherPortal } from "@/features/teacher-ops/components/teacher-portal";
import {
  appData,
  getTeacher,
  getTeacherCoursePlans,
  getTeacherMonthlySnapshots,
  getTeacherProgress,
  getTeacherStudents,
} from "@/features/teacher-ops/lib/data";

export function TeacherOpsTeacherDashboard() {
  const teacher = getTeacher(appData.teacher.id);

  return (
    <div className="min-h-[calc(100vh-2.5rem)] rounded-lg bg-zinc-950 text-zinc-100">
      <TeacherPortal
        teacher={teacher}
        students={getTeacherStudents(teacher.id)}
        sessions={appData.sessions.filter((session) => session.teacherId === teacher.id)}
        progress={getTeacherProgress(teacher.id)}
        courses={appData.courses}
        modules={appData.modules}
        lessons={appData.lessons}
        plans={getTeacherCoursePlans(teacher.id)}
        attendanceSummaries={appData.attendanceSummaries}
        monthlySnapshots={getTeacherMonthlySnapshots(teacher.id)}
      />
    </div>
  );
}
