"use client";

import { skipToken } from "@reduxjs/toolkit/query";
import React, { useMemo } from "react";
import { useFetchResourceQuery } from "@/redux/api/curd";
import { courseRoutes } from "@/constants/end-point";
import { tagTypes } from "@/redux/tag-types";
import CheckoutStepper from "@/components/AllPages/Checkout/CheckoutStepper";

export default function Checkout({ params }) {
  const { checkoutID } = React.use(params);

  const validId = checkoutID && checkoutID.trim().length >= 5;

  // ✅ Stable query args with tags
  const queryArgs = useMemo(() => {
    return validId
      ? { 
          url: courseRoutes.getById(checkoutID),
          tags: tagTypes.course // <-- tag for caching
        }
      : skipToken;
  }, [validId, checkoutID]);

  const { data: singleCourse, isLoading, error } = useFetchResourceQuery(queryArgs, {
    skip: !validId,
  });

  if (!validId) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Invalid course ID.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
      <div className="text-3xl font-bold mb-4">
        <span className="text-primary">Muslim </span>
        <span>School</span>
      </div>
     
    </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error loading course details.
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="flex-1 max-w-6xl mx-auto py-8">
        {singleCourse?.data ? (
         <CheckoutStepper courseData={singleCourse.data} />
        ) : (
          <p className="text-gray-400">No course details available.</p>
        )}
      </main>
    </div>
  );
}
