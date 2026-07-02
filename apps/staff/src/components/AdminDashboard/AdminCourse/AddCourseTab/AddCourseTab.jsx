import { useState } from "react";

 const AddCourseTab = ({ com1, com3, com4, com5, com6, com7, com8, com9 }) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: "Description", component: com1 },
    { label: "FAQ", component: com3 },
    { label: "Pay", component: com4 },
    { label: "Announcement", component: com5 },
    { label: "What Learn", component: com6 },
    { label: "What You Get", component: com7 },
    { label: "For Whom", component: com8 },
    { label: "Why Choose", component: com9 },
  ];

  return (
    <div className="w-full">
      <div className="flex gap-1 border-b border-slate-200 mb-4 overflow-x-auto bg-slate-50/80 rounded-t-lg px-1 pt-1">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-3 py-2 text-sm whitespace-nowrap rounded-t-md transition-colors duration-200 ${
              activeTab === index
                ? "border-b-2 border-emerald-500 text-emerald-700 font-medium bg-white"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4">{tabs[activeTab]?.component}</div>
    </div>
  );
};

export default AddCourseTab