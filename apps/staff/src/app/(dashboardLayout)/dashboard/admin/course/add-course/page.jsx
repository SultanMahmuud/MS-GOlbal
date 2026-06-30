"use client";

import dynamic from "next/dynamic";
import React from "react";

const AddCourse = dynamic(() => import('@/components/AdminDashboard/AdminCourse/AddCourse'), {
  ssr: false,
});

const Page = () => {
  return (
    <div>
      <AddCourse />
    </div>
  );
};

export default Page;
