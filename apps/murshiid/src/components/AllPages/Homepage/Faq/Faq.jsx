"use client";
import React, { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { MdArrowRight, MdExpandMore } from "react-icons/md";
import Link from "next/link";

import axios from "axios";
import SectionTitle from "@/components/Shared/SectionTitle/SectionTitle";
const FAQ = () => {
  const [faq, setFaq] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [category, setCategory] = useState([]);

  const getComponent = () => {
    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/faq`).then((res) => {
      const reversedData = res?.data?.data?.reverse();
      setFaq(reversedData);
      setSearchResult(reversedData);
    }).catch(() => {
      setFaq([]);
      setSearchResult([]);
    });
  };

  useEffect(() => {
    getComponent();
  }, []);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/category`)
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => setCategory((data?.data || []).slice().reverse()))
      .catch(() => setCategory([]));
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value || e.target?.innerText || '';
    setSearchInput(value);
    const result = faq.filter(
      (item) =>
        item?.question?.toLowerCase().includes(value.toLowerCase()) ||
        item?.category?.toLowerCase().includes(value.toLowerCase())
    );
    setSearchResult(result);
  };

  const handleChange = (panel) => (event) => {
    setExpanded(expanded === panel ? false : panel);
  };
  return (
    <div className="pb-12 px-4 max-w-3xl mx-auto w-full ">
      <div className="my-3 text-center">
        <SectionTitle
          primaryText="প্রায়ই"
          secondaryText="জিজ্ঞেস করা প্রশ্ন"
          underlineWidth="w-[380px]"
        
        
        />

        <p className="base1 lg:text-lg text-center  text-[18px] font-medium base2 mt-2 mb-6">
          সম্ভব্য সমস্ত প্রশ্ন এখানে দেওয়া আছে। যদি আপনি আপনার প্রয়োজনীয়
          প্রশ্ন খুঁজে না পান, দয়া করে আমাদের একটি ইমেইল করুন
          support@muslimschoool.com এই ইমেলে । আমরা যত তাড়াতাড়ি সম্ভব আপনার
          সাথে যোগাযোগ করবো।
        </p>
      </div>

     
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-md shadow max-w-4xl mx-auto mb-6">
          <BiSearch className="text-xl text-black" />
          <input
            type="text"
            value={searchInput}
            onChange={handleSearch}
            placeholder="Search question"
            className="w-full py-2 outline-none text-sm"
          />
        </div>

      <div>
        {(searchResult.length > 0 ? searchResult : faq).slice(0,10).map((e, index) => (
                   <div
                     key={index}
                     className="bg-white rounded-md shadow-md mb-4 overflow-hidden"
                   >
                     <div
                       onClick={handleChange(e.question)}
                       className="w-full flex justify-between items-center px-4 py-3 text-left text-gray-800 font-semibold hover:bg-gray-50"
                     >
                       <span className="text-sm md:text-base">{e.question}</span>
                       <MdExpandMore
                         className={`transition-transform ${
                           expanded === e.question ? 'rotate-180' : ''
                         }`}
                       />
                     </div>
                     {expanded === e.question && (
                       <div className="px-4 pb-4 text-gray-600 text-sm">
                         {e.answer}
                       </div>
                     )}
                   </div>
                 ))}
      </div>

      <div className="flex justify-center mt-8">
        <Link href="/frequently-asked-questions" className="inline-block">
          <button className="mt-3 bg-[#10B981] hover:bg-[#059669] rounded-full px-6 py-4 text-[16px] font-semibold text-white flex items-center gap-2 mx-auto">
            <span>আরও দেখুন</span>
            <MdArrowRight className="text-lg" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default FAQ;
