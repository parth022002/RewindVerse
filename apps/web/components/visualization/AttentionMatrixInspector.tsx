"use client";

import React, { useState, useMemo } from "react";
import { Sparkles, AlertTriangle, Layers, Info, CheckCircle2 } from "lucide-react";
import { ProvenanceBadge } from "./ProvenanceBadge";

interface AttentionHeadData {
  headId: number;
  name: string;
  weights: number[][]; // N x N matrix
}

const SAMPLE_TOKENS = ["Every", "model", "has", "a", "story", "replay", "how", "it", "learned"];

// Synthetic multi-head attention weight distributions
const SAMPLE_HEADS: AttentionHeadData[] = [
  {
    headId: 1,
    name: "Head 1 · Syntactic Subject-Verb Alignment",
    weights: [
      [0.65, 0.20, 0.05, 0.02, 0.03, 0.02, 0.01, 0.01, 0.01],
      [0.15, 0.55, 0.18, 0.02, 0.04, 0.02, 0.01, 0.02, 0.01],
      [0.05, 0.12, 0.62, 0.05, 0.08, 0.03, 0.02, 0.02, 0.01],
      [0.02, 0.03, 0.05, 0.72, 0.12, 0.02, 0.01, 0.02, 0.01],
      [0.03, 0.06, 0.08, 0.10, 0.58, 0.08, 0.03, 0.02, 0.02],
      [0.02, 0.04, 0.05, 0.03, 0.12, 0.54, 0.10, 0.04, 0.06],
      [0.01, 0.02, 0.03, 0.02, 0.05, 0.12, 0.60, 0.09, 0.06],
      [0.01, 0.02, 0.02, 0.02, 0.04, 0.05, 0.10, 0.68, 0.06],
      [0.02, 0.03, 0.03, 0.02, 0.06, 0.08, 0.10, 0.12, 0.54],
    ],
  },
  {
    headId: 2,
    name: "Head 2 · Long-Range Semantic Association",
    weights: [
      [0.30, 0.05, 0.05, 0.05, 0.15, 0.20, 0.05, 0.05, 0.10],
      [0.05, 0.25, 0.05, 0.05, 0.10, 0.35, 0.05, 0.05, 0.05],
      [0.05, 0.05, 0.30, 0.05, 0.10, 0.25, 0.05, 0.05, 0.10],
      [0.02, 0.02, 0.05, 0.40, 0.25, 0.10, 0.06, 0.05, 0.05],
      [0.10, 0.15, 0.05, 0.10, 0.30, 0.15, 0.05, 0.05, 0.05],
      [0.25, 0.15, 0.05, 0.05, 0.15, 0.20, 0.05, 0.05, 0.05],
      [0.05, 0.05, 0.05, 0.05, 0.05, 0.15, 0.40, 0.10, 0.10],
      [0.05, 0.05, 0.05, 0.05, 0.05, 0.10, 0.15, 0.45, 0.05],
      [0.15, 0.20, 0.05, 0.05, 0.10, 0.15, 0.05, 0.10, 0.15],
    ],
  },
  {
    headId: 3,
    name: "Head 3 · Positional Recency Bias",
    weights: [
      [0.85, 0.15, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00],
      [0.30, 0.70, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00],
      [0.10, 0.35, 0.55, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00],
      [0.05, 0.10, 0.35, 0.50, 0.00, 0.00, 0.00, 0.00, 0.00],
      [0.02, 0.05, 0.15, 0.38, 0.40, 0.00, 0.00, 0.00, 0.00],
      [0.01, 0.02, 0.05, 0.12, 0.35, 0.45, 0.00, 0.00, 0.00],
      [0.01, 0.01, 0.03, 0.05, 0.15, 0.35, 0.40, 0.00, 0.00],
      [0.00, 0.01, 0.02, 0.03, 0.08, 0.16, 0.35, 0.35, 0.00],
      [0.00, 0.01, 0.01, 0.02, 0.05, 0.10, 0.20, 0.31, 0.30],
    ],
  },
];

interface AttentionMatrixInspectorProps {
  tokens?: string[];
  heads?: AttentionHeadData[];
  className?: string;
}

export function AttentionMatrixInspector({
  tokens = SAMPLE_TOKENS,
  heads = SAMPLE_HEADS,
  className = "",
}: AttentionMatrixInspectorProps) {
  const [selectedHeadIdx, setSelectedHeadIdx] = useState<number>(0);
  const [hoveredCell, setHoveredCell] = useState<{ query: number; key: number } | null>(null);

  const activeHead = heads[selectedHeadIdx] || heads[0];
  const matrix = activeHead.weights;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Non-Causality Warning Alert (Required by Section 5.8) */}
      <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/50 flex items-start gap-2.5 text-xs text-amber-200/90 leading-relaxed">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong>Interpretability Disclosure (Jain &amp; Wallace / Wiegreffe &amp; Pinter):</strong> Attention weights represent internal routing geometry (<code className="text-amber-300">A = Softmax(Q·Kᵀ / √d_k)</code>), not causal explanation. High attention between tokens does not establish that token X caused prediction Y.
        </div>
      </div>

      {/* Head Selection Toolbar */}
      <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {heads.map((h, idx) => (
            <button
              key={h.headId}
              onClick={() => setSelectedHeadIdx(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                selectedHeadIdx === idx
                  ? "bg-cyan-500/20 border border-cyan-500 text-cyan-300 font-bold"
                  : "bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-muted)] hover:text-white"
              }`}
            >
              Head {h.headId}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ProvenanceBadge type="recorded" />
          <span className="text-xs font-mono text-[var(--text-muted)] truncate max-w-xs">
            {activeHead.name}
          </span>
        </div>
      </div>

      {/* Interactive Heatmap Matrix */}
      <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-4 shadow-xl overflow-x-auto">
        <div className="min-w-[480px]">
          {/* Column Headers (Keys) */}
          <div className="flex items-center pl-24 mb-1">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block w-full text-center">
              Keys (Attended To) →
            </span>
          </div>

          <div className="grid grid-cols-[100px_repeat(9,1fr)] gap-1">
            {/* Empty top-left cell */}
            <div className="flex items-end justify-end pr-2 pb-1 text-[10px] font-mono text-purple-400">
              Query ↓
            </div>

            {/* Token Key Labels */}
            {tokens.map((tok, cIdx) => (
              <div
                key={cIdx}
                className="text-[10px] font-mono text-[var(--text-muted)] text-center truncate py-1 border-b border-white/5"
                title={tok}
              >
                {tok}
              </div>
            ))}

            {/* Matrix Rows (Queries) */}
            {tokens.map((qTok, rIdx) => (
              <React.Fragment key={rIdx}>
                {/* Query Row Label */}
                <div
                  className="flex items-center justify-end pr-3 text-[10px] font-mono text-[var(--text-muted)] truncate"
                  title={qTok}
                >
                  {qTok}
                </div>

                {/* Cells in Row */}
                {tokens.map((_, cIdx) => {
                  const weight = matrix[rIdx]?.[cIdx] ?? 0;
                  const isHovered =
                    hoveredCell?.query === rIdx && hoveredCell?.key === cIdx;

                  // Opacity mapped to weight
                  const bgOpacity = Math.max(0.04, Math.min(0.95, weight * 1.1));

                  return (
                    <div
                      key={cIdx}
                      onMouseEnter={() => setHoveredCell({ query: rIdx, key: cIdx })}
                      onMouseLeave={() => setHoveredCell(null)}
                      className={`aspect-square rounded-md flex items-center justify-center text-[10px] font-mono cursor-pointer transition-all ${
                        isHovered
                          ? "ring-2 ring-cyan-400 z-10 scale-110 shadow-lg"
                          : "border border-white/5 hover:border-cyan-500/40"
                      }`}
                      style={{
                        backgroundColor: `rgba(0, 210, 255, ${bgOpacity})`,
                        color: weight > 0.4 ? "#000000" : "#ffffff",
                      }}
                      title={`Query: "${qTok}" → Key: "${tokens[cIdx]}" | Weight: ${(weight * 100).toFixed(1)}%`}
                    >
                      {weight > 0.15 ? weight.toFixed(2) : ""}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Hovered Cell Detail Strip */}
        <div className="p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-between text-xs font-mono">
          {hoveredCell ? (
            <div className="flex items-center gap-2">
              <span className="text-purple-300 font-bold">
                Query: &quot;{tokens[hoveredCell.query]}&quot;
              </span>
              <span className="text-[var(--text-muted)]">attends to</span>
              <span className="text-cyan-300 font-bold">
                Key: &quot;{tokens[hoveredCell.key]}&quot;
              </span>
              <span className="text-[var(--text-muted)] ml-2">with weight:</span>
              <span className="text-white font-bold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                {((matrix[hoveredCell.query]?.[hoveredCell.key] ?? 0) * 100).toFixed(2)}%
              </span>
            </div>
          ) : (
            <span className="text-[var(--text-muted)]">
              Hover over any cell in the attention matrix to inspect Query-Key routing coefficients.
            </span>
          )}

          <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)]">
            <span>Low (0%)</span>
            <div className="w-16 h-2 rounded bg-gradient-to-r from-cyan-950 to-cyan-400" />
            <span>High (100%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
