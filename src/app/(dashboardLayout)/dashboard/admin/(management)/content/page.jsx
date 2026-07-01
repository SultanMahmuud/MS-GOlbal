'use client'
import Achievement from "@/components/AdminDashboard/AdminConent/AdminContent";
import ComingSoon from "@/components/AdminDashboard/AdminConent/CommingSoon";
import PopulerSubjectsModel from "@/components/AdminDashboard/AdminConent/Plans/PopulerSubjectsModel";
import PopulerSubjectsModelBangla from "@/components/AdminDashboard/AdminConent/Plans/PopulerSubjectsModelBangla";
import PricingSection from "@/components/AdminDashboard/AdminConent/PriceSection";


const ContentContainer = () => {
  const heading = 'font-semibold text-lg md:text-xl mb-2 font-hind';
  const light = 'font-medium text-sm md:text-base font-hind';
  const layout = 'flex items-center gap-2';
  const inputTitle = 'bg-white shadow text-base capitalize';
  const card = 'bg-white shadow-md p-4 rounded-lg mb-4';

  return (
    <div className="p-4">
      <div className={card}>
        <Achievement
          heading={heading}
          light={light}

          lay={layout}
          inputTitle={inputTitle}
        />
      </div>

      <div className={card}>
        <ComingSoon
          heading={heading}
          light={light}
   
          lay={layout}
          inputTitle={inputTitle}
        />
      </div>

      <div className={card}>
        <PricingSection />
      </div>

      <div className={card}>
        <PopulerSubjectsModel />
      </div>

      <div className={card}>
        <PopulerSubjectsModelBangla />
      </div>

    
    </div>
  );
};

export default ContentContainer;
