import BestReviews from "@/components/AllPages/Homepage/BestReviews/BestReviews";
import FAQ from "@/components/AllPages/Homepage/Faq/Faq";
import HeroSection from "@/components/AllPages/Homepage/HeroSection/HeroSection";
import HowToGetStart from "@/components/AllPages/Homepage/HowToStart/HowToStart";
import MostPopularCourses from "@/components/AllPages/Homepage/MostPopularCourses/MostPopularCourses";
import OurAchivements from "@/components/AllPages/Homepage/OurAchivements/OurAchivements";
import OurServiceSection from "@/components/AllPages/Homepage/OurServiceSection/OurServiceSection";
import PopularSubjects from "@/components/AllPages/Homepage/PopularSubjects/PopularSubjects";
import RecentAdmitStudent from "@/components/AllPages/Homepage/RecentAdmitStudent/RecentAdmitStudent";
import StartLearningIslam from "@/components/AllPages/Homepage/StartLearingIslam/StartLearningIslam";
import AwsomeTeachers from "@/components/AllPages/Homepage/AwsomeTeachers/AwsomeTeachers";

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <MostPopularCourses />
      <PopularSubjects />

      <StartLearningIslam />
      <AwsomeTeachers />
      <RecentAdmitStudent />
      <OurAchivements />
      <BestReviews />
      <HowToGetStart />
      <FAQ />
      <OurServiceSection />
    </>
  );
};

export default HomePage;
