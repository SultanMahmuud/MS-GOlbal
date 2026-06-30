'use client';

import { getUserInfo } from '@/services/auth.services';
import axios from 'axios';
import { useState } from 'react';

const suggestTopics = [
  { title: 'আকিদাহ' },
  { title: 'ইসলামিক ইতিহাস' },
  { title: 'ফিক্হ' },
  { title: 'ইসলামী আইন' },
  { title: 'হাদিস তাফসিরুল কোরআন' },
  { title: 'তরজমাতুল কোরআন' },
  { title: 'আরবি ব্যাকরণ' },
  { title: 'নবীদের জীবনী' },
  { title: 'সুন্নাহ' },
  { title: 'প্রাইসিং' },
  { title: 'টিচার' },
  { title: 'এসাইনমেন্ট' },
  { title: 'ক্লাস মার্ক' },
  { title: 'ক্লাস ভিডিও' },
];

const StudentFeedback = () => {
  const [feedBackCategory, setFeedBackCategory] = useState('');
  const [studentFeedback, setStudentFeedback] = useState('');
  const [topic, setTopic] = useState('');
  const user = getUserInfo();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newData = {
      feedBackCategory,
      studentFeedback,
      topic,
      name: user.name,
      email: user.email,
      studentId: user.studentId,
      feedType: 'StudentFeedback',
    };

    axios
      .put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/feedback/studentUpdateFeedBack`, {
        studentFeedBack: newData,
      })
      .then((response) => {
        if (response.status === 200) {
          alert('Feedback sent successfully');
          setStudentFeedback('');
          setFeedBackCategory('');
          setTopic('');
        }
      })
      .catch((error) => {
        alert('Bad Request, Please try again');
      });
  };

  return (
    <div className="bg-white max-w-3xl w-full mx-auto shadow-md p-8 rounded-lg">
      <h2 className="text-center font-bold text-yellow-500 tracking-wide font-[Hind] text-2xl mb-4">
        Send Feedback
      </h2>
      <hr className="border-b border-gray-200 mb-6" />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Select Category */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            তোমার ফিডব্যাকের ক্যাটাগরি সিলেক্ট করো
          </label>
          <select
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-700 font-[Hind]"
            value={feedBackCategory}
            onChange={(e) => setFeedBackCategory(e.target.value)}
          >
            <option value="">None</option>
            {suggestTopics.map((element, index) => (
              <option key={index} value={element.title}>
                {element.title}
              </option>
            ))}
          </select>
        </div>

        {/* Topic Field */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            টপিক
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Write your topic here"
          />
        </div>

        {/* Feedback Field */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            তোমার ফিডব্যাকটি এখানে লিখো
          </label>
          <textarea
            rows="4"
            value={studentFeedback}
            onChange={(e) => setStudentFeedback(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Write your feedback here"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-yellow-400 text-black hover:text-white hover:bg-yellow-500 transition-all duration-300 rounded py-2 font-semibold tracking-wide font-[Inter]"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentFeedback;
