'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Input } from '@/components/UI/input';
import { Button } from '@/components/UI/button';
import { Label } from '@/components/UI/label';
import { Textarea } from '@/components/UI/textarea';
import { Separator } from '@/components/UI/separator';
import useUploads from '@/components/Hooks/useUpload';
import CommonFileUpload from '@/components/Shared/FileUpload/CommonFileUpload';

const suggestTopics = [{ title: 'ReviewPage' }, { title: 'HomePage' }];

const Feedback = () => {
  const { register, handleSubmit, reset } = useForm();
  const { handleSubmits } = useUploads();
  const [showPage, setShowPage] = useState('');
  const [reviewPersonImg, setreviewPersonImg] = useState('');

 

  const onSubmit = (data) => {
    const newData = {
      ...data,
      reviewPersonImg,
      showPage,
    };

    axios
      .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/reviews/createReview`, newData)
      .then(() => {
        alert('Add Feedback successfully');
        reset();
        setShowPage('');
        setreviewPersonImg('');
      })
      .catch(() => {
        toast.error('Error! Something went wrong');
      });
  };

  return (
    <div className="bg-white max-w-2xl mx-auto shadow-lg rounded-lg p-8">
      <h2 className="text-center text-2xl font-bold text-yellow-500 mb-3">Send Feedback</h2>
      <Separator className="mb-6" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Select Dropdown */}
        <div>
          <Label htmlFor="showPage" className="mb-1 block text-sm font-medium text-gray-700">
            তোমার ফিডব্যাকের পেজ সিলেক্ট করো
          </Label>
          <select
            id="showPage"
            value={showPage}
            onChange={(e) => setShowPage(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
          >
            <option value="">Select a page</option>
            {suggestTopics.map((element, index) => (
              <option key={index} value={element.title}>
                {element.title}
              </option>
            ))}
          </select>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 gap-4">
          <Input placeholder="Enter Person Name" {...register('personName')} />
          <Input placeholder="Batch Name" {...register('batchName')} />
          <Input placeholder="Enter Location Name" {...register('location')} />
          <Textarea placeholder="Give Review" {...register('review')} rows={4} />
          <Input placeholder="Give rating between 1 to 5" {...register('rating')} />
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <Label>Upload Reviewer Image</Label>
         <CommonFileUpload url={reviewPersonImg} setUrl={setreviewPersonImg} />
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full bg-yellow-400 text-black hover:text-white">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default Feedback;
