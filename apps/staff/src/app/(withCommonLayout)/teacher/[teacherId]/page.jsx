

import Instructureteacher from "@/components/AllPages/TeacherPage/Instructureteacher/Instructureteacher";

export default async function Page({ params }) {

 const { teacherId } = await params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/single-home/${teacherId}`, {
    cache: "no-store",
  });
  const teacherProfiles = await res.json();


  return (
    <Instructureteacher teacherProfiles={teacherProfiles?.data} />
 
  )
}
