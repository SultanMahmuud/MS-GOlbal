'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CourseCard from '@/components/Shared/CourseCard/CourseCard';
import { Button } from '@/components/UI/button';
import Link from 'next/link';
import { BiSearch } from 'react-icons/bi';


const featuredCourses = [
  { title: 'Learn Quranic Arabic', badge: 'Popular' },
  { title: 'Introduction to Hadith', badge: null },
  { title: 'Islamic Theology', badge: null },
];

const chips = ['Tajweed', 'Hadith', 'Arabic', 'Kids', 'Adults'];

export default function AllCourses() {
  const [search, setSearch] = useState('');
  const [activeChip, setActiveChip] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/course`, {
        headers: {
          "X-Brand-Key": process.env.NEXT_PUBLIC_BRAND_KEY || "",
        },
      })
      .then((res) => {
       
        setCourses(res?.data.data);
        
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);


  const filteredCourses = courses?.filter((course) => {
    const matchSearch = course?.title
      ?.toLowerCase()
      ?.includes(search.toLowerCase());
    const matchChip = !activeChip || course?.title?.toLowerCase().includes(activeChip.toLowerCase());
    return matchSearch && matchChip;
  });

  return (
    <>
   
      <section className="px-4 py-8 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-6">Featured Courses</h2>
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

        <h2 className="text-3xl font-semibold text-center mb-2">Join Thousands of Learners</h2>
        <p className="text-center text-gray-600 mb-4">Browse by topic or search</p>

        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {chips.map((chip,i) => (
            <Button
              key={i}
              onClick={() => setActiveChip(activeChip === chip ? '' : chip)}
              className={`px-4 py-1 rounded-full border transition ${
                activeChip === chip
                  ? 'bg-green-100 border-green-400 text-green-800'
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
            >
              {chip}
            </Button>
          ))}
        </div>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, idx) => (
                <h2 key={idx} className="animate-pulse bg-gray-100 rounded-xl h-48 w-full mb-4"></h2>
              ))
            : courses.length > 0
            ? courses.map((course, _id) => (
                <Link key={_id} href={`/courses/${course.engTitle}`}>
                  <CourseCard course={course} loading={false} />
                </Link>
              ))
            : (
              <p className="text-center text-gray-500 col-span-full">
              <>
                {[...Array(6)].map((_, idx) => (
                  <div
                    key={idx}
                    className="animate-pulse bg-gray-100 rounded-xl h-48 w-full mb-4"
                  />
                ))}
              </>
              </p>
            )}
        </div>
      </section>
      
    </>
  );
}
