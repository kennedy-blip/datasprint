"use client";

export function KeyboardShortcuts() {
  const shortcuts = [
    { key: "/", label: "Focus search" },
    { key: "Esc", label: "Close drawer / Clear filters" },
    { key: "E", label: "Export CSV" },
    { key: "D", label: "Toggle dark/light theme" },
  ];

  return (
    <div className="fixed bottom-4 right-4 bg-background border border-border rounded-lg p-3 shadow-lg z-50">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
        Shortcuts
      </p>
      <div className="flex flex-wrap gap-2">
        {shortcuts.map(({ key, label }) => (
          <span
            key={key}
            className="flex items-center gap-1.5 rounded border border-border bg-muted px-2 py-0.5 text-[10px] font-medium"
          >
            <kbd className="rounded border border-border bg-background px-1 py-0 text-[10px]">
              {key}
            </kbd>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
