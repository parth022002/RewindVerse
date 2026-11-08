"use client";

import React, { useState } from "react";
import {
  Sparkles,
  BarChart3,
  TrendingUp,
  Activity,
  Layers,
  HelpCircle,
  Eye,
  Sliders,
  CheckCircle2,
} from "lucide-react";

export default function ExplainabilityPage() {
  const [selectedFeature, setSelectedFeature] = useState<string>("tenure_months");

  // Permutation feature importance mock scores
  const featureImportances = [
    { name: "total_charges", importance: 0.38, std: 0.04 },
    { name: "tenure_months", importance: 0.28, std: 0.03 },
    { name: "monthly_charges", importance: 0.18, std: 0.02 },
    { name: "contract_type", importance: 0.11, std: 0.02 },
    { name: "payment_method", importance: 0.05, std: 0.01 },
  ];

  // Partial Dependence simulation curve
  const pdpCurve = [
    { x: 0, y: 0.12 },
    { x: 10, y: 0.18 },
    { x: 20, y: 0.29 },
    { x: 30, y: 0.44 },
    { x: 40, y: 0.58 },
    { x: 50, y: 0.72 },
    { x: 60, y: 0.81 },
    { x: 72, y: 0.86 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-violet-500/10 text-violet-400 border border-violet-500/20">
              Explainability Workbench
            </span>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              Specification §16.0 Conformance
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
            Feature Attribution & Model Interpretability
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Permutation Feature Importance (PFI), Partial Dependence (PDP), and Individual Conditional Expectation (ICE).
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-xs font-mono">
          <Eye className="w-4 h-4 text-violet-400" />
          <span className="text-white">Faithful Interpretation Guard: ACTIVE</span>
        </div>
      </div>

      {/* Permutation Importance & PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Permutation Feature Importance */}
        <div className="glass-panel p-6 rounded-2xl border-[var(--border)] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-violet-400" />
              <span>Permutation Feature Importance (PFI)</span>
            </h2>
            <span className="text-[10px] text-[var(--text-muted)] font-mono">Metric drop on shuffle</span>
          </div>

          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Measures the increase in prediction error after permuting the feature values, breaking the relationship
            between feature and target.
          </p>

          <div className="space-y-3 pt-2 text-xs font-mono">
            {featureImportances.map((f) => (
              <div key={f.name} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-white font-bold">{f.name}</span>
                  <span className="text-violet-300">
                    +{(f.importance * 100).toFixed(1)}% error (±{(f.std * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-white/[0.04] rounded-full overflow-hidden flex">
                  <div
                    className="bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full"
                    style={{ width: `${f.importance * 200}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partial Dependence Plot */}
        <div className="glass-panel p-6 rounded-2xl border-[var(--border)] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Partial Dependence Plot (PDP): {selectedFeature}</span>
            </h2>
            <select
              value={selectedFeature}
              onChange={(e) => setSelectedFeature(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] text-xs text-white focus:outline-none font-mono"
            >
              <option value="tenure_months">tenure_months</option>
              <option value="monthly_charges">monthly_charges</option>
              <option value="total_charges">total_charges</option>
            </select>
          </div>

          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Shows the marginal effect that the selected feature has on the predicted outcome of the model.
          </p>

          <div className="h-44 w-full bg-black/40 rounded-xl border border-[var(--border)] p-4 flex items-end justify-between gap-2">
            {pdpCurve.map((point) => (
              <div key={point.x} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[9px] font-mono text-cyan-300">{(point.y * 100).toFixed(0)}%</span>
                <div
                  className="w-full bg-cyan-500/80 hover:bg-cyan-400 rounded-t transition-all"
                  style={{ height: `${point.y * 70}%` }}
                />
                <span className="text-[9px] font-mono text-[var(--text-muted)]">{point.x}</span>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-violet-950/20 border border-violet-500/20 text-violet-300 text-[11px] flex items-center gap-2 font-mono">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Monotonic relationship observed: higher tenure correlates with increased prediction probability.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

