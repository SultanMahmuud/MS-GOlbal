'use client'
import CourseSummary from "@/components/AdminDashboard/AdminAnalitics/CourseSummary";
import StudentInfo from "@/components/AdminDashboard/AdminAnalitics/StudentInfo";
import StudentChart from "@/components/AdminDashboard/AdminAnalitics/StydentChart";
import TeacherInfo from "@/components/AdminDashboard/AdminAnalitics/TeacherInfo";
import ActivityCast from "@/components/AdminDashboard/DashboardActivity/ActivityCast";
import React, { useState } from "react";


const AdminAnalyticContainer = () => {
  return (
    <div className="w-full p-5">
      <ActivityCast />
     <TabBar/>
    </div>
  );
};

export default AdminAnalyticContainer;

const TabBar = () => {
  const [searchUser, setSearchUser] = useState({});
  const [email, setEmail] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [value, setValue] = useState("1");
  const [courseLength, setCourseLength] = useState("");

  const [sumOfQuestionMarks, setSumOfQuestionMarks] = useState(null);
  const [sumOfTotalQuestionMarks, setSumOfTotalQuestionMarks] = useState(null);
  const [sumOfQuizMarks, setSumOfQuizMarks] = useState(null);
  const [sumOfTotalQuizMarks, setSumOfTotalQuizMarks] = useState(null);

  return (
    <div className="w-full mt-10">
      <div className="flex items-center border-b border-gray-200 rounded-md bg-primary w-1/5 p-1">
        <button
          onClick={() => setValue("1")}
          className={`text-sm font-medium py-2 px-4 rounded-md ${
            value === "1" ? "bg-secondary" : ""
          }`}
        >
          Student
        </button>
        <button
          onClick={() => setValue("2")}
          className={`text-sm font-medium py-2 px-4 rounded-md ${
            value === "2" ? "bg-secondary" : ""
          }`}
        >
          Teacher
        </button>
      </div>

      {value === "1" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
          <div className="col-span-12 lg:col-span-8 bg-white rounded-md shadow p-4">
            <StudentChart
              searchUser={searchUser}
              email={email}
              setSumOfQuestionMarks={setSumOfQuestionMarks}
              setSumOfTotalQuestionMarks={setSumOfTotalQuestionMarks}
              setSumOfQuizMarks={setSumOfQuizMarks}
              setSumOfTotalQuizMarks={setSumOfTotalQuizMarks}
            />
          </div>
          <div className="col-span-12 lg:col-span-4 bg-white rounded-md shadow p-4">
            <StudentInfo
              lay="flex items-center"
              setSearchUser={setSearchUser}
              setEmail={setEmail}
              email={email}
              searchUser={searchUser}
              sumOfQuestionMarks={sumOfQuestionMarks}
              sumOfTotalQuestionMarks={sumOfTotalQuestionMarks}
              sumOfQuizMarks={sumOfQuizMarks}
              sumOfTotalQuizMarks={sumOfTotalQuizMarks}
            />
          </div>
        </div>
      )}

      {value === "2" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
          <div className="col-span-12 lg:col-span-8 bg-white rounded-md shadow p-4">
            <CourseSummary
              teacherEmail={teacherEmail}
              setCourseLength={setCourseLength}
            />
          </div>
          <div className="col-span-12 lg:col-span-4 bg-white rounded-md shadow p-4">
            <TeacherInfo
              lay="flex items-center"
              setSearchUser={setSearchUser}
              setEmail={setEmail}
              email={email}
              searchUser={searchUser}
              sumOfQuestionMarks={sumOfQuestionMarks}
              sumOfTotalQuestionMarks={sumOfTotalQuestionMarks}
              sumOfQuizMarks={sumOfQuizMarks}
              sumOfTotalQuizMarks={sumOfTotalQuizMarks}
              setTeacherEmail={setTeacherEmail}
              teacherEmail={teacherEmail}
              courseLength={courseLength}
            />
          </div>
        </div>
      )}
    </div>
  );
};
