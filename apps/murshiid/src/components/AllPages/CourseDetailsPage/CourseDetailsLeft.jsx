"use client";

import { Button } from "@/components/UI/button";
import LearnCourseTab from "./LearnCourseTab";
import Image from "next/image";

import axios from "axios";
import { useEffect, useState } from "react";
import StarRating from "@/utils/StarRating";
import ReactPlayer from "react-player";
import CourseDetailsRight from "./CourseDetailsRight";
import detailsImg from "@/assets/details/Untitled-1-min.png"
const CourseDetailsLeft = ({ data }) => {
 
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    axios
      .put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/getByFiltered`, {
        emails: data?.teacherInfo,
      })
      .then((res) => {
        setTeachers(res?.data.data);
      })
      .catch((error) => {});
  }, [data]);

  return (
    <div className="mt-2 lg:mt-0 p-4">
      {data?.previewVideo ? (
        <div className="relative pt-[56.25%]">
          <ReactPlayer
            className="absolute top-0 left-0"
            url={data.previewVideo}
            width="100%"
            height="100%"
            controls
          />
        </div>
      ) : (
        <div className="mt-6">
          <Image
            src={data?.image || "https://via.placeholder.com/1920x1080"}
            alt="Course Thumbnail"
            className="w-full rounded-lg"
            width={1920}
            height={1080}
          />
        </div>
      )}

      <div className="border p-4 rounded-lg mt-4">
        <h2 className="text-xl lg:text-4xl font-semibold lg:font-bold mb-2 navColor">
          {data?.title}
        </h2>
        <p className="text-gray-700 mb-4 text-[20px] font-medium">
          {data?.subTitle}
        </p>

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "6px",

            justifyContent: " flex-start",
            marginBottom: "10px",
          }}
        >
          {data?.courseDay && (
            <Button
              style={{
                border: "1px solid orange",
                backgroundColor: "#fef0e8",
                padding: "0 5px",
                height: "35px",
                borderRadius: "4px",
                color: "black",
                fontSize: "16px",
                fontWeight: 700,
              }}
            >
              <p>{`${data?.courseDay}`}</p>
            </Button>
          )}

          {data?.courseTime && (
            <Button
              style={{
                border: "1px solid purple",
                backgroundColor: "#f1e3ff",
                padding: "0 5px",
                height: "35px",
                borderRadius: "4px",
                color: "black",
                fontSize: "16px",
                fontWeight: 700,
              }}
            >
              <p className="inter">{`${data?.courseTime}`}</p>
            </Button>
          )}

          {data?.courseSeat && (
            <Button
              style={{
                border: "1px solid orange",
                backgroundColor: "#fef0e8",
                padding: "0 5px",
                height: "35px",
                borderRadius: "4px",
                color: "black",
                fontSize: "16px",
                fontWeight: 700,
              }}
            >
              <p>{`${data?.courseSeat}`}</p>
            </Button>
          )}
        </div>
        <div className="border border-[#ddd] rounded-[10px] p-[5px] mb-[10px] lg:mb-0 hind">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {/* Instructor */}
            <div className="flex items-center border-r lg:border-r border-[#ddd] pr-2">
              <Image
                alt="Remy Sharp"
                src={teachers[0]?.avatar || detailsImg}
                width={40}
                height={40}
              />
              <div className="text-[#1C1C1E] ml-2 leading-tight">
                <p className="text-[16px] font-semibold font-hind">
                  ইন্সট্রাক্টর
                </p>
                <p className="text-[18px] font-semibold font-hind">
                  {data?.teacherName}
                </p>
              </div>
            </div>

            {/* Category */}
            <div className="flex items-center border-r lg:border-r border-[#ddd] pr-2">
              <div className="text-[#1C1C1E] leading-tight">
                <p className="text-[16px] font-semibold">ক্যাটাগরি</p>
                <p className="text-[18px] font-semibold">{data?.category}</p>
              </div>
            </div>

            {/* Students */}
            <div className="flex items-center border-t lg:border-t-0 border-[#ddd] pl-10 lg:pl-0 border-r lg:border-r pr-2">
              <div className="text-[#1C1C1E] leading-tight w-full">
                <p className="text-[16px] font-semibold">স্টুডেন্ট</p>
                <p className="text-[18px] font-semibold">
                  {data?.studentTotal}
                </p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center border-t lg:border-t-0 border-[#ddd]  flex-wrap">
              <div className="text-[#1C1C1E] my-1">
                <p className="lg:text-[16px] font-semibold">রেটিং</p>
                <div className="w-32">
                  <StarRating
                  name="size-small"
                  size="small"
                  readOnly
                  defaultValue={5}
                  precision={0.5}
                  max={5}
                />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="prose prose-lg text-gray-700 hind"
          dangerouslySetInnerHTML={{ __html: data?.description }}
        />
      </div>

      {/* Additional Tabs or Right Section */}
      <div className="mt-12">
        <div className="lg:hidden block">
          <CourseDetailsRight data={data} />
        </div>
        <LearnCourseTab course={data} />
      </div>
    </div>
  );
};

export default CourseDetailsLeft;
