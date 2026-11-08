"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Compass, Sparkles, Filter, ShieldCheck } from "lucide-react";
import { ProvenanceBadge } from "../../../components/visualization/ProvenanceBadge";

const ThreeEmbeddingProjector = dynamic(
  () =>
    import("../../../components/visualization/ThreeEmbeddingProjector").then(
      (m) => m.ThreeEmbeddingProjector
    ),
  { ssr: false }
);

export default function EmbeddingsPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Compass className="w-6 h-6 text-cyan-400" />
            3D Embedding Projector
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            High-dimensional representation inspection via deterministic Principal Component Analysis (PCA).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ProvenanceBadge type="projected" />
          <div className="px-3 py-1 rounded-lg bg-cyan-950/40 border border-cyan-800/60 text-xs font-mono text-cyan-300">
            Local PCA · Zero Cloud Transmission
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/50 text-xs text-cyan-200/90 leading-relaxed flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <strong>Dimensionality Reduction Disclosure:</strong> Linear PCA projects high-dimensional embedding spaces onto the top 3 orthogonal axes of maximum variance.
          While PCA preserves global variance, Euclidean distances in the 3D subspace are approximations of original high-dimensional manifolds.
        </div>
      </div>

      <ThreeEmbeddingProjector />
    </div>
  );
}

