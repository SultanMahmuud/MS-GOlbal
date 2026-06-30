'use client'
import one from "@/assets/Exam-01/Exam-01.png";
import two from "@/assets/Exam-01/Note-01.png";
import three from "@/assets/Exam-01/Support.png";
import four from "@/assets/Exam-01/Teacher-01.png";
import Image from "next/image";
import { useState } from "react";

const features = [
  {id:1,
    title: "অভিজ্ঞ শিক্ষক-শিক্ষিকা",
    desc: "আপনি পাচ্ছেন প্রতিটা বিষয়ের সেরা টিচার, ফলে কঠিন সবচেয়ে টপিকও পানির মতো সহজ মনে হবে",
    img: one,
  },
  {id:3,
    title: "স্মার্ট নোট ও স্টাডি ম্যাটেরিয়াল",
    desc: "সুস্পষ্ট ও গোছানো স্মার্ট নোট, যা আপনার শেখাকে আরও সহজ ও আনন্দদায়ক করবে।",
    img: two,
  },
  {id:4,
    title: "মাসিক পরিক্ষা ও সার্টিফিকেট",
    desc:"প্রতিমাসের নিয়মিত মূল্যায়নে নিজেকে যাচাই করুন, আত্মবিশ্বাস বাড়ান এবং পান স্বীকৃতি।",
    img: three,
  },
  {id:5,
    title: "বেস্ট স্টুডেন্ট কেয়ার",
    desc: "যেকোনো প্রশ্নে বা সমস্যায় আমাদের আন্তরিক টিম আপনার পাশে রয়েছে সবসময়। 24/7 সাপোর্ট .",
    img: four,
  },
];

export default function StartLearningIslam() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative overflow-hidden py-14 px-2 bg-gradient-to-tr from-[#f7fafd] via-[#fff6fc] to-[#f8fbff] hind  rounded-md mt-12 max-w-7xl mx-auto">
      {/* Background Circle */}
      {/* Title */}
      <h2 className="text-center font-extrabold text-3xl md:text-4xl text-[rgb(16_24_40_/_90%)]  tracking-tight hind">
        শুরু করুন আপনার  <br className="lg:hidden block"/>ইসলাম শেখার যাত্রা
      </h2>
      <p className="text-center mb-12 my-4 w-2/3 mx-auto text-[18px] font-medium text-[rgb(29_41_57_/_90%)]">
        আমরা থাকবো আপনার পাশে ছায়ার মত, আপনার সফলতায় আমাদের সফলতা। বিশ্বাস করুন আপনি পারবেন। আমরা বিশ্বাস করি আল্লাহ সবচেয়ে বড় সাহায্যকারী ও রাসূল সাঃ বলেন যে চেষ্টা করে সে পায়। আপনার জন্য আমরা দ্বীনি শিক্ষাকে সহজ থেকে সহজতর করতে অবিরাম চেষ্টা করে যাচ্ছি।
      </p>

      {/* SVG Wave Path */}
      <div className="hidden lg:block absolute left-0 right-0 top-[300px] md:top-[300px] w-full h-40 z-10 pointer-events-none">
        <svg viewBox="0 0 1200 120" width="100%" height="100%">
          <defs>
            <linearGradient
              id="waveGrad"
              x1="0"
              y1="0"
              x2="1200"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#8b5cf6" />
              <stop offset="0.4" stopColor="#6366f1" />
              <stop offset="0.8" stopColor="#f472b6" />
            </linearGradient>
          </defs>
          <path
            d="M40,60 Q300,5 600,60 Q900,115 1160,60"
            fill="transparent"
            stroke="url(#waveGrad)"
            strokeWidth="20"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Features Row */}
      <div className="relative z-20 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-6 max-w-5xl mx-auto">
        {features.map((f, i) => {
          const isActive = i === activeIndex;
          return (
            <div
              key={f.id}
              onClick={() => setActiveIndex(i)}
              className={`flex flex-col items-center bg-white bg-opacity-80 backdrop-blur rounded-3xl px-6 py-8 w-[250px] cursor-pointer transition-all duration-300 transform
                ${
                  isActive
                    ? "scale-105 shadow-[0_0_0_8px_rgba(139,92,246,0.3)] border-2 border-violet-500"
                    : "hover:scale-105 shadow-md border border-[#f3f5fa]"
                }
                ${i === 1 ? "md:mt-6" : i === 2 ? "md:-mt-3" : ""}`}
            >
              <div className="h-32 w-32 flex items-center justify-center mb-4 -mt-10">
                <Image
                  src={f.img}
                  alt={f.title}
                  className="w-28 h-28 object-contain"
                  draggable="false"
                  height={100}
                  width={100}
                />
              </div>
              <div
                className="font-extrabold text-xl text-[#1d2531] mb-2 text-center leading-tight"
                style={{ letterSpacing: "-0.02em" }}
              >
                {f.title}
              </div>
              <div className="text-gray-500 text-base text-center font-medium max-w-[180px] mx-auto">
                {f.desc}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
