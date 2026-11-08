"use client";

import { useState } from "react";
import {
  Settings,
  Palette,
  RefreshCw,
  Trash2,
  Download,
  Save,
  AlertCircle,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type Milestone } from "@/lib/data";
import { useTheme } from "./ThemeProvider";

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  onReset: () => void;
  onExport: () => void;
}

export function SettingsPanel({
  open,
  onClose,
  onReset,
  onExport,
}: SettingsPanelProps) {
  if (!open) return null;
  const [saved, setSaved] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-background border border-border rounded-xl shadow-2xl p-6 m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Settings</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-md text-muted-foreground hover:bg-accent">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold mb-3">Appearance</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-lg border border-border cursor-pointer hover:bg-accent group">
                <span className="flex items-center gap-3">
                  <div className={`h-5 w-5 rounded-full border ${theme === "light" ? "ring-2 ring-primary" : ""}`} />
                  <Palette className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span>Light mode</span>
                </span>
                <button
                  onClick={() => setTheme("light")}
                  className={cn("rounded-md p-1.5 text-muted-foreground", theme === "light" && "bg-primary text-primary-foreground")}
                  aria-pressed={theme === "light"}
                >
                  {theme === "light" ? <Check className="h-4 w-4" /> : null}
                </button>
              </label>
              <label className="flex items-center justify-between p-3 rounded-lg border border-border cursor-pointer hover:bg-accent group">
                <span className="flex items-center gap-3">
                  <div className={`h-5 w-5 rounded-full border ${theme === "dark" ? "ring-2 ring-primary" : ""}`} />
                  <MoonIcon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span>Dark mode</span>
                </span>
                <button
                  onClick={() => setTheme("dark")}
                  className={cn("rounded-md p-1.5 text-muted-foreground", theme === "dark" && "bg-primary text-primary-foreground")}
                  aria-pressed={theme === "dark"}
                >
                  {theme === "dark" ? <Check className="h-4 w-4" /> : null}
                </button>
              </label>
              <label className="flex items-center justify-between p-3 rounded-lg border border-border cursor-pointer hover:bg-accent group">
                <span className="flex items-center gap-3">
                  <div className={`h-5 w-5 rounded-full border ${theme === "system" ? "ring-2 ring-primary" : ""}`} />
                  <Monitor className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span>System default</span>
                </span>
                <button
                  onClick={() => setTheme("system")}
                  className={cn("rounded-md p-1.5 text-muted-foreground", theme === "system" && "bg-primary text-primary-foreground")}
                  aria-pressed={theme === "system"}
                >
                  {theme === "system" ? <Check className="h-4 w-4" /> : null}
                </button>
              </label>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Data</h3>
            <div className="space-y-3">
              <button
                onClick={onExport}
                className="flex w-full items-center justify-between p-3 rounded-lg border border-border text-left hover:bg-accent transition-colors"
              >
                <span className="flex items-center gap-3">
                  <Download className="h-4 w-4 text-muted-foreground" />
                  <span>Export data to CSV</span>
                </span>
                <span className="text-xs text-muted-foreground">Download milestones</span>
              </button>
              <button
                onClick={() => {
                  if (window.confirm("Reset all milestones to the original mock data? This cannot be undone.")) {
                    onReset();
                  }
                }}
                className="flex w-full items-center justify-between p-3 rounded-lg border border-destructive text-destructive hover:bg-destructive/50 transition-colors text-left"
              >
                <span className="flex items-center gap-3">
                  <RefreshCw className="h-4 w-4 text-muted-foreground" />
                  <span>Reset to mock data</span>
                </span>
                <span className="text-xs text-muted-foreground">Restore original set</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end">
            {saved ? (
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Settings saved</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  );
}

function Monitor({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 7h6m-6 4h6m4 0v3m0-13V9h-6zM3 12a1 1 0 011-1h16a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z"
      />
    </svg>
  );
}
