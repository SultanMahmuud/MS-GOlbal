'use client'
import { useEffect, useState } from 'react';
import { BiSearch } from 'react-icons/bi';


import Axios from 'axios';
import { MdExpandMore } from 'react-icons/md';


const FAQContainer = () => {
  const [faq, setFaq] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [category, setCategory] = useState([]);

  const getComponent = () => {
    Axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/faq`).then((res) => {
      const reversedData = res?.data?.data?.reverse();
      setFaq(reversedData);
      setSearchResult(reversedData);
    });
  };

  useEffect(() => {
    getComponent();
  }, []);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/category`)
      .then((res) => res.json())
      .then((data) => setCategory(data.data.reverse()));
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
    <div>
    

      <div className="py-10 px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Frequently Asked{' '}
            <span className="text-primary">Questions</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-500 mt-2">
            All the questions are available here. If you don't find your required question,
            please email us at <br /> support@muslimschoool.com.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-6 max-w-4xl mx-auto">
          {category[0]?.FAQ?.map((e, index) => (
            <div
              key={index}
              onClick={handleSearch}
              className={`px-4 py-2 rounded-md shadow text-base font-semibold ${
                searchInput === e?.category
                  ? 'bg-primary text-white'
                  : 'text-gray-800 bg-white'
              }`}
            >
              {e?.category}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-md shadow max-w-4xl mx-auto mb-6">
          <BiSearch className="text-xl text-gray-500" />
          <input
            type="text"
            value={searchInput}
            onChange={handleSearch}
            placeholder="Search question"
            className="w-full h-[45px] outline-none text-sm"
          />
        </div>

        <div className="max-w-4xl mx-auto">
          {(searchResult.length > 0 ? searchResult : faq).map((e, index) => (
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
      </div>

    </div>
  );
};

export default FAQContainer;
