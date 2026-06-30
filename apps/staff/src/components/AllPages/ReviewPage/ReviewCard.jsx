"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";

const ReviewCard = ({ showPage }) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const stylePresets = [
    { border: "from-green-400 via-blue-500 to-purple-500" },
    { border: "from-pink-500 via-purple-500 to-blue-500" },
    { border: "from-purple-500 via-blue-400 to-pink-400" },
    { border: "from-blue-400 via-purple-400 to-yellow-400" },
    { border: "from-yellow-400 via-orange-400 to-pink-500" },
    { border: "from-green-400 via-yellow-500 to-red-400" },
    { border: "from-purple-400 via-blue-500 to-green-400" },
    { border: "from-pink-400 via-red-400 to-yellow-400" },
  ];

  useEffect(() => {
    const getComponent = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/reviews/getReview`
        );

        // Adjust according to API shape
        const apiData = Array.isArray(res.data) ? res.data : res.data.data;

        const styledData = apiData.map((review, index) => {
          const style = stylePresets[index % stylePresets.length];
          return { ...review, border: style.border };
        });
        const filteredData = styledData.filter(
          (review) => review.showPage === (showPage || "ReviewPage")
        );

        setReviews(filteredData);
       
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getComponent();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center text-white py-10">Loading reviews...</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {reviews.map((t, i) => (
          <div
            key={t._id || i}
            className={`relative p-[1px] rounded-2xl bg-gradient-to-br ${t.border} transition-transform hover:scale-105`}
          >
            <div className="bg-gradient-to-br from-[#19122B] to-[#0F1021] backdrop-blur-lg rounded-xl h-full flex flex-col justify-between p-7 font-hind">
              {/* Quote Icon */}
              <div
                className={`absolute -top-6 left-7 bg-gradient-to-r ${t.border} text-white rounded-full w-10 h-10 flex items-center justify-center text-3xl shadow-lg`}
              >
                &ldquo;
              </div>

              {/* Review Text */}
              <p className="text-white/90 text-[1.08rem] leading-relaxed mb-6 flex-grow font-hind">
                {t.review || "No review text available."}
              </p>

              {/* Person Info */}
              <div className="flex items-center gap-4 mt-4">
                <Image
                  src={t.reviewPersonImg || "/default-avatar.png"}
                  alt={t.personName || "Anonymous"}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover"
                />
                <div>
                  <div className="font-bold text-white">
                    {t.personName || "Anonymous"}
                  </div>
                  <div className="text-white/70 text-sm">
                    {t.location || "Unknown"} &bull;{" "}
                    {t.date ? new Date(t.date).toLocaleDateString() : "No date"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {reviews.length === 0 && !isLoading && (
          <div className="col-span-full text-center text-gray-400">
            No reviews available.
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
