'use client'
import CourseCard from "@/components/Shared/CourseCard/CourseCard";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaUserAstronaut } from "react-icons/fa";

const AdminCourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false); // 👈

  useEffect(() => {
    setMounted(true); // mark that we are on client

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/course`)
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setLoading(false);
      });
  }, []);

  if (!mounted) return null; // 👈 avoid hydration mismatch

  return (
    <div className="p-4">  
  

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
           <div className="flex flex-col md:flex-row gap-4 py-5">
        {[{
          title: 'Total Courses',
          count:40,
        }, {
          title: 'Total Student',
          count: 403,
        }].map(({ title, count }, i) => (
          <div key={i} className="bg-white shadow-md w-full max-w-xs rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl">
              <FaUserAstronaut />
            </div>
            <div>
              <h6 className="text-sm font-medium">{title}</h6>
              <h6 className="text-lg font-bold">{count}</h6>
            </div>
          </div>
        ))}
      </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {courses.data.map((course) => (
             <Link key={course._id} href={`course/${course?._id}`}>
             <CourseCard
                        dashboard={true}
                        course={course}
                       
                        
                      />
             </Link>
          ))}
        </div>
        </>
      )}
    </div>
  );
};

export default AdminCourse;
