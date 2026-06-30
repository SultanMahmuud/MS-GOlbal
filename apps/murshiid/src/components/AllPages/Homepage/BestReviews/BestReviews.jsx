
import Image from 'next/image';
import Marquee from 'react-fast-marquee';
import { safeFetchJson } from '@/lib/safe-api';

const stylePresets = [
  {
    border: 'from-green-400 via-blue-500 to-purple-500',
    rotate: '-rotate-6',
    offsetY: 'mt-10',
  },
  {
    border: 'from-pink-500 via-purple-500 to-blue-500',
    rotate: '-rotate-3',
    offsetY: '-mt-2',
  },
  {
    border: 'from-purple-500 via-blue-400 to-pink-400',
    rotate: 'rotate-1',
    offsetY: 'mt-4',
  },
  {
    border: 'from-blue-400 via-purple-400 to-yellow-400',
    rotate: 'rotate-6',
    offsetY: '-mt-4',
  },
  {
    border: 'from-yellow-400 via-orange-400 to-pink-500',
    rotate: 'rotate-4',
    offsetY: 'mt-12',
  },
  {
    border: 'from-green-400 via-yellow-500 to-red-400',
    rotate: '-rotate-2',
    offsetY: 'mt-0',
  },
  {
    border: 'from-purple-400 via-blue-500 to-green-400',
    rotate: 'rotate-2',
    offsetY: '-mt-6',
  },
  {
    border: 'from-pink-400 via-red-400 to-yellow-400',
    rotate: '-rotate-4',
    offsetY: 'mt-10',
  },
];

const BestReviews = async () => {

const getStaticReviews = async () => {
  return safeFetchJson("/api/v1/reviews/getReview", {
    next: { revalidate: 60 },
    fallback: [],
  });
};
const staticReviews = await getStaticReviews();

  const reviews = staticReviews.map((review, index) => ({
    ...review,
    ...stylePresets[index % stylePresets.length],
  }));

 const filteredData = reviews.filter(
          (review) => review.showPage === "HomePage"
        );
  return (
    <div>
     
      <Marquee direction="right" gradient={false} speed={70}>
        <div className="flex gap-1 px-4">
          {filteredData.map((t, i) => (
            <div
              key={i}
              className={`relative w-[340px] md:w-[400px] min-h-[200px] p-[1px] rounded-2xl bg-gradient-to-br ${t.border} transition-transform hover:scale-105 z-10 ${t.rotate} ${t.offsetY} mb-12 mt-24`}
            >
              <div className="bg-gradient-to-br from-[#19122B] to-[#0F1021] backdrop-blur-lg rounded-xl h-full flex flex-col justify-between p-7">
                <div
                  className={`absolute -top-6 left-7 bg-gradient-to-r ${t.border} text-white rounded-full w-10 h-10 flex items-center justify-center text-3xl shadow-lg`}
                >
                  &ldquo;
                </div>
                <p className="text-white/90 text-[1.08rem] leading-relaxed mb-6 flex-grow hind">
                  {t?.review}
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <Image
                    src={t?.reviewPersonImg || "https://via.placeholder.com/150"}
                    alt={t?.personName}
                    className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                    width={40}
                    height={40}
                  />
                  <div>
                    <div className="font-bold text-white">{t.personName}</div>
                    <div className="text-white/70 text-sm">
                      {t?.location} &bull; {t?.date}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Marquee>
    </div>
  );
};

export default BestReviews;
