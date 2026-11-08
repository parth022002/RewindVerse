"use client";

import React, { useState } from "react";
import { Layers, Sparkles, Filter, Info } from "lucide-react";
import { ProvenanceBadge } from "./ProvenanceBadge";

interface ConvFilterSpec {
  id: string;
  name: string;
  purpose: string;
  kernel: number[][]; // 3x3 matrix
  featureMap: number[][]; // 8x8 sample activations
}

const CONV_FILTERS: ConvFilterSpec[] = [
  {
    id: "sobel_v",
    name: "Vertical Edge Detector (Sobel X)",
    purpose: "Detects sharp vertical luminosity gradients and vertical object boundaries.",
    kernel: [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1],
    ],
    featureMap: [
      [0.05, 0.90, 0.10, 0.05, 0.85, 0.12, 0.05, 0.02],
      [0.08, 0.95, 0.12, 0.08, 0.90, 0.15, 0.04, 0.03],
      [0.02, 0.88, 0.09, 0.04, 0.84, 0.10, 0.06, 0.01],
      [0.04, 0.92, 0.11, 0.06, 0.89, 0.14, 0.05, 0.02],
      [0.10, 0.98, 0.15, 0.09, 0.92, 0.18, 0.08, 0.05],
      [0.06, 0.91, 0.10, 0.05, 0.86, 0.12, 0.04, 0.02],
      [0.03, 0.87, 0.08, 0.03, 0.82, 0.09, 0.05, 0.01],
      [0.01, 0.82, 0.06, 0.02, 0.78, 0.08, 0.03, 0.01],
    ],
  },
  {
    id: "sobel_h",
    name: "Horizontal Edge Detector (Sobel Y)",
    purpose: "Detects horizontal transitions, ground planes, and horizon features.",
    kernel: [
      [-1, -2, -1],
      [0, 0, 0],
      [1, 2, 1],
    ],
    featureMap: [
      [0.05, 0.08, 0.04, 0.02, 0.06, 0.05, 0.03, 0.02],
      [0.85, 0.90, 0.88, 0.92, 0.86, 0.89, 0.84, 0.82],
      [0.12, 0.15, 0.10, 0.14, 0.11, 0.13, 0.09, 0.08],
      [0.06, 0.07, 0.05, 0.06, 0.05, 0.06, 0.04, 0.03],
      [0.88, 0.94, 0.91, 0.95, 0.90, 0.93, 0.87, 0.85],
      [0.10, 0.12, 0.09, 0.11, 0.08, 0.10, 0.07, 0.06],
      [0.04, 0.05, 0.03, 0.04, 0.03, 0.04, 0.02, 0.02],
      [0.02, 0.03, 0.02, 0.02, 0.02, 0.03, 0.01, 0.01],
    ],
  },
  {
    id: "laplace",
    name: "Ridge / Corner Detector (Laplacian)",
    purpose: "High-pass spatial filter computing second-order derivatives to highlight fine point textures.",
    kernel: [
      [0, 1, 0],
      [1, -4, 1],
      [0, 1, 0],
    ],
    featureMap: [
      [0.02, 0.04, 0.03, 0.02, 0.04, 0.03, 0.02, 0.01],
      [0.03, 0.85, 0.12, 0.04, 0.80, 0.10, 0.03, 0.02],
      [0.02, 0.15, 0.05, 0.02, 0.12, 0.04, 0.02, 0.01],
      [0.04, 0.06, 0.04, 0.92, 0.08, 0.05, 0.03, 0.02],
      [0.03, 0.78, 0.10, 0.05, 0.88, 0.14, 0.04, 0.02],
      [0.02, 0.10, 0.04, 0.02, 0.15, 0.05, 0.02, 0.01],
      [0.01, 0.03, 0.02, 0.01, 0.04, 0.03, 0.02, 0.01],
      [0.01, 0.02, 0.01, 0.01, 0.02, 0.02, 0.01, 0.00],
    ],
  },
];

interface CnnFeatureMapExplorerProps {
  filters?: ConvFilterSpec[];
  className?: string;
}

export function CnnFeatureMapExplorer({
  filters = CONV_FILTERS,
  className = "",
}: CnnFeatureMapExplorerProps) {
  const [selectedFilterIdx, setSelectedFilterIdx] = useState<number>(0);
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number; val: number } | null>(null);

  const activeFilter = filters[selectedFilterIdx] || filters[0];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filter Selector Toolbar */}
      <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((f, idx) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilterIdx(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                selectedFilterIdx === idx
                  ? "bg-purple-500/20 border border-purple-500 text-purple-300 font-bold"
                  : "bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-muted)] hover:text-white"
              }`}
            >
              {f.name.split(" ")[0]} ({f.id})
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ProvenanceBadge type="derived" />
          <span className="text-xs font-mono text-[var(--text-muted)]">
            Kernel: 3×3 Float32
          </span>
        </div>
      </div>

      {/* Main Grid: Kernel Weights (Left) vs Convolved Feature Map (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: 3x3 Convolution Kernel */}
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-4 shadow-xl">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400">
              3×3 Kernel Weights
            </h3>
            <p className="text-[11px] text-[var(--text-muted)] mt-1">
              Spatial convolution operator coefficients.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto py-4">
            {activeFilter.kernel.map((row, r) =>
              row.map((val, c) => (
                <div
                  key={`${r}-${c}`}
                  className="aspect-square rounded-lg bg-[var(--surface-raised)] border border-purple-500/30 flex items-center justify-center font-mono font-bold text-sm text-purple-200"
                >
                  {val > 0 ? `+${val}` : val}
                </div>
              ))
            )}
          </div>

          <div className="text-[11px] text-[var(--text-muted)] leading-relaxed border-t border-[var(--border)] pt-3">
            <strong>Purpose:</strong> {activeFilter.purpose}
          </div>
        </div>

        {/* Right: 8x8 Feature Map Activations */}
        <div className="md:col-span-2 p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Post-Convolution Activation Slices (Feature Map)
              </h3>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">
                Output activation tensor <code className="text-cyan-300">A = ReLU(K * X + b)</code> across spatial receptive field.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)] font-mono">
              <span>0.0</span>
              <div className="w-16 h-2 rounded bg-gradient-to-r from-slate-900 to-cyan-400" />
              <span>1.0</span>
            </div>
          </div>

          <div className="grid grid-cols-8 gap-1.5 max-w-[340px] mx-auto py-2">
            {activeFilter.featureMap.map((row, r) =>
              row.map((val, c) => {
                const isHovered = hoveredCell?.r === r && hoveredCell?.c === c;
                const opacity = Math.max(0.06, val);

                return (
                  <div
                    key={`${r}-${c}`}
                    onMouseEnter={() => setHoveredCell({ r, c, val })}
                    onMouseLeave={() => setHoveredCell(null)}
                    className={`aspect-square rounded-md flex items-center justify-center text-[10px] font-mono cursor-pointer transition-all ${
                      isHovered
                        ? "ring-2 ring-white scale-110 z-10 shadow-lg"
                        : "border border-white/5 hover:border-cyan-400/50"
                    }`}
                    style={{
                      backgroundColor: `rgba(0, 210, 255, ${opacity})`,
                      color: val > 0.5 ? "#000000" : "#ffffff",
                    }}
                  >
                    {val > 0.6 ? val.toFixed(1) : ""}
                  </div>
                );
              })
            )}
          </div>

          {/* Hover Detail Panel */}
          <div className="p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-between text-xs font-mono">
            {hoveredCell ? (
              <span className="text-white">
                Receptive Field Pixel: <strong className="text-cyan-300">({hoveredCell.r}, {hoveredCell.c})</strong> · Activation Strength: <strong className="text-purple-300">{hoveredCell.val.toFixed(3)}</strong>
              </span>
            ) : (
              <span className="text-[var(--text-muted)]">
                Hover over spatial activation units to inspect receptive field response.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
