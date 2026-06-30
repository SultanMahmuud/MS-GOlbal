'use client'

import { Button } from "@/components/UI/button";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import logo from "@/assets/Logo/Logo WH.png";
import ssl from "@/assets/SSLCommerz-Pay-With-logo-All.png";

const Footer = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // ✅ Hide until client render

  return (
    <footer className="relative text-white overflow-hidden bg-gradient-to-br from-[#2eca7f] via-[#14532d] to-[#001c12] pt-16 pb-8">
      {/* Wave Background Animation */}
      <div className="absolute inset-0 z-0 bottom-0 pointer-events-none">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 2600 600">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#065f46" />
              <stop offset="50%" stopColor="#047857" />
              <stop offset="100%" stopColor="#065f46" />
            </linearGradient>
            <path
              id="wavePath"
              d="M0,300 C600,350 1200,250 1800,300 C2400,350 2600,300 2600,300 L2600,600 L0,600 Z"
            />
          </defs>
          <g className="opacity-20 animate-wave">
            <use href="#wavePath" fill="url(#waveGradient)" />
            <use href="#wavePath" x="2600" fill="url(#waveGradient)" />
          </g>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 flex flex-col lg:flex-row gap-8">
        {/* Left side: Logo + Text */}
        <div className="lg:w-2/3 flex flex-col justify-between">
          <div>
            <div className="flex items-center mb-6">
              <Image
                src={logo}
                alt="Muslim School Logo"
                width={100}
                height={100}
                style={{ width: "180px", height: "80px" }}
              />
            </div>
            <p className="text-white text-base leading-relaxed hind">
              দ্বীনের আলোয় জীবন আলোকিত হোক—স্বাগতম ইসলামের নতুন দুনিয়ায়! <br />
              আমাদের লক্ষ্য ইসলামের জ্ঞান পৌঁছে দেওয়া পৃথিবীর প্রতিটি কোণে। এখানে
              আপনি শুধু শিক্ষকই নন, পাবেন আন্তরিক অভিভাবক, যারা সর্বদা আপনার পাশে
              থেকে আপনার যত্ন নেবেন। <br />
              আমরা বিশ্বাস করি, দ্বীন শেখা কঠিন নয়—দরকার শুধু সঠিক দিকনির্দেশনা আর
              মানসম্মত শিক্ষা। দিনকে দ্বীনময় করতে আমরা আছি আপনার পাশে। আপনি পারবেন—
              পথ সহজ করে দেবেন স্বয়ং মহান আল্লাহ।
            </p>
          </div>
        </div>

        {/* Right side: 3 Cards */}
        <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* About */}
          <div className="bg-white/20 border border-white/30 rounded-lg p-6 hind">
            <h3 className="text-white text-lg font-semibold mb-4">আমাদের সম্পর্কে</h3>
            <ul className="space-y-2 text-white">
              <li><Link href="/about">আমাদের সম্পর্কে</Link></li>
              <li><Link href="/refund-policy">মূল্যফেরতনীতি</Link></li>
              <li><Link href="/terms-conditions">ব্যবহারকারীর শর্তাবলী</Link></li>
              <li><Link href="/privacy-policy">গোপনীয়তা নীতি</Link></li>
            </ul>
          </div>

          {/* Contact + Socials (desktop) */}
          <div className="bg-white/20 border border-white/30 rounded-lg p-6 row-span-2 lg:block hidden">
            <h3 className="text-white text-lg font-semibold mb-4">আমাদের সাথে কথা বলুন</h3>
            <ul className="space-y-2 text-white">
              <li><Link href="/frequently-asked-questions">প্রশ্নোত্তর</Link></li>
              <li><Link href="/contact">যোগাযোগ করুন</Link></li>
              <li><Link href="/student-registration">দ্বীন শিখা শুরু করুন</Link></li>
            </ul>

            <div className="flex items-center mt-8">
              <a href="https://www.facebook.com/muslimschoool" target="_blank" rel="noopener noreferrer">
                <FaFacebookF className="w-6 h-6 hover:text-blue-500" />
              </a>
              <a href="https://www.instagram.com/muslimschoool" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="w-6 h-6 mx-2 hover:text-pink-500" />
              </a>
              <a href="https://youtube.com/muslimschoool" target="_blank" rel="noopener noreferrer">
                <FaYoutube className="w-6 h-6 mx-2 hover:text-red-500" />
              </a>
              <a href="https://www.tiktok.com/company/muslimschoool" target="_blank" rel="noopener noreferrer">
                <FaTiktok className="w-6 h-6 mx-2 hover:text-gray-300" />
              </a>
              <a href="https://www.linkedin.com/company/muslimschoool" target="_blank" rel="noopener noreferrer">
                <FaLinkedinIn className="w-6 h-6 mx-2 hover:text-blue-600" />
              </a>
            </div>

            <div className="mt-14 flex flex-col">
              <h3 className="text-xl font-semibold mb-4">Newsletter</h3>
              <form className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 rounded-lg bg-white/30 placeholder-white text-white focus:outline-none"
                />
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold transition"
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white/20 border border-white/30 rounded-lg p-6 hind">
            <h3 className="text-white text-lg font-semibold mb-4">আমাদের বিশেষত্ব</h3>
            <ul className="flex flex-col gap-2 text-white">
              <li><Link href="/courses">কোর্স সমূহ</Link></li>
              <li><Link href="/live-batch">লাইভ ব্যাচ</Link></li>
              <li><Link href="/pricing">প্রাইসিং</Link></li>
              <li><Link href="/review">স্টুডেন্ট রিভিউ</Link></li>
            </ul>
          </div>

          {/* Contact + Socials (mobile) */}
          <div className="bg-white/20 border border-white/30 rounded-lg p-6 row-span-2 block lg:hidden">
            <h3 className="text-white text-lg font-semibold mb-4">আমাদের সাথে কথা বলুন</h3>
            <ul className="space-y-2 text-white">
              <li><Link href="/frequently-asked-questions">প্রশ্নোত্তর</Link></li>
              <li><Link href="/contact">যোগাযোগ করুন</Link></li>
              <li><Link href="/student-registration">দ্বীন শিখা শুরু করুন</Link></li>
            </ul>

            <div className="flex items-center mt-8">
              <a href="https://www.facebook.com/muslimschoool" target="_blank" rel="noopener noreferrer">
                <FaFacebookF className="w-6 h-6 hover:text-blue-500" />
              </a>
              <a href="https://www.instagram.com/muslimschoool" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="w-6 h-6 mx-2 hover:text-pink-500" />
              </a>
              <a href="https://youtube.com/muslimschoool" target="_blank" rel="noopener noreferrer">
                <FaYoutube className="w-6 h-6 mx-2 hover:text-red-500" />
              </a>
              <a href="https://www.tiktok.com/@muslimschoool" target="_blank" rel="noopener noreferrer">
                <FaTiktok className="w-6 h-6 mx-2 hover:text-gray-300" />
              </a>
              <a href="https://www.linkedin.com/muslimschoool" target="_blank" rel="noopener noreferrer">
                <FaLinkedinIn className="w-6 h-6 mx-2 hover:text-blue-600" />
              </a>
            </div>

            <div className="mt-14 flex flex-col">
              <h3 className="text-xl font-semibold mb-4">Newsletter</h3>
              <form className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 rounded-lg bg-white/30 placeholder-white text-white focus:outline-none"
                />
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold transition"
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* SSLCommerz logo */}
      <div className="p-4 mt-4 rounded-lg flex items-center justify-center">
        <Image width={700} height={50} src={ssl} alt="SSLCommerz Payment" />
      </div>

      {/* Copyright */}
      <div className="mt-5 text-center text-white text-sm opacity-80">
        © 2025 Muslim School. All Rights Reserved.
      </div>

      {/* Wave Animation Style */}
      <style jsx>{`
        @keyframes wave {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-200px);
          }
        }
        .animate-wave {
          animation: wave 8s linear infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
