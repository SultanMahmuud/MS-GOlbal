import React from 'react';
import { FaBookmark, FaCheck, FaSortAmountUpAlt } from 'react-icons/fa';
import { GoTasklist } from 'react-icons/go';

const AnlaCards = ({ element }) => {
  const cards = [
    {
      icon: <FaBookmark />,
      title: element[0]?.heading,
      count: element[0]?.count || 0,
      bg: 'bg-blue-500', // replace with your Tailwind color (or use 'bg-blue-500')
    },
    {
      icon: <GoTasklist />,
      title: element[1]?.heading,
      count: element[1]?.count || 0,
      bg: 'bg-primary', // replace with your Tailwind color (or use 'bg-indigo-500')
    },
    {
      icon: <FaSortAmountUpAlt />,
      title: element[2]?.heading,
      count: element[2]?.count ,
      bg: 'bg-yellow-500',
    },
    {
      icon: <FaCheck />,
      title: element[3]?.heading,
      count: element[3]?.count,
      bg: 'bg-green-500', // replace with your Tailwind color (or use 'bg-green-500')
    },
  ];

  return (
    <div className="space-y-4">
      {cards.map((card, index) => (
        <div key={index} className="flex justify-between items-center mb-4">
          <div className="flex items-center bg-white rounded-md shadow-md overflow-hidden">
            <div
              className={`w-[39px] h-[38px] flex items-center justify-center text-white text-xs ${card.bg}`}
            >
              {card.icon}
            </div>
            <p className="px-4 text-subBlue">{card.title}</p>
          </div>
          <div className="bg-white rounded-md shadow-md px-4 py-2">
            <p className="text-subBlue">{card.count}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnlaCards;
