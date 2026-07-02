'use client';

import CourseCard from "@/components/Shared/CourseCard/CourseCard";
import { getApiBaseUrl, getBrandHeaders } from "@/lib/brand-config";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaUserAstronaut, FaPlus } from "react-icons/fa";

const getAuthHeaders = () => {
  if (typeof window === "undefined") return {};
  const token = window.localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const AdminCourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("all");

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

        const response = await fetch(`${apiBaseUrl}/course/admin`, {
          headers: {
            Accept: "application/json",
            ...getBrandHeaders(),
            ...getAuthHeaders(),
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

  const finalCourses = courses.filter((course) => course.courseType !== "draft");
  
  const displayedCourses = finalCourses.filter(
    (course) => selectedBrand === "all" || course.brandKey === selectedBrand
  );

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Courses Directory</h1>
          <p className="text-sm text-slate-500 mt-1">Manage public and active courses across brands</p>
        </div>
        <Link
          href="/dashboard/admin/course/add-course"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold transition duration-200"
        >
          <FaPlus size={12} />
          Create Course
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="flex flex-col gap-4 py-5 md:flex-row">
            {[
              {
                title: "Total Courses",
                count: finalCourses.length,
              },
              {
                title: "Total Student",
                count: 403,
              },
            ].map(({ title, count }) => (
              <div
                key={title}
                className="flex w-full max-w-xs items-center gap-4 rounded-xl bg-white p-4 shadow-md border border-slate-100"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-xl text-slate-700">
                  <FaUserAstronaut />
                </div>
                <div>
                  <h6 className="text-sm font-medium text-slate-500">{title}</h6>
                  <h6 className="text-lg font-bold text-slate-950">{count}</h6>
                </div>
              </div>
            ))}
          </div>

          {/* Brand Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { key: "all", name: "All Brands" },
              { key: "muslim-school", name: "Muslim School" },
              { key: "quran-care", name: "Quran Care" },
              { key: "murshiid", name: "Murshiid" },
            ].map((brand) => (
              <button
                key={brand.key}
                onClick={() => setSelectedBrand(brand.key)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg border transition duration-200 ${
                  selectedBrand === brand.key
                    ? "bg-slate-950 text-white border-slate-950 shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {brand.name}
              </button>
            ))}
          </div>

          {error ? (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {!error && displayedCourses.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">
              No courses found for the selected brand.
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
            {displayedCourses.map((course) => (
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
