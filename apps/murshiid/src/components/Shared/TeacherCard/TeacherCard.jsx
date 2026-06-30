import React from 'react';
import Completedclass from '@/assets/SVG Teacher Card/Completed Class.svg';
import Experience from '@/assets/SVG Teacher Card/Experience.svg';
import Institution from '@/assets/SVG Teacher Card/Institution.svg';
import Specialities from '@/assets/lectureicon/008-experience-1.svg';
import TotalStudent from '@/assets/SVG Teacher Card/Total Student.svg';
import department from '@/assets/SVG Teacher Card/Department.svg';
import TotalClasses from '@/assets/SVG Teacher Card/Total Class.svg';
import Image from 'next/image';






const TeacherCard = ({image, depart, qualification2, expert , institution,experience,totalClass,totalSutdents,name,}) => {
  return (
    <div className=" flex items-center justify-center">
      <div className="bg-white max-w-sm w-full rounded-2xl shadow-lg overflow-hidden">
        {/* Profile Section with shadow box */}
        <div className="flex flex-col items-center p-6 bg-gray-50">
          <div className="relative">
            <div className="w-28 h-28 rounded-full border-4 border-primary flex items-center justify-center base1 font-bold text-sm">
              <Image src={image} width={100} height={100}  className='w-24 h-24 rounded-full' alt="Department Icon" />
            </div>
            <div className="absolute bottom-0 right-0  w-6 h-6 mt-1 rounded-full flex items-center justify-center">
              <Image src={Completedclass} width={5} height={5}  className="w-6 h-6 mt-1" alt="Department Icon" />
            </div>
          </div>
          <h2 className="mt-4 text-xl font-bold text-gray-800">{name}</h2>
          <p className="text-primary font-bold text-[17px]">{qualification2}</p>
        </div>

        {/* Info Section */}
        <div className="px-6 pb-6">
          <hr className="mb-[14px]" />
          <div className="space-y-4 text-sm text-gray-700">
            <div className="flex  gap-3">
              <Image src={department} width={5} height={5}  className="w-6 h-6 mt-1" alt="Department Icon" />
              <div>
                <div className="font-bold text-[17px]">Department</div>
                <div className='font-medium '>{depart}</div>
              </div>
            </div>

            <div className="border-t pt-[14px]">
              <div className="flex  gap-3">
                <Image src={Specialities} width={5} height={5} className="w-6 h-6 mt-1" alt="Calendar Icon" />
                <div>
                  <div className="font-bold text-[17px]">Expert</div>
                  <div className='font-medium'>{expert}</div>
                </div>
              </div>
            </div>
            {/* TODO */}
          {/* TOTAL Student, department, Experience,Institution, Expert  */}

            <div className="border-t pt-[14px]">
              <div className="flex  gap-3">
                <Image src={Institution}width={5} height={5}  className="w-6 h-6 mt-1" alt="Institution Icon" />
                <div>
                  <div className=" font-bold text-[17px]">Institution</div>
                  <div className='font-medium'>{institution}</div>
                </div>
              </div>
            </div>

            <div className="border-t pt-[14px]">
              <div className="flex   gap-3">
                <Image src={Experience}width={5} height={5}  className="w-6 h-6 mt-1" alt="Experience Icon" />
                <div>
                  <div className=" font-bold text-[17px]">Experience</div>
                  <div className='font-medium'>{experience}</div>
                </div>
              </div>
            </div>

            <div className="border-t pt-[14px]">
              <div className="flex   gap-3">
                <Image src={TotalClasses} width={5} height={5}  className="w-6 h-6 mt-1" alt="Classes Icon" />
                <div>
                  <div className=" font-bold text-[17px]">Total Classes</div>
                  <div className='font-medium'>{totalClass}</div>
                </div>
              </div>
            </div>

            <div className="border-t pt-[14px]">
              <div className="flex  gap-3">
                <Image src={TotalStudent} width={5} height={5}  className="w-6 h-6 mt-1" alt="Classes Icon" />
                <div>
                  <div className=" font-bold text-[17px]">Total Student</div>
                  <div className='font-medium'>{totalSutdents}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherCard;
