

import CourseSlider from "./CourseSlider";
import { safeFetchJson } from "@/lib/safe-api";

const getCourses = async () => {
  const data = await safeFetchJson("/course", { fallback: { data: [] } });
  return data?.data || [];
};
const CommonCourse = async () => {
  const courses = await getCourses();
  return (
    <div>
         {courses && courses.length > 0 ? (
          <CourseSlider courses={courses} />
        ) : (
          <div className="text-center text-gray-500">কোনো কোর্স পাওয়া যায়নি</div>
        )}
    </div>
  )
}

export default CommonCourse
