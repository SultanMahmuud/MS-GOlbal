"use client";
import React from "react";

export default function SectionTitle({
  primaryText,
  secondaryText = "",
  className = "",
  underlineWidth = "w-[800px]",
  underlineHeight = "h-12",
}) {
  return (
    <h2
      className={`text-4xl my-12 font-extrabold navColor relative inline-block text-center w-full ${className}`}
    >
      <span className="text-primary">{primaryText} </span>
      <span className="navColor">{secondaryText}</span>

      {/* fixed underline background image */}
      <span
        className={`absolute left-1/2 -translate-x-1/2 -bottom-3 ${underlineWidth} ${underlineHeight} 
        bg-no-repeat bg-center bg-contain`}
        style={{
          backgroundImage: `url('https://qawamiuniversity.nyc3.digitaloceanspaces.com/courseIcons/underline%201%20(1).svg')`,
        }}
      ></span>
    </h2>
  );
}
