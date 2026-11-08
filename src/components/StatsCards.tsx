"use client";

import {
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRelativeDate } from "@/lib/utils";
import { type Milestone } from "@/lib/data";
import { STATUSES } from "@/lib/theme";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  iconClass: string;
  progress?: number;
  milestone?: Milestone;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconClass,
  progress,
  milestone,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border border-border p-4 sm:p-5 transition-colors hover:bg-accent/50 dark:hover:bg-accent/10",
        milestone?.status === "at-risk" && "ring-2 ring-rose-500/30"
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`flex items-center rounded-md p-2 ${iconClass}`}>
          {icon}
        </div>
        {progress != null && (
          <div className="text-right">
            <div className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              Progress
            </div>
            <div className="text-xs font-semibold">{progress}%</div>
          </div>
        )}
      </div>
      <h3 className="text-lg font-semibold">{value}</h3>
      <p className="text-xs text-muted-foreground">{title}</p>
      <p className="text-[10px] text-muted-foreground mt-1">{subtitle}</p>
      {progress != null && milestone && (
        <div className="mt-3 h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={cn(
              "h-full",
              progress >= 80 ? "bg-emerald-500" : progress >= 50 ? "bg-blue-500" : "bg-amber-500"
            )}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}

interface StatsCardsProps {
  milestones: Milestone[];
}

export function StatsCards({ milestones }: StatsCardsProps) {
  const total = milestones.length;
  const completed = milestones.filter((m) => m.status === "completed").length;
  const inProgress = milestones.filter((m) => m.status === "in-progress").length;
  const atRisk = milestones.filter((m) => m.status === "at-risk").length;
  const planned = milestones.filter((m) => m.status === "planned").length;
  const avgProgress =
    total > 0 ? Math.round(milestones.reduce((s, m) => s + m.progress, 0) / total) : 0;

  const soonest = milestones
    .filter((m) => m.status !== "completed")
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    )[0];

  const statusConfig = (id: string) =>
    STATUSES.find((s) => s.id === id) ?? STATUSES[0];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard
        title="Total Milestones"
        value={total.toString()}
        subtitle="Across all projects"
        icon={<Activity className="h-5 w-5" />}
        iconClass="bg-blue-500/10 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
      />
      <StatCard
        title="Completed"
        value={completed.toString()}
        subtitle={total > 0 ? Math.round((completed / total) * 100) + "% done" : "0% done"}
        icon={<CheckCircle2 className="h-5 w-5" />}
        iconClass="bg-emerald-500/10 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
        progress={avgProgress}
        milestone={milestones[0]}
      />
      <StatCard
        title="In Progress"
        value={inProgress.toString()}
        subtitle="Actively being worked on"
        icon={<Clock className="h-5 w-5" />}
        iconClass="bg-purple-500/10 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
      />
      <StatCard
        title="At Risk"
        value={atRisk.toString()}
        subtitle={atRisk > 0 ? "Needs attention" : "All clear"}
        icon={<AlertTriangle className="h-5 w-5" />}
        iconClass="bg-rose-500/10 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400"
      />
      <StatCard
        title="Up Next"
        value={soonest ? soonest.title : "—"}
        subtitle={
          soonest
            ? "Due " + formatRelativeDate(soonest.dueDate)
            : "Nothing scheduled"
        }
        icon={<TrendingUp className="h-5 w-5" />}
        iconClass="bg-indigo-500/10 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
      />
    </section>
  );
}
