import { MdOutlineDoubleArrow } from "react-icons/md";
import engImg from "@/assets/Logo/Bannar/Bannar.jpg";
import Image from "next/image";
import { Button } from "@/components/UI/button";
import Link from "next/link";


const HeroSection = () => {
  return (
    <>
      <div className="mb-6">
        <div className="max-w-7xl mx-auto bg-[#faf9f7] p-12 rounded-lg">
          {/* for mobile devide image on the top and text on ther bottom */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
            {/* For mobile, show image first */}
            <div className="block md:hidden mb-6">
              <Image
              width={100}
              height={100}
                src={engImg}
                alt="Banner"
                className="w-full h-auto max-h-[450px] object-contain pt-4"
              />
            </div>
            {/* For desktop, show text first */}
            <div className="md:order-1 text-center lg:text-start">
              <p className="text-primary lg:text-xl font-bold  mb-2 text-[16px]">
                সহজ উপায়ে উন্নত মানের দ্বীনি শিক্ষা।
              </p>
              <h2 className="base1 lg:text-[36px] text-[24px] font-bold lg:font-extrabold leading-tight">
                দ্বীন শেখার নতুন দুনিয়ায়
                <br />
                আপনাকে স্বাগতম
              </h2>
              <p className="base2 font-semibold lg:text-[20px] mb-8 text-[16px]">
                সহজ উপায়ে উন্নত মানের দ্বীনি শিক্ষা নিয়ে
                <br />
                আমরা আছি আপনার পাশে, শিখুন প্রাণ খুলে।
              </p>
              <div className="flex gap-4 sm:flex-wrap mx-auto justify-center lg:justify-start">
                <Link href="/trial-class">
                  <Button className="banner-button-1 font-bold">
                    ফ্রি ক্লাস
                    <MdOutlineDoubleArrow className="text-xl" />
                  </Button>
                </Link>
                <Link href="/student-registration">
                  <Button className="banner-button-2">
                   এখনই ভর্তি হোন

                    <MdOutlineDoubleArrow className="text-xl" />
                  </Button>
                </Link>
              </div>
            </div>
            {/* For desktop, show image second */}
            <div className="hidden md:block md:order-2">
              <Image
              width={500}
              height={100}
                src={engImg}
                alt="Banner"
                className="w-full h-auto max-h-[450px] object-contain pt-4"
              />
            </div>
          </div>
          </div>
         
        </div>
   
    </>
  );
};

export default HeroSection;
