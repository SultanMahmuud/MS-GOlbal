import React from 'react';
import axios from 'axios';
import FeedbackUpdate from './FeedBackUpdate';
import Image from 'next/image';

const AdminFeedbackCard = ({ reviews, setIsLoading }) => {
  const handleDeleteCours = (id) => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/reviews/getReview/${id}`)
      .then(() => {
        alert('Review deleted successfully');
        setIsLoading(true);
      })
      .catch(() => {
        alert('Error! Something went wrong');
      });
  };

  return (
    <div className="px-4 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {reviews?.map((item) => (
          <div
            key={item._id}
            className="bg-white shadow-md rounded-lg flex flex-col justify-between transition-transform duration-500 hover:scale-105"
          >
            <div className="overflow-hidden rounded-t-lg">
              <Image
                src={item?.reviewPersonImg}
                alt="reviewer"
                className="h-52 w-full object-cover"
                width={192}
                height={288}
              />
            </div>
            <div className="p-4 flex flex-col justify-between h-full">
              <div>
                <h2 className="text-[#13265C] text-lg font-semibold font-hind mb-1">
                  {item?.personName}
                  <br />
                  <small className="text-sm">Rating: {item?.rating}</small>
                </h2>
                <p className="text-[#5F6C76] text-sm text-justify font-inter mb-2">
                  {item?.review?.slice(0, 150)}
                </p>
                <p className="text-[#FCB23F] text-xs tracking-wide font-inter">
                  {item?.updatedAt?.split('T')[0]}
                </p>
              </div>
              <div className="flex justify-around items-center mt-4">
                <button
                  onClick={() => handleDeleteCours(item?._id)}
                  className="bg-[#1B4D89] text-white text-sm px-4 py-1 rounded font-inter"
                >
                  Delete
                </button>
                <FeedbackUpdate itemId={item?._id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminFeedbackCard;
