'use client'
import { CheckCircle, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'
import { BiBookOpen } from 'react-icons/bi';
import { FiRefreshCw } from 'react-icons/fi';

const Instructureteacher = ({teacherProfiles}) => {
 const [aboutOpen, setAboutOpen] = useState(false);

 // Sample data
const stats = [
  { icon: <BiBookOpen />, label: 'Total Classes', value: teacherProfiles?.Course.length || 0 },
  { icon: <CheckCircle />, label: 'Completed', value: teacherProfiles?.completedLessons || 0 },
  { icon: <FiRefreshCw />, label: 'Active Courses', value: teacherProfiles?.activeCourses || 0 },
  { icon: <Star />, label: 'Average Rating', value: teacherProfiles?.averageRating || '0' }
];
  return (
    <div>
        <div className="min-h-screen bg-green-50 p-8">
      {/* Header */}
      <div className="bg-green-100 rounded-lg p-8 mb-8 flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src={teacherProfiles?.avatar}
            alt="Teacher Illustration"
            className="w-32 h-32"
            width={60} height={60}
          />
          <div className="ml-6">
            <h1 className="text-4xl font-bold text-gray-900">{teacherProfiles?.Department}</h1>
            <p className="text-2xl text-gray-700 mt-1">{teacherProfiles?.name}</p>
          </div>
        </div>
        <Link href="/trial-class" ><button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg">
          Book Trial Class
        </button></Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <div className="text-green-500">
              {React.cloneElement(stat.icon, { className: 'w-8 h-8' })}
            </div>
            <p className="text-2xl font-semibold mt-2 text-gray-900">{stat.value}</p>
            <p className="mt-1 text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* About Me */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <button
          className="w-full flex justify-between items-center"
          onClick={() => setAboutOpen(!aboutOpen)}
        >
          <h2 className="text-xl font-bold text-gray-900">About Me</h2>
          <svg
            className={`w-6 h-6 text-gray-600 transform transition-transform duration-200 ${
              aboutOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {aboutOpen && (
          <p className="mt-4 text-gray-700">
           {teacherProfiles?.bio}
          </p>
        )}
      </div>

      {/* Courses Carousel */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Courses</h2>
        <div className="flex space-x-6 overflow-x-auto pb-4">
          <div className="min-w-[300px] bg-green-50 rounded-lg shadow p-4 flex">
            <Image
              src="/"
              alt={teacherProfiles?.name}
              className="w-24 h-24 rounded-md object-cover"
              width={60} height={60}
            />
            <div className="ml-4 flex-1">
              <h3 className="font-semibold text-lg text-gray-900">{teacherProfiles?.title}</h3>
              <div className="text-gray-600 mt-2">
                <span>{teacherProfiles?.lessons} lessons</span> · <span>{teacherProfiles.hours} h</span>
              </div>
              <div className="mt-4 flex items-baseline space-x-2">
                <span className="text-gray-400 line-through">${teacherProfiles?.oldPrice}</span>
                <span className="text-green-600 font-semibold">${teacherProfiles?.newPrice}</span>
              </div>
            </div>
          </div>
          {/* Additional course cards can be added here */}
        </div>
      </div>
    </div>
    </div>
  )
}

export default Instructureteacher
