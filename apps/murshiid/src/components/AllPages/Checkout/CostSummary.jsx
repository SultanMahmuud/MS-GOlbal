import Image from "next/image";
import React from "react";

const CostSummary = ({ data, getMethod, promoValue }) => {
  return (
    <div
      className="shadow-md rounded-md p-8"
      style={{ minWidth: "350px", minHeight: "200px" }}
    >
      <div
        className="font-bold text-primary hind mb-4"
        style={{ fontSize: "1.25rem" /* approx SIZES.large */ }}
      >
        কোর্সের বিস্তারিত
      </div>

      <Image
        src={
          data?.medium === "Private"
            ? "https://qawamiuniversity.nyc3.digitaloceanspaces.com/Reading%20Quran%20Online%20Qawmi%20University%20(1).jpg"
            : data?.image
        }
        alt="course"
        className="w-20 h-20 rounded-md mb-4 object-cover"
        width={500}
        height={500}
      />

      {/* Price Row */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <div className="font-bold text-black hind">
            {data?.medium === "Private" ? "মাসিক বেতন" : "কোর্সের মূল্য"}
          </div>
        </div>
        <div>
          <div className="font-bold text-black hind">
            ৳{" "}
            {data?.medium === "Private"
              ? getMethod?.price
              : data?.banSalePrice || data?.salePrice || 0}
          </div>
        </div>
      </div>

      {/* Subscription Type Row */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <div className="font-bold text-black hind">সাবস্ক্রিপশন টাইপ</div>
        </div>
        <div>
          <div className="font-bold text-black hind">
            {data?.medium === "Private"
              ? getMethod?.selectedDay
                ? `${getMethod?.title} - ${getMethod.selectedDay.split("_")[1]} দিন সাপ্তাহিক`
                : getMethod?.title
              : "লাইভ কোর্স"}
          </div>
        </div>
      </div>

      {/* Discount Row */}
      <div className="flex justify-between items-center my-2 text-secondary">
        <div>
          <div className="font-bold text-black hind">ডিস্কাউন্ট</div>
        </div>
        <div>
          <div className="font-bold text-black hind">
            ৳{" "}
            {promoValue === data?.PromoCode
              ? Math.floor((data?.salePrice * data?.PromoPercentage) / 100)
              : 0}
          </div>
        </div>
      </div>

      <hr className="my-2" />

      {/* Total Row */}
      <div className="flex justify-between items-center">
        <div>
          <div className="font-bold text-black hind">সর্বমোট (১৫% ভ্যাট সহ)</div>
        </div>
        <div>
          <div className="font-bold text-black hind">
            ৳{" "}
            {data?.medium === "Private"
              ? getMethod?.price
              : promoValue === data?.PromoCode
              ? Math.ceil((data?.salePrice * (100 - data?.PromoPercentage)) / 100)
              : data?.salePrice}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostSummary;
