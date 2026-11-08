"use client";

import { useCallback, useState, useEffect, useMemo } from "react";
import {
  Plus,
  LayoutDashboard,
  Settings as SettingsIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatsCards } from "@/components/StatsCards";
import { MilestoneChart } from "@/components/MilestoneChart";
import { FilterBar } from "@/components/FilterBar";
import { CsvExportButton } from "@/components/CsvExportButton";
import { EmptyState } from "@/components/EmptyState";
import { LoadingState } from "@/components/LoadingState";
import { MilestoneDetailDrawer } from "@/components/MilestoneDetailDrawer";
import { SettingsPanel } from "@/components/SettingsPanel";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useMilestones, applyFilters, type FilterState } from "@/hooks/useMilestones";
import { MOCK_MILESTONES, type Milestone } from "@/lib/data";

export default function Dashboard() {
  const { milestones, loading, upsert, remove } = useMilestones();
  const [filter, setFilter] = useState<FilterState>({
    search: "",
    category: "All",
    status: "All",
    dateFrom: "",
    dateTo: "",
    sortBy: "dueDate",
    sortDir: "asc",
  });
  const [openDrawer, setOpenDrawer] = useState<Milestone | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => applyFilters(milestones, filter), [
    milestones,
    filter,
  ]);

  const handleUpsert = useCallback((m: Milestone) => upsert(m), [upsert]);
  const handleRemove = useCallback((id: string) => {
    remove(id);
    if (openDrawer?.id === id) setOpenDrawer(null);
    if (selectedId === id) setSelectedId(null);
  }, [remove, openDrawer, selectedId]);

  const handleReset = useCallback(() => {
    localStorage.setItem(
      "datasprint:milestones",
      JSON.stringify(MOCK_MILESTONES)
    );
    // Re-hydrate by forcing a reload of state via localStorage key change trick
    window.dispatchEvent(new Event("datasprint:reset"));
  }, []);

  const handleExport = useCallback(() => {
    // Handled by CsvExportButton internally with filtered list
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <KeyboardShortcuts />

      <header className="sticky top-0 z-20 border-b border-background/50 bg-background/80 backdrop-blur-md">
        <div className="flex flex-col gap-4 px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold tracking-tight">DataSprint</span>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setSettingsOpen(true)}
                className="p-2 rounded-md text-muted-foreground hover:bg-accent"
                title="Settings"
              >
                <SettingsIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setOpenDrawer(null)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-md border border-border bg-background text-sm font-medium hover:bg-accent"
              >
                <Plus className="h-4 w-4" /> New milestone
              </button>
            </div>
          </div>

          <StatsCards milestones={milestones} />
        </div>
      </header>

      <main className="px-4 sm:px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Chart column */}
            <div className="lg:col-span-4">
              <div className="space-y-4">
                <MilestoneChart milestones={filtered} />
                <div className="rounded-xl border border-border p-4">
                  <h3 className="text-sm font-semibold mb-3">Quick actions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setOpenDrawer(null)}
                      className="flex w-full items-center gap-2 px-3 py-2 rounded-md border border-border text-left text-sm hover:bg-accent transition-colors"
                    >
                      <Plus className="h-4 w-4" /> Add milestone
                    </button>
                    <CsvExportButton milestones={filtered} />
                    <button
                      onClick={() => setSettingsOpen(true)}
                      className="flex w-full items-center gap-2 px-3 py-2 rounded-md border border-border text-left text-sm hover:bg-accent transition-colors"
                    >
                      <SettingsIcon className="h-4 w-4" /> Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* List column */}
            <div className="lg:col-span-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Milestones</h2>
              </div>
              <FilterBar milestones={filtered} setFilter={setFilter} />

              <div className="mt-4">
                {loading ? (
                  <LoadingState />
                ) : filtered.length === 0 ? (
                  <EmptyState />
                ) : (
                  <div className="rounded-xl border border-border overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted/50 text-muted-foreground border-b">
                          <th className="px-4 py-3 text-left">Milestone</th>
                          <th className="px-4 py-3 text-left">Project</th>
                          <th className="px-4 py-3 text-left">Category</th>
                          <th className="px-4 py-3 text-left">Status</th>
                          <th className="px-4 py-3 text-left">Progress</th>
                          <th className="px-4 py-3 text-left">Due</th>
                          <th className="px-4 py-3 text-right">Owner</th>
                          <th className="px-4 py-3" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filtered.map((m) => (
                          <tr
                            key={m.id}
                            className={cn(
                              "hover:bg-accent/50 transition-colors",
                              selectedId === m.id && "bg-primary/10",
                              m.status === "at-risk" && "bg-rose-50/30 dark:bg-rose-900/20"
                            )}
                            onClick={() => {
                              setSelectedId(m.id);
                              setOpenDrawer(m);
                            }}
                          >
                            <td className="px-4 py-3">
                              <div className="font-medium">{m.title}</div>
                              <div className="text-xs text-muted-foreground">
                                {m.description.slice(0, 80)}…
                              </div>
                            </td>
                            <td className="px-4 py-3">{m.project}</td>
                            <td className="px-4 py-3">
                              <span className={cn(
                                "inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold",
                                m.status === "planned"
                                  ? "bg-blue-500/10 text-blue-700 border-blue-200 dark:border-blue-800/50 dark:bg-blue-900/20 dark:text-blue-400"
                                  : m.status === "in-progress"
                                  ? "bg-purple-500/10 text-purple-700 border-purple-200 dark:border-purple-800/50 dark:bg-purple-900/20 dark:text-purple-400"
                                  : m.status === "completed"
                                  ? "bg-emerald-500/10 text-emerald-700 border-emerald-200 dark:border-emerald-800/50 dark:bg-emerald-900/20 dark:text-emerald-400"
                                  : "bg-rose-500/10 text-rose-700 border-rose-200 dark:border-rose-800/50 dark:bg-rose-900/20 dark:text-rose-400"
                              )}>
                                {m.status.replace("-", " ")}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
                                <div
                                  className={cn(
                                    "h-full",
                                    m.progress >= 80
                                      ? "bg-emerald-500"
                                      : m.progress >= 50
                                      ? "bg-blue-500"
                                      : "bg-amber-500"
                                  )}
                                  style={{ width: `${m.progress}%` }}
                                ></div>
                              </div>
                              <div className="text-[10px] text-muted-foreground mt-0.5">
                                {m.progress}%
                              </div>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">{new Date(m.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</td>
                            <td className="px-4 py-3 text-right">{m.owner}</td>
                            <td className="px-4 py-3 text-right" />
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <MilestoneDetailDrawer
        milestone={openDrawer}
        onClose={() => setOpenDrawer(null)}
        onUpdate={handleUpsert}
        onDelete={handleRemove}
      />
      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onReset={handleReset}
        onExport={() => {}}
      />
    </div>
  );
}
