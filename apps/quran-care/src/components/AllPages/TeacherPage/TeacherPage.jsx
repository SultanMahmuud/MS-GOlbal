'use client';
import TeacherCard from "@/components/Shared/TeacherCard/TeacherCard";
import { Button } from "@/components/UI/button";
import Image from "next/image";
import Link from "next/link";
import{ useEffect, useState } from "react";
import  maleTeacher from '@/assets/defaultImage/Teacher-1.jpg';
import  femaleteacher  from '@/assets/defaultImage/Teacher-2.jpg';


const teacherOfMonth = [
  {
    name: "Sumaia Jannati",
    avatar: "https://qawamiuniversity.nyc3.digitaloceanspaces.com/wp5618747.jpg"
,
    quote: "“Patience and perseverance are key in teaching.”",
  },
  {
    name: "কাওছার হোসাইন",
    avatar: "https://qawamiuniversity.nyc3.digitaloceanspaces.com/Kawsar hossain.jpg",
    quote: "“Strive for knowledge and encourage others.”",
  },
  {
    name: "Tanvir Ahmad",
    avatar: "https://qawamiuniversity.nyc3.digitaloceanspaces.com/rsz_whatsapp_image_2022-12-15_at_172206.jpg",
    quote: "“Inspiring the next generation of learners.”",
  },
];

export default function TeachersSection() {
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [deptFilter, setDeptFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setIsLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/role/teacher?limit=all`)
      .then((res) => res.json())
      .then((data) => {
        const activeTeachers = data?.data?.filter((teacher) => !teacher.isBlock);
        setTeachers(activeTeachers || []);
        setIsLoading(false);
      });
  }, []);

  const departments = Array.from(new Set(teachers.map((t) => t.Department)));

  const filteredTeachers = teachers.filter((t) => {
    const matchesDepartment = deptFilter === "" || t.Department === deptFilter;
    const matchesGender = genderFilter === "" || t.gender?.toLowerCase() === genderFilter.toLowerCase();
    const matchesSearch =
      searchTerm === "" ||
      t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.Department?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDepartment && matchesGender && matchesSearch;
  });


  return (
    <>
    

      <section className="px-6 py-12 max-w-6xl mx-auto">
        {/* Teacher of the Month Carousel */}
        <h2 className="text-4xl font-bold text-center mb-6">
          Teacher of the Month
        </h2>
        <div className="flex flex-col lg:flex-row space-y-8 space-x-6  mb-12 pb-4">
          {teacherOfMonth.map((t, i) => (
            <div
              key={i}
              className="min-w-[18rem] bg-white rounded-2xl p-6 flex-shrink-0 shadow-md"
            >
              <Image
                src={t.avatar}
                alt={t.name}
                width={96}
                height={96}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-center mb-2">
                {t.name}
              </h3>
              <p className="text-center text-gray-600 mb-4">{t.quote}</p>
              <Button className="block mx-auto bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                Learn More
              </Button>
            </div>
          ))}
        </div>

        {/* Header + Subtext */}
        <h2 className="text-3xl font-bold text-center mb-2">
          Muslim School Awesome Teachers
        </h2>
        <p className="text-center text-gray-600 mb-6">
          You Get The Best Teacher In the Subject As A Result, <br />
          Difficult Topics Will Seem Easy As Water
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 justify-center items-center mb-8">
          {/* Department Dropdown */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 hind rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="">All Departments</option>
            {departments.map((dep,index) => (
              <option key={index} value={dep}>
                {dep}
              </option>
            ))}
          </select>

          {/* Gender Filter */}
          {["male", "female"].map((g) => (
            <Button
              key={g}
              className={`px-4 py-2 rounded-lg border transition-colors focus:outline-none ${
                genderFilter === g
                  ? "bg-green-100 border-green-400 text-green-800"
                  : "bg-white border-gray-300 text-gray-800"
              }`}
            >
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </Button>
          ))}

          {/* Search Input */}
          <input
            type="text"
            placeholder="Enter search term"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div className="pb-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Skeleton loader when loading */}
        {isLoading && (
          <>
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="animate-pulse bg-gray-200 rounded-2xl h-64 w-full" />
            ))}
          </>
        )}
        {filteredTeachers.length > 0 ? (
          filteredTeachers.map((el) => (
            <div key={el?._id}>
              <Link href={`/teacher/${el?._id}`} className="no-underline">
              <TeacherCard
                
                image={el?.gender === "Male" ? maleTeacher : femaleteacher}
                depart={el?.Department || "নাজেরা"}
                name={el?.name || "yasin"}
                joiningDate={el?.joiningDate || "23-5-11"}
                institution={el?.institution}
                experience={el?.experience}
                totalSutdents={el?.totalStudents}
                totalClass={el?.totalClasses || "20"}
                qualification={el?.qual1}
                qualification2={el?.qual2}
                expert={el?.expert}
                
              />
              </Link>
            </div>
          ))
        ) : (
          <div className="col-span-full">
            <p className="text-center text-gray-500">No teachers found.</p>
          </div>
        )}
      </div>
    </div>
      </section>

   
    </>
  );
}
