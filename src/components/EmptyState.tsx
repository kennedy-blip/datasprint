"use client";

import { Inbox, RotateCcw } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function EmptyState() {
  const { toggle } = useTheme();
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="p-4 rounded-full bg-muted/50 mb-4">
        <Inbox className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">No milestones found</h3>
      <p className="text-muted-foreground mt-1 max-w-xs mx-auto">
        Try adjusting your filters or clear them to see all milestones.
      </p>
      <button
        onClick={toggle}
        className="mt-6 inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
      >
        <RotateCcw className="h-4 w-4" /> Clear filters
      </button>
    </div>
  );
}
