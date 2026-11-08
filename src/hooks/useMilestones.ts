"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import { MOCK_MILESTONES, type Milestone } from "@/lib/data";
import { STORAGE_KEY } from "@/lib/theme";
import { format, parseISO, isValid, subDays, addDays, formatISO } from "date-fns";

export interface FilterState {
  search: string;
  category: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  sortBy: "dueDate" | "progress" | "title" | "project";
  sortDir: "asc" | "desc";
}

export function useMilestones() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Simulate fetch + hydrate from localStorage
    const tick = setTimeout(() => {
      const raw = localStorage.getItem(STORAGE_KEY);
      let data: Milestone[];
      if (raw) {
        try {
          data = JSON.parse(raw);
        } catch {
          data = MOCK_MILESTONES;
        }
      } else {
        data = MOCK_MILESTONES;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_MILESTONES));
      }
      setMilestones(data);
      setLoading(false);
    }, 300);
    return () => clearTimeout(tick);
  }, []);

  const save = useCallback((next: Milestone[]) => {
    setMilestones(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const upsert = useCallback((m: Milestone) => {
    setMilestones((prev) => {
      const next =
        prev.find((x) => x.id === m.id) && m.id
          ? prev.map((x) => (x.id === m.id ? m : x))
          : [
              ...prev,
              { ...m, id: m.id || `MS-${Date.now()}` },
            ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setMilestones((prev) => {
      const next = prev.filter((x) => x.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { milestones, loading, save, upsert, remove };
}

export function useFilters() {
  const [filter, setFilter] = useState<FilterState>({
    search: "",
    category: "All",
    status: "All",
    dateFrom: "",
    dateTo: "",
    sortBy: "dueDate",
    sortDir: "asc",
  });

  const filtered = useMemo(
    () => filter,
    [filter]
  );
  return { filter, setFilter };
}

export function applyFilters(milestones: Milestone[], filter: FilterState) {
  const { search, category, status, dateFrom, dateTo, sortBy, sortDir } = filter;
  let result = milestones.filter((m) => {
    if (search) {
      const q = search.toLowerCase();
      if (
        !m.title.toLowerCase().includes(q) &&
        !m.project.toLowerCase().includes(q) &&
        !m.owner.toLowerCase().includes(q) &&
        !m.category.toLowerCase().includes(q) &&
        !m.description.toLowerCase().includes(q)
      )
        return false;
    }
    if (category !== "All" && m.category !== category) return false;
    if (status !== "All" && m.status !== status) return false;
    if (dateFrom) {
      const d = parseISO(m.dueDate);
      if (isValid(d) && d < parseISO(dateFrom)) return false;
    }
    if (dateTo) {
      const d = parseISO(m.dueDate);
      if (isValid(d) && d > parseISO(dateTo)) return false;
    }
    return true;
  });

  result = [...result].sort((a, b) => {
    let av: any;
    let bv: any;
    if (sortBy === "dueDate") {
      av = new Date(a.dueDate).getTime();
      bv = new Date(b.dueDate).getTime();
    } else if (sortBy === "progress") {
      av = a.progress;
      bv = b.progress;
    } else if (sortBy === "title") {
      av = a.title;
      bv = b.title;
    } else {
      av = a.project;
      bv = b.project;
    }
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  return result;
}

export function rangeDates() {
  const now = new Date();
  return {
    from: formatISO(subDays(now, 30)),
    to: formatISO(addDays(now, 60)),
  };
}
