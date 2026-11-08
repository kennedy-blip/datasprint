"use client";

import { Sun, Moon, Monitor, Cpu, Palette, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme, toggle } = useTheme();

  const icons: Record<string, React.ReactNode> = {
    light: <Moon className="h-4 w-4" />,
    dark: <Sun className="h-4 w-4" />,
  };

  const labels: Record<string, string> = {
    light: "Switch to dark mode",
    dark: "Switch to light mode",
    system: "Use system theme",
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setTheme("system")}
        aria-label="Use system theme"
        title="Use system theme"
        className={cn(
          "p-1.5 rounded-md transition-colors",
          theme === "system"
            ? "bg-primary/10 text-primary"
            : "hover:bg-accent text-muted-foreground"
        )}
      >
        <Monitor className="h-4 w-4" />
      </button>
      <button
        onClick={toggle}
        aria-label={labels[theme]}
        title={labels[theme]}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors border",
          theme === "system"
            ? "border-transparent bg-muted text-muted-foreground"
            : "border-border hover:bg-accent"
        )}
      >
        {icons[resolvedTheme]}
        <span className="hidden sm:inline">{labels[theme]}</span>
      </button>
      <button
        onClick={() => setTheme("light")}
        aria-label="Force light mode"
        title="Force light mode"
        className={cn(
          "p-1.5 rounded-md transition-colors",
          theme === "light"
            ? "bg-primary/10 text-primary"
            : "hover:bg-accent text-muted-foreground"
        )}
      >
        <Palette className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        aria-label="Force dark mode"
        title="Force dark mode"
        className={cn(
          "p-1.5 rounded-md transition-colors",
          theme === "dark"
            ? "bg-primary/10 text-primary"
            : "hover:bg-accent text-muted-foreground"
        )}
      >
        <Moon className="h-4 w-4" />
      </button>
      <button
        onClick={() => {}}
        aria-label="Refresh theme"
        title="Refresh theme"
        className={cn(
          "p-1.5 rounded-md transition-colors hover:bg-accent text-muted-foreground"
        )}
      >
        <RefreshCw className="h-4 w-4" />
      </button>
    </div>
  );
}
