'use client';
import { useState } from "react";

const pages = ["কোরআন শিক্ষা", "হিফজ", "নাজেরা", "হাদিস", "তাফসীর"];

const FamousBar = () => {
  const [activePage, setActivePage] = useState("");

  return (
    <div className="px-2 sm:px-4">
      <div className="flex flex-wrap sm:flex-wrap gap-2 sm:gap-4 min-w-full">
        {pages.map((page) => (
          <div
            key={page}
            onClick={() => setActivePage(page)}
            className={`px-3 sm:px-3 py-1 sm:py-2 rounded-md font-medium text-[14px] sm:text-[16px] cursor-pointer transition-all duration-300 min-w-fit ${
              activePage === page
                ? "bg-white shadow-md"
                : "bg-[#EFF3F1]"
            }`}
          >
            {page}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FamousBar;
