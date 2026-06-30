import React from 'react';
import { FaPlay } from 'react-icons/fa';

const Surahs = ({ setSingleData, surahList, isLoading }) => {
  return (
    <div className='py-8'>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {!isLoading ? (
          surahList?.map((item) => (
            <div
              key={item.id}
              onClick={() => setSingleData(item)}
              className="cursor-pointer bg-white dark:bg-gray-800 shadow-md rounded-md py-2 sm:px-3 sm:py-2  md:py-2 lg:py-4 transition hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-600 text-white text-sm font-bold">
                    {item.id}
                  </div>
                  <div>
                    <p className="font-semibold text-green-700 text-base sm:text-sm md:text-base lg:text-lg">
                      {item.transliteration}
                    </p>
                    <p className="text-gray-500 text-xs sm:text-xs md:text-sm -mt-1">
                      {item.translation}
                    </p>
                  </div>
                </div>
                <FaPlay className="text-green-600 text-lg" />
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center w-full">
            <div className="h-10 w-10 border-4 border-green-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Surahs;
