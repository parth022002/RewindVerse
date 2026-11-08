"use client";

import React from "react";
import { ViewMode } from "../../lib/visualization/types";
import { Box, Layers, Cpu, HelpCircle } from "lucide-react";

interface ViewModeSelectorProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  supports3D: boolean;
  className?: string;
}

export function ViewModeSelector({
  currentMode,
  onModeChange,
  supports3D,
  className = "",
}: ViewModeSelectorProps) {
  if (!supports3D) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] text-xs text-[var(--text-muted)] ${className}`}>
        <Layers className="w-3.5 h-3.5 text-cyan-400" />
        <span className="font-semibold text-white">2D View</span>
        <span className="text-[10px] text-[var(--text-muted)] hidden sm:inline" title="3D is not meaningful for this scalar metric view">
          (Scalar View)
        </span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center p-0.5 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] text-xs font-semibold ${className}`}
      role="group"
      aria-label="Visualization Mode Selector"
    >
      <button
        type="button"
        onClick={() => onModeChange("2d")}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
          currentMode === "2d"
            ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm"
            : "text-[var(--text-muted)] hover:text-white"
        }`}
        title="Force 2D representation"
      >
        <Layers className="w-3 h-3" />
        2D
      </button>

      <button
        type="button"
        onClick={() => onModeChange("3d")}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
          currentMode === "3d"
            ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-sm"
            : "text-[var(--text-muted)] hover:text-white"
        }`}
        title="Interactive 3D representation"
      >
        <Box className="w-3 h-3" />
        3D
      </button>

      <button
        type="button"
        onClick={() => onModeChange("auto")}
        className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all ${
          currentMode === "auto"
            ? "bg-white/10 text-cyan-300 font-bold"
            : "text-[var(--text-muted)] hover:text-white"
        }`}
        title="Automatically select optimal representation"
      >
        <Cpu className="w-3 h-3" />
        Auto
      </button>
    </div>
  );
}

