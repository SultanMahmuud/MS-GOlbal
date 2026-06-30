'use client';
import React, { useEffect, useState } from "react";
import sehedule from "@/assets/icons/schedule (2).svg";
import axios from "axios";
import { Button } from "@/components/UI/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

const daysOptions = ["2 Days", "3 Days", "4 Days", "5 Days", "6 Days"];
const planKeys = ["30", "40", "1hr"];
const colors = [
  "bg-[rgb(243_255_247)]",
  "bg-[rgb(243_255_247)]",
  "bg-[rgb(243_255_247)]",
];

const PricingPlans = () => {
  const [selectedDays, setSelectedDays] = useState(0);
  const [plans, setPlans] = useState([]);
  const [rawPlans, setRawPlans] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useRouter();

  // Fetch plans once
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/pricingplan`
        );
        const data = res.data.data[0];
        setRawPlans(data);

        // 👇 initialize with 2 Days plan immediately
        updatePlansByDay(data, 0);
      } catch (error) {
        console.error("Failed to fetch plans", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Update plans when selectedDays changes
  useEffect(() => {
    if (rawPlans) {
      updatePlansByDay(rawPlans, selectedDays);
    }
  }, [selectedDays]);

  const handleChosen = (method) => {
    const newMethod = {
      ...method,
      selectedDays,
    };
    navigate.push(`/student-registration`);
    // localStorage.setItem("chosenPlan", JSON.stringify(newMethod));
  };

  const updatePlansByDay = (data, index) => {
    const dayKey = `Days_${index + 2}`;
    const planData = data[dayKey];

    if (!planData) {
      setPlans([]);
      return;
    }

    const formatted = planKeys.map((key, i) => ({
      minutes: key === "1hr" ? "60" : key,
      label: key === "30" ? "Starter" : key === "40" ? "Popular" : "Premium",
      labelColor: colors[i % colors.length],
      features: planData[`heading_${key}`]
        ? planData[`heading_${key}`]
            .split(",")
            .map((text) => ({ icon: "✅", text }))
        : [],
      price: planData[`price_${key}`] || 0,
      btnColor:
        key === "30"
          ? "bg-gradient-to-r from-green-500 to-teal-400 hover:from-green-600 hover:to-teal-500"
          : key === "40"
          ? "bg-gradient-to-r from-green-500 to-teal-400 hover:from-green-600 hover:to-teal-500"
          : "bg-gradient-to-r from-green-500 to-teal-400 hover:from-green-600 hover:to-teal-500",
    }));

    setPlans(formatted);
  };

  return (
    <div className="flex flex-col items-center justify-center px-2 min-h-screen  py-12 bg-red">

      <h2 className="text-4xl font-extrabold text-gray-900 mb-6 text-center drop-shadow-sm">
        Choose Your Plan
      </h2>

      {/* Days Toggle */}
      <div className="grid grid-cols-3 lg:grid-cols-5 bg-white rounded-xl shadow-sm px-2 py-2 gap-2">
        {daysOptions.map((label, idx) => (
          <Button
            key={label}
            className={`px-5 py-2 rounded-lg font-semibold text-[18px] transition-all duration-200 ${
              selectedDays === idx
                ? "bg-[rgb(246_250_255)] text-[rgb(16_185_129)] shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setSelectedDays(idx)}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Plan Cards */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl justify-center items-center mt-5">
        {loading ? (
          <div className="text-gray-500 animate-pulse bg-gray-100 rounded-xl h-48 w-full mb-4"></div>
        ) : plans.length > 0 ? (
          plans.map((plan, idx) => (
            <div
              key={plan.minutes}
              className={`relative mt-16 lg:mt-5 w-[300px] bg-white rounded-3xl shadow-xl flex flex-col items-center p-7 pt-14 transition-all duration-300 ${
                idx === 1
                  ? "ring-4 ring-green-300 scale-105 z-10"
                  : "ring-2 ring-gray-200"
              }`}
            >
              {/* Label */}
              <div
                className={`absolute -top-4 left-6 px-5 py-2 rounded-[8px] shadow-md font-bold text-sm tracking-wider ${plan.labelColor} select-none inter`}
              >
                {plan.label}
              </div>

              {/* Minutes */}
              <div className="text-3xl font-extrabold text-gray-900 mb-3 mt-2 flex gap-3">
                <Image alt="Schedule Icon" src={sehedule} className="w-8 h-8" width={30} height={30}/>
                {plan.minutes} min
              </div>

              {/* Features */}
              <ul className="flex flex-col gap-3 w-full mb-7 mt-1">
                {plan.features.map((feat, fi) => (
                  <li
                    key={fi}
                    className="flex items-center gap-3 text-[16px] font-semibold"
                  >
                    <span className="w-6 h-6 flex items-center justify-center">
                      {feat.icon}
                    </span>
                    <span>{feat.text}</span>
                  </li>
                ))}
              </ul>

              {/* Price */}
              <div className="text-[26px] font-bold mb-5 text-gray-900">
                ৳{plan.price}
              </div>

              {/* Select Button */}
              <Button
                className={`banner-button-1 w-full ${plan.btnColor}`}
                onClick={() => handleChosen(plan)}
              >
                Select
              </Button>
            </div>
          ))
        ) : (
          <div className="text-gray-500">No plans available for this day</div>
        )}
      </div>
    </div>
  );
};

export default PricingPlans;
