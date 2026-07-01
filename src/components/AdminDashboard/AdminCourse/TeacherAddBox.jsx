"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const TeacherAddBox = ({ setTeacher, selectedTeacherId }) => {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/role/teacher`
        );
        setTeachers(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchTeachers();
  }, []);

  const handleChange = (e) => {
    setTeacher(e.target.value);
  };

  return (
    <div className="">
   
      <select
        id="teacher-select"
        value={selectedTeacherId}
        onChange={handleChange}
        className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
      >
        <option value="">Select a teacher</option>
        {teachers.map((teacher) => (
          <option key={teacher.id} value={teacher.id}>
            {teacher.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TeacherAddBox;
