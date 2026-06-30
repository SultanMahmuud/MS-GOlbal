'use client';
import axios from "axios";
import React, { useEffect, useState } from "react";


import TeacherCard from "@/components/Shared/TeacherCard/TeacherCard";
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
            {courses?.map((el, index) => (
              <div key={index} className="w-full">
                <TeacherCard element={el} />
              </div>
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
