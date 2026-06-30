"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/UI/dialog";
import { Button } from "@/components/UI/button";
import { toast } from "sonner";
import CommonFileUpload from "@/components/Shared/FileUpload/CommonFileUpload";

const suggestTopics = [{ title: "ReviewPage" }, { title: "HomePage" }];

const FeedbackUpdate = ({ itemId }) => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [reviewPersonImg, setReviewPersonImg] = useState("");
  const [open, setOpen] = useState(false);

  // 1. Fetch initial data and populate form
  useEffect(() => {
    if (itemId && open) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/reviews/getReview/${itemId}`
      )
        .then((res) => res.json())
        .then((data) => {
          reset(data); // populates text fields
          setReviewPersonImg(data?.reviewPersonImg || ""); // sets local state for uploader
        })
        .catch((err) => console.error("Error fetching review:", err));
    }
  }, [itemId, open, reset]);

  // 2. CRITICAL: Sync the uploader state with React Hook Form
  // Whenever reviewPersonImg changes (via upload), update the form value
  useEffect(() => {
    setValue("reviewPersonImg", reviewPersonImg);
  }, [reviewPersonImg, setValue]);

  const onSubmit = (formData) => {
    axios
      .put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/reviews/${itemId}`,
        formData
      )
      .then(() => {
        toast.success("Feedback updated successfully");
        setOpen(false);
        // Better than reload: window.location.reload(); 
        // Or use a router.refresh() if using Next.js App Router
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
        toast.error("Something went wrong");
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-[#1B4D89] text-white">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Edit Feedback</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Select Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1">
              তোমার ফিডব্যাকের পেজ সিলেক্ট করো
            </label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2"
              {...register("showPage", { required: true })}
            >
              <option value="">Select a page</option>
              {suggestTopics.map((element, index) => (
                <option key={index} value={element.title}>
                  {element.title}
                </option>
              ))}
            </select>
          </div>

          {/* Text fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="w-full border border-gray-300 rounded px-3 py-2"
              type="text"
              placeholder="Person Name"
              {...register("personName", { required: true })}
            />
            <input
              className="w-full border border-gray-300 rounded px-3 py-2"
              type="text"
              placeholder="Batch Name"
              {...register("batchName", { required: true })}
            />
            <input
              className="w-full border border-gray-300 rounded px-3 py-2"
              type="text"
              placeholder="Location"
              {...register("location", { required: true })}
            />
            <input
              className="w-full border border-gray-300 rounded px-3 py-2"
              type="text"
              placeholder="Rating"
              {...register("rating", { required: true })}
            />
          </div>

          <textarea
            rows={4}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Review"
            {...register("review", { required: true })}
          />

          {/* Image Upload Integration */}
          <div className="bg-gray-50 p-3 rounded-md border border-dashed border-gray-300">
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Update Reviewer Image
            </label>
            <CommonFileUpload
              url={reviewPersonImg}
              setUrl={setReviewPersonImg}
              label="Reviewer Photo"
            />
            {reviewPersonImg && (
               <p className="text-[10px] text-gray-500 mt-1 truncate">
                 Current Path: {reviewPersonImg}
               </p>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#FCB23F] text-black hover:bg-[#e5a139]"
            >
              Update Feedback
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackUpdate;