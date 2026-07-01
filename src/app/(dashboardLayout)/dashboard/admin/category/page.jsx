"use client";

import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/UI/tabs";
import CourseCategory from "@/components/AdminDashboard/Category/CourseCategory";
import BatchCategory from "@/components/AdminDashboard/Category/BatchCategory";
import LibraryCategary from "@/components/AdminDashboard/Category/LibraryCategory";
import BlogCategary from "@/components/AdminDashboard/Category/BlogCategory";
import FAQCategory from "@/components/AdminDashboard/Category/FaqCategory";


const Category = () => {
  return (
    <div className="w-full mt-0">
      <TabBar />
    </div>
  );
};

export default Category;

const TabBar = () => {
  const featured = "text-center text-gray-700 py-2 my-2 font-medium";
  const texteld =
    "w-full mx-auto font-semibold shadow bg-white mt-0 mb-0 font-inter";
  const button_form =
    "w-full border-none my-1 py-2.5 px-4 rounded font-inter text-sm tracking-wide bg-yellow-500 text-white hover:bg-yellow-500 hover:text-black transition-transform cursor-pointer";
  const featured__vis = "flex justify-around items-center font-inter";

  return (
    <Tabs defaultValue="1" className="w-full">
      <TabsList className="bg-primary rounded-sm p-0 h-9 flex justify-start overflow-x-auto text-black mt-4">
        <TabsTrigger value="1" className="text-sm h-9 px-4">
          Course
        </TabsTrigger>
        <TabsTrigger value="2" className="text-sm h-9 px-4">
          Batch
        </TabsTrigger>
        <TabsTrigger value="3" className="text-sm h-9 px-4">
          Library
        </TabsTrigger>
        <TabsTrigger value="4" className="text-sm h-9 px-4">
          Blog
        </TabsTrigger>
        <TabsTrigger value="5" className="text-sm h-9 px-4">
          FAQ
        </TabsTrigger>
      </TabsList>

      <TabsContent value="1" className="p-0 mt-2 rounded-sm">
        <div className="pl-0 py-4 rounded-sm">
          <CourseCategory
            featured={featured}
            texteld={texteld}
            featured__vis={featured__vis}
            button_form={button_form}
          />
        </div>
      </TabsContent>

      <TabsContent value="2" className="p-0 mt-2 rounded-sm">
        <div className="pl-0 py-4 rounded-sm">
          <BatchCategory
            featured={featured}
            texteld={texteld}
            featured__vis={featured__vis}
            button_form={button_form}
          />
        </div>
      </TabsContent>

      <TabsContent value="3" className="p-0 mt-2 rounded-sm">
        <div className="pl-0 py-4 rounded-sm">
          <LibraryCategary
            featured={featured}
            texteld={texteld}
            featured__vis={featured__vis}
            button_form={button_form}
          />
        </div>
      </TabsContent>

      <TabsContent value="4" className="p-0 mt-2 rounded-sm">
        <div className="pl-0 py-4 rounded-sm">
          <BlogCategary
            featured={featured}
            texteld={texteld}
            featured__vis={featured__vis}
            button_form={button_form}
          />
        </div>
      </TabsContent>

      <TabsContent value="5" className="p-0 mt-2 rounded-sm">
        <div className="pl-0 py-4 rounded-sm">
          <FAQCategory
            featured={featured}
            texteld={texteld}
            featured__vis={featured__vis}
            button_form={button_form}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
};
