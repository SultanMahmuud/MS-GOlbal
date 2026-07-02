"use client";

import React, { useState } from "react";
import CourseCategory from "@/components/AdminDashboard/Category/CourseCategory";
import BatchCategory from "@/components/AdminDashboard/Category/BatchCategory";
import LibraryCategory from "@/components/AdminDashboard/Category/LibraryCategory";
import BlogCategory from "@/components/AdminDashboard/Category/BlogCategory";
import FAQCategory from "@/components/AdminDashboard/Category/FaqCategory";
import { FolderKanban, BookOpen, Layers, MessageSquare, HelpCircle } from "lucide-react";

const Category = () => {
  const [activeTab, setActiveTab] = useState("course");

  const tabItems = [
    { id: "course", label: "Course Categories", icon: FolderKanban },
    { id: "batch", label: "Batch Categories", icon: Layers },
    { id: "library", label: "Library Categories", icon: BookOpen },
    { id: "blog", label: "Blog Categories", icon: MessageSquare },
    { id: "faq", label: "FAQ Categories", icon: HelpCircle }
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Category settings</h1>
        <p className="text-slate-500 text-sm mt-1">Configure taxonomies and categories across various sections of the platform.</p>
      </div>

      {/* Tabs list */}
      <div className="flex border border-slate-100 rounded-xl bg-slate-50 p-1 w-full md:w-fit overflow-x-auto scrollbar-none gap-1 shadow-sm shrink-0">
        {tabItems.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-lg transition-all shrink-0 cursor-pointer ${
                isActive 
                  ? "bg-emerald-600 text-white shadow-sm" 
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              <TabIcon className="w-4 h-4 shrink-0" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm min-h-[300px]">
        {activeTab === "course" && <CourseCategory />}
        {activeTab === "batch" && <BatchCategory />}
        {activeTab === "library" && <LibraryCategory />}
        {activeTab === "blog" && <BlogCategory />}
        {activeTab === "faq" && <FAQCategory />}
      </div>
    </div>
  );
};

export default Category;
