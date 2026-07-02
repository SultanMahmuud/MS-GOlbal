"use client";

import CourseCard from "@/components/Shared/CourseCard/CourseCard";
import { getApiBaseUrl } from "@/lib/brand-config";
import Link from "next/link";
import React, { useEffect, useState } from "react";



const DraftCourse = () => {
  const [courses, setCourses] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

 

  useEffect(() => {
    setLoading(true);
    fetch(`${getApiBaseUrl()}/course/admin`)
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

 


  return (
    <div className="w-full px-4">
    
      {/* Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading
          ?
              <div>
                loading.........
              </div>
            
          : (searchResult.length > 0 ? searchResult : courses)
              .filter(
                (course) =>
                  course.courseType !== "final" || course.visibility !== "Public"
              )
              .map((element, index) => (
                <div key={index}>
                  <Link href={`/dashboard/admin/course/${element._id}`}>
                  <CourseCard
                    element={element}
                    loading={loading}
                    dashboard={true}

                  />
                  
                  </Link>
                </div>
              ))}
      </div>
    </div>
  );
};

export default DraftCourse;
