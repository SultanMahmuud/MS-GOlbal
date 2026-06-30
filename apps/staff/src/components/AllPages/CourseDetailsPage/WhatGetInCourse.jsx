import Image from 'next/image';
import React from 'react';

const WhatGetInCourse = ({data}) => {
const array = data.whatYouGet

  return (
    <div className="shadow-md p-5 rounded-md">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-2 lg:gap-0 place-items-center">
        {array?.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center border border-[#f3f4f7] h-auto lg:h-[170px] text-center"
          >
            <div className="h-[50px] w-[50px] mt-5">
              <Image
                src={item.uploadUrl}
                alt="img"
                className="mx-auto object-contain h-full w-full"
                width={50}
                height={50}
              />
            </div>
            <div className="px-3 pt-2 pb-4">
              <p className="font-hind text-[16px] lg:text-[18px] font-semibold pb-2 base1">
                {item.title}
              </p>
              <p className="font-hind text-[16px] font-normal base1">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhatGetInCourse;
