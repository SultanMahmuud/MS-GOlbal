import React, { useRef } from "react";


const StudentInfo = ({
  setSearchUser,
  setEmail,
  searchUser,
  sumOfQuestionMarks,
  sumOfTotalQuestionMarks,
  sumOfQuizMarks,
  sumOfTotalQuizMarks,
}) => {
  const studentRef = useRef(null);
  const studentRefID = useRef(null);

  const FilterUser = searchUser?.data;

  const getStudentByEmail = () => {
    const email = studentRef?.current?.value;

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/single/${email}`)
      .then((res) => res.json())
      .then((db) => {
        setSearchUser(db);
        setEmail(email);
      });
  };

  const getStudentByID = () => {
    
    const id = studentRefID?.current?.value;
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/studentId/${id}`)
      .then((res) => res.json())
      .then((db) => {
        setSearchUser(db);
        setEmail(id);
      });
  };

  const activeData = [
    { heading: "Assignment M.", count: FilterUser?.points },
    { heading: "Total Exam", count: sumOfTotalQuestionMarks },
    { heading: "Attended N'th", count: FilterUser?.questionMarks?.length },
    { heading: "Quiz Marks", count: sumOfQuizMarks },
    { heading: "Examen Quiz", count: sumOfTotalQuizMarks },
    { heading: "Enrolled C", count: FilterUser?.Course?.length },
    { heading: "Number", count: FilterUser?.number },
    { heading: "Email", count: FilterUser?.email },
    { heading: "ID", count: FilterUser?.studentId },
  ];

  return (
    <div className="px-3">
      <div className="flex gap-2">
        <input
          ref={studentRef}
          type="text"
          placeholder="Enter Student Email or ID"
          className="w-full border border-gray-300 text-sm px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={getStudentByEmail}
          className="bg-blue-600 text-white px-4 py-2 text-sm rounded-md shadow"
        >
          Check
        </button>
      </div>

      <div className="flex gap-2 mt-3">
        <input
          ref={studentRefID}
          type="text"
          placeholder="Enter Student ID"
          className="w-full border border-gray-300 text-sm px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={getStudentByID}
          className="bg-blue-600 text-white px-4 py-2 text-sm rounded-md shadow"
        >
          Check
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2 mt-4">
        {activeData?.map((element, index) => (
          <div key={index} className="bg-white rounded-md shadow p-3">
            <p className="text-xs font-medium text-gray-500">{element.heading}</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{element.count || "N/A"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentInfo;
