"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
} from "recharts";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { type Milestone } from "@/lib/data";

const STATUS_COLORS: Record<string, string> = {
  planned: "#3b82f6",
  "in-progress": "#a855f7",
  completed: "#10b981",
  "at-risk": "#f43f5e",
};

interface MilestoneChartProps {
  milestones: Milestone[];
}

export function MilestoneChart({ milestones }: MilestoneChartProps) {
  // Group by due-date week
  const buckets: Record<string, Record<string, number>> = {};
  milestones.forEach((m) => {
    const week = format(new Date(m.dueDate), "yyyy-MM-dd");
    if (!buckets[week]) buckets[week] = { planned: 0, "in-progress": 0, completed: 0, "at-risk": 0 };
    buckets[week][m.status] = (buckets[week][m.status] ?? 0) + 1;
  });

  const data = Object.entries(buckets)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, counts]) => ({
      week: format(new Date(week + "T00:00:00"), "MMM d"),
      ...counts,
    }));

  const statuses = ["planned", "in-progress", "completed", "at-risk"] as const;

  if (data.length === 0) return null;

  return (
    <div className="rounded-xl border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Milestones by Due Date</h3>
        <div className="flex gap-2">
          {statuses.map((s) => (
            <div key={s} className="flex items-center gap-1.5 text-xs">
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  STATUS_COLORS[s]
                )}
              ></div>
              {s}
            </div>
          ))}
        </div>
      </div>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis type="number" dataKey="planned" hide />
            <YAxis dataKey="week" width={60} tickFormatter={(v) => String(v)} />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Legend verticalAlign="top" align="right" />
            {statuses.map((s) => (
              <Bar
                key={s}
                dataKey={s}
                stackId="a"
                fill={STATUS_COLORS[s]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
