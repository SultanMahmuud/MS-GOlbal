import React, { useEffect, useState } from "react";

const CourseSummary = ({ teacherEmail, setCourseLength }) => {
  const [courses, setCourses] = useState(null);
  

  useEffect(() => {
    if (!teacherEmail) return;

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/course/teacher/${teacherEmail}`)
      .then((res) => res.json())
      .then((db) => {
        setCourses(db?.data);
        setCourseLength(db?.data?.length);
      });
  }, [teacherEmail, setCourseLength]);

  return (
    <div className="px-4">
      <h2 className="text-base font-semibold text-gray-700 mb-3">Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses?.length ? (
          courses.map((element) => (
            <div key={element?._id} className="rounded-md border p-3 text-sm">
              <p className="font-semibold text-gray-800">{element?.title}</p>
              <p className="text-gray-500">{element?.category}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No courses found</p>
        )}
      </div>
    </div>
  );
};

export default CourseSummary;
