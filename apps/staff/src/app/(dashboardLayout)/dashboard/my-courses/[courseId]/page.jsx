"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, FileText, PlayCircle, ClipboardCheck } from "lucide-react";
import { getApiBaseUrl, getBrandHeaders } from "@/lib/brand-config";
import { getUserInfo } from "@/services/auth.services";

const iconByType = {
  video: PlayCircle,
  recorded_class: PlayCircle,
  live_class: PlayCircle,
  note: FileText,
  reading: FileText,
  resource: FileText,
  quiz: ClipboardCheck,
  assignment: ClipboardCheck,
  exam: ClipboardCheck,
  homework: ClipboardCheck,
};

const getAuthHeaders = () => {
  if (typeof window === "undefined") return {};
  const token = window.localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const legacyToCentral = (course) => ({
  title: course?.title || "Course Curriculum",
  description: course?.subTitle || "",
  semesters: [
    {
      title: "Course Syllabus",
      order: 1,
      modules: (course?.curriculum || []).map((module, moduleIndex) => ({
        title: module.moduleName || `Module ${moduleIndex + 1}`,
        order: moduleIndex + 1,
        items: (module.lessons || []).map((lesson, lessonIndex) => ({
          _id: `${moduleIndex}-${lessonIndex}`,
          title: lesson.title || `Lesson ${lessonIndex + 1}`,
          type: lesson.lessonType || "video",
          description: lesson.noteText || "",
          contentUrl: lesson.video || lesson.noteFile || "",
          duration: lesson.duration || {},
          status: "published",
          order: lessonIndex + 1,
        })),
      })),
    },
  ],
});

export default function CoursePlayerPage({ params }) {
  const unwrappedParams = React.use(params);
  const courseId = unwrappedParams.courseId;
  const user = getUserInfo();
  const [course, setCourse] = useState(null);
  const [curriculum, setCurriculum] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadCourse() {
      try {
        const courseResponse = await fetch(`${getApiBaseUrl()}/course/single-student/${courseId}`, {
          headers: { ...getBrandHeaders(), ...getAuthHeaders() },
          cache: "no-store",
        });
        const courseBody = await courseResponse.json();
        const courseData = courseBody?.data;
        if (!isMounted) return;
        setCourse(courseData);

        if (courseData?.curriculumId) {
          const curriculumResponse = await fetch(`${getApiBaseUrl()}/curriculums/${courseData.curriculumId}`, {
            headers: { ...getBrandHeaders(), ...getAuthHeaders() },
            cache: "no-store",
          });
          const curriculumBody = await curriculumResponse.json();
          const curriculumData = curriculumBody?.data;
          setCurriculum(curriculumData);
          const firstItem = curriculumData?.semesters?.[0]?.modules?.[0]?.items?.[0];
          setActiveItem(firstItem || null);
        } else {
          const legacy = legacyToCentral(courseData);
          setCurriculum(legacy);
          setActiveItem(legacy.semesters?.[0]?.modules?.[0]?.items?.[0] || null);
        }
      } catch (error) {
        if (isMounted) setMessage("Course curriculum could not be loaded.");
      }
    }

    loadCourse();
    return () => {
      isMounted = false;
    };
  }, [courseId]);

  const allItems = useMemo(
    () =>
      (curriculum?.semesters || []).flatMap((semester) =>
        (semester.modules || []).flatMap((module) => module.items || [])
      ),
    [curriculum]
  );

  const progress = allItems.length ? Math.round((completed.length / allItems.length) * 100) : 0;

  async function markComplete(item) {
    const itemId = item._id || item.title;
    const nextCompleted = Array.from(new Set([...completed, itemId]));
    setCompleted(nextCompleted);

    if (user?._id && course?.curriculumId) {
      const itemProgress = nextCompleted.map((completedItemId) => ({
        itemId: completedItemId,
        status: "completed",
        completedAt: new Date().toISOString(),
      }));
      await fetch(`${getApiBaseUrl()}/student-progress/${user._id}/${course.curriculumId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getBrandHeaders(),
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          courseId,
          itemProgress,
          lastActiveItemId: itemId,
        }),
      }).catch(() => null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 text-slate-950 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Link href="/dashboard/my-courses" className="text-sm font-medium text-emerald-700">
          Back to my courses
        </Link>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold">{course?.title || "Course"}</h1>
              <p className="mt-1 text-sm text-slate-600">{curriculum?.title || "Curriculum"}</p>
            </div>
            <div className="min-w-52">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <strong>{progress}%</strong>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full bg-emerald-600" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </section>

        {message ? (
          <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            {message}
          </div>
        ) : null}

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            {activeItem ? (
              <>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {activeItem.type}
                </p>
                <h2 className="mt-2 text-2xl font-semibold">{activeItem.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {activeItem.description || activeItem.objective || "No description added yet."}
                </p>
                {activeItem.contentUrl ? (
                  <a
                    href={activeItem.contentUrl}
                    target="_blank"
                    className="mt-5 inline-flex h-10 items-center rounded-md bg-slate-950 px-4 text-sm font-medium text-white"
                  >
                    Open content
                  </a>
                ) : null}
                <button
                  type="button"
                  onClick={() => markComplete(activeItem)}
                  className="mt-5 ml-0 inline-flex h-10 items-center gap-2 rounded-md bg-emerald-600 px-4 text-sm font-medium text-white md:ml-3"
                >
                  <CheckCircle2 className="h-4 w-4" /> Mark complete
                </button>
              </>
            ) : (
              <p className="text-sm text-slate-500">No curriculum item found.</p>
            )}
          </div>

          <aside className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-4">
              <h2 className="font-semibold">Course Syllabus</h2>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-4">
              {(curriculum?.semesters || []).map((semester, semesterIndex) => (
                <div key={semester._id || semesterIndex} className="mb-5">
                  <h3 className="text-sm font-semibold">{semester.title}</h3>
                  {(semester.modules || []).map((module, moduleIndex) => (
                    <div key={module._id || moduleIndex} className="mt-3 border-l border-slate-200 pl-3">
                      <p className="text-sm font-medium">{module.title}</p>
                      <div className="mt-2 space-y-2">
                        {(module.items || []).map((item, itemIndex) => {
                          const Icon = iconByType[item.type] || FileText;
                          const itemId = item._id || item.title;
                          const isComplete = completed.includes(itemId);
                          return (
                            <button
                              type="button"
                              key={itemId || itemIndex}
                              onClick={() => setActiveItem(item)}
                              className="flex w-full items-center gap-3 rounded-md p-2 text-left text-sm hover:bg-slate-50"
                            >
                              <Icon className={`h-4 w-4 ${isComplete ? "text-emerald-600" : "text-slate-500"}`} />
                              <span className="min-w-0 flex-1 truncate">{item.title}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
