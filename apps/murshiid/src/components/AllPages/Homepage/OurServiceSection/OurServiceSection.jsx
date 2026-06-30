
import LearningPlans from "./LearningPlans";

const OurServiceSection = () => {

  
  return (
    <section className="max-w-6xl mx-auto px-4 lg:py-10">
      <div className="text-center mb-12">
        <h2 className="text-[26px] lg:text-3xl font-extrabold text-gray-900">
        আমরা  <span className="text-primary">৩ ধরণের</span> <br className="lg:hidden block"/>লার্নিং প্ল্যান অফার করি
        </h2>
        <p className="text-center  text-[18px] font-medium base2 mt-2 mb-6 hind">
          আপনি যেকোনো একটি সিলেক্ট করে আনন্দের সাথে
        </p>
      </div>

      <LearningPlans/>
    </section>
  );
};

export default OurServiceSection;
