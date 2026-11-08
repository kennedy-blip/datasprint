export const CATEGORIES = [
  "Product",
  "Engineering",
  "Design",
  "Marketing",
  "Operations",
  "Research",
] as const;

export const STATUSES = [
  { id: "planned", label: "Planned", color: "bg-blue-500/10 text-blue-700 border-blue-200 dark:border-blue-800/50 dark:bg-blue-900/20 dark:text-blue-400" },
  { id: "in-progress", label: "In Progress", color: "bg-purple-500/10 text-purple-700 border-purple-200 dark:border-purple-800/50 dark:bg-purple-900/20 dark:text-purple-400" },
  { id: "completed", label: "Completed", color: "bg-emerald-500/10 text-emerald-700 border-emerald-200 dark:border-emerald-800/50 dark:bg-emerald-900/20 dark:text-emerald-400" },
  { id: "at-risk", label: "At Risk", color: "bg-rose-500/10 text-rose-700 border-rose-200 dark:border-rose-800/50 dark:bg-rose-900/20 dark:text-rose-400" },
] as const;

export type Category = (typeof CATEGORIES)[number];
export type StatusId = (typeof STATUSES)[number]["id"];

export const STORAGE_KEY = "datasprint:milestones";

export function getStatusConfig(statusId: StatusId) {
  return STATUSES.find((s) => s.id === statusId) ?? STATUSES[0];
}
