'use client';

import React, { useEffect, useState, useMemo } from 'react';
import AdminFeedbackCard from './AdminFeedbackCard';
import { Star, MessageSquarePlus, Search, SlidersHorizontal, BarChart3, Eye } from 'lucide-react';
import Link from 'next/link';

const AllFeedback = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageFilter, setPageFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/reviews/getReview`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data?.reverse());
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [isLoading]);

  // Computed stats
  const stats = useMemo(() => {
    if (!reviews?.length) return { total: 0, avgRating: 0, reviewPage: 0, homePage: 0, coursePage: 0 };
    const total = reviews.length;
    const avgRating = (reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / total).toFixed(1);
    const reviewPage = reviews.filter(r => r.showPage === 'ReviewPage').length;
    const homePage = reviews.filter(r => r.showPage === 'HomePage').length;
    const coursePage = reviews.filter(r => r.showPage === 'CoursePage').length;
    return { total, avgRating, reviewPage, homePage, coursePage };
  }, [reviews]);

  // Filtered & sorted reviews
  const filteredReviews = useMemo(() => {
    let result = reviews || [];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r =>
        r.personName?.toLowerCase().includes(q) ||
        r.review?.toLowerCase().includes(q) ||
        r.location?.toLowerCase().includes(q)
      );
    }

    // Page filter
    if (pageFilter !== 'all') {
      result = result.filter(r => r.showPage === pageFilter);
    }

    // Sort
    if (sortBy === 'oldest') {
      result = [...result].reverse();
    } else if (sortBy === 'rating-high') {
      result = [...result].sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    } else if (sortBy === 'rating-low') {
      result = [...result].sort((a, b) => (Number(a.rating) || 0) - (Number(b.rating) || 0));
    }

    return result;
  }, [reviews, searchQuery, pageFilter, sortBy]);

  // Skeleton card
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl p-6 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-14 h-14 rounded-full bg-slate-200" />
        <div className="flex-1">
          <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-slate-100 rounded w-1/2" />
        </div>
      </div>
      <div className="flex gap-1 mb-4">
        {[1,2,3,4,5].map(i => <div key={i} className="w-4 h-4 bg-slate-200 rounded" />)}
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-5/6" />
        <div className="h-3 bg-slate-100 rounded w-2/3" />
      </div>
    </div>
  );

  return (
    <div className="py-6 px-2 sm:px-4">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquarePlus className="w-6 h-6 text-emerald-600" />
            Student Reviews
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage testimonials displayed on your landing pages
          </p>
        </div>
        <Link
          href="/dashboard/admin/add-review/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-emerald-600/15 active:scale-[0.97]"
        >
          <MessageSquarePlus className="w-4 h-4" />
          Add Review
        </Link>
      </div>

      {/* ── Stats Cards ── */}
      {!isLoading && reviews?.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              </div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Avg Rating</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats.avgRating}<span className="text-sm text-slate-400 font-normal">/5</span></p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                <Eye className="w-4 h-4 text-teal-600" />
              </div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Review Page</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats.reviewPage}</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                <Eye className="w-4 h-4 text-violet-600" />
              </div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Home Page</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats.homePage}</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center">
                <Eye className="w-4 h-4 text-sky-600" />
              </div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Course Page</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats.coursePage}</p>
          </div>
        </div>
      )}

      {/* ── Search & Filters ── */}
      {!isLoading && reviews?.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, review, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
            />
          </div>

          {/* Page filter */}
          <div className="relative">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={pageFilter}
              onChange={(e) => setPageFilter(e.target.value)}
              className="pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Pages</option>
              <option value="ReviewPage">Review Page</option>
              <option value="HomePage">Home Page</option>
              <option value="CoursePage">Course Page</option>
            </select>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all appearance-none cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="rating-high">Rating: High → Low</option>
            <option value="rating-low">Rating: Low → High</option>
          </select>
        </div>
      )}

      {/* ── Loading Skeletons ── */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* ── Empty State ── */}
      {!isLoading && reviews?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-5">
            <MessageSquarePlus className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-700 mb-1">No reviews yet</h3>
          <p className="text-slate-400 text-sm mb-6 max-w-xs">
            Student testimonials will appear here once you add them.
          </p>
          <Link
            href="/dashboard/admin/add-review/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-all"
          >
            <MessageSquarePlus className="w-4 h-4" />
            Add First Review
          </Link>
        </div>
      )}

      {/* ── No Search Results ── */}
      {!isLoading && reviews?.length > 0 && filteredReviews.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search className="w-10 h-10 text-slate-300 mb-3" />
          <h3 className="text-lg font-bold text-slate-700 mb-1">No matching reviews</h3>
          <p className="text-slate-400 text-sm">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* ── Review Cards ── */}
      {!isLoading && filteredReviews.length > 0 && (
        <AdminFeedbackCard reviews={filteredReviews} setIsLoading={setIsLoading} />
      )}
    </div>
  );
};

export default AllFeedback;
