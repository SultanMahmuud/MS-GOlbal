import React, { useEffect, useState } from 'react';
import AdminFeedbackCard from './AdminFeedbackCard';


const AllFeedback = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/reviews/getReview`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data?.reverse());
        setIsLoading(false);
      });
  }, [isLoading]);

  return (
    <div>
      {isLoading && 'loading......'}
     {/* if data have show data otherwise show no data */}
     {!isLoading && reviews.length === 0 && (
       <p className="text-gray-500 text-center font-medium text-lg">No feedback available</p>
     )}
      <AdminFeedbackCard reviews={reviews} setIsLoading={setIsLoading} />
    </div>
  );
};

export default AllFeedback;
