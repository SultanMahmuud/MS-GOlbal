'use client';
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { getUserInfo } from "@/services/auth.services";

const MyCourse = () => {
  const [User, setUser] = useState();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState();
const user = getUserInfo()

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/single/${user?.email}`)
      .then((res) => {
        setUser(res?.data);
        setError(false);
      })
      .catch((error) => {
        setError(true);
      });
  }, [user?.email]);

  useEffect(() => {
    const courseId = User?.data?.Course;
    setLoading(true);
    if (courseId?.length) {
      axios
        .put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/course/get-courseby-filter`, {
          courseId: courseId,
        })
        .then((res) => {
          setLoading(false);
          setCourses(
            res?.data?.data.filter((course) => course.medium === "Record Course")
          );
          setError(false);
        })
        .catch((error) => {
          setLoading(false);
          setError(true);
        });
    }
  }, [User]);

  return (
    <div>
      <div className="w-full">
        {!loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {courses?.map((course, index) => (
              <article key={course?._id || index} className="w-full rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                {course?.image ? (
                  <img
                    src={course.image}
                    alt={course.title || "Course"}
                    className="mb-4 h-36 w-full rounded-md object-cover"
                  />
                ) : null}
                <h2 className="text-base font-semibold text-slate-950">{course?.title}</h2>
                <p className="mt-1 text-sm text-slate-500">{course?.medium}</p>
                <Link
                  href={`/dashboard/my-courses/${course?._id}`}
                  className="mt-4 inline-flex h-9 items-center rounded-md bg-emerald-600 px-3 text-sm font-medium text-white hover:bg-emerald-700"
                >
                  Continue course
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="w-full">
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourse;
