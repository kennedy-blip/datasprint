"use client";

import { Download } from "lucide-react";
import { type Milestone } from "@/lib/data";

export function CsvExportButton({ milestones }: { milestones: Milestone[] }) {
  function handleExport() {
    const headers = [
      "ID",
      "Title",
      "Project",
      "Category",
      "Status",
      "Due Date",
      "Progress",
      "Owner",
      "Description",
    ];
    const rows = milestones.map((m) => [
      m.id,
      `"${m.title.replace(/"/g, '""')}"`,
      m.project,
      m.category,
      m.status,
      m.dueDate,
      m.progress,
      m.owner,
      `"${m.description.replace(/"/g, '""')}"`,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `datasprint-milestones-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-background text-sm font-medium hover:bg-accent transition-colors"
      aria-label="Export milestones to CSV"
    >
      <Download className="h-4 w-4" />
      <span className="hidden sm:inline">Export CSV</span>
    </button>
  );
}
