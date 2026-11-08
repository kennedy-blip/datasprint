"use client";

import {
  Search,
  Filter,
  Calendar,
  SortAsc,
  SortDesc,
  X,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CATEGORIES, STATUSES, type Category } from "@/lib/theme";
import { useFilters, applyFilters, type FilterState, rangeDates } from "@/hooks/useMilestones";
import { type Milestone } from "@/lib/data";

interface FilterBarProps {
  milestones: Milestone[];
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
}

export function FilterBar({ milestones, setFilter }: FilterBarProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState<FilterState["sortBy"]>("dueDate");
  const [sortDir, setSortDir] = useState<FilterState["sortDir"]>("asc");

  const filtered = applyFilters(milestones, {
    search: query,
    category,
    status,
    dateFrom,
    dateTo,
    sortBy,
    sortDir,
  });

  const handleApply = () => {
    setFilter({
      search: query,
      category,
      status,
      dateFrom,
      dateTo,
      sortBy,
      sortDir,
    });
  };

  const hasActiveFilter =
    query !== "" ||
    category !== "All" ||
    status !== "All" ||
    dateFrom !== "" ||
    dateTo !== "";

  return (
    <div className="rounded-xl border border-border p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search title, project, owner…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-md border border-input bg-background focus:ring-1 focus:ring-ring focus:border-transparent outline-none text-sm transition-colors"
          />
        </div>
        <div className="flex gap-1">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-9 px-3 rounded-md border border-input bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-9 px-3 rounded-md border border-input bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
          >
            <option value="All">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <div className="flex gap-1 w-full sm:w-auto">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="h-9 px-3 rounded-md border border-input bg-background outline-none text-sm focus:ring-1 focus:ring-ring min-w-[150px]"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="h-9 px-3 rounded-md border border-input bg-background outline-none text-sm focus:ring-1 focus:ring-ring min-w-[150px]"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="h-9 px-3 rounded-md border border-input bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
        >
          <option value="dueDate">Sort: Due Date</option>
          <option value="progress">Sort: Progress</option>
          <option value="title">Sort: Title</option>
          <option value="project">Sort: Project</option>
        </select>
        <button
          onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
          className={cn(
            "h-9 px-3 rounded-md border border-input bg-background outline-none text-sm focus:ring-1 focus:ring-ring",
            sortDir === "desc" ? "bg-muted" : ""
          )}
          title="Toggle sort direction"
          aria-label="Toggle sort direction"
        >
          {sortDir === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
        </button>
        <button onClick={handleApply} className="h-9 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium">
          Apply
        </button>
        {hasActiveFilter && (
          <button
            onClick={() => {
              setQuery("");
              setCategory("All");
              setStatus("All");
              setDateFrom("");
              setDateTo("");
              setSortBy("dueDate");
              setSortDir("asc");
              handleApply();
            }}
            className="h-9 px-3 rounded-md border border-destructive text-destructive hover:bg-destructive/10 text-sm"
          >
            <X className="h-4 w-4 mr-2" /> Clear
          </button>
        )}
      </div>

      <div className="w-full sm:w-auto flex items-center justify-between gap-2 pt-2 sm:pt-0 border-t sm:border-t-0">
        <span className="text-xs text-muted-foreground">
          {filtered.length} of {milestones.length} milestones
        </span>
        <button
          onClick={() => {
            const r = rangeDates();
            setDateFrom(r.from);
            setDateTo(r.to);
            handleApply();
          }}
          className="text-xs text-primary hover:underline"
        >
          Quick range (last 30 days → next 60)
        </button>
      </div>
    </div>
  );
}
