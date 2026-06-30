"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Play,
  BellRing,
} from "lucide-react";

export default function Page() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0f1a] text-white">
      <AuroraBackground />
      <div className="relative z-10 mx-auto max-w-[1400px] px-4 lg:px-6">
        <div className="flex">
          <main className="flex-1 py-8 lg:py-10">
            <Header />
            <TopStats />
            <section className="mt-6 grid grid-cols-1 gap-6 lg:mt-8 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <ContinueLearning />
              </div>
              <div className="lg:col-span-4">
                <NextClassCard />
              </div>
              <div className="lg:col-span-6">
                <AssignmentsCard />
              </div>
              <div className="lg:col-span-6">
                <AnnouncementsCard />
              </div>
            </section>
          </main>
        </div>
      </div>
      <style>{`
        .glass{ backdrop-filter: blur(20px); background: rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.18); box-shadow: 0 10px 30px rgba(0,0,0,.25); }
        .glass-soft{ backdrop-filter: blur(16px); background: rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.14); box-shadow: 0 6px 24px rgba(0,0,0,.18); }
        .chip{ background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.16); }
        @keyframes float { 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-10px) } }
        @keyframes auroraMove {
          0%{ transform: translate(-10%, -10%) scale(1); opacity:.7 }
          50%{ transform: translate(10%, 10%) scale(1.15); opacity:.9 }
          100%{ transform: translate(-10%, -10%) scale(1); opacity:.7 }
        }
      `}</style>
    </div>
  );
}

function AuroraBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute -top-40 -left-32 h-[520px] w-[520px] rounded-full opacity-70 blur-[90px]" style={{background:"radial-gradient(closest-side, rgba(99,102,241,.55), transparent)"}} />
      <div className="absolute top-10 left-1/3 h-[520px] w-[520px] rounded-full opacity-60 blur-[90px]" style={{background:"radial-gradient(closest-side, rgba(45,212,191,.45), transparent)"}} />
      <div className="absolute -bottom-32 right-0 h-[620px] w-[620px] rounded-full opacity-70 blur-[110px]" style={{background:"radial-gradient(closest-side, rgba(236,72,153,.35), transparent)"}} />
      <div className="absolute inset-0 animate-[auroraMove_12s_ease-in-out_infinite]" style={{background:"conic-gradient(from 200deg at 70% 30%, rgba(59,130,246,.25), rgba(20,184,166,.18), rgba(168,85,247,.22), rgba(236,72,153,.2), rgba(59,130,246,.25))"}} />
      <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(255,255,255,.08),transparent_60%)]" />
    </div>
  );
}

function Header() {
  return (
    <header className="mb-6 lg:mb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-white/95 lg:text-[28px]">Assalamu alaikum, Ayan</h1>
        <div className="flex items-center gap-3">
          <button className="chip inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/80">
            <BellRing className="h-4 w-4" />
            Notifications
          </button>
        </div>
      </div>
    </header>
  );
}

function TopStats() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="glass rounded-2xl p-5 ring-1 ring-white/15">
        <div className="text-sm text-white/70">Streak</div>
        <div className="mt-2 flex items-end gap-2">
          <div className="text-3xl font-bold">5</div>
          <div className="text-sm text-white/60">days</div>
        </div>
      </div>
      <div className="glass rounded-2xl p-5 ring-1 ring-white/15">
        <div className="text-sm text-white/70">Study time</div>
        <div className="mt-2 text-3xl font-bold">12h 30m</div>
      </div>
      <div className="glass rounded-2xl p-5 ring-1 ring-white/15">
        <div className="flex items-center justify-between">
          <div className="text-sm text-white/70">Overall progress</div>
          <div className="text-xs text-white/50">64%</div>
        </div>
        <div className="mt-3">
          <ProgressRing value={64} size={84} stroke={10} />
        </div>
      </div>
    </div>
  );
}

function ContinueLearning() {
  return (
    <div className="glass rounded-2xl ring-1 ring-white/15">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-2xl">
          <img src="https://images.unsplash.com/photo-1545289414-1c3cb1c06238?q=80&w=1400&auto=format&fit=crop" alt="cover" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/15">
              <div className="h-2 w-1/3 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" />
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between p-4 lg:p-6">
          <div>
            <div className="text-sm text-white/70">Continue learning</div>
            <h3 className="mt-1 text-2xl font-semibold tracking-tight">Qur'an Reading – Tajwīd Basics</h3>
            <p className="mt-2 text-white/70">Resume Lesson 7 • Last studied 2h ago</p>
          </div>
          <div className="mt-6">
            <button className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#5729d6] to-[#ef5123] px-6 py-3 text-base font-semibold text-white shadow-[0_8px_24px_rgba(87,41,214,.35)] transition hover:shadow-[0_12px_28px_rgba(87,41,214,.45)]">
              <Play className="mr-2 h-5 w-5" />
              Resume Lesson 7
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NextClassCard() {
  const target = useMemo(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() + 12);
    d.setSeconds(d.getSeconds() + 34);
    return d;
  }, []);
  return (
    <div className="glass rounded-2xl p-5 ring-1 ring-white/15">
      <div className="text-sm text-white/70">Next class</div>
      <div className="mt-1 text-[40px] font-bold leading-none tracking-tight lg:text-[48px]">
        <Countdown target={target} />
      </div>
      <div className="mt-4 text-white/80">Live with Ustadh Sultan • Today 10:00</div>
      <div className="mt-6">
        <button className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#5729d6] to-[#ef5123] px-6 py-3 text-base font-semibold text-white shadow-[0_8px_24px_rgba(87,41,214,.35)] transition hover:shadow-[0_12px_28px_rgba(87,41,214,.45)]">
          <Play className="mr-2 h-5 w-5" /> Join Class
        </button>
      </div>
    </div>
  );
}

function AssignmentsCard() {
  const items = [
    { title: "Submit Surah Al-Mulk recitation", due: "Due Today" },
    { title: "MCQ Quiz – Arabic letters", due: "Due Thu" },
    { title: "Vocabulary review – 10 words", due: "Due Sun" },
  ];
  return (
    <div className="glass rounded-2xl p-5 ring-1 ring-white/15">
      <div className="mb-3 text-lg font-semibold">Assignments</div>
      <ul className="space-y-3">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-3">
            <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-transparent" />
            <div className="flex-1 text-white/90">{it.title}</div>
            <div className="chip rounded-md px-2 py-1 text-xs text-white/80">{it.due}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AnnouncementsCard() {
  const items = [
    { title: "Recording available for Lesson 6", time: "2h ago" },
    { title: "New badge unlocked: Consistent Reader", time: "Yesterday" },
  ];
  return (
    <div className="glass rounded-2xl p-5 ring-1 ring-white/15">
      <div className="mb-3 text-lg font-semibold">Announcements</div>
      <ul className="space-y-3">
        {items.map((it, i) => (
          <li key={i} className="flex items-center justify-between gap-3">
            <div className="text-white/90">{it.title}</div>
            <div className="text-sm text-white/60">{it.time}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Countdown({ target }) {
  const [remaining, setRemaining] = useState("00:00:00");
  useEffect(() => {
    const tick = () => {
      const diff = +target - +new Date();
      setRemaining(toHMS(diff));
    };
    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [target]);
  return <>{remaining}</>;
}

function toHMS(ms) {
  const clamped = Math.max(0, ms);
  const h = Math.floor(clamped / 3_600_000);
  const m = Math.floor((clamped % 3_600_000) / 60_000);
  const s = Math.floor((clamped % 60_000) / 1000);
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

function ProgressRing({ value, size = 84, stroke = 10 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  const rest = c - dash;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,.15)" strokeWidth={stroke} fill="none" />
      <circle cx={size / 2} cy={size / 2} r={r} stroke="url(#g)" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${dash} ${rest}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} fill="none" />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize={14} fill="white">{value}%</text>
    </svg>
  );
}

if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  console.assert(toHMS(3_661_000) === "01:01:01", "toHMS 3661000 should be 01:01:01");
  console.assert(toHMS(59_999) === "00:00:59", "toHMS 59999 should be 00:00:59");
  console.assert(toHMS(-1) === "00:00:00", "toHMS -1 should clamp to 00:00:00");
}
