"use client";

import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { FaUserAlt, FaPhoneAlt, FaAddressCard } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";

import { IoMdBookmarks, IoMdSunny } from "react-icons/io";

import Simg1 from "../../../assets/R1/R1.png";
import Simg2 from "../../../assets/R1/R2.png";
import Simg3 from "../../../assets/R1/R3.png";

import { FaUserFriends } from "react-icons/fa";
import { Mail } from "lucide-react";
import { Button } from "@/components/UI/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";

export default function StudentRegistration({ type }) {
  const [time, setTime] = useState("Morning");
  const [days, setDays] = useState(1);
  const navigate = useRouter();

  const timeOptions = [
    "7 AM",
    "8 AM",
    "9 AM",
    "10 AM",
    "11 AM",
    "12 PM",
    "1 PM",
    "2 PM",
    "3 PM",
    "4 PM",
    "5 PM",
    "6 PM",
    "7 PM",
    "8 PM",
    "9 PM",
    "10 PM",
    "11 PM",
  ];
  const dayOptions = [1, 2, 3, 4, 5, 6];
  const [selectedSubject, setSelectedSubject] = useState("");
  const vluses = [
    "কোরআন শিক্ষা ১ম সেমিস্টার (কায়দা)",
    "কোরআন শিক্ষা ২য় সেমিস্টার (আমপারা)",
    "কোরআন শিক্ষা ৩য় সেমিস্টার (অ্যাডভান্স ১-৩০ পারা)",
    "কোরআন হিফজ প্রোগ্রাম ",
    "পূর্ণাঙ্গ নামাজ শিক্ষা। ",
    "আমপারা ৩০ মুখস্ত।",
    "আরবি ভাষা শিক্ষা-লেভেল ১। ",
    "ইসলামের ইতিহাস। ",
    "ইসলামী বিধান- মাসায়েল,ফিকহ। ",
    "ইসলামী আকিদা শিক্ষা। ",
    "১০০ হাদিস হিফজ প্রোগ্রাম। ",
    "নবীদের জীবনী ও শিক্ষা।",
    "তাফসিরুল কোরআন। ",
    "কোরআন তারজমা। ",
    "হাদিসের কিতাব।",
  ];
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const [, setSubmit] = useState();

  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");

  const onSubmit = (data) => {
    const newData = {
      ...data,
      interestedSubject: selectedSubject,
      attDays: days,
      attTime: time,
      regType: type,
      user: {
        name: user,
        email: email,
      },
    };

    axios
      .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/registration`, newData)
      .then((response) => {
        setSubmit(response.data);
        if (response.data._id) {
          if (type === "student-registration") {
            toast("Your Registration Successful");
            navigate.push("/student-registration-registration-thank-you");

          }
          // add an another push  after thankyou page to home page
          navigate.push("/courses");
        }
      })
      .catch((error) => {
        toast("Something went wrong");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fffefa] px-2 hind mt-12 max-w-lg my-12 mx-auto">
      <div className="w-full  mt-12 ">
        {/* Top Section with Sun Icon, Greeting, and Illustration */}
        <div className="flex flex-row justify-between items-center mb-2">
          <div>
            <div className="flex items-center gap-2">
              <IoMdSunny size={32} className="text-yellow-400" />
              <h1 className="text-4xl font-bold text-gray-800 mt-2 leading-tight">
                Good Morning, Student!
              </h1>
            </div>
          </div>
        </div>
        {/* Slider after greeting */}
        <div className="my-4">
          <Slider
            dots={true}
            infinite={true}
            speed={500}
            slidesToShow={3}
            slidesToScroll={1}
            autoplay={false}
            autoplaySpeed={3000}
            arrows={false}
            dotsClass="slick-dots slick-thumb"
          >
            <div>
              <Image
                src={Simg1}
                alt="Online Course"
                className="w-32 h-32 object-contain mx-auto"
                width={128}
                height={128}
              />
            </div>
            <div>
              <Image
                src={Simg2}
                alt="Reading Book"
                className="w-32 h-32 object-contain mx-auto"
                width={128}
                height={128}
              />
            </div>
            <div>
              <Image
                src={Simg3}
                alt="Studying"
                className="w-32 h-32 object-contain mx-auto"
                width={128}
                height={128}
              />
            </div>
          </Slider>
        </div>

        {/* Registration Card */}
        <form
          className=" shadow-lg rounded-2xl  py-8 mt-1 px-9"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Student Registration
          </h2>
          {/* Student Info */}
          <div className="mb-4">
            <label className="font-semibold block mb-1">Student Info</label>
            <div className="flex items-center bg-gray-50 rounded-lg px-3 mb-3 border focus-within:ring-2 ring-blue-300">
              <FaUserAlt className="text-green-400 mr-2" />
              <input
                className="w-full py-2 px-1 bg-transparent border-none focus:outline-none"
                type="text"
                placeholder="Student Name"
                value={user?.name}
                onChange={(event) => {
                  setUser(event.target.value);
                }}
                required
              />
            </div>

            <div className="flex items-center bg-gray-50 rounded-lg px-3 mb-3 border focus-within:ring-2 ring-blue-300">
              <Mail className="text-red-400 mr-2" />
              <input
                className="w-full py-2 px-1 bg-transparent border-none focus:outline-none"
                type="text"
                placeholder="Enter Your Email"
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
              />
            </div>

            <div className="flex items-center bg-gray-50 rounded-lg px-3 mb-3 border focus-within:ring-2 ring-blue-300">
              <FaUserFriends className="text-blue-400 mr-2" />
              <input
                className="w-full py-2 px-1 bg-transparent border-none focus:outline-none"
                type="text"
                placeholder="Enter Your Age"
                {...register("age", { required: "অবশ্যই এই তথ্যটি দিতে হবে।" })}
              />
            </div>

            <div className="flex items-center bg-gray-50 rounded-lg px-3 border focus-within:ring-2 ring-blue-300">
              <FaPhoneAlt className="text-green-400 mr-2" />
              <input
                className="w-full py-2 px-1 bg-transparent border-none focus:outline-none"
                type="text"
                placeholder="Enter Mobile Number"
                {...register("phoneNumber", {
                  required: "অবশ্যই এই তথ্যটি দিতে হবে।",
                })}
              />
            </div>
          </div>

          {/* Guardian Info */}
          <div className="mb-4">
            <label className="font-semibold block mb-1">Guardian Info</label>
            <div className="flex items-center bg-gray-50 rounded-lg px-3 border focus-within:ring-2 ring-blue-300">
              <FaUserCircle className="text-purple-400 mr-2" />
              <input
                className="w-full py-2 px-1 bg-transparent border-none focus:outline-none"
                type="text"
                placeholder="Enter Guardian Name"
                {...register("parentName", {
                  required: "অবশ্যই এই তথ্যটি দিতে হবে।",
                })}
              />
            </div>
            <div className="flex items-center bg-gray-50 rounded-lg px-3 border focus-within:ring-2 ring-blue-300 mt-2">
              <FaAddressCard className="text-yellow-400 mr-2" />
              <input
                className="w-full py-2 px-1 bg-transparent border-none focus:outline-none"
                placeholder="Your Address"
                {...register("address", {
                  required: "অবশ্যই এই তথ্যটি দিতে হবে।",
                })}
              />
            </div>
          </div>

          {/* Schedule */}
          <div className="mb-5">
            <label className="font-semibold block my-6">
              Which time? ( BD Time){" "}
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {timeOptions.map((option) => (
                <Button
                  key={option}
                  type="button"
                  className={`px-4 py-2 rounded-lg font-medium border
                    ${
                      time === option
                        ? "bg-orange-400 text-white border-orange-400"
                        : "bg-white border-gray-300 text-gray-700"
                    }
                    transition`}
                  onClick={() => setTime(option)}
                >
                  {option}
                </Button>
              ))}
            </div>

            <label className="font-semibold block mb-1 mt-4">
              Days Per Week
            </label>
            <div className="flex flex-wrap gap-2">
              {dayOptions.map((option) => (
                <Button
                  key={option}
                  type="button"
                  className={`w-12 py-2 rounded-lg font-medium border
                    ${
                      days === option
                        ? "bg-[#10b981] text-white border-[#10b981]"
                        : "bg-white border-gray-300 text-gray-700"
                    }
                    transition`}
                  onClick={() => setDays(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
          {/* Interested Subject */}
         <div className="mb-4 relative">
  <label className="font-semibold block mb-1">Subject</label>

  <Select onValueChange={setSelectedSubject}>
    <SelectTrigger className="w-full pl-10 py-5 text-lg"> {/* extra padding-left for icon */}
      <IoMdBookmarks className="absolute left-3 top-12 -translate-y-1/2 text-[#10b981]" />
      <SelectValue placeholder="Choose an Option" />
    </SelectTrigger>

    <SelectContent className="">
      {vluses.map((subject, index) => (
        <SelectItem key={index} value={subject} className="hover:bg-[#10b981] hover:text-white">
          {subject}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>


          {/* Submit */}
          <Button type="submit" className="banner-button-1 w-full">
            Submit
          </Button>
        </form>
      </div>
         
    </div>
  );
}
