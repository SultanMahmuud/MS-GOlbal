"use client";

import CommonFilter from "@/components/common/CommonFilter";
import { useState } from "react";


export default function AddFAQModal({ open, setOpen, triggerAddFaq }) {
  const [faqCategory, setFaqCategory] = useState("Course");
  const [newFaq, setNewFaq] = useState({});

  const handleSubmit = () => {
    const faqData = {
      category: faqCategory,
      ...newFaq,
    };
    triggerAddFaq(faqData);
    setNewFaq({});
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl animate-fadeIn">
        {/* Header */}
        <div className="bg-blue-600 px-4 py-2 rounded-t-lg">
          <h2 className="text-white font-bold font-sans">Add Lesson</h2>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col lg:flex-row gap-6">
          {/* Left section (Question + Answer) */}
          <div className="flex-1">
            <input
              value={newFaq.question || ""}
              onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
              placeholder="Question"
              className="w-full mb-3 rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              value={newFaq.answer || ""}
              onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
              placeholder="Answer"
              rows="5"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSubmit}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Submit
            </button>
          </div>

          {/* Right section (Category selector) */}
          <div className="w-full lg:w-40">
            <div className="shadow-md rounded-md overflow-hidden">
              <div className="bg-blue-600 text-white text-sm font-medium px-3 py-1">
                Category
              </div>
              <div className="p-3">
                <CommonFilter
                  value={faqCategory}
                  setValue={setFaqCategory}
                  values={["Course", "Payment", "Support", "Price"]}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-4 py-3 border-t">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
