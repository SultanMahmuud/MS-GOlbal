"use client";

import { Button } from "@/components/UI/button";
import { useEffect, useState } from "react";
import axios from "axios";
import CurriculumTab from "./CurriculumTab";
import Lesson from "./Lesson";
import Quiz from "./Quiz";

const CourseCurriculum = ({ curriculum, setCurriculum }) => {
  const [currTitle, setCurrTitle] = useState("");
  const [lessons, setLessons] = useState([]);
  const [saved, setSave] = useState(false);

  useEffect(() => {
    if (saved) {
      const newCurriculum = {
        moduleName: currTitle,
        lessons: lessons,
      };

      axios.post("/api/lesson", newCurriculum).catch((err) => {
        console.error("Error saving lesson:", err);
      });
    }
  }, [saved]);

  const handleCurriculumChange = () => {
    const newCurriculum = {
      moduleName: currTitle,
      lessons: lessons,
    };

    setCurriculum([...curriculum, newCurriculum]);
    setLessons([]);
    setCurrTitle("");
  };

  return (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          className="w-full p-3 text-base border rounded-md shadow-sm outline-gray-400"
          placeholder="Section Title"
          value={currTitle}
          onChange={(e) => setCurrTitle(e.target.value)}
        />
      </div>

      <CurriculumTab
        com1={
          <Lesson
            lessons={lessons}
            setLessons={setLessons}
            setSave={setSave}
            save={saved}
          />
        }
        com2={
          <Quiz
            lessons={lessons}
            setLessons={setLessons}
            setSave={setSave}
          />
        }
       
      />

      <div className="text-right">
        <Button
          className="text-sm mr-8"
          onClick={handleCurriculumChange}
        >
          Next Curriculum
        </Button>
      </div>
    </div>
  );
};

export default CourseCurriculum;
