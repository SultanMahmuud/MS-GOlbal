import Image from "next/image";
import { safeFetchJson } from "@/lib/safe-api";



const PopularSubjects = async () => {
  const data = await safeFetchJson("/populersubjectsBng", {
    cache: "no-store",
    fallback: { data: [] },
  });


  return (
    <div className="mt-6">
      {data && (
        <div className='max-w-6xl mx-auto'>
          {/* Header */}
          <div className="flex flex-col items-center justify-center mb-6 px-4 text-center">
            <h2 className="hind text-[26px] lg:text-[30px] font-bold base1">
              জনপ্রিয় বিষয়সমূহ
            </h2>
            <p className="hind text-[18px] sm:text-[15px] lg:text-[20px] font-medium base2">
              প্রতিটি ডিপার্টমেন্টে আমাদের রয়েছে অভিজ্ঞ টিচারযা আপনার শিক্ষার যাত্রাকে করবে সহজ থেকে সহজতর
            </p>
          </div>

          {/* Grid List */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10 px-4">
            {/* for   */}
            {data.data.slice().reverse().slice(0, 8).map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-3 p-4 rounded-lg shadow-md bg-white hover:shadow-lg transition-all duration-300 flex-col lg:flex-row"
              >
                <Image
                width={40}
                height={4}
                  src={item.image}
                  alt="Subject"
                  className="w-10 h-10 object-contain"
                />
                <div className="flex flex-col">
                  <p className=" font-bold text-[16px] md:text-[20px] base1 lg:text-left text-center">
                    {item.title}
                  </p>
                  <p className=" font-medium text-[14px] md:text-[16px] lg:text-[17px] base2 lg:text-left text-center">
                    {item.SubTitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PopularSubjects;
