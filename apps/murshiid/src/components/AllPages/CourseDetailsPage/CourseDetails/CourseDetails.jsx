"use client";

import { useEffect, useState } from "react";

import { MdOutlineDoubleArrow } from "react-icons/md";
import CourseDetailsLeft from "../CourseDetailsLeft";
import CourseDetailsRight from "../CourseDetailsRight";
import axios from "axios";
import { Button } from "@/components/UI/button";



const CourseDetails = ({ courseID }) => {
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);

useEffect(() => {
  if (!courseID) return; 

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/course/${courseID}`;
     
      const response = await axios.get(url);
      setCourse(response.data?.data);
    } catch (error) {
      console.error("Failed to fetch course:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchCourse();
}, [courseID]); // ✅ run only when courseID changes



  const HandleEnrollNow = () => {
    if (!course) return;
    window.location.href = `/check-out/${course?.engTitle}`;
  };

  const trailClass = () => {
    window.location.href = "/trial-class";
  };

  return (
    <div className="relative">
   

        <section className="py-6 max-w-7xl mx-auto">
          {loading ? (
            <div className="text-3xl font-bold mb-4 h-[100vh] flex items-center justify-center gap-2">
        <span className="text-primary">Muslim </span>
        <span> School</span>
      </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-9">
                {course && (
                  <CourseDetailsLeft
                    data={course}
                    trailClass={trailClass}
                    HandleEnrollNow={HandleEnrollNow}
                  />
                )}
                
              </div>
              <div className="hidden md:block md:col-span-3 lg:block">
              {course && (
                <CourseDetailsRight
                  data={course}
                  trailClass={trailClass}
                  HandleEnrollNow={HandleEnrollNow}
                />
                
              )}
              
            </div>
          </div>
           
          )}
        </section>

        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-green-400 shadow-md z-50 w-full">
          <div className="flex flex-col px-4 py-2 space-y-2">
            <div className="flex items-center justify-between text-gray-800 font-semibold">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-gray-800">
                  ৳{course?.banSalePrice || course?.price}
                </span>
                <del className="text-sm text-gray-500">
                  ৳{course?.banPrice || course?.salePrice}
                </del>
                
              </div>
            <div>
              {course?.singleHighlighter && (
                <div className="flex items-center bg-red-100 text-red-600 text-sm font-medium px-2 py-1 rounded-md">
                  {course?.singleHighlighter}
                </div>
              )}
            </div>
              
            </div>

            <div className="flex justify-between">
              <Button
                onClick={trailClass}
                className="banner-button-1 w-[45%]"
              >
                ফ্রি ক্লাস
                <MdOutlineDoubleArrow className="text-xl" />
              </Button>
              <Button
                onClick={HandleEnrollNow}
                className="banner-button-2"
              >
                এখনই ভর্তি হোন
                <MdOutlineDoubleArrow className="text-xl" />
              </Button>
            </div>
          </div>
        </div>
    
    </div>
  );
};

export default CourseDetails;
