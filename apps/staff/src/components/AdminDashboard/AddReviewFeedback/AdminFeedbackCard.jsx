'use client';

import React, { useState } from 'react';
import axios from 'axios';
import FeedbackUpdate from './FeedBackUpdate';
import { Star, Trash2, Calendar, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

const PAGE_BADGE_STYLES = {
  ReviewPage: 'bg-teal-50 text-teal-700 border-teal-100',
  HomePage: 'bg-violet-50 text-violet-700 border-violet-100',
  CoursePage: 'bg-sky-50 text-sky-700 border-sky-100',
  default: 'bg-slate-50 text-slate-600 border-slate-100',
};

const AdminFeedbackCard = ({ reviews, setIsLoading }) => {
  const [expandedCards, setExpandedCards] = useState({});

  const handleDelete = (id) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return;
    axios
      .delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/reviews/getReview/${id}`)
      .then(() => {
        toast.success('Review deleted successfully');
        setIsLoading(true);
      })
      .catch(() => {
        toast.error('Failed to delete review');
      });
  };

  const toggleExpand = (id) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Generate a deterministic gradient from a name string
  const getAvatarGradient = (name) => {
    const gradients = [
      'from-emerald-400 to-teal-500',
      'from-violet-400 to-purple-500',
      'from-amber-400 to-orange-500',
      'from-sky-400 to-blue-500',
      'from-rose-400 to-pink-500',
      'from-lime-400 to-green-500',
      'from-fuchsia-400 to-pink-500',
      'from-cyan-400 to-teal-500',
    ];
    const hash = (name || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return gradients[hash % gradients.length];
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {reviews?.map((item) => {
        const isExpanded = expandedCards[item._id];
        const reviewText = item?.review || '';
        const isLong = reviewText.length > 200;
        const badgeStyle = PAGE_BADGE_STYLES[item?.showPage] || PAGE_BADGE_STYLES.default;
        const ratingVal = Number(item?.rating) || 5;

        return (
          <div
            key={item._id}
            className="group bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col overflow-hidden relative"
          >
            {/* Page Destination Badge in Top Right */}
            <span className={`absolute top-4 right-4 inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${badgeStyle}`}>
              {item?.showPage || 'Landing'}
            </span>

            {/* ── Card Body ── */}
            <div className="p-5 flex-1 flex flex-col pt-6">
              {/* Header: Avatar + Star Rating + Name + Batch */}
              <div className="flex items-start gap-3.5 mb-4">
                <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 ring-2 ring-slate-100">
                  {item?.reviewPersonImg ? (
                    <img
                      src={item.reviewPersonImg}
                      alt={item.personName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${getAvatarGradient(item?.personName)} text-white font-bold text-lg`}>
                      {item?.personName?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                </div>
                
                <div className="min-w-0 flex-1">
                  {/* Dynamic Stars Displayed ABOVE the Name */}
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const starVal = i + 1;
                        const isHalf = ratingVal === starVal - 0.5;
                        const isFull = ratingVal >= starVal;
                        return (
                          <span key={i} className="text-amber-400">
                            {isFull ? (
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            ) : isHalf ? (
                              <div className="relative w-3.5 h-3.5 inline-block">
                                <Star className="w-3.5 h-3.5 absolute top-0 left-0 text-slate-200" />
                                <Star className="w-3.5 h-3.5 absolute top-0 left-0 fill-amber-400 text-amber-400" style={{ clipPath: 'inset(0 50% 0 0)' }} />
                              </div>
                            ) : (
                              <Star className="w-3.5 h-3.5 text-slate-200" />
                            )}
                          </span>
                        );
                      })}
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">
                      {ratingVal.toFixed(1)}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-800 text-[15px] truncate leading-snug pr-16">
                    {item?.personName}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
                    {item?.batchName || 'Student'}
                  </p>
                </div>
              </div>

              {/* Review Text */}
              <div className="flex-1 mt-2">
                <p className="text-slate-600 text-[13px] font-medium leading-relaxed">
                  &ldquo;{isLong && !isExpanded ? `${reviewText.slice(0, 200)}...` : reviewText}&rdquo;
                </p>
                {isLong && (
                  <button
                    onClick={() => toggleExpand(item._id)}
                    className="flex items-center gap-1 text-emerald-600 text-xs font-semibold mt-2 hover:text-emerald-700 transition-colors cursor-pointer"
                  >
                    {isExpanded ? (
                      <>Show less <ChevronUp className="w-3 h-3" /></>
                    ) : (
                      <>Read more <ChevronDown className="w-3 h-3" /></>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* ── Card Footer ── */}
            <div className="px-5 py-3.5 border-t border-slate-50 bg-slate-50/50 flex items-center justify-between">
              {/* Meta info */}
              <div className="flex flex-col gap-1 text-[11px] text-slate-400 font-medium min-w-0">
                {item?.location && (
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  <span>{item?.updatedAt?.split('T')[0]}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
                <FeedbackUpdate itemId={item?._id} />
                <button
                  onClick={() => handleDelete(item?._id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer text-xs font-semibold"
                  title="Delete Feedback"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminFeedbackCard;
