"use client";

import React, { useState } from "react";
import { MdExpandMore } from "react-icons/md";

const FAQSection = ({ data }) => {
  const [expandedPanel, setExpandedPanel] = useState(null);

  const handleToggle = (index) => {
    setExpandedPanel(expandedPanel === index ? null : index);
  };

  return (
    <div>
      {data?.FAQ?.map((item, index) => (
        <div
          key={item._id || index}
          className="mb-2 rounded-md shadow-sm border border-gray-200"
        >
          <button
            className="w-full flex justify-between items-center text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-md transition"
            onClick={() => handleToggle(index)}
          >
            <span className="font-semibold text-[16px]">
              {item.question}
            </span>
            <MdExpandMore
              className={`text-xl transform transition-transform ${
                expandedPanel === index ? "rotate-180" : ""
              }`}
            />
          </button>
          {expandedPanel === index && (
            <div className="px-4 py-3 font-semibold text-[16px]">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQSection;
