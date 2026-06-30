"use client";
import React, { useState } from "react";
import { MdExpandMore, MdOndemandVideo } from "react-icons/md";

const Curriculum = ({ data }) => {
const curriculumData = data.curriculum



  const [openModule, setOpenModule] = useState(0);

  const handleLessonClick = (lesson) => {
    if (lesson?.preview) {
    
    }
  };

  return (
    <div>
      {curriculumData?.map((data, moduleIndex) => (
        <div
          key={moduleIndex}
          className="mb-4 shadow-md border border-gray-200 rounded-lg bg-white"
        >
         
          <div
            className="flex items-center justify-between cursor-pointer px-4 py-3"
            onClick={() =>
              setOpenModule(openModule === moduleIndex ? null : moduleIndex)
            }
          >
            <div className="flex items-center">
              <div className="bg-primary text-white rounded-md px-2 py-1 text-center mr-3">
                <span className="block text-lg font-bold">পাঠ</span>
                <span className="block text-lg font-bold">
                  {moduleIndex + 1}
                </span>
              </div>
              <h3 className="text-lg font-bold navColor">
                {data?.moduleName}
              </h3>
            </div>
            <div className="bg-gray-100 rounded-full p-1">
              <MdExpandMore
                className={`text-black text-2xl transition-transform ${
                  openModule === moduleIndex ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>
          </div>

          {openModule === moduleIndex && (
            <div className="px-4 py-2 border-t border-gray-200">
              {data?.lessons?.map((lesson, videoIndex) => (
                <div
                  key={lesson._id}
                  className={`px-3 py-2 rounded-md cursor-pointer transition `}
                  onClick={() => handleLessonClick(lesson)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-gray-800">
                      <MdOndemandVideo className="text-lg" />
                      <span className="text-sm font-medium">
                        {`Video 0${videoIndex + 1} - ${lesson?.title}`}
                      </span>
                    </div>
                    {lesson?.preview && (
                      <span className="text-sm font-medium text-primary">
                        ফ্রি
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Curriculum;
