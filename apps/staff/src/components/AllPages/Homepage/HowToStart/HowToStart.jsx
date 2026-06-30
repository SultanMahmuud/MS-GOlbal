import { PiArrowArcRightBold } from "react-icons/pi";
import { TbClick } from "react-icons/tb";
import knowMore from "@/assets/howStartIcon/বিস্তারিত জানুন.svg";
import freeClass from "@/assets/howStartIcon/ফ্রি ক্লাস.svg";
import startNow from "@/assets/howStartIcon/শুরু করুন.svg";

import { Button } from "@/components/UI/button";
import Image from "next/image";
import Link from "next/link";

const steps = [
  {
    id: 1,
    title: "বিস্তারিত জানুন",
    description:
      "বিস্তারিত জানুন ও আপনার পছন্দের বিষয় সিলেক্ট করে শেখা শুরু করে দিন। সহজে, আনন্দের সাথে !",
    icon: knowMore,
    bg: "bg-emerald-100",
    buttonText: "বিস্তারিত জানুন",
    link: "/courses",
  },
  {
    id: 2,
    title: "কয়েকটি ফ্রি ক্লাস করে  দেখুন",
    description:
      "ফ্রিতে কয়েকটি ক্লাস করে আমাদের পড়ানোর মান যাচাই করুন। এরপর ভর্তির সিদ্ধান্ত নিন।",
    icon: freeClass,
    bg: "bg-blue-100",
    buttonText: "ফ্রি ক্লাস",
    link: "/trail-class",
  },
  {
    id: 3,
    title: "আজই ইসলাম শিখা শুরু করুন",
    description:
      "অভিজ্ঞ টিচারের সাথে সহজেই কোরআন ও ইসলামের খুটিনাটি বিষয় শিখে নিন",
    icon: startNow,
    bg: "bg-purple-100",
    buttonText: "শুরু করুন",
    link: "/student-registration",
  },
];

export default function HowToGetStart() {
  return (
    <section className="relative py-16 overflow-hidden bg-white">
      {/* Decorative background blobs */}
      <div className="absolute -top-40 -left-40 w-80 h-96 bg-emerald-100 rounded-[45%_55%_50%_50%]" />
      <div className="absolute -top-32 -right-32 w-72 h-96 bg-blue-100 rounded-[50%_50%_45%_55%]" />
      <div className="absolute -bottom-36 -left-32 w-96 h-80 bg-rose-100 rounded-[55%_45%_60%_40%]" />
      <div className="absolute -bottom-24 -right-36 w-80 h-64 bg-sky-100 rounded-[50%_60%_40%_50%]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <h2 className="text-[26px] md:text-3xl lg:text-4xl font-bold text-center base1 mb-10 hind">
          কিভাবে শুরু করবেন
        </h2>

        <div className="flex flex-wrap justify-center items-center gap-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-6">
              <div className="bg-white shadow-md rounded-2xl w-72 p-6 flex flex-col items-center text-center hind">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold">
                  {step.id}
                </div>
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mt-4 ${step.bg}`}
                >
                  <Image width={40} height={40} src={step.icon} alt={step.title} className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mt-3">
                  {step.title}
                </h3>
                <p className="text-[15px] text-[rgb(27,127,81)] font-medium mt-1 mb-3 px-2">
                  {step.description}
                </p>

                

              <Link href={step.link}>
                <div
                
                  className="bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-[16px] px-6 py-4 rounded-full flex items-center gap-2 transition duration-200"
                >
                  {step?.buttonText}
                  <TbClick className="text-lg" />
                </div>
              </Link>
            </div>

              {/* Arrow, not for last item */}
              {index < steps.length - 1 && (
                <div className="text-[45px] hidden md:block">
                  <PiArrowArcRightBold />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
