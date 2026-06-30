"use client";

import { useEffect, useState } from "react";
import CurriculumTab from "../CurriculumTab";
import Lesson from "../Lesson";
import Quiz from "../Quiz";


const AddNewLesson = ({ lesson, setLesson, setOpen }) => {
  const [saved, setSave] = useState(false);

  useEffect(() => {
    if (saved) {
      setOpen(false);
    }
  }, [saved, setOpen]);

  return (
    <div className="w-full scroll-my-7">
      {/* Curriculum Tabs */}
      <CurriculumTab
        com1={
          <Lesson
            lessons={lesson}
            setLessons={setLesson}
            setSave={setSave}
            save={saved}
          />
        }
        com2={
          <Quiz
            lessons={lesson}
            setLessons={setLesson}
            setSave={setSave}
            save={saved}
          />
        }
      />

      {/* Footer actions (aligned right) */}
      <div className="text-right mt-4">
        {/* Optional buttons can go here */}
      </div>
    </div>
  );
};

export default AddNewLesson;
