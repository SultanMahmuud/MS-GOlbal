import { CurriculumBuilder } from "@/features/teacher-ops/components/curriculum-builder";
import { Card, CardContent, CardHeader } from "@/features/teacher-ops/components/ui/card";
import { courses, lessons, modules } from "@/features/teacher-ops/lib/data";

export function TeacherOpsCurriculumPage() {
  return (
    <div className="min-h-[calc(100vh-2.5rem)] rounded-lg bg-zinc-950 text-zinc-100">
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <header>
          <p className="text-sm text-zinc-500">Admin curriculum</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50">
            Course, module, and lesson setup
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-zinc-400">
            Build the lesson library that teachers use when marking student progress.
          </p>
        </header>

        <section className="mt-6">
          <Card>
            <CardHeader title="Lesson builder" eyebrow="Admin-only setup" />
            <CardContent>
              <CurriculumBuilder courses={courses} modules={modules} lessons={lessons} />
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
