import React from 'react';
import { MdOutlineDoubleArrow } from 'react-icons/md';
import { cn } from '@/lib/utils'; // Optional utility for conditional classes
import { Button } from '../UI/button';

const ButtonStyle = ({ label, onClick, width, margin, xs, lg }) => {
  return (
    <div className="w-full flex mt-10">
      <Button
        className={cn(
          "flex items-center justify-center px-4 py-2 base1 font-semibold rounded border border-gray-300 text-center cursor-pointer transition-transform duration-500 hover:translate-x-1",
          "base2",
          width ? width : "w-full",
          margin ? margin : "mx-auto",
        )}
        style={{
          width: '100%',
          maxWidth: lg || '90%',
        }}
        onClick={onClick}
      >
        <span className="mr-2">{label}</span>
        <MdOutlineDoubleArrow className="text-[22px]" />
      </Button>
    </div>
  );
};

export default ButtonStyle;
