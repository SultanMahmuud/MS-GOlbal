"use client";
import { Button } from "@/components/UI/button";
import Image from "next/image";
import React from "react";

const WhyLearnCard = ({ data }) => {
  const array = data?.courseWhy || [];

  return (
    <div>
      {array.map((card, index) => (
        <div
          key={index}
          className={`flex flex-col md:flex-row items-center justify-center lg:justify-between bg-white  rounded-lg shadow-sm p-2 mb-4 ${
            index % 2 == 0 ? "md:flex-row-reverse" : ""
          }`}
        >
          {/* Image */}
          <div className="w-full md:w-1/2 flex lg:justify-start gap-12 justify-center">
            <Image
            width={48}
            height={100}
              src={card.uploadUrl}
              alt={card.title}
              className="w-48 h-auto object-contain"
            />
          </div>

          {/* Content */}
          <div className="w-full flex flex-col md:px-6 mt-4 md:mt-0">
            <h2 className="text-[22px] font-bold mb-2 navColor">{card.title}</h2>
            <p className="text-[#0009] text-[18px] font-semibold mb-4">
              {card.subtitle}
            </p>
            <Button className="banner-button-1 w-1/3 font-extrabold text-3xl">এখনই ভর্তি হোন</Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WhyLearnCard;
