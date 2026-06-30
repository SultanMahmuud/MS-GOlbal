import Image from "next/image";



const WhatLearn = ({data}) => {

const array = data.whatLearn
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-5">
      {array?.map((show, index) => (
        <div
          key={index}
          className="flex flex-col sm:flex-row items-center gap-0 sm:gap-2 p-3 sm:p-4 lg:p-2 rounded-md shadow hover:shadow z-10 transition-shadow duration-500 h-[173px] lg:h-auto"
        >
          <Image
            src={show?.uploadUrl || "https://qawamiuniversity.nyc3.digitaloceanspaces.com/courseIcons/what-learn.svg"}
            alt="Banner"
            className="w-12 h-12 rounded bg-[#f9f9fa] p-[6px]"
            width={50}
            height={50}
          />
          <div className="text-center sm:text-left">
         
            <p className="base1 text-[18px] sm:text-[16px] md:text-[18px] lg:text-[18px] font-semibold navColor">
              {show.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WhatLearn;
