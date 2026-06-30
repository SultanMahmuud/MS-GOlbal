import axios from "axios";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const StudentQuizChart = ({
  searchUser,
  email,
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
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/quizMarks/${email}`)
      .then((response) => {
        response?.data?.data?.quizMarks?.forEach((item) => {
          marks.push(item?.quizMark);
          date.push(item?.quizSubmittedDate);
          total.push(item?.totalMark);
        });

        setCategory(date);
        setData(marks);
        setTotal(total);

        const sumQuestionTotal = total.reduce((sum, a) => sum + a, 0);
        const sumQuestionMarks = marks.reduce((sum, a) => sum + a, 0);

        setSumOfTotalQuizMarks(sumQuestionTotal);
        setSumOfQuizMarks(sumQuestionMarks);
      })
      .catch((e) => {
        // Handle error silently
      });
  }, [email]);

  return (
    <div className="mt-4">
      <ReactApexChart
        options={{
          chart: {
            id: "student-quiz-chart",
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
    </div>
  );
};
export default StudentQuizChart