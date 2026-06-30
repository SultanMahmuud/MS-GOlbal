"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MonthlyStudentSnapshot } from "@/features/teacher-ops/lib/types";

export function StudentTrendChart({
  data,
}: {
  data: MonthlyStudentSnapshot[];
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: 4, right: 8, top: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="studentTrend" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#34d399" stopOpacity={0.45} />
              <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#a1a1aa", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            tick={{ fill: "#a1a1aa", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              background: "#09090b",
              border: "1px solid #27272a",
              borderRadius: 8,
              color: "#fafafa",
            }}
            labelStyle={{ color: "#fafafa" }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#34d399"
            strokeWidth={2}
            fill="url(#studentTrend)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
