
import Image from "next/image";
import Link from "next/link";
import { BiBarChart } from "react-icons/bi";
import { BsJournalBookmark } from "react-icons/bs";
import { GiDuration } from "react-icons/gi";


const TeacherCourseCard = ({ element }) => {
 

 
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-full h-full">
      <Link href={`/teacherDashboard/myCourse/${element?._id}`} className="block">
        <Image
          src={element?.image}
          alt={element?.title}
          className="w-full h-52 object-cover rounded-t-lg"
          width={300}
          height={300}
        />
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="text-yellow-500 text-sm">★★★★★</div>
            <p className="text-sm ">({element?.rating})</p>
          </div>

          <h3 className="text-lg font-semibold  mb-3">
            {element?.title}
          </h3>

          <div className="flex justify-between flex-wrap gap-2 mb-4  text-sm font-medium">
            <div className="flex items-center gap-1">
              <BsJournalBookmark className="" />
              <span>{element?.lesson} Lesson</span>
            </div>
            <div className="flex items-center gap-1">
              <GiDuration className="" />
              <span>
                {element?.durationHr}hr {element?.durationMt}m
              </span>
            </div>
            <div className="flex items-center gap-1">
              <BiBarChart className="text-blue-600" />
              <span>{element?.level}</span>
            </div>
          </div>

          <hr className="mb-3" />

          <div className="flex justify-between items-center text-sm font-medium text-blue-700">
            <div className="flex items-center gap-2">
            </div>
            <div className="flex flex-col text-right">
              <span className="line-through">${element?.price}</span>
              <span className="text-green-600">${element?.salePrice}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default TeacherCourseCard;
