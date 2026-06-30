"use client";

import { useMemo, useState } from "react";
import { BookOpenCheck, ListPlus, Plus } from "lucide-react";
import { Badge } from "@/features/teacher-ops/components/ui/badge";
import { Button } from "@/features/teacher-ops/components/ui/button";
import { FieldLabel, TextInput } from "@/features/teacher-ops/components/ui/field";
import type { Course, CurriculumModule, Lesson } from "@/features/teacher-ops/lib/types";

export function CurriculumBuilder({
  courses,
  modules,
  lessons,
}: {
  courses: Course[];
  modules: CurriculumModule[];
  lessons: Lesson[];
}) {
  const [courseId, setCourseId] = useState(courses[0]?.id ?? "");
  const [localLessons, setLocalLessons] = useState<Lesson[]>(lessons);
  const [lessonTitle, setLessonTitle] = useState("");
  const [moduleId, setModuleId] = useState(modules.find((item) => item.courseId === courseId)?.id ?? "");
  const courseModules = useMemo(
    () => modules.filter((module) => module.courseId === courseId),
    [courseId, modules],
  );
  const courseLessons = useMemo(() => {
    const moduleIds = new Set(courseModules.map((module) => module.id));
    return localLessons.filter((lesson) => moduleIds.has(lesson.moduleId));
  }, [courseModules, localLessons]);

  function changeCourse(nextCourseId: string) {
    setCourseId(nextCourseId);
    setModuleId(modules.find((item) => item.courseId === nextCourseId)?.id ?? "");
  }

  function addLesson() {
    if (!lessonTitle.trim() || !moduleId) return;

    const moduleLessons = localLessons.filter((lesson) => lesson.moduleId === moduleId);
    setLocalLessons((current) => [
      ...current,
      {
        id: `LOCAL-LES-${Date.now()}`,
        moduleId,
        title: lessonTitle.trim(),
        order: moduleLessons.length + 1,
        estimatedMinutes: 60,
      },
    ]);
    setLessonTitle("");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
      <div className="space-y-4">
        <div>
          <FieldLabel htmlFor="course">Course</FieldLabel>
          <select
            id="course"
            value={courseId}
            onChange={(event) => changeCourse(event.target.value)}
            className="mt-2 h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none focus:border-emerald-500"
          >
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <FieldLabel htmlFor="module">Semester / module</FieldLabel>
          <select
            id="module"
            value={moduleId}
            onChange={(event) => setModuleId(event.target.value)}
            className="mt-2 h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none focus:border-emerald-500"
          >
            {courseModules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.semester} - {module.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <FieldLabel htmlFor="lesson-title">New lesson title</FieldLabel>
          <TextInput
            id="lesson-title"
            value={lessonTitle}
            onChange={(event) => setLessonTitle(event.target.value)}
            placeholder="Example: Surah Mulk ayah 1-5"
          />
        </div>

        <Button type="button" onClick={addLesson}>
          <Plus className="h-4 w-4" />
          Add lesson
        </Button>

        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-50">
            <BookOpenCheck className="h-4 w-4 text-emerald-300" />
            How teachers use this
          </div>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Admin creates the lesson plan here. During class, teacher selects the
            student and marks each lesson as current or completed. Parent and admin
            see the same progress immediately.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {courseModules.map((module) => {
          const moduleLessons = courseLessons.filter((lesson) => lesson.moduleId === module.id);
          return (
            <section key={module.id} className="rounded-lg border border-zinc-800 bg-zinc-950">
              <div className="flex items-start justify-between gap-4 border-b border-zinc-800 px-4 py-3">
                <div>
                  <Badge tone="info">{module.semester}</Badge>
                  <h3 className="mt-2 text-sm font-semibold text-zinc-50">{module.title}</h3>
                </div>
                <Badge tone="neutral">{moduleLessons.length} lessons</Badge>
              </div>
              <div className="divide-y divide-zinc-900">
                {moduleLessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center gap-3 px-4 py-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-900 text-xs text-zinc-400">
                      {lesson.order}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-zinc-100">{lesson.title}</p>
                      <p className="text-xs text-zinc-500">{lesson.estimatedMinutes} min estimate</p>
                    </div>
                    <ListPlus className="h-4 w-4 text-zinc-600" />
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
