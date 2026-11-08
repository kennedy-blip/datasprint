"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [storedTheme, setStoredTheme] = useState<Theme>("light");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("datasprint:theme") as Theme | null;
    const initial: Theme = saved ?? "system";
    setStoredTheme(initial);
    setResolvedTheme(resolveTheme(initial));
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setResolvedTheme(resolveTheme(storedTheme));
    applyTheme(resolveTheme(storedTheme));
  }, [storedTheme, mounted]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (storedTheme === "system") {
        setResolvedTheme(resolveTheme("system"));
        applyTheme(resolveTheme("system"));
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [storedTheme]);

  function resolveTheme(theme: Theme): "light" | "dark" {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return theme;
  }

  function applyTheme(theme: "light" | "dark") {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }

  function setTheme(theme: Theme) {
    setStoredTheme(theme);
    localStorage.setItem("datasprint:theme", theme);
  }

  function toggle() {
    const next = resolvedTheme === "light" ? "dark" : "light";
    setTheme(next);
  }

  return (
    <ThemeContext.Provider value={{ theme: storedTheme, resolvedTheme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
