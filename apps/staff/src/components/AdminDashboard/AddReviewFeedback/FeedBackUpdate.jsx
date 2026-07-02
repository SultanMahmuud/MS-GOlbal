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
  DialogDescription,
} from "@/components/UI/dialog";
import { Button } from "@/components/UI/button";
import { toast } from "sonner";
import { Star, Pencil, ImagePlus, X, Loader2, ChevronDown } from "lucide-react";
import CommonFileUpload from "@/components/Shared/FileUpload/CommonFileUpload";
import { getApiBaseUrl } from "@/lib/brand-config";

const suggestTopics = [{ title: "ReviewPage" }, { title: "HomePage" }, { title: "CoursePage" }];

const FeedbackUpdate = ({ itemId }) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const [reviewPersonImg, setReviewPersonImg] = useState("");
  const [open, setOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [saving, setSaving] = useState(false);

  const showPage = watch("showPage");

  // Fetch initial data and populate form
  useEffect(() => {
    if (itemId && open) {
      fetch(
        `${getApiBaseUrl()}/api/v1/reviews/getReview/${itemId}`
      )
        .then((res) => res.json())
        .then((data) => {
          reset(data);
          setReviewPersonImg(data?.reviewPersonImg || "");
          setRating(Number(data?.rating) || 5);
        })
        .catch((err) => console.error("Error fetching review:", err));
    }
  }, [itemId, open, reset]);

  // Sync the uploader state with React Hook Form
  useEffect(() => {
    setValue("reviewPersonImg", reviewPersonImg);
  }, [reviewPersonImg, setValue]);

  // Sync rating with form
  useEffect(() => {
    setValue("rating", rating);
  }, [rating, setValue]);

  const onSubmit = async (formData) => {
    setSaving(true);
    try {
      await axios.put(
        `${getApiBaseUrl()}/api/v1/reviews/${itemId}`,
        { ...formData, rating: Number(rating) }
      );
      toast.success("Feedback updated successfully");
      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const inputStyles =
    "w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all text-sm";
  const labelStyles =
    "text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer text-xs font-semibold">
          <Pencil className="w-3.5 h-3.5" />
          Edit
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-800">Edit Feedback</DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Update the testimonial details below. Changes will be reflected on the selected page.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-2">
          {/* Page Destination */}
          <div>
            <label className={labelStyles}>Display Page</label>
            <input type="hidden" {...register("showPage", { required: true })} />
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-left text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all flex items-center justify-between cursor-pointer"
              >
                <span className={showPage ? "text-slate-800 font-semibold" : "text-slate-400"}>
                  {showPage || "Select a page"}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsDropdownOpen(false)} />
                  <div className="absolute z-40 w-full mt-1.5 bg-white border border-slate-100 rounded-xl shadow-lg overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                    {suggestTopics.map((element, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          setValue("showPage", element.title);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-slate-50 flex items-center justify-between ${
                          showPage === element.title ? "bg-slate-50/80 text-emerald-600 font-bold" : "text-slate-700"
                        }`}
                      >
                        <span>{element.title}</span>
                        {showPage === element.title && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Person Name + Batch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelStyles}>Person Name *</label>
              <input
                className={inputStyles}
                type="text"
                placeholder="e.g. Sayeeda Khanom"
                {...register("personName", { required: true })}
              />
            </div>
            <div>
              <label className={labelStyles}>Batch / Course Label</label>
              <input
                className={inputStyles}
                type="text"
                placeholder="e.g. Quran Hifz Batch 3"
                {...register("batchName")}
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className={labelStyles}>Location</label>
            <input
              className={inputStyles}
              type="text"
              placeholder="e.g. Dhaka, Bangladesh"
              {...register("location")}
            />
          </div>

          {/* Interactive Star Rating */}
          <div>
            <label className={labelStyles}>Star Rating ({rating.toFixed(1)}/5)</label>
            <div className="flex gap-1.5 mt-1">
              {[1, 2, 3, 4, 5].map((starIndex) => {
                const isHalf = rating === starIndex - 0.5;
                const isFull = rating >= starIndex;
                const hoverHalf = hoveredStar === starIndex - 0.5;
                const hoverFull = hoveredStar >= starIndex;

                const activeHalf = hoveredStar > 0 ? hoverHalf : isHalf;
                const activeFull = hoveredStar > 0 ? hoverFull : isFull;

                return (
                  <div key={starIndex} className="relative flex items-center justify-center">
                    {/* Left half clickable for .5 */}
                    <button
                      type="button"
                      onClick={() => setRating(starIndex - 0.5)}
                      onMouseEnter={() => setHoveredStar(starIndex - 0.5)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="w-4 h-8 overflow-hidden focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                      title={`${starIndex - 0.5} Stars`}
                    >
                      <Star
                        className={`w-8 h-8 -mr-4 ${
                          activeFull || activeHalf
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-200"
                        }`}
                        style={{ clipPath: "inset(0 50% 0 0)" }}
                      />
                    </button>
                    {/* Right half clickable for whole number */}
                    <button
                      type="button"
                      onClick={() => setRating(starIndex)}
                      onMouseEnter={() => setHoveredStar(starIndex)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="w-4 h-8 overflow-hidden focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                      title={`${starIndex} Stars`}
                    >
                      <Star
                        className={`w-8 h-8 -ml-4 ${
                          activeFull
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-200"
                        }`}
                        style={{ clipPath: "inset(0 0 0 50%)" }}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className={labelStyles}>Review Text *</label>
            <textarea
              rows={4}
              className={inputStyles}
              placeholder="Write the student feedback here..."
              {...register("review", { required: true })}
            />
          </div>

          {/* Image Upload Section */}
          <div className="border border-slate-100 bg-slate-50/50 rounded-xl p-4 space-y-3">
            <label className={labelStyles}>
              <ImagePlus className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
              Reviewer Photo
            </label>

            {/* Current image preview */}
            {reviewPersonImg && (
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                  <img
                    src={reviewPersonImg}
                    alt="Current reviewer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-500 truncate">{reviewPersonImg.split('/').pop()}</p>
                  <button
                    type="button"
                    onClick={() => setReviewPersonImg("")}
                    className="text-xs text-rose-500 hover:text-rose-600 font-medium mt-1 flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3 h-3" /> Remove
                  </button>
                </div>
              </div>
            )}

            <CommonFileUpload
              url={reviewPersonImg}
              setUrl={setReviewPersonImg}
              label="Upload New Photo"
            />
          </div>

          <DialogFooter className="pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="text-slate-500"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackUpdate;
