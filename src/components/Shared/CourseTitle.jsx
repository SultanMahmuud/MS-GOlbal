import React from 'react';

const CourseTitle = ({ title, first }) => {
  return (
    <div className="bg-containt my-12">
      <p className="text-[30px] text-center font-bold base2">
        <span className="text-primary">{first}</span>
        {title}
      </p>
      {/* 
      <hr className="w-[40%] mx-auto border-[4px] border-orange-500 mt-2" /> 
      */}
    </div>
  );
};

export default CourseTitle;
