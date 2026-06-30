'use client';
import useUpload from '@/components/Hooks/useUpload';
import { getUserInfo } from '@/services/auth.services';
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const StudentSettings = () => {
  const [sound, setSound] = useState(false);
  const [firstimg, setfirstimg] = useState('');
  const [degree, setDegree] = useState('');
  const [institution, setInstitution] = useState('');
  const [currentYear, setCurrentYear] = useState('');
  const [exam, setExam] = useState('');
  const [passingYear, setPassingYear] = useState('');
  const { register, handleSubmit } = useForm();
  const { handleSubmits } = useUpload();

  const [singleUsers, setsingleUsers] = useState();
  const [gender, setGender] = useState('');

 const user = getUserInfo();

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/single/${user.email}`)
      .then((res) => {
        setsingleUsers(res?.data?.data);
      });
  }, [user]);

  const img1 = (e) => {
    handleSubmits(e, setfirstimg);
  };

  const onSubmit = (data) => {
    let education = {
      degree: degree,
      institution: institution,
      currentYear: currentYear,
      exam: exam,
      passingYear: passingYear,
    };
    let newData = {
      ...data,
      education: education,
      avatar: firstimg,
      email: user.email,
      gender: gender,
    };
  };

  const inputField = 'border-none p-4 border-b border-gray-400 outline-gray-400 bg-[#F5F5FE] mb-4 w-full';

  return (
    <div className="container mx-auto p-8">
      <h2 className="font-bold text-yellow-400 flex items-center">My Profile</h2>
      <hr className="my-4 border-t-2" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-[#46AAD5] flex items-center justify-center overflow-hidden">
            <Image src={firstimg ? firstimg : singleUsers?.avatar} alt="Avatar" className="object-cover w-full h-full" width={128} height={128} />
          </div>
          {sound && (
            <input
              onChange={img1}
              type="file"
              className="mt-14 border border-[#03070c] mx-auto"
            />
          )}
        </div>
        <div>
          {sound ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-semibold text-darkgray">Full Name</label>
                  <input
                    type="text"
                    defaultValue={singleUsers?.name}
                    className="w-full mt-2 p-3 border-b border-gray-300"
                    {...register('name')}
                  />
                </div>
                <div>
                  <label className="font-semibold text-darkgray">Phone</label>
                  <input
                    type="text"
                    defaultValue={singleUsers?.number}
                    className="w-full mt-2 p-3 border-b border-gray-300"
                    {...register('number')}
                  />
                </div>
                <div>
                  <label className="font-semibold text-darkgray">Your Country</label>
                  <input
                    type="text"
                    defaultValue={singleUsers?.perCountry}
                    className="w-full mt-2 p-3 border-b border-gray-300"
                    {...register('perCountry')}
                  />
                </div>
                <div>
                  <label className="font-semibold text-darkgray">District</label>
                  <input
                    type="text"
                    defaultValue={singleUsers?.perDistrict}
                    className="w-full mt-2 p-3 border-b border-gray-300"
                    {...register('perDistrict')}
                  />
                </div>
                <div>
                  <label className="font-semibold text-darkgray">Street Address</label>
                  <input
                    type="text"
                    defaultValue={singleUsers?.address}
                    className="w-full mt-2 p-3 border-b border-gray-300"
                    {...register('address')}
                  />
                </div>
                <div>
                  <label className="font-semibold text-darkgray">Your Education Level</label>
                  <input
                    type="text"
                    defaultValue={singleUsers?.education?.degree}
                    className="w-full mt-2 p-3 border-b border-gray-300"
                    onChange={(evt) => setDegree(evt.target.value)}
                  />
                </div>
                <div>
                  <label className="font-semibold text-darkgray">Exam/Degree Title</label>
                  <input
                    type="text"
                    defaultValue={singleUsers?.education?.exam}
                    className="w-full mt-2 p-3 border-b border-gray-300"
                    onChange={(evt) => setExam(evt.target.value)}
                  />
                </div>
                <div>
                  <label className="font-semibold text-darkgray">Institution Name</label>
                  <input
                    type="text"
                    defaultValue={singleUsers?.education?.institution}
                    className="w-full mt-2 p-3 border-b border-gray-300"
                    onChange={(evt) => setInstitution(evt.target.value)}
                  />
                </div>
                <div>
                  <label className="font-semibold text-darkgray">Approximate Passing Year</label>
                  <input
                    type="text"
                    defaultValue={singleUsers?.education?.passingYear}
                    className="w-full mt-2 p-3 border-b border-gray-300"
                    onChange={(evt) => setPassingYear(evt.target.value)}
                  />
                </div>
                <div>
                  <label className="font-semibold text-darkgray">Current Year</label>
                  <input
                    type="text"
                    defaultValue={singleUsers?.education?.currentYear}
                    className="w-full mt-2 p-3 border-b border-gray-300"
                    onChange={(evt) => setCurrentYear(evt.target.value)}
                  />
                </div>
                <div>
                  <select
                    className="w-full mt-2 p-3 border-b border-gray-300"
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option>Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="flex space-x-4 mt-4">
                  <button
                    type="submit"
                    className="bg-primary text-white p-3 rounded-md"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    className="bg-gray-400 text-white p-3 rounded-md"
                    onClick={() => setSound(false)}
                  >
                    Back
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <>
              <div>
                <label className="font-semibold text-darkgray">ID</label>
                <p className="text-secondary">{singleUsers?.studentId}</p>
              </div>
              <div>
                <label className="font-semibold text-darkgray">Name</label>
                <p className="text-secondary">{singleUsers?.name}</p>
              </div>
              <div>
                <label className="font-semibold text-darkgray">Email</label>
                <p className="text-secondary">{singleUsers?.email}</p>
              </div>
              <button
                className="bg-primary text-white p-3 rounded-md mt-4"
                onClick={() => setSound(true)}
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>

      {!sound && (
        <div className="border border-[#efe7e7] py-4 px-5 mt-4">
          <h1>Personal Information</h1>
          <hr className="my-4 border-t-2" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-semibold text-darkgray">Institution</label>
              <p className="text-secondary">{singleUsers?.education?.institution}</p>
            </div>
            <div>
              <label className="font-semibold text-darkgray">Exam</label>
              <p className="text-secondary">{singleUsers?.education?.exam}</p>
            </div>
            <div>
              <label className="font-semibold text-darkgray">Current Year</label>
              <p className="text-secondary">{singleUsers?.education?.currentYear}</p>
            </div>
            <div>
              <label className="font-semibold text-darkgray">Country</label>
              <p className="text-secondary">{singleUsers?.perCountry}</p>
            </div>
            <div>
              <label className="font-semibold text-darkgray">District</label>
              <p className="text-secondary">{singleUsers?.perDistrict}</p>
            </div>
            <div>
              <label className="font-semibold text-darkgray">Address</label>
              <p className="text-secondary">{singleUsers?.address}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSettings;
