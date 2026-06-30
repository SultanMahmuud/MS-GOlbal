import axios from "axios";
import React, { useEffect, useState } from "react";

import StudentQuizChart from "./StudentQuizChart";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const StudentChart = ({
  searchUser,
  email,
  setSumOfQuestionMarks,
  setSumOfTotalQuestionMarks,
  setSumOfQuizMarks,
  setSumOfTotalQuizMarks,
}) => {
  const [category, setCategory] = useState([]);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState([]);

  useEffect(() => {
    const marks = [];
    const date = [];
    const total = [];

    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/questionMarks/${email}`)
      .then((response) => {
        response.data.data.questionMarks.forEach((item) => {
          marks.push(item?.questionMark);
          date.push(item?.questionSubmittedDate);
          total.push(item?.totalMark);
        });

        setCategory(date);
        setData(marks);
        setTotal(total);

        const sumQuestionTotal = total.reduce((sum, a) => sum + a, 0);
        const sumQuestionMarks = marks.reduce((sum, a) => sum + a, 0);

        setSumOfTotalQuestionMarks(sumQuestionTotal);
        setSumOfQuestionMarks(sumQuestionMarks);
      })
      .catch((e) => {
        // Handle error silently
      });
  }, [email]);

  return (
    <div className="w-full">
      <ReactApexChart
        options={{
          chart: {
            id: "student-question-chart",
          },
          xaxis: {
            categories: category,
          },
        }}
        series={[
          {
            name: "Marks",
            data: data,
          },
          {
            name: "Total",
            data: total,
          },
        ]}
        type="area"
        height={450}
      />
      <p className="text-gray-700 font-medium text-base mt-4 pl-2">Quiz Analytics</p>
      <StudentQuizChart
        searchUser={searchUser}
        email={email}
        setSumOfQuizMarks={setSumOfQuizMarks}
        setSumOfTotalQuizMarks={setSumOfTotalQuizMarks}
      />
    </div>
  );
};

export default StudentChart;
