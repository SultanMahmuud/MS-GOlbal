import React, { useState } from 'react';
import PrivatePrice from './PrivatePrice';


const Plan2 = () => {
  const [day, setDay] = useState("Days_2");

  const handleLanguage = (e) => {
    setDay(e.target.value);
  };

  return (
    <div className="mt-6">
      <h2 className="font-bold text-lg text-gray-700 mb-1 font-[hind]">
        Select days for pricing
      </h2>

      <select
        value={day}
        onChange={handleLanguage}
        className="text-sm w-[150px] bg-gray-200 rounded-lg px-2 py-1 focus:outline-none mb-4"
      >
        <option value="Days_2">2-Days</option>
        <option value="Days_3">3-Days</option>
        <option value="Days_4">4-Days</option>
        <option value="Days_5">5-Days</option>
        <option value="Days_6">6-Days</option>
      </select>

      <PrivatePrice day={day} />
    </div>
  );
};

export default Plan2;
