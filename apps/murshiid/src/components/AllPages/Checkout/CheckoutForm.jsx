import React from "react";

const CheckoutForm = ({
  userInfoConfig,
  showWarning,
  setPromoValue,
  data,
  onChangeTermsCheck,
  TermsValue,
}) => {
  const { name, setName, email, setEmail, number, setNumber, setAddress, address } = userInfoConfig;

  return (
    <div className="shadow-md p-5 rounded-md w-full max-w-[720px] mx-auto">
      <div className="mb-5">
        <div
          className="font-bold text-primary"
          style={{ fontSize: "1.25rem" /* approx SIZES.large */ }}
        >
          শিক্ষার্থীর তথ্য
        </div>
      </div>

      {/* First row */}
      <div className="flex flex-col md:flex-row gap-5 mb-5">
        <div className="flex flex-col w-full md:w-1/2">
          <label htmlFor="name" className="mb-1 font-semibold text-black">
            শিক্ষার্থীর নাম
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="শিক্ষার্থীর সম্পূর্ন নাম"
            className="border-2 border-gray-300 rounded-md p-3 mb-5  text-base h-[50px]"
          />
        </div>

        <div className="flex flex-col w-full md:w-1/2">
          <label htmlFor="number" className="mb-1 font-semibold text-black">
            মোবাইল নম্বর
          </label>
          <input
            id="number"
            name="number"
            type="text"
            required
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="শিক্ষার্থীর মোবাইল নম্বর"
            className="border-2 border-gray-300 rounded-md p-3 mb-5  text-base h-[50px]"
          />
        </div>
      </div>

      {/* Second row */}
      <div className="flex flex-col md:flex-row gap-5 mb-5">
        <div className="flex flex-col w-full md:w-1/2">
          <label htmlFor="email" className="mb-1 font-semibold text-black">
            ইমেল এড্রেস
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ইমেল এড্রেস লিখুন"
            className="border-2 border-gray-300 rounded-md p-3 mb-5  text-base h-[50px]"
          />
        </div>

        <div className="flex flex-col w-full md:w-1/2">
          <label htmlFor="address" className="mb-1 font-semibold text-black">
            ঠিকানা
          </label>
          <input
            id="address"
            name="address"
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="শিক্ষার্থীর ঠিকানা"
            className="border-2 border-gray-300 rounded-md p-3 mb-5  text-base h-[50px]"
          />
        </div>
      </div>

      {/* Promo code */}
      {data?.PromoCode?.length > 0 && (
        <>
          <label htmlFor="promoCode" className="mb-1 font-semibold text-black">
            প্রোমো কোড
          </label>
          <input
            id="promoCode"
            type="text"
            onChange={(e) => setPromoValue(e.target.value)}
            placeholder="প্রোমো কোড"
            className="border-2 border-gray-300 rounded-md p-3 mb-5  text-base h-[50px] w-full"
          />
        </>
      )}

      {/* Warning message */}
      {showWarning && (
        <div className="text-yellow-400 font-bold font-sans">
          *সকল তথ্য প্রদান বাধ্যতামূলক
        </div>
      )}
    </div>
  );
};

export default CheckoutForm;
