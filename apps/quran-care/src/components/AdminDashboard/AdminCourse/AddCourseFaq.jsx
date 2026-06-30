"use client";
import { useState } from "react";

const AddCourseFaq = ({ faq, setFaq }) => {
  const [faqCategory, setFaqCategory] = useState("");
  const [newFaq, setNewFaq] = useState({});

  const handleSubmit = () => {
    const faqData = {
      category: faqCategory,
      ...newFaq,
    };
    setFaq([...faq, faqData]);
    setNewFaq({});
  };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-col lg:flex-row gap-5">
        {/* Left Side Input */}
        <div className="w-full">
          <input
            type="text"
            value={newFaq.question || ""}
            onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
            placeholder="Question"
            className="w-full mb-3 px-3 py-2 rounded-md shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
          />

          <textarea
            value={newFaq.answer || ""}
            onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
            placeholder="Answer"
            rows="5"
            className="w-full mb-3 px-3 py-2 rounded-md shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
          />

          <button
            onClick={handleSubmit}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow"
          >
            Submit
          </button>
        </div>

        {/* Right Side (for categories or future use) */}
        <div className="w-full lg:w-1/2">
          {/* You can render FAQ Categories or Preview here */}
        </div>
      </div>
    </div>
  );
};

export default AddCourseFaq;
