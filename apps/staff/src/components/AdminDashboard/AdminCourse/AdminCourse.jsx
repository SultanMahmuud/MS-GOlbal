'use client';

import CourseCard from "@/components/Shared/CourseCard/CourseCard";
import { getApiBaseUrl } from "@/lib/brand-config";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaUserAstronaut } from "react-icons/fa";

const AdminCourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let isActive = true;
    setMounted(true);

    const loadCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const apiBaseUrl = getApiBaseUrl();
        if (!apiBaseUrl) {
          throw new Error("API base URL is not configured.");
        }

        const response = await fetch(`${apiBaseUrl}/course`, {
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Course API failed with status ${response.status}.`);
        }

        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          throw new Error("Course API returned a non-JSON response.");
        }

        const data = await response.json();
        const courseList = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : [];

        if (!isActive) return;
        setCourses(courseList);
      } catch (fetchError) {
        console.error("Error fetching courses:", fetchError);
        if (!isActive) return;
        setCourses([]);
        setError(fetchError?.message || "Failed to load courses.");
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadCourses();

    return () => {
      isActive = false;
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="p-4">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="flex flex-col gap-4 py-5 md:flex-row">
            {[
              {
                title: "Total Courses",
                count: courses.length,
              },
              {
                title: "Total Student",
                count: 403,
              },
            ].map(({ title, count }) => (
              <div
                key={title}
                className="flex w-full max-w-xs items-center gap-4 rounded-xl bg-white p-4 shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl">
                  <FaUserAstronaut />
                </div>
                <div>
                  <h6 className="text-sm font-medium">{title}</h6>
                  <h6 className="text-lg font-bold">{count}</h6>
                </div>
              </div>
            ))}
          </div>

          {error ? (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {!error && courses.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">
              No courses found.
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
            {courses.map((course) => (
              <Link
                key={course._id}
                href={`/dashboard/admin/course/${course?._id}`}
              >
                <CourseCard dashboard={true} course={course} />
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminCourse;
