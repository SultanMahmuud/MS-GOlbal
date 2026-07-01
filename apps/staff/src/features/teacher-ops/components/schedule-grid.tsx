"use client";

import { Fragment } from "react";
import { Clock3 } from "lucide-react";
import type { ScheduleBooking } from "@/features/teacher-ops/lib/types";
import { cn } from "@/features/teacher-ops/lib/utils";

const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const defaultTimes = [
  "04:00",
  "09:00",
  "09:30",
  "10:00",
  "12:00",
  "16:00",
  "17:30",
  "18:00",
  "19:00",
  "19:30",
  "20:20",
  "20:50",
  "21:30",
  "22:00",
  "22:30",
  "23:00",
];

function slotStatus(bookings: ScheduleBooking[], day: string, time: string) {
  return bookings.find((booking) => booking.day === day && booking.time === time);
}

export function ScheduleGrid({ bookings }: { bookings: ScheduleBooking[] }) {
  const times = Array.from(
    new Set([...defaultTimes, ...bookings.map((booking) => booking.time)]),
  ).sort((a, b) => a.localeCompare(b));

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[920px]">
        <div className="grid grid-cols-[88px_repeat(7,minmax(92px,1fr))] gap-2">
          <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            <Clock3 className="h-3.5 w-3.5" />
            Time
          </div>
          {days.map((day) => (
            <div
              key={day}
              className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-center text-xs font-medium text-slate-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
            >
              {day.slice(0, 3)}
            </div>
          ))}

          {times.map((time) => (
            <Fragment key={time}>
              <div
                key={`${time}-label`}
                className="rounded-md border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-500"
              >
                {time}
              </div>
              {days.map((day) => {
                const slot = slotStatus(bookings, day, time);
                return (
                  <div
                    key={`${day}-${time}`}
                    title={
                      slot?.studentName
                        ? `${slot.studentName} - ${slot.durationMinutes ?? ""} min`
                        : "Available"
                    }
                    className={cn(
                      "flex h-12 flex-col items-center justify-center rounded-md border px-2 py-1 text-center text-[11px] font-medium leading-tight transition",
                      !slot && "border-slate-200 bg-slate-50 text-slate-400 dark:border-zinc-900 dark:bg-zinc-950 dark:text-zinc-700",
                      slot?.status === "booked" &&
                        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
                      slot?.status === "conflict" &&
                        "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-700 dark:bg-rose-950 dark:text-rose-200",
                    )}
                  >
                    {slot ? (
                      <>
                        <span>{slot.status === "conflict" ? "Conflict" : "Booked"}</span>
                        <span className="mt-0.5 max-w-full truncate text-[10px] opacity-80">
                          {slot.studentName ?? slot.studentId}
                        </span>
                      </>
                    ) : (
                      "Free"
                    )}
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
