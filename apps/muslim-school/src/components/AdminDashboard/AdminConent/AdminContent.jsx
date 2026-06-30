import CommonFileUpload from '@/components/Shared/FileUpload/CommonFileUpload';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';



const Achievement = ({
  heading,
  light,

}) => {
  const { register, handleSubmit, reset } = useForm();
const [featuredImage, setFeaturedImage] = useState('');


  const onSubmit = (data) => {
    const Newdata = {
      ...data,
      iconImg: featuredImage,
    };

    axios
      .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/achievement`, Newdata)
      .then((res) => {
        if (res.status === 200) {
          alert('Add Blog successfully');
          reset();
        }
      })
      .catch(() => {
        alert('error! something went wrong');
      });
  };

  return (
    <div>
      <h2 className={`${heading}`}>Achievement...</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <label
              htmlFor="title"
              className={`bg-white shadow px-3 py-1 text-sm font-medium rounded ${light}`}
            >
              Name
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter Title..."
              {...register('title', { required: true })}
              className="w-full border px-3 py-2 rounded "
            />
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="number"
              className={`bg-white shadow px-3 py-1 text-sm font-medium rounded ${light}`}
            >
              Number
            </label>
            <input
              id="number"
              type="number"
              placeholder="Enter Number..."
              {...register('number', { required: true })}
              className="w-full border px-3 py-2 rounded "
            />
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <label
              htmlFor="upload"
              className={`block bg-white shadow px-3 py-1 mb-2 w-full text-center rounded cursor-pointer ${light}`}
            >
              Add Image Icon
            </label>
          
            <CommonFileUpload url={featuredImage} setUrl={setFeaturedImage} />
          
          </div>

          {featuredImage && (
            <button
              type="submit"
              className="mt-4 w-full bg-primary text-white font-semibold py-2 rounded  transition"
            >
              Publish
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Achievement;
