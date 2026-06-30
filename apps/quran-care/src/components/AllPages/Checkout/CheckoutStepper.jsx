import React, { useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";

import CheckoutForm from "./CheckoutForm";
import CostSummary from "./CostSummary";
import Successful from "./Successful";
import Otp from "./Otp";
import { getApiBaseUrl, getBrandHeaders, getBrandKey } from "@/lib/brand-config";


const steps = ["অর্ডার কনফার্মেশন", "লগ ইন", "পেমেন্ট","সাকসেফুল"];

const CheckoutStepper = ({ courseData }) => {

  const userData = { user: { name: "", email: "" } };

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [RequiredUserData, setRequiredUserData] = useState({});
  const [showWarning, setShowWarning] = useState(false);
  const [promoValue, setPromoValue] = useState("");
  const [checkTerms, setCheckTerms] = useState(false);
  const [name, setName] = useState(userData?.user?.name || "");
  const [email, setEmail] = useState(userData?.user?.email || "");
  const [number, setNumber] = useState("");
  const [address, setAddress] = useState("");
  const [isSSLPaySelected, setIsSSLPaySelected] = useState(false);
  const [isBkashSelected, setIsBkashSelected] = useState(false);

  let getMethod = localStorage.getItem("chosenMethod");
  getMethod = JSON.parse(getMethod);
  let getUser = localStorage.getItem("user");
  getUser = JSON.parse(getUser);

  const paymentData = {
    amount:
      promoValue === courseData?.PromoCode
        ? Math.ceil((courseData?.salePrice * 100 - courseData?.PromoPercentage) / 100)
        : courseData?.salePrice,
    order_id: courseData?._id,
    orderID: courseData?._id,
    courseId: courseData?._id,
    brandKey: getBrandKey(),
    userId: getUser?._id,
    customer_name: getUser?.name || name,
    customer_address: "Bangladesh",
    customer_phone: number,
    customer_post_code: "5200",
    client_ip: "unknown",
    currency: "BDT",
    discsount_amount:
      promoValue === courseData?.PromoCode
        ? courseData?.medium === "Record Course"
          ? Math.floor((courseData?.salePrice * courseData?.PromoPercentage) / 100)
          : Math.floor((getMethod?.price * courseData?.PromoPercentage) / 100) || 0
        : 0,
    email: getUser?.email || email,
    value1: "nhe",
  };

  const startPayment = (gateway) => {
    setLoading(true);
    if (number.length < 9 || !checkTerms) {
      setShowWarning(true);
      setLoading(false);
      return;
    }

    fetch(`${getApiBaseUrl()}/payment/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getBrandHeaders() },
      body: JSON.stringify({ ...paymentData, gateway, phone: number }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((result) => {
        if (result?.url) {
          window.location.replace(result.url);
          return;
        }
        throw new Error(result?.error || "Payment could not be started");
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };

  const handleFinish = () => {
    setLoading(true);
    window.location.href = "/";
  };

  const handleSSLPay = () => {
    setLoading(true);
    setIsSSLPaySelected(true);
    setIsBkashSelected(false);

    if (number.length < 9 || !checkTerms) {
      setShowWarning(true);
    } else {
      startPayment("sslcommerz");
    }
  };

  const handleBkash = () => {
    setIsBkashSelected(true);
    setIsSSLPaySelected(false);
    if (number.length < 9 || !checkTerms) {
      setShowWarning(true);
    } else {
      startPayment("bkash");
    }
  };

  const onOtpVerified = () => {
    setActiveStep(2);
  };

  return (
    <div className="max-w-6xl mx-auto p-10 font-hind">
<div className="flex justify-center mb-10 font-hind text-lg relative">
  {steps.map((label, index) => {
    if (index === 1 && getUser?._id) return null;

    const isActive = activeStep === index;
    const isCompleted = activeStep > index;

    return (
      <div key={label} className="flex flex-col items-center relative z-10 px-6">
        {index !== 0 && (
          <div className="absolute top-5 left-0 w-full h-1 -z-10 bg-gray-300 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ease-in-out ${
                isCompleted
                  ? "bg-gradient-to-r from-primary to-cyan-400 w-full"
                  : "w-0 bg-gradient-to-r from-primary to-cyan-400"
              }`}
            ></div>
          </div>
        )}

        <div
          className={`w-12 h-12 flex items-center justify-center rounded-full border-2 shadow-md transition-all duration-300
            ${
              isActive
                ? "border-primary bg-gradient-to-br from-p to-primary text-white scale-110 animate-pulse"
                : ""
            }
            ${isCompleted ? "border-primary bg-primary text-white" : ""}
            ${!isActive && !isCompleted ? "border-gray-300 bg-white text-gray-400" : ""}
          `}
        >
          {isCompleted ? "✓" : index + 1}
        </div>

        <span
          className={`mt-2 transition-colors duration-300 ${
            isActive ? "font-semibold text-primary" : "text-gray-500"
          }`}
        >
          {label}
        </span>
      </div>
    );
  })}
</div>


      {activeStep === steps.length ? (
        <Successful />
      ) : (
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="flex-1">
            {activeStep === 0 && (
              <CheckoutForm
                userInfoConfig={{ name, setName, email, setEmail, number, setNumber, address, setAddress }}
                data={courseData}
                setPromoValue={setPromoValue}
                setUserData={setRequiredUserData}
                showWarning={showWarning}
                onChangeTermsCheck={setCheckTerms}
                TermsValue={checkTerms}
              />
            )}
            {activeStep === 1 && <Otp phoneNumber={number} onOtpVerified={onOtpVerified} email={email} />}
            {activeStep === 2 && (
              <button
                className="mt-5 px-6 py-3 text-white bg-primary rounded shadow-lg hover:bg-yellow-400 hover:text-white transition-transform transform hover:scale-110 flex items-center"
                onClick={handleSSLPay}
                disabled={loading}
              >
                payment <MdKeyboardArrowRight className="ml-2" />
              </button>
            )}
          </div>

          <CostSummary data={courseData} promoValue={promoValue} getMethod={getMethod} />
        </div>
      )}

      {activeStep < steps.length && (
        <div className="mt-10 max-w-xl">
          {activeStep === steps.length - 1 ? (
            <button
              onClick={handleFinish}
              className="mt-6 px-6 py-3 bg-primary text-white rounded shadow-lg hover:bg-yellow-400 hover:text-white transition-transform transform hover:scale-110 flex items-center"
            >
              শেষ <MdKeyboardArrowRight className="ml-2" />
            </button>
          ) : (
            <>
              <div className="mb-3 text-lg font-semibold">পেমেন্ট মেথড সিলেক্ট করুন</div>

              <label
                className={`flex items-center justify-between p-4 mb-3 rounded border cursor-pointer ${
                  isBkashSelected ? "border-primary" : "border-gray-300"
                }`}
                onClick={() => {
                  setIsBkashSelected(true);
                  setIsSSLPaySelected(false);
                }}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="paymentOption"
                    checked={isBkashSelected}
                    readOnly
                    className="cursor-pointer"
                  />
                  <span className="font-semibold text-lg">বিকাশ</span>
                </div>
              </label>

              <label
                className={`flex items-center justify-between p-4 rounded border cursor-pointer ${
                  isSSLPaySelected ? "border-primary" : "border-gray-300"
                }`}
                onClick={() => {
                  setIsSSLPaySelected(true);
                  setIsBkashSelected(false);
                }}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="paymentOption"
                    checked={isSSLPaySelected}
                    readOnly
                    className="cursor-pointer"
                  />
                  <span className="font-semibold text-lg">অন্যান্য পেমেন্ট মাধ্যম</span>
                </div>
              </label>

              <label className="flex items-center mt-5 space-x-3 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={checkTerms}
                  onChange={(e) => setCheckTerms(e.target.checked)}
                  className="cursor-pointer"
                />
                <span>
                  আমি এই প্ল্যাটফর্ম{" "}
                  <a href="https://qawmiuniversity.com/terms-conditions" className="underline text-yellow-600">
                    ব্যবহারের শর্তাবলি
                  </a>
                  ,{" "}
                  <a href="https://qawmiuniversity.com/privacy-policy" className="underline text-yellow-600">
                    গোপনীয়তা নীতি
                  </a>{" "}
                  এবং{" "}
                  <a href="https://qawmiuniversity.com/refund-policy" className="underline text-yellow-600">
                    মূল্যফেরত নীতির
                  </a>{" "}
                  ব্যাপারে সম্মতি দিচ্ছি
                </span>
              </label>

              <button
                onClick={() => {
                  if (isBkashSelected) {
                    handleBkash();
                  } else if (isSSLPaySelected) {
                    handleSSLPay();
                  }
                }}
                disabled={!checkTerms}
                className={`mt-6 w-full py-3 rounded text-white font-bold text-xl transition-transform ${
                  checkTerms ? "banner-button-1 bg-primary" : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                পেমেন্ট করুন
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckoutStepper;
