

import { IoMdCheckboxOutline } from 'react-icons/io';


const CourseForWhom = ({data, loading= false}) => {

const array =data?.courseForWhom

  return (
    <div>
   

      {loading ? (
        <div className="flex justify-center py-4">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-[#12b669] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1  sm:grid-cols-2 gap-4">
          {array?.map((item, index) => (
            <div key={index} className="rounded-md shadow-sm">
              <div className="flex items-start p-3">
                <div className="w-[22px] p-[2px] text-[#12b669]">
                  <IoMdCheckboxOutline className="text-[22px]" />
                </div>
                <p className="ml-2 font-bold text-[18px] base2 font-hind navColor">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseForWhom;
