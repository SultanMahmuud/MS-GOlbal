import Image from "next/image";
import { safeFetchJson } from "@/lib/safe-api";


const OurAchivements = async () => {
  const data = await safeFetchJson("/achievement", {
    cache: "no-store",
    fallback: { data: [] },
  });

  return (
    <div className="py-8 px-4">
      <h2 className="text-center text-[26px] md:text-3xl font-bold  base1">
        আমাদের অর্জন
      </h2>
      <p className="text-center  text-[18px] font-medium base2 mt-2 mb-6 hind">
        আল্লাহর রহমতে, আমাদের আপ্রান চেষ্টা ও শিক্ষার্থীদের  ভালোবাসায়  আমরা এগিয়ে যাচ্ছি
      </p>

      <div className="flex justify-center">
        <div className="grid grid-cols-2 lg:grid-cols-7 gap-6 max-w-6xl w-full">
          {data?.data?.reverse().slice(0, 7).map((item, i) => (
            <div
              key={item._id}
              className="group bg-white/80 rounded-2xl shadow-xl px-6 py-8 flex flex-col items-center border border-white/60 ring-1 ring-white/50 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-white/90"
              style={{
                animation: `popIn 0.5s cubic-bezier(.26,.66,.38,1.25) ${i * 0.07 + 0.3}s both`,
              }}
            >
              <Image
                src={item.iconImg}
                alt={item.title}
                className="w-20 h-20 mb-3  group-hover:opacity-100 transition-opacity duration-300"
                width={80}
                height={80}
              />
              <div className="text-2xl font-extrabold text-gray-800 drop-shadow-md">
                {item.number}+
              </div>
              <div className="text-base text-gray-700 font-semibold text-center mt-1 tracking-tight hind">
                {item.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Animation Keyframes */}
      <style>
        {`
          @keyframes popIn {
            0% {
              opacity: 0;
              transform: scale(0.85) translateY(30px);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}

export default OurAchivements;
