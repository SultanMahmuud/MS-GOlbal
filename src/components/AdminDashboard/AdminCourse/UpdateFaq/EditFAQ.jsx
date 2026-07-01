"use client";

import { useState } from "react";

import { BiEdit } from "react-icons/bi";
import { MdDeleteForever, MdExpandMore } from "react-icons/md";

import EditFAQModal from "./EditFAQModal";
import AddCourseFaq from "../AddCourseFaq";

export default function EditFAQ({ faq, handleDeletePay, setFaq }) {
  const [index, setIndex] = useState();
  const [editable, setEditable] = useState();
  const [openEdit, setOpenEdit] = useState(false);
  const [openIdx, setOpenIdx] = useState(0); // Track which accordion is open





  // Open edit modal
  const handleEditFaq = (faqItem, idx) => {
    setEditable(faqItem);
    setIndex(idx);
    setOpenEdit(true);
  };

  // Replace an existing FAQ with updated data
  const triggerEditFaq = (updatedFaq) => {
    const newFaqs = faq.map((item, ind) =>
      ind === index ? updatedFaq : item
    );
    setFaq(newFaqs);
    setOpenEdit(false);
  };

  // Accordion toggle
  const toggleAccordion = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="w-full">
      {faq?.map((faqItem, idx) => (
        <div
          key={idx}
          className="mb-2 rounded-md shadow-sm border border-gray-200"
        >
          {/* Accordion Header */}
          <button
            onClick={() => toggleAccordion(idx)}
            className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-md"
          >
            <span className="font-medium text-gray-800 text-base">
              {faqItem?.question}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditFaq(faqItem, idx);
                }}
                className="p-1 rounded hover:bg-gray-200"
              >
                <BiEdit size={18} />
              </button>
          
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeletePay(idx);
                }}
                className="p-1 rounded hover:bg-red-100 text-red-600"
              >
                <MdDeleteForever size={18} />
              </button>
              <MdExpandMore
                className={`ml-2 transform transition-transform ${
                  openIdx === idx ? "rotate-180" : ""
                }`}
                size={20}
              />
            </div>
          </button>

          {/* Accordion Content */}
          {openIdx === idx && (
            <div className="px-4 pb-4 text-gray-600 text-sm">
              {faqItem?.answer}
            </div>
          )}
        </div>
      ))}

    
      <EditFAQModal
        open={openEdit}
        setOpen={setOpenEdit}
        singleFaq={editable}
        triggerEditFaq={triggerEditFaq}
      />

      {/* Add New FAQ at bottom */}
      <AddCourseFaq faq={faq} setFaq={setFaq} />
    </div>
  );
}
