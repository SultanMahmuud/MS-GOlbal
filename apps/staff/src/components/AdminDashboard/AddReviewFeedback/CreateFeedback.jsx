'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Star, MessageSquarePlus, ChevronDown } from 'lucide-react';
import CommonFileUpload from '@/components/Shared/FileUpload/CommonFileUpload';
import { getApiBaseUrl } from '@/lib/brand-config';

const suggestTopics = [{ title: 'ReviewPage' }, { title: 'HomePage' }, { title: 'CoursePage' }];

const Feedback = () => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [showPage, setShowPage] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [reviewPersonImg, setreviewPersonImg] = useState('');
  const [rating, setRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [loading, setLoading] = useState(false);

  const API_BASE = getApiBaseUrl();

  const onSubmit = (data) => {
    setLoading(true);
    const newData = {
      ...data,
      rating: Number(rating),
      reviewPersonImg,
      showPage,
    };

    axios
      .post(`${API_BASE}/api/v1/reviews/createReview`, newData)
      .then(() => {
        toast.success('Feedback entry added successfully!');
        reset();
        setShowPage('');
        setreviewPersonImg('');
        setRating(5);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Failed to save feedback entry');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const inputStyles =
    "w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm";
  const labelStyles = "text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5";

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Create Student Feedback</h1>
        <p className="text-slate-500 text-sm mt-1">Add new testimonial feedback for course landing pages.</p>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Select Page Target */}
          <div>
            <label className={labelStyles}>Display Page Destination</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-left text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all flex items-center justify-between cursor-pointer"
              >
                <span className={showPage ? "text-slate-800 font-semibold" : "text-slate-400"}>
                  {showPage || "Select display location"}
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
                          setShowPage(element.title);
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

          {/* Form details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelStyles}>Person Name *</label>
              <input 
                placeholder="e.g. Sayeeda Khanom" 
                className={inputStyles}
                {...register('personName', { required: true })} 
              />
            </div>
            <div>
              <label className={labelStyles}>Batch / Course Label</label>
              <input 
                placeholder="e.g. Quran Hifz Batch 3" 
                className={inputStyles}
                {...register('batchName')} 
              />
            </div>
            <div className="col-span-2">
              <label className={labelStyles}>Location</label>
              <input 
                placeholder="e.g. Dhaka, Bangladesh" 
                className={inputStyles}
                {...register('location')} 
              />
            </div>
            <div className="col-span-2">
              <label className={labelStyles}>Testimonial Review Text *</label>
              <textarea 
                placeholder="Write the student feedback here..." 
                className={inputStyles}
                {...register('review', { required: true })} 
                rows={4} 
              />
            </div>
          </div>

          {/* Interactive Star Rating Selector */}
          <div>
            <label className={labelStyles}>Star Rating ({rating.toFixed(1)}/5)</label>
            <div className="flex gap-1 mt-1">
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
                      className="w-3.5 h-7 overflow-hidden focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                      title={`${starIndex - 0.5} Stars`}
                    >
                      <Star
                        className={`w-7 h-7 -mr-3.5 ${
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
                      className="w-3.5 h-7 overflow-hidden focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                      title={`${starIndex} Stars`}
                    >
                      <Star
                        className={`w-7 h-7 -ml-3.5 ${
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

          {/* Image Upload */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <label className={labelStyles}>Student Photo</label>
            <div className="border border-slate-100 bg-slate-50/50 rounded-xl p-4">
              <CommonFileUpload url={reviewPersonImg} setUrl={setreviewPersonImg} />
            </div>
          </div>

          {/* Submit */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-600/10 active:scale-[0.98] cursor-pointer text-sm"
          >
            {loading ? 'Adding...' : 'Add Testimonial Entry'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
