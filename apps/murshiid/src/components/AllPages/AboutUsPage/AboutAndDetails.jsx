import Image from "next/image";
import aboutIcon from "@/assets/images/aboutpagesicon.png";
const AboutAndDetails = () => {
  return (
    <div className="about px-4  py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Image Section */}
        <div className="flex justify-center items-center">
          <Image
            src="https://qawamiuniversity.nyc3.digitaloceanspaces.com/4727487.jpg"
            alt="The house from the offer."
            className="min-h-[200px] object-cover"
            width={500}
            height={500}
          />
        </div>

        {/* Right Text Section */}
        <div className="flex flex-col justify-center">
        
          <h2 className="font-extrabold text-black tracking-wide mt-2 text-xl sm:text-2xl md:text-3xl py-5 leading-none">
            মুসলিম স্কুলেে তোমাকে স্বাগতম
          </h2>

          <p className="text-gray-600 leading-[29px] font-medium text-base py-3">
            আমরা যত্নশীল শিক্ষার্থীদের প্রতি। দ্বীন শিখার যাত্রাকে সহজ থেকে সহজতর করে দিতে চাই।
            শুধু টিচার না তুমি পাবে অভিভাবক যারা তোমার কেয়ার করবে। আমরা বিশ্বাস করি দ্বীন শিখা
            কঠিন না, প্রয়োজন মানসম্মত শিক্ষা তাই আমরা তোমাকে দিচ্ছি মানসম্মত শিক্ষা।
          </p>

          {/* Icon with Text */}
          <div className="useful abouticon_cont">
            <ul>
              <li className="flex items-start gap-4 py-2">
                <Image
                  src={aboutIcon}
                  alt="Icon"
                  className="max-w-[40px] flex-shrink-0"
                  width={40}
                  height={40} 
                />
                <span className="text-justify text-gray-700 text-base">
                  দিন কে দ্বীন বানাতে আমরা আছি তোমার পাশে। তুমি পারবে। পথকে তো প্রভুই সহজ করবেন
                  তোমাকে তো তোমার চেষ্টা করতে হবে। একটি বৃক্ষের বড় হওয়া ও সেখানে ফল আসে মোটেও সহজ
                  পথ বা প্রক্রিয়া না। কিন্তু প্রভু এটা আমাদের জন্য কত সহজ করে রিজিক হিসাবে আমাদের
                  দিয়েছেন।
                </span>
              </li>
            </ul>
          </div>

          <p className="text-gray-600 leading-[29px] font-medium text-base py-3">
            পড় তোমার প্রভুর মানে। জীবনের সূচনা ,জ্ঞানের সূচনা ,দিনের সূচনা ,দ্বীনের সূচনা সব
            কিছুতে প্রভু তুমি। তুমি মালিক , তুমি মালিক আমার অস্তিত্বের। আমি তোমার কাছে আরো কাছে
            যেতে চাই, আরো কাছে, তোমার সাথে ভালো সম্পর্ক তৈরী করতে চাই। প্রতিটি নিঃশ্বাসে রব তোমার
            রহমত অনুভব করতে চাই । প্রভু আমাকে পথ দেখাও।
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutAndDetails;
    