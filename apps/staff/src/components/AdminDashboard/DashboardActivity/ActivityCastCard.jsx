import Image from "next/image";
import React from "react";

const ActivityCastCard = ({ element, loading }) => {

  return (
    <div className="col-span-1">
      <div className="bg-white rounded-md shadow p-3 flex sm:flex-row flex-col items-center sm:items-start gap-2">
        <Image
          src="https://cdn-icons-png.flaticon.com/512/2920/2920349.png"
          alt="icon"
          className="w-8 sm:w-9 md:w-10 lg:w-11 xl:w-12"
          width={40}
          height={40}
        />
        <div className="text-center sm:text-left">
          <p className="text-sm text-blue-500 font-medium whitespace-nowrap">
            {element.heading}
          </p>
          <p className="text-base sm:text-lg font-semibold text-blue-600 whitespace-nowrap">
            {loading ? "Loading..." : element.count}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActivityCastCard;
