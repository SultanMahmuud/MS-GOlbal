"use client";

import CourseCard from "@/components/Shared/CourseCard/CourseCard";
import { getApiBaseUrl, getBrandHeaders } from "@/lib/brand-config";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const getAuthHeaders = () => {
  if (typeof window === "undefined") return {};
  const token = window.localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const DraftCourse = () => {
  const [courses, setCourses] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("all");

  useEffect(() => {
    setLoading(true);
    fetch(`${getApiBaseUrl()}/course/admin`, {
      headers: {
        Accept: "application/json",
        ...getBrandHeaders(),
        ...getAuthHeaders(),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const courseList = Array.isArray(data?.data) ? data.data : [];
        setCourses(courseList);
        setSearchResult(courseList);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching draft courses:", error);
        setCourses([]);
        setSearchResult([]);
        setLoading(false);
      });
  }, []);

  const draftCourses = (searchResult.length > 0 ? searchResult : courses).filter(
    (course) => course.courseType === "draft"
  );

  const displayedCourses = draftCourses.filter(
    (course) => selectedBrand === "all" || course.brandKey === selectedBrand
  );

  return (
    <div className="w-full px-4">
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

      {loading ? (
        <div>loading.........</div>
      ) : displayedCourses.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">
          No draft courses found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayedCourses.map((element, index) => (
            <div key={index}>
              <Link
                href={`/dashboard/admin/course/${element._id}`}
                className="w-fit h-fit block"
              >
                <CourseCard
                  course={element}
                  loading={loading}
                  dashboard={true}
                />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DraftCourse;
