
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/UI/tabs';
import CommonCourse from '../Homepage/MostPopularCourses/CommonCourse';
import BestReviews from '../Homepage/BestReviews/BestReviews';


const Abouttopbar = () => {
  return (
    <div className="w-full mt-8 mb-28">
      <Tabs defaultValue="class">
        <TabsList className="flex gap-2 bg-gray-100  p-4 rounded-md overflow-x-auto h-16">
          <TabsTrigger
            value="class"
            className="text-black whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-3 rounded-md data-[state=active]:font-semibold"
          >
            ক্লাস ব্যবস্থা
          </TabsTrigger>
          <TabsTrigger
            value="teachers"
              className="text-black whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-3 rounded-md"
          >
            শিক্ষক-শিক্ষিকা
          </TabsTrigger>
          <TabsTrigger
            value="achievements"
             className="text-black whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-3 rounded-md"
          >
            আমাদের অর্জন
          </TabsTrigger>
        </TabsList>

        <TabsContent value="class" className="mt-4 bg-white p-4 rounded-md shadow-md">
          <ul className="list-disc pl-5 space-y-2 text-gray-700 text-[16px] leading-[29px] font-medium">
            <li>আমরা প্রতিটি ক্লাসকে আলাদা ভাবে গুরুত্ব দেই। মনিটরিং করা হয় প্রতিটি ক্লাস।</li>
            <li>ক্লাস শেষে টিচার স্টুডেন্টদের ফিডব্যাক দেয় সে কেমন ক্লাস করেছে।</li>
            <li>একই ভাবে আমরা স্টুডেন্টদের কাছে থেকেও ফিডব্যাক নেয় তার কাছে ক্লাসটি কেমন লেগেছে।</li>
            <li>আমরা এটা নিশ্চিত করতে চেষ্টা করি যে প্রতিটি ক্লাস করে যেন টিচার ও স্টুডেন্টের মনে হয়, ক্লাসটি অসাধারণ ছিল।</li>
            <li>ক্লাস সংক্রান্ত সমস্ত কিছু তুমি ক্লাসরুমে পেয়ে যাবে যেমন ক্লাস ভিডিও ,এসাইনমেন্ট ,ক্লাস। তোমার যেকোনো সমস্যা সমাধান করে নিতে পারবে কমিউনিটিতে।</li>
          </ul>
        </TabsContent>

        <TabsContent value="teachers" className="mt-4 bg-white p-4 rounded-md shadow-md">
          <ul className="list-disc pl-5 space-y-2 text-gray-700 text-[16px] leading-[29px] font-medium">
            <li>আমরা প্রতিটি শিক্ষক-শিক্ষিকাকে কয়েকটি ধাপে ইন্টারভিউ নেওয়ার পরে নিয়োগ দেই।</li>
            <li>শিক্ষক-শিক্ষিকা সম্পর্কে বিস্তারিত তথ্য তুমি টিচার পেজে দেখতে পারবে।</li>
            <li>কোনো বিষয়ে প্রব্লেম থাকলে সরাসরি টিচারের সাথে কথা বলতে পারবে।</li>
            <li>টিচার নিয়ে কনসার্ন থাকলে আমাদের বিনা দ্বিধায় জানতে পারবে।</li>
            <li>প্রতিটি সাবজেক্টের জন্য তুমি পাবে অভিজ্ঞ টিচার।</li>
          </ul>
        </TabsContent>

        <TabsContent value="achievements" className="mt-4 bg-white p-4 rounded-md shadow-md">
          <ul className="list-disc pl-5 space-y-2 text-gray-700 text-[16px] leading-[29px] font-medium">
            <li>আমরা এখনোও অনেক পথ পাড়ি দেওয়া বাকি। আমরা শুরু করেছি লক্ষ্যেও পৌঁছে যাবো ইনশাল্লাহ।</li>
            <li>৮০০+ এর অধিক শিক্ষার্থী আমাদের এখানে ফ্রি ক্লাসের আবেদন করেন।</li>
            <li>৩৫০+ এর অধিক শিক্ষার্থী আমাদের বিশ্বাস করছেন।</li>
            <li>৮০০০ এর অধিক ক্লাস আমরা সফল ভাবে শেষ করছে ,আলহামদুলিল্লাহ।</li>
            <li>১৩০০০ হাজারের অধিক ফলোয়ার আছে আমাদের ফেসবুক ও অন্যান্য সোশ্যাল মিডিয়াতে।</li>
          </ul>
        </TabsContent>
      </Tabs>

      <CommonCourse/>
        <BestReviews />
    </div>
  );
};

export default Abouttopbar;
