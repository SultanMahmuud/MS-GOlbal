'use client';
import { FaCalendarAlt, FaMapMarkerAlt, FaVideo } from 'react-icons/fa';
import Image from 'next/image';

export default function ContentCard({
  image,
  classType,
  name,
  course,
  joinDate,
  location,
  time,
  label
}) {
  return (
    <div className="flex justify-center items-center p-4 mt-4 font-hind min-w-[300px]">
      <div className="bg-[#f9fafb] border border-[#d0e1da] rounded-2xl p-5 max-w-[360px] w-full text-center shadow-md">
        {/* Avatar */}
        <div className="-mt-12 mb-4">
          <div className="w-24 h-24 mx-auto rounded-full border-4 border-white bg-green-100 overflow-hidden">
            <Image
              src={image || '/avatar.png'} // default fallback
              alt={name}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Course and Name */}
        <p className="text-green-700 font-semibold">{course}</p>
        <h3 className="text-xl font-bold text-gray-900">{name}</h3>

        {/* Class Type */}
        <div className="flex items-center justify-center gap-2 mt-2">
          <FaVideo className="text-green-700 text-sm" />
          <span className="text-sm font-semibold text-gray-600">
            {classType || 'Online Class'}
          </span>
        </div>

        {/* Details Card */}
        <div className="bg-white border border-gray-100 rounded-xl p-4 mt-4 text-left space-y-3">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-green-700 text-sm" />
            <span className="text-sm font-semibold">{joinDate}</span>
          </div>
          <div className="flex items-start gap-2">
            <FaMapMarkerAlt className="text-green-700 text-sm mt-[2px]" />
            <span className="text-sm font-semibold">
              {location || 'Dhaka'}
            </span>
          </div>

          {/* Chips */}
          <div className="flex justify-between items-center gap-2 pt-1">
            <span className="text-[13px] font-semibold px-3 py-1 rounded-md bg-gray-100">
            {label || "Ongoing"}
            </span>
            <span className="text-[13px] font-semibold text-white px-3 py-1 rounded-md bg-emerald-600">
              {time}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
