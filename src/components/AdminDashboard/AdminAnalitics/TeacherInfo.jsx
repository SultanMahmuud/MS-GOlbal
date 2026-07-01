import React, { useRef, useState } from "react";

const TeacherInfo = ({

  setTeacherEmail,
  courseLength,
}) => {
  const [searchTeacher, setTeacher] = useState([]);
  const studentRef = useRef("");
  const [email, setEmail] = useState("");

  const getStudentByEmail = () => {
    
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/single/${email}`)
      .then((res) => res.json())
      .then((db) => {
        setTeacher(db?.data);
        setTeacherEmail(db?.data?.email);
      });
  };

  const activeDataTeacher = [
    { heading: "Total Course", count: courseLength || 0 },
    { heading: "Number", count: searchTeacher?.number || "No number" },
    { heading: "Join Date", count: searchTeacher?.joiningDate || "YY/MM/DD" },
    {
      heading: "Last Payment",
      count: searchTeacher?.teacherPayment?.slice(-1)[0]?.amountOfPayment || 0,
    },
    { heading: "Email", count: searchTeacher?.email },
    { heading: "ID", count: searchTeacher?.teacherId },
  ];

  return (
    <div className="px-4">
      <div className="flex gap-2">
        <input
          ref={studentRef}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          placeholder="Enter Teacher Email"
          className="w-full border border-gray-300 text-sm px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={getStudentByEmail}
          className="bg-blue-600 text-white px-4 py-2 text-sm rounded-md shadow"
        >
          Click
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
        {activeDataTeacher?.map((element, index) => (
          <div key={index} className="bg-white rounded-md shadow p-3">
            <p className="text-xs font-medium text-gray-500">{element.heading}</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{element.count || "N/A"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherInfo;
