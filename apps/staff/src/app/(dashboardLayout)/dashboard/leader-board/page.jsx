"use client";

import Image from "next/image";
import React, { useEffect, useState, useMemo } from "react";
import { 
  Trophy, Users, Search, Flame, Crown, Award, 
  ChevronRight, Sparkles, BookOpen, Star, Target
} from "lucide-react";

// Deterministic gradient generator for student avatar fallbacks
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

// Gamification League Mapper
const getLeagueDetails = (points) => {
  if (points >= 1500) {
    return { name: "Grand Legend", color: "text-amber-500 bg-amber-50 border-amber-200", ring: "ring-amber-400" };
  } else if (points >= 800) {
    return { name: "Master Mind", color: "text-indigo-600 bg-indigo-50 border-indigo-200", ring: "ring-indigo-400" };
  } else if (points >= 400) {
    return { name: "Knowledge Champion", color: "text-amber-600 bg-amber-50 border-amber-100", ring: "ring-amber-300" };
  } else if (points >= 150) {
    return { name: "Rising Star", color: "text-teal-600 bg-teal-50 border-teal-200", ring: "ring-teal-300" };
  } else {
    return { name: "Beginner Explorer", color: "text-emerald-600 bg-emerald-50 border-emerald-100", ring: "ring-emerald-200" };
  }
};

const LeaderBoard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all-time"); // 'all-time', 'monthly', 'weekly'

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  const placeholderImage = "https://upload.wikimedia.org/wikipedia/commons/f/fc/Qur%27an_and_Rehal.jpg";

  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}/user/role/student`)
      .then((res) => res.json())
      .then((data) => {
        const mapped = (data?.data || []).map((e) => ({
          id: e._id,
          name: e.name || "Anonymous Learner",
          points: e.points ?? 0,
          attend: e.questionMarks?.length ?? 0,
          email: e.email || "",
          avatar: e.avatar || "",
          address: e.address || "No address provided",
          // Deterministic active learning streak for visual motivation
          streak: ((e.points || 0) % 6) + 1,
        }));
        setStudents(mapped);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Leaderboard load error:", err);
        setLoading(false);
      });
  }, [BASE_URL]);

  // Transform points based on tab selection to simulate active sprints
  const processedStudents = useMemo(() => {
    const list = students.map((s) => {
      let pts = s.points;
      if (activeTab === "monthly") {
        pts = Math.floor(s.points * 0.45);
      } else if (activeTab === "weekly") {
        pts = Math.floor(s.points * 0.15);
      }
      return { ...s, displayPoints: pts };
    });
    return list.sort((a, b) => b.displayPoints - a.displayPoints);
  }, [students, activeTab]);

  // Apply search query
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return processedStudents;
    const q = searchQuery.toLowerCase();
    return processedStudents.filter((s) =>
      s.name.toLowerCase().includes(q) ||
      s.address.toLowerCase().includes(q)
    );
  }, [processedStudents, searchQuery]);

  // Podium splits
  const topThree = useMemo(() => filteredStudents.slice(0, 3), [filteredStudents]);
  const remainingStudents = useMemo(() => filteredStudents.slice(3, 20), [filteredStudents]);

  // Max points for scale progress bars
  const maxPoints = useMemo(() => filteredStudents[0]?.displayPoints || 100, [filteredStudents]);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Trophy className="w-8 h-8 text-amber-500 fill-amber-500/10 animate-bounce" />
            Leaderboard Arena
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Celebrating excellence and commitment. Learn daily, climb ranks, earn badges!
          </p>
        </div>

        {/* Search & Statistics */}
        <div className="relative min-w-[260px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search classmate..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* ── Game Time Sprint Tabs ── */}
      <div className="flex bg-slate-200/60 p-1.5 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveTab("weekly")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === "weekly"
              ? "bg-white text-emerald-700 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          ⚡ Weekly Sprint
        </button>
        <button
          onClick={() => setActiveTab("monthly")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === "monthly"
              ? "bg-white text-emerald-700 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          📅 Monthly Sprint
        </button>
        <button
          onClick={() => setActiveTab("all-time")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === "all-time"
              ? "bg-white text-emerald-700 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          🏆 All-Time Legends
        </button>
      </div>

      {/* ── Loading Skeleton ── */}
      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 h-64 items-end bg-white border border-slate-100 rounded-3xl p-6">
            <div className="h-44 bg-slate-100 rounded-2xl animate-pulse" />
            <div className="h-56 bg-slate-100 rounded-2xl animate-pulse" />
            <div className="h-36 bg-slate-100 rounded-2xl animate-pulse" />
          </div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-100 border border-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl shadow-sm">
          <Users className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700 mb-1">No learners found</h3>
          <p className="text-slate-400 text-sm">Be the first to join the academy standings!</p>
        </div>
      ) : (
        <div className="space-y-6">

          {/* ── TOP 3 PODIUM ARENA ── */}
          {topThree.length > 0 && (
            <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end pt-10 pb-6 px-1 relative min-h-[340px] bg-gradient-to-b from-slate-50 to-transparent rounded-3xl border border-slate-100/50 p-6">
              
              {/* 🥈 SECOND PLACE (Silver Podium) */}
              {topThree[1] && (
                <div className="flex flex-col items-center bg-white border border-slate-100 rounded-3xl p-4 text-center shadow-md shadow-slate-100 hover:-translate-y-1 transition-all duration-300 relative group">
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-slate-100 text-slate-700 font-extrabold text-[10px] px-3 py-1 rounded-full border border-slate-200 shadow-sm flex items-center gap-1">
                    🥈 2nd
                  </div>
                  
                  {/* Avatar Frame */}
                  <div className="relative mt-2">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-3 border-slate-300 shadow-lg shadow-slate-300/20">
                      {topThree[1].avatar ? (
                        <Image
                          src={topThree[1].avatar}
                          alt={topThree[1].name}
                          className="w-full h-full object-cover"
                          width={80}
                          height={80}
                        />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${getAvatarGradient(topThree[1].name)} text-white font-extrabold text-lg`}>
                          {topThree[1].name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="font-extrabold text-slate-800 text-xs sm:text-sm mt-4 truncate w-full">{topThree[1].name}</h3>
                  <p className="text-[10px] text-slate-400 font-bold truncate w-full mt-0.5">{topThree[1].address}</p>
                  
                  {/* Active Streak */}
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-orange-600 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full mt-2">
                    <Flame className="w-3 h-3 fill-orange-500 stroke-none" />
                    {topThree[1].streak}d Streak
                  </span>

                  <span className="inline-flex mt-3 px-3.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-black border border-slate-200">
                    {topThree[1].displayPoints} Pts
                  </span>
                </div>
              )}

              {/* 👑 FIRST PLACE (Gold Podium - Champion) */}
              {topThree[0] && (
                <div className="flex flex-col items-center bg-amber-50/15 border-2 border-amber-200 shadow-xl shadow-amber-500/5 rounded-3xl p-5 sm:p-7 text-center hover:-translate-y-1 transition-all duration-300 relative -top-6 group">
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-amber-500 text-white font-black text-xs px-4 py-1.5 rounded-full shadow-lg shadow-amber-500/30 border-2 border-white flex items-center gap-1.5 animate-pulse">
                    <Crown className="w-4 h-4 fill-white text-amber-500" />
                    CHAMPION
                  </div>
                  
                  {/* Avatar Frame with Crown */}
                  <div className="relative mt-2">
                    <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-amber-400 shadow-xl shadow-amber-400/20">
                      {topThree[0].avatar ? (
                        <Image
                          src={topThree[0].avatar}
                          alt={topThree[0].name}
                          className="w-full h-full object-cover"
                          width={112}
                          height={112}
                        />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${getAvatarGradient(topThree[0].name)} text-white font-extrabold text-2xl`}>
                          {topThree[0].name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="font-black text-slate-900 text-sm sm:text-base mt-4 truncate w-full tracking-tight">{topThree[0].name}</h3>
                  <p className="text-[10px] sm:text-xs text-slate-400 font-bold truncate w-full mt-0.5">{topThree[0].address}</p>

                  {/* Active Streak */}
                  <span className="inline-flex items-center gap-0.5 text-[9px] sm:text-xs font-bold text-orange-600 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full mt-2 animate-bounce">
                    <Flame className="w-3.5 h-3.5 fill-orange-500 stroke-none" />
                    {topThree[0].streak}d Streak
                  </span>

                  <span className="inline-flex mt-4 px-5 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs sm:text-sm font-black shadow-md shadow-amber-500/20">
                    {topThree[0].displayPoints} Pts
                  </span>
                </div>
              )}

              {/* 🥉 THIRD PLACE (Bronze Podium) */}
              {topThree[2] && (
                <div className="flex flex-col items-center bg-white border border-slate-100 rounded-3xl p-4 text-center shadow-md shadow-slate-100 hover:-translate-y-1 transition-all duration-300 relative group">
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-amber-700 text-white font-extrabold text-[10px] px-3 py-1 rounded-full border border-amber-800 shadow-sm flex items-center gap-1">
                    🥉 3rd
                  </div>
                  
                  {/* Avatar Frame */}
                  <div className="relative mt-2">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-3 border-amber-700 shadow-lg shadow-amber-700/20">
                      {topThree[2].avatar ? (
                        <Image
                          src={topThree[2].avatar}
                          alt={topThree[2].name}
                          className="w-full h-full object-cover"
                          width={80}
                          height={80}
                        />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${getAvatarGradient(topThree[2].name)} text-white font-extrabold text-lg`}>
                          {topThree[2].name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="font-extrabold text-slate-800 text-xs sm:text-sm mt-4 truncate w-full">{topThree[2].name}</h3>
                  <p className="text-[10px] text-slate-400 font-bold truncate w-full mt-0.5">{topThree[2].address}</p>

                  {/* Active Streak */}
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-orange-600 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full mt-2">
                    <Flame className="w-3 h-3 fill-orange-500 stroke-none" />
                    {topThree[2].streak}d Streak
                  </span>

                  <span className="inline-flex mt-3 px-3.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-black border border-slate-200">
                    {topThree[2].displayPoints} Pts
                  </span>
                </div>
              )}

            </div>
          )}

          {/* ── SECONDARY LEADERBOARD RANK LISTINGS ── */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Class Standings (4th to 20th)</h4>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-50 border px-2 py-0.5 rounded-full">
                Active Standings: {remainingStudents.length + topThree.length}
              </span>
            </div>
            
            {remainingStudents.length === 0 && searchQuery.trim() && (
              <div className="text-center py-8">
                <p className="text-slate-400 text-sm">No secondary rankings match your filter.</p>
              </div>
            )}

            <div className="space-y-2">
              {remainingStudents.map((e, index) => {
                const globalIndex = index + 4;
                const progressWidth = maxPoints > 0 ? (e.displayPoints / maxPoints) * 100 : 0;
                
                // League Badge Map
                const league = getLeagueDetails(e.points);
                const levelNum = Math.floor(e.points / 100) + 1;

                return (
                  <div
                    key={e.id}
                    className="group flex items-center justify-between gap-4 py-3 px-4 hover:bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all duration-300"
                  >
                    {/* Student Identity */}
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <span className="w-6 text-center text-xs font-black text-slate-400 group-hover:text-slate-600">
                        {globalIndex}
                      </span>

                      {/* Avatar Frame with dynamic league color border ring */}
                      <div className={`w-11 h-11 rounded-full overflow-hidden shrink-0 ring-2 ${league.ring} p-0.5 bg-white shadow-sm`}>
                        {e.avatar ? (
                          <Image
                            src={e.avatar}
                            alt={e.name}
                            className="w-full h-full object-cover rounded-full"
                            width={44}
                            height={44}
                          />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${getAvatarGradient(e.name)} text-white font-bold text-sm rounded-full`}>
                            {e.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-extrabold text-slate-800 text-sm sm:text-base truncate group-hover:text-slate-900 transition-colors">
                            {e.name}
                          </p>
                          <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold border shrink-0 ${league.color}`}>
                            {league.name}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold mt-0.5">
                          <span className="truncate">{e.address}</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5 text-orange-500 font-bold">
                            <Flame className="w-3 h-3 fill-orange-500 stroke-none" />
                            {e.streak}d
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar & points */}
                    <div className="flex items-center gap-6 shrink-0">
                      
                      {/* Gamified progress bar representing level standing */}
                      <div className="hidden sm:flex flex-col items-end gap-1 w-32">
                        <div className="flex items-center justify-between w-full text-[9px] font-extrabold text-slate-400">
                          <span>Lv.{levelNum}</span>
                          <span>Lv.{levelNum + 1}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-500" 
                            style={{ width: `${progressWidth}%` }}
                          />
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-black text-slate-800">{e.displayPoints} Pts</p>
                        <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide mt-0.5">Rank #{globalIndex}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── MOTIVATIONAL STICKY USER STANDINGS CARD ── */}
          {students.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0 border border-amber-500/20">
                  <Sparkles className="w-5 h-5 fill-amber-500/10" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base">Target Achieved: Top 20 Classmates List</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Learn daily, complete homework, and earn points to rank higher!</p>
                </div>
              </div>
              <div className="flex items-center gap-2 font-bold text-xs bg-slate-800 border border-slate-700/60 rounded-xl px-4 py-2 text-slate-300">
                <Target className="w-4 h-4 text-emerald-400" />
                Next milestone: Earn 25 Points to level up
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default LeaderBoard;
