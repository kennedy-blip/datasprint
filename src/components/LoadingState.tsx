"use client";

import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
      <Loader2 className="h-8 w-8 animate-spin" />
      <p className="text-muted-foreground text-sm">Loading milestones…</p>
    </div>
  );
}
