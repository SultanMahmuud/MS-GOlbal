
import CourseDetails from '@/components/AllPages/CourseDetailsPage/CourseDetails/CourseDetails';

export default async function Page({ params }) {
  
  const { courseId } = await params;

  return (
    <div>
      <CourseDetails courseID={courseId} />
    </div>
  );
}
