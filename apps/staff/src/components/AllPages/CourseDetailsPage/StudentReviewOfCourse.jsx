import ButtonStyle from "@/components/Shared/ButtonStyle";
import { Button } from "@/components/UI/button";
import Image from "next/image";
import { useEffect, useState } from "react";




const StudentReviewOfCourse = () => {

  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    setIsLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/reviews/getReview`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data);
        setIsLoading(false);
      });
  }, []);
  const handleEnrollNow = () => {
    navigate(`/check-out/${data?.singleCourse?.data?._id}`);
  };

  const handlereviews = () => {
    navigate('/review');
  };

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {!isLoading ? (
          reviews.map((dt) => (
            <div key={dt._id} className="bg-white shadow rounded-xl p-4">
              <p className="text-center text-primary font-semibold text-base">
                {dt?.batchName} Department
              </p>
              <div className="w-1/2 h-[2px] bg-gray-200 mx-auto my-2" />
              <div className="flex justify-center">
                <Image
                  src={dt?.reviewPersonImg}
                  alt="Reviewer"
                  className="w-32 h-32 rounded-full border-4 border-primary object-cover"
                  width={128}
                  height={128}
                />
              </div>
              <div className="flex justify-center mt-3 text-yellow-500">
                {'★'.repeat(Math.floor(dt?.rating)) +
                  (dt?.rating % 1 ? '½' : '')}
              </div>
              <div className="text-center mt-4">
                <p className="text-xl font-bold text-blue-900">
                  {dt?.personName}
                </p>
                <p className="text-sm font-semibold text-primary mt-1">
                  {dt?.location}
                </p>
                <p className="text-gray-700 bg-gray-100 rounded-md p-2 mt-2 text-sm font-medium">
                  {dt?.review}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full text-center col-span-3 py-6">
            <span className="text-gray-600">Loading...</span>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
        <Button className="banner-button-1">এখনই ভর্তি হোন</Button>
        <Button className="banner-button-1">আরও দেখুন</Button>
      </div>
    </div>
  );
};

export default StudentReviewOfCourse;
