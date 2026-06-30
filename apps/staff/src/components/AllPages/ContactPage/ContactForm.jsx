"use client"

import { Button } from '@/components/UI/button';
import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiEdit } from 'react-icons/bi';
import { BsPerson } from 'react-icons/bs';
import { FaPortrait } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';






const ContactForm = () => {
  const { handleSubmit, register, reset } = useForm();
  const [submit, setSubmit] = useState();
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const onSubmit = (data) => {
    const newData = {
      ...data,
      user: {
        name: user,
        email: email,
      },
      regType: 'ContactForm',
    };

    axios
      .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/registration`, newData)
      .then((response) => {
        // toast.success('Success Contact !');

        setSubmit(response.data);
        if (response.data._id) {
          // toast.success('Success Contact !');
          reset();
        }
      })
      .catch((error) => {});
  };
  return (
    <>
      <form
  className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-4"
  onSubmit={handleSubmit(onSubmit)}
>
  <div className="font-semibold text-xl mb-2">Drop Us A Line</div>
  <p className="text-sm text-gray-500 -mt-2">Your email will not be published anywhere.</p>

  <div className="flex gap-3 flex-col md:flex-row">
    <div className="relative flex-1">
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <HiOutlineMail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
    </div>
    <div className="relative flex-1">
      <input
        type="text"
        placeholder="Enter your name"
        value={user}
        onChange={(event) => setUser(event.target.value)}
        required
        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <BsPerson className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
    </div>
  </div>

  <div className="relative">
    <input
      type="text"
      placeholder="Subject"
      {...register('subject', { required: true })}
      className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
    />
    <FaPortrait className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
  </div>

  <div className="relative">
    <textarea
      placeholder="Write your message"
      {...register('description', { required: true })}
      className="w-full border rounded-lg px-4 py-2 min-h-[90px] focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
    />
    <BiEdit className="absolute right-3 top-4 text-gray-400" />
  </div>

  <Button
    type="submit"
    className="w-full py-6 mt-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold text-lg transition"
  >
    SEND
  </Button>
</form>
    </>
   

    

   
  );
};

export default ContactForm;
