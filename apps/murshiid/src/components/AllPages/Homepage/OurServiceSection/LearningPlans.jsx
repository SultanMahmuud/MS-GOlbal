'use client';

import {
  MdMenuBook,
  MdQuiz,
  MdAssignment,
  MdOndemandVideo,
  MdSelfImprovement,
  MdDownload,
  MdTrendingUp,
  MdForum,
  MdLiveTv,
  MdOutlineVideoLibrary,
  MdNotificationsActive,
  MdHelpCenter,
  MdFeedback,
  MdSchedule,
  MdPersonOutline,
  MdAssessment,
} from "react-icons/md";
import { AiFillSafetyCertificate } from "react-icons/ai";
import { BsInfinity, BsChatDotsFill } from "react-icons/bs";
import { FaUsers, FaUserShield } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";

import courseImg from "@/assets/3 Learning Plan/Course.svg";
import liveBatchImg from "@/assets/3 Learning Plan/Live Batch.svg";
import privateImg from "@/assets/3 Learning Plan/Private Class.svg";
import { Button } from "@/components/UI/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const plans = [
  {
    title: "Course",
    subtitle: "Perfect For Self-learners",
    icon: courseImg,
    features: [
      { icon: MdMenuBook, label: "Lessons" },
      { icon: MdQuiz, label: "Practice Quizzes" },
      { icon: MdAssignment, label: "Assignments" },
      { icon: AiFillSafetyCertificate, label: "Certificate" },
      { icon: MdOndemandVideo, label: "Video Content" },
      { icon: BsInfinity, label: "Lifetime Access" },
      { icon: MdSelfImprovement, label: "Self-Paced Learning" },
      { icon: MdDownload, label: "Downloadable Resources" },
      { icon: MdTrendingUp, label: "Progress Tracking" },
      { icon: MdForum, label: "Discussion Forums" },
    ],
  },
  {
    title: "Live Batch",
    subtitle: "Learn In a Group Setting",
    icon: liveBatchImg,
    recommended: true,
    features: [
      { icon: MdLiveTv, label: "Live Classes" },
      { icon: MdQuiz, label: "Practice Quizzes" },
      { icon: MdAssignment, label: "Assignments" },
      { icon: AiFillSafetyCertificate, label: "Certificate" },
      { icon: MdOutlineVideoLibrary, label: "Video Recordings" },
      { icon: HiUserGroup, label: "Group Discussion" },
      { icon: FaUsers, label: "Peer Learning" },
      { icon: MdNotificationsActive, label: "Class Reminders" },
      { icon: MdHelpCenter, label: "Doubt Clearing Sessions" },
      { icon: MdFeedback, label: "Live Feedback" },
    ],
  },
  {
    title: "Private",
    subtitle: "1-on-1 Sessions",
    icon: privateImg,
    features: [
      { icon: MdLiveTv, label: "Live Classes" },
      { icon: MdQuiz, label: "Practice Quizzes" },
      { icon: MdAssignment, label: "Assignments" },
      { icon: AiFillSafetyCertificate, label: "Certificate" },
      { icon: MdOutlineVideoLibrary, label: "Video Recordings" },
      { icon: MdSchedule, label: "Flexible Schedule" },
      { icon: MdPersonOutline, label: "Personalized Study Plan" },
      { icon: BsChatDotsFill, label: "Direct Messaging" },
      { icon: MdAssessment, label: "Progress Reports" },
      { icon: FaUserShield, label: "Parent/Guardian Updates" },
    ],
  },
];



const LearningPlans = () => {
  const navigate = useRouter();

  const handleChosen = (title) => {
    if (title === "Course") {
      navigate.push("/courses");
    } else if (title === "Live Batch") {
      navigate.push("/live-batch");
    } else {
      navigate.push("/pricing");
    }
  };

  return (
    <section className="lg:py-16">
      <div className="max-w-6xl mx-auto px-4 grid gap-8 sm:grid-cols-1 md:grid-cols-3">
        {plans.map(({ title, subtitle, icon: Icon, features, recommended }) => (
          <div
            key={title}
            className="relative group  rounded-2xl border border-gray-200 p-8 flex flex-col hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            {recommended && (
              <div
                className="absolute top-4 right-4 text-[rgb(45,45,45)] text-xs font-semibold uppercase px-2 py-1 rounded"
                style={{ backgroundColor: "rgba(182, 237, 177, 0.43)" }}
              >
                Recommended
              </div>
            )}
            <div className="mb-6 flex justify-center">
              <Image width={64} height={64} src={Icon} alt={title} className="w-16 h-16 object-contain" />
            </div>

            <h3 className="text-[22px] font-bold text-[rgb(16_24_40_/_90%)] text-center">
              {title}
            </h3>
            <p className="text-[17px] font-semibold text-[rgb(29_41_57_/_90%)] text-center">
              {subtitle}
            </p>

            <ul className="space-y-4 flex-1 mt-5">
              {features.map(({ icon: FIcon, label }) => (
                <li key={label} className="flex items-center">
                  <div className="bg-[#F4F7F0] p-2 rounded-full mr-3">
                    <FIcon className="w-5 h-5 text-[rgb(16_185_129)]" />
                  </div>
                  <span className="text-[#2D2D2D] font-medium hind">{label}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() => handleChosen(title)}
              className="banner-button-1 mt-5 bg-gradient-to-r from-green-500 to-teal-400 hover:from-green-600 hover:to-teal-500"
            >
              Get Started
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LearningPlans;
