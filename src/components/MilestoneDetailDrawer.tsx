"use client";

import { useState } from "react";
import {
  X,
  Edit2,
  Save,
  Trash2,
  ChevronLeft,
  Calendar,
  Tag,
  User,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type Milestone } from "@/lib/data";
import { STATUSES, getStatusConfig } from "@/lib/theme";
import { formatDate } from "@/lib/utils";
import { useTheme } from "./ThemeProvider";

interface MilestoneDetailDrawerProps {
  milestone: Milestone | null;
  onClose: () => void;
  onUpdate: (m: Milestone) => void;
  onDelete: (id: string) => void;
}

export function MilestoneDetailDrawer({
  milestone,
  onClose,
  onUpdate,
  onDelete,
}: MilestoneDetailDrawerProps) {
  if (!milestone) return null;
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...milestone });
  const { theme, setTheme } = useTheme();

  const statusConfig = getStatusConfig(form.status);

  function handleSave() {
    setEditing(false);
    onUpdate(form);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-background border border-t border-b border-l border-border shadow-2xl transform transition-all duration-300 translate-y-0 rounded-t-2xl p-6 sm:p-8 max-h-[90vh] flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center text-lg font-semibold",
                statusConfig.color.split(" ").filter((c) => c.startsWith("text-")).join(" ")
              )}
            >
              {milestone.title.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{milestone.title}</h2>
              <p className="text-sm text-muted-foreground">
                {milestone.project} • {milestone.category}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(true)}
              className="p-2 rounded-md text-muted-foreground hover:bg-accent transition-colors"
              title="Edit"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                if (window.confirm("Delete this milestone?")) {
                  onDelete(milestone.id);
                  onClose();
                }
              }}
              className="p-2 rounded-md text-rose-600 hover:bg-rose-50 transition-colors"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button onClick={onClose} className="p-2 rounded-md text-muted-foreground hover:bg-accent transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {editing ? (
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-1 focus:ring-ring outline-none"
                autoFocus
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Project</label>
                <input
                  value={form.project}
                  onChange={(e) => setForm({ ...form, project: e.target.value })}
                  className="w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-1 focus:ring-ring outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-1 focus:ring-ring outline-none"
                >
                  {["Product", "Engineering", "Design", "Marketing", "Operations", "Research"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                  className="w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-1 focus:ring-ring outline-none"
                >
                  {STATUSES.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Due Date</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-1 focus:ring-ring outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Owner</label>
                <input
                  value={form.owner}
                  onChange={(e) => setForm({ ...form, owner: e.target.value })}
                  className="w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-1 focus:ring-ring outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Progress (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={form.progress}
                  onChange={(e) => setForm({ ...form, progress: Math.min(100, Math.max(0, Number(e.target.value) || 0)) })}
                  className="w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-1 focus:ring-ring outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-1 focus:ring-ring outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-4 py-2 rounded-md text-sm border border-border bg-background hover:bg-accent"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md text-sm bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Save className="h-4 w-4 mr-2" /> Save
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</div>
                <span className={`font-medium ${statusConfig.color}`}>{statusConfig.label}</span>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Progress</div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{milestone.progress}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-border mt-1 overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${milestone.progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Due Date</div>
                <span className="font-semibold">
                  <Calendar className="h-4 w-4 mr-1.5 inline" /> {formatDate(milestone.dueDate)}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Owner</div>
                <span className="font-semibold">
                  <User className="h-4 w-4 mr-1.5 inline" /> {milestone.owner || "—"}
                </span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Description</div>
              <p className="text-sm">{milestone.description}</p>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 rounded-md text-sm text-primary hover:bg-primary/10"
              >
                <Edit2 className="h-4 w-4 mr-1.5" /> Edit milestone
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
