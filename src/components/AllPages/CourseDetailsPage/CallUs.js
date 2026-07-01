import Image from 'next/image';
import React from 'react';

const CallUs = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between mt-4 p-3 rounded-xl shadow-[rgba(0,0,0,0.08)_0px_2px_4px_0px] bg-[#1d2939] lg:bg-white">
      
      {/* Left Icon */}
      <div className="hidden lg:block">
        <Image
          src="https://qawamiuniversity.nyc3.digitaloceanspaces.com/courseIcons/Support%20(1).png"
          alt="Support"
          className="w-16 h-16 pl-2"
          width={64}
          height={64}
        />
      </div>

      {/* Center Text */}
      <div className="text-center font-hind text-white lg:text-[#ff8c4b]">
        <p className="font-bold text-[16px] lg:text-[30px]">
          আমাদেরকে কল করুন <br />
        </p>
        <p className="font-bold text-[12px] lg:text-[16px] text-white lg:text-inherit">
          (সকাল ৯টা থেকে রাত ১০টা)
        </p>
      </div>

      {/* Right Button */}
      <div className="flex justify-center lg:justify-start mt-3 lg:mt-0">
        <div className="flex items-center bg-[#eaecf2] px-4 py-2 lg:px-12 lg:py-3 rounded">
          <Image
            src="https://qawamiuniversity.nyc3.digitaloceanspaces.com/courseIcons/contacting%20(1).svg"
            alt="Call Icon"
            className="w-[18px] mx-1"
            width={18}
            height={18}
          />
          <p className="hidden lg:block font-bold text-[18px] text-[#ff8c4b] font-hind pr-2">
            01947200111
          </p>
          <p className="block lg:hidden font-bold text-[18px] text-[#ff8c4b] font-hind pr-2">
            কল করুন
          </p>
        </div>
      </div>
    </div>
  );
};

export default CallUs;
