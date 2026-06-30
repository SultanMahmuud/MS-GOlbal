import React from "react";
import TeacherCard from "@/components/Shared/TeacherCard/TeacherCard";
import Link from "next/link";
import { MdArrowRight } from "react-icons/md";

import  maleTeacher from '@/assets/defaultImage/Teacher-1.jpg';
import  femaleteacher  from '@/assets/defaultImage/Teacher-2.jpg';
import { safeFetchJson } from "@/lib/safe-api";

const getAllTeachers = async () => {
  const data = await safeFetchJson("/user/role/teacher", {
    cache: "force-cache",
    fallback: { data: [] },
  });
  return data?.data || [];
};

const AwsomeTeachers = async ({ isLoading = false }) => {
  const teachers = await getAllTeachers();
 

  return (
    <div className="px-4 md:px-10 lg:px-16 lg:mt-12 mt-4">
      {/* Section Heading */}
      <div className="text-center mb-10">
        <h2 className=" text-[26px] sm:text-xl lg:text-3xl font-bold base1">
          আপনার পাশে আছে অসাধারণ <br className="lg:hidden block"/>শিক্ষক-শিক্ষিকাবৃন্দ
        </h2>
        <p className="text-[18px] lg:text-xl base2  font-medium">
          আপনি পাচ্ছেন সাবজেক্টের সেরা টিচার ফলে <br className="lg:hidden block"/> কঠিন টপিকও পানির মতো সহজ মনে
          হবে
        </p>

        <Link href="/teacher">
          <button
            className="mt-5 bg-[#10B981] hover:bg-[#059669] rounded-full px-6 py-3 text-[16px] font-semibold text-white flex items-center gap-2 mx-auto"
          >
            <span>টিচারদের দেখুন</span>
            <MdArrowRight className="text-lg" />
          </button>
        </Link>
      </div>

      
      {/* Teacher Cards */}
      {isLoading ? (
        <p>Loading</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {teachers?.slice(0, 4).map((el) => (
            <Link key={el?._id} href={`teacher/${el._id}`}>
              <TeacherCard
                
                image={el?.gender === "Male" ? maleTeacher : femaleteacher}
                depart={el?.Department || "নাজেরা"}
                name={el?.name || "yasin"}
                joiningDate={el?.joiningDate || "23-5-11"}
                institution={el?.institution}
                experience={el?.experience}
                totalSutdents={el?.totalStudents}
                totalClass={el?.totalClasses || "20"}
                qualification={el?.qual1}
                qualification2={el?.qual2}
                expert={el?.expert}
                
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AwsomeTeachers;
