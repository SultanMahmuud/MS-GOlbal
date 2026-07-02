'use client';
import  { useState } from "react";
import { FaHeart, FaUniversity, FaCopy } from "react-icons/fa";
import axios from "axios";
import { getApiBaseUrl, getBrandHeaders } from "@/lib/brand-config";

const getAuthHeaders = () => {
  if (typeof window === "undefined") return {};
  const token = window.localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};



import enrolled from "@/assets/cardIcon/Icon/Enrolled.svg";

import classNote from "@/assets/cardIcon/Icon/Class Note.svg";
import lectures from "@/assets/lectureicon/video-lecture (1).svg"
import duration from "@/assets/cardIcon/Icon/clock.svg";

import { MdFavoriteBorder } from "react-icons/md";
import Image from "next/image";
import { Button } from "@/components/UI/button";
import StarRating from "@/utils/StarRating";

export default function CourseCard({ course, dashboard }) {
  const [loved, setLoved] = useState(false);


  const rankStyle = {
    Hot: "bg-green-500",
    New: "bg-red-500",
    Bestseller: "bg-red-400",
    Popular: "bg-yellow-500",
    Special: "bg-emerald-500",
  };

  const handleLove = async (id) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/course/like/${id}`,
        { n: 1 }
      );
      if (res.status === 201) {
        setLoved(true);
      }
    } catch {
      alert("Error! Something went wrong");
    }
  };

  return (
  
      <div className="max-w-[340px] rounded-2xl bg-white/50 shadow-xl backdrop-blur-xl border border-white/70 p-3 my-5"
          style={{
            background: "linear-gradient(135deg, rgb(224 239 231) 0%, rgb(255 255 255) 80%)",
          }}
        >
          {/* Image */}
          <div
            className="relative h-[200px] rounded-xl overflow-hidden mb-4 bg-cover bg-center"
            style={{
              backgroundImage: course?.image
              ? `url("${course.image}")`
              : "url('/fallback.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black/10"></div>

          {/* Rank Badge */}
          {course?.rank && (
            <span
              className={`absolute top-2 left-2 px-3 py-1 rounded-md text-white text-xs font-semibold shadow-sm ${rankStyle[course.rank]}`}
            >
              {course.rank}
            </span>
          )}

          {/* Love Button */}
          <div className="absolute top-2 right-2 flex items-center gap-1">
            <Button onClick={() => handleLove(course._id)} className="bg-transparent">
              {!loved ? (
                <MdFavoriteBorder className="text-white" />
              ) : (
                <FaHeart className="text-red-500" />
              )}
            </Button>
            <span className="text-white text-xs">{course?.likes?.length || 0}</span>
          </div>
        </div>

        {/* Star Rating */}
        <div className="px-2 my-4">
          <StarRating reviews={course?.review} />
        </div>

        {/* Title */}
        <div className="px-2">
          <h3 className="text-xl font-bold base1 mb-2">{course?.title}</h3>

          {/* Time & Seat */}
          <div className="flex flex-wrap gap-2 mb-3">
            {course?.courseTime && (
              <div className="border border-purple-400 bg-purple-100 text-purple-700 text-sm font-semibold px-3 py-1 rounded-md">
                {course.courseTime}
              </div>
            )}
            {course?.courseSeat && (
              <div className="border border-orange-400 bg-orange-100 text-orange-700 text-sm font-semibold px-3 py-1 rounded-md">
                {course.courseSeat}
              </div>
            )}
          </div>

          {/* Features */}
          <div className="flex justify-between gap-2 mb-2">
            <div className="flex items-center bg-gray-100 gap-1 px-3 py-1 rounded-md text-[16px] text-gray-700 font-medium">
              <Image src={enrolled} className="w-4 h-4" alt="Enrolled Icon" width={6} height={6}/>
              Enrolled: {course?.totalEnroll || 0}
            </div>
            <div className="flex items-center bg-gray-100 gap-1 px-3 py-1 rounded-md text-[16px] text-gray-700 font-medium">
              <Image src={classNote} className="w-4 h-4" alt="Class Note Icon" width={6} height={6}/>
              Class Notes: {course?.classNote || 0}
            </div>
          </div>

          <div className="flex justify-between gap-2 mb-2">
            <div className="flex items-center bg-gray-100 gap-1 px-3 py-1 rounded-md text-[16px] text-gray-700 font-medium">
              <Image src={lectures} className="w-4 h-4" alt="Lectures Icon" width={6} height={6}/>
              Lectures: {course?.lectures || 0}
            </div>
            <div className="flex items-center bg-gray-100 gap-1 px-3 py-1 rounded-md text-[16px] text-gray-700 font-medium">
              <Image src={duration} className="w-4 h-4" alt="Duration Icon" width={6} height={6}/>
              Duration: {course?.courseDuration || 0}
            </div>
          </div>

          
          {/* Provider and Price */}
            <div className="flex justify-between mt-4 items-center">
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center text-gray-700 gap-2">
                  <FaUniversity className="text-gray-500" />
                  <span className="font-medium">
                    {course?.provider || "Muslim School"}
                  </span>
                </div>
                {dashboard && (
                  <div className="flex flex-col gap-1.5 items-start mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      course?.brandKey === 'quran-care' 
                        ? 'bg-teal-50 text-teal-700 border-teal-200' 
                        : course?.brandKey === 'murshiid' 
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {course?.brandKey === 'quran-care' ? 'Quran Care' : course?.brandKey === 'murshiid' ? 'Murshiid' : 'Muslim School'}
                    </span>
                    <button
                      onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (window.confirm(`Are you sure you want to duplicate "${course?.title || 'this course'}"?`)) {
                          try {
                            const res = await axios.post(
                              `${getApiBaseUrl()}/course/duplicate/${course._id}`,
                              {},
                              {
                                headers: {
                                  ...getBrandHeaders(),
                                  ...getAuthHeaders(),
                                },
                              }
                            );
                            alert("Course duplicated successfully!");
                            window.location.href = `/dashboard/admin/course/${res.data.data._id}`;
                          } catch (err) {
                            console.error("Error duplicating course:", err);
                            alert(err.response?.data?.error || "Failed to duplicate course.");
                          }
                        }
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-emerald-700 bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-200/50 px-2 py-0.5 rounded-md transition duration-200 cursor-pointer"
                    >
                      <FaCopy size={10} />
                      Duplicate
                    </button>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end leading-none">
                <span className="text-lg font-extrabold text-gray-900">
                  {course?.banSalePrice || course?.salePrice}
                </span>
                <span className="text-sm text-gray-500 line-through leading-none mb-3">
                  ৳{course?.banPrice || course?.price}
                </span>
              </div>
            </div>
          {/* Enroll Button */}
         {!dashboard && (
           <Button
             onClick={(e) => {
               e.preventDefault();
               window.location.href = `/courses/${course.engTitle}`;
             }}
             className="banner-button-1 w-full mt-3"
           >
             ভর্তি হোন
           </Button>
         )}
        </div>
      </div>
   
  );
}
