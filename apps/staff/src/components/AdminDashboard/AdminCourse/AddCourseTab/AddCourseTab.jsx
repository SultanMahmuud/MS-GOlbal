import { useState } from "react";

 const AddCourseTab = ({ com1, com2, com3, com4, com5, com6, com7, com8, com9 }) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: "Description", component: com1 },
    { label: "Curriculum", component: com2 },
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
      <div className="flex border-b mb-4 overflow-x-auto">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 whitespace-nowrap ${
              activeTab === index
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4">{tabs[activeTab].component}</div>
    </div>
  );
};

export default AddCourseTab