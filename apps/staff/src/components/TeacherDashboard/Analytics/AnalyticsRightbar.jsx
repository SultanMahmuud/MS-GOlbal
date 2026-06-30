'use client'
import React, { useEffect, useState } from 'react';
import AnlaCards from './AnlaCards';
import Image from 'next/image';



const AnalyticsRightbar = ({ sumOfTotalQuestionMarks, sumOfQuestionMarks }) => {
  const [searchUser, setSearchUser] = useState({});
  const [email, setEmail] = useState('');
// fake user data for demonstration
  const user = {
    email: 'QUT7.liyas@qawmiuniversity.live',
   
  };

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/single/${user?.email}`)
      .then((res) => res.json())
      .then((db) => {
        setSearchUser(db);
        setEmail(email);
      });
  }, [user?.email, email]);

  const FilterUser = searchUser?.data;

  const activeData = [
    { heading: 'Assignment', count: searchUser?.data?.points },
    { heading: 'Total Exam', count: sumOfTotalQuestionMarks },
    { heading: 'Attended', count: FilterUser?.questionMarks?.length },
    { heading: 'Enrolled Course', count: FilterUser?.Course?.length },
  ];


  return (
    <div className="px-4">
      <div className="flex justify-center items-center my-4">
        <Image
          className="w-[75px] h-[75px] rounded-full object-cover"
          src={FilterUser?.avatar}
          alt="User Avatar"
          width={75}
          height={75}
        />
      </div>
      <AnlaCards element={activeData} searchUser={searchUser} />
    </div>
  );
};

export default AnalyticsRightbar;
