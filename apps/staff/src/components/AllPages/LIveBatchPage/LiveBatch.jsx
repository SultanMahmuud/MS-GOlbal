'use client';
import React, { useEffect, useState } from "react";
import axios from "axios";
import CourseCard from "@/components/Shared/CourseCard/CourseCard";
import Link from "next/link";
import { Button } from "@/components/UI/button";
import { BiSearch } from "react-icons/bi";

const chips = ["Tajweed", "Hadith", "Arabic", "Kids", "Adults"];

export default function LiveBatch() {
  const [search, setSearch] = useState("");
  const [activeChip, setActiveChip] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/course`)
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.data);
        setSearchResult(data.data);
        setLoading(false);
      });

    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/category`)
      .then((res) => {
        const newData = res.data.data[0];
        const batchCat = newData.batch.map((item) => item.category);
        const recordedCat = newData.course.map((item) => item.category);
        const catArray = [...batchCat, ...recordedCat];
        const catObject = catArray.map((item) => ({
          label: item,
          value: item,
        }));
        setCategoryOptions(catObject);
      })
      .catch((error) => {});
  }, []);

  // Filter logic
  const filteredCourses = courses.filter((course) => {
    const lowerTitle = course.title.toLowerCase();
    const matchesSearch = lowerTitle.includes(search.toLowerCase());
    const matchesChip =
      !activeChip || lowerTitle.includes(activeChip.toLowerCase());
    return matchesSearch && matchesChip;
  });
const featuredCourses = [
  { title: 'Learn Quranic Arabic', badge: 'Popular' },
  { title: 'Introduction to Hadith', badge: null },
  { title: 'Islamic Theology', badge: null },
];
  return (
    <>
      <section className="px-4 max-w-6xl mx-auto py-16">
        {/* Featured Courses */}
        <h2 className="text-3xl font-bold text-center mb-6">
          Featured Courses
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {featuredCourses.map((course, idx) => (
            <div
              key={`featured-${idx}`}
              className="relative rounded-2xl p-6 h-56 flex items-end"
              style={{
                background: 'linear-gradient(to bottom, #6CCFAD, #3A8D56)',
              }}
            >
              {course.badge && (
                <span
                  className={`absolute top-4 left-4 px-3 py-1 text-sm font-medium rounded-full ${
                    course.badge === 'Popular'
                      ? 'bg-yellow-400 text-white'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {course.badge}
                </span>
              )}
              <h3 className="text-white text-xl font-bold">{course.title}</h3>
            </div>
          ))}
        </div>

        {/* All Courses */}
        <h2 className="text-3xl font-semibold text-center mb-2">
          Join Thousands of Learners
        </h2>
        <p className="text-center text-gray-600 mb-4 text-[16px] font-semibold">
          Browse by topic or search
        </p>

        {/* Category Chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {chips.map((chip) => (
            <Button
              key={chip}
              onClick={() => setActiveChip(activeChip === chip ? "" : chip)}
              className={`px-4 py-1 rounded-full border transition font-semibold text-[16px] ${
                activeChip === chip
                  ? "bg-green-100 border-green-400 text-green-800"
                  : "bg-white border-gray-300 text-gray-800"
              }`}
            >
              {chip}
            </Button>
          ))}
        </div>

        {/* Search Input */}
       
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-md shadow max-w-4xl mx-auto mb-6">
                          <BiSearch className="text-xl text-gray-500" />
                          <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search course"
                            className="w-full h-[45px] outline-none text-sm"
                          />
                        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 9 }).map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse bg-gray-100 rounded-xl h-64 flex flex-col justify-end p-4"
              >
                <div className="h-6 bg-gray-300 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))
          ) : filteredCourses.length > 0 ? (
            filteredCourses
              .filter((course) => course.medium === "সিঙ্গেল লাইভ ক্লাস")
              .map((course, idx) => (
                <Link key={idx} href={`/course/${course.engTitle}`}>
                  <CourseCard course={course} loading={loading} />
                </Link>
              ))
          ) : (
            courses
              .filter((course) => course.medium === "লাইভ ব্যাচ")
              .map((course, idx) => (
                <Link key={idx} href={`/course/${course.engTitle}`}>
                  <CourseCard course={course} loading={loading} />
                </Link>
              ))
          )}
        </div>
      </section>
    </>
  );
}
