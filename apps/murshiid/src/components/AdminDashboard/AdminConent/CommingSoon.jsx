import { createRef, useState } from 'react';

import axios from 'axios';
import useUpload from '@/components/Hooks/useUpload';
import CommonFileUpload from '@/components/Shared/FileUpload/CommonFileUpload';

const ComingSoon = ({
  heading,
  light,

}) => {
  const [firstSelectedFatured, setfirstSelectedFatured] = useState('');
  const { handleSubmits } = useUpload();

  const img1 = (e) => {
    handleSubmits(e, setfirstSelectedFatured);
  };

  const headingRef = createRef();
  const titleRef = createRef();
  const countDownRef = createRef();

  const handleClickComingSoon = (event) => {
    event.preventDefault();

    const data = {
      heading: headingRef?.current?.value,
      title: titleRef?.current?.value,
      countDown: countDownRef?.current?.value,
      image: firstSelectedFatured,
    };

    axios
      .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/comingSoon`, data)
      .then((response) => {
        if (response.status === 200) {
          alert('Sent data to server');
        }
      })
      .catch(() => {
        alert('Error! Something went wrong');
      });
  };

  return (
    <div>
      <h2 className={`${heading}`}>ComingSoon...</h2>

      <form className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {/* Left Section */}
        <div className="md:col-span-2 flex flex-col gap-4">
          {/* Heading Input */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="heading"
              className={`bg-white shadow px-3 py-1 text-sm font-medium rounded ${light}`}
            >
              Heading
            </label>
            <input
              ref={headingRef}
              type="text"
              id="heading"
              placeholder="Enter heading..."
              className="w-full border px-3 py-2 rounded outline-blue-500"
            />
          </div>

          {/* Title Input */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="title"
              className={`bg-white shadow px-3 py-1 text-sm font-medium rounded ${light}`}
            >
              Title
            </label>
            <input
              ref={titleRef}
              type="text"
              id="title"
              placeholder="Enter title..."
              className="w-full border px-3 py-2 rounded outline-blue-500"
            />
          </div>

          {/* Duration Input */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="countdown"
              className={`bg-white shadow px-3 py-1 text-sm font-medium rounded ${light}`}
            >
              Duration
            </label>
            <input
              ref={countDownRef}
              type="number"
              id="countdown"
              placeholder="Enter milliseconds..."
              className="w-full border px-3 py-2 rounded outline-blue-500"
            />
          </div>
        </div>

        {/* Right Section (Image Upload + Submit) */}
        <div className="flex flex-col justify-between">
          <div>
            <label
              htmlFor="image"
              className={`block bg-white shadow px-3 py-1 mb-2 w-full text-center rounded cursor-pointer ${light}`}
            >
              Add Image
            </label>
            <CommonFileUpload url={firstSelectedFatured} setUrl={setfirstSelectedFatured} />
          </div>

          {firstSelectedFatured && (
            <button
              onClick={handleClickComingSoon}
              type="submit"
              className="mt-4 w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
            >
              Publish
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ComingSoon;
