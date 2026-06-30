import useUpload from '@/components/Hooks/useUpload';
import CommonFileUpload from '@/components/Shared/FileUpload/CommonFileUpload';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';



const PopulerSubjectsModelBangla = () => {
  const { handleSubmits } = useUpload();
  const [populerSubjectsimg, setPopulerSubjectsimg] = useState('');
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    const newdata = {
      ...data,
      image: populerSubjectsimg,
    };

    axios
      .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/populersubjectsBng`, newdata, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then(() => {
        alert('Add populer subjects successfully');
        reset();
      })
      .catch((error) => {
        // handle error if needed
      });
  };

  const img1 = (e) => {
    handleSubmits(e, setPopulerSubjectsimg);
  };

  return (
    <div className="p-4">
      <h2 className="font-semibold text-xl mb-4 font-[hind]">
        Populer Subjects Model Bangla
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Side Inputs */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-medium bg-white shadow px-3 py-1 rounded w-[100px]">
                Title
              </span>
              <input
                type="text"
                placeholder="Enter heading..."
                {...register('title')}
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
              />
            </div>

            <div className="flex items-center gap-4">
              <span className="font-medium bg-white shadow px-3 py-1 rounded w-[100px]">
                Sub Title
              </span>
              <input
                type="text"
                placeholder="Enter bio..."
                {...register('SubTitle')}
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
              />
            </div>
          </div>

          {/* Right Side File Upload */}
          <div>
            <span className="font-medium bg-white shadow px-3 py-1 rounded inline-block w-full mb-2">
               Image
            </span>

            <CommonFileUpload url={populerSubjectsimg} setUrl={setPopulerSubjectsimg} />


            {populerSubjectsimg && (
              <button
                type="submit"
                className="mt-4 w-full bg-blue-700 text-white font-semibold py-2 rounded hover:bg-blue-800 transition"
              >
                Publish
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default PopulerSubjectsModelBangla;
