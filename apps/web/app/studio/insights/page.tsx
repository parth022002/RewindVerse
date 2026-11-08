"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { runOptimizationSimulation } from "@rewindverse/rewindml";
import { analyzeTraceDiagnostics } from "@rewindverse/diagnostics";
import { AttentionMatrixInspector } from "../../../components/visualization/AttentionMatrixInspector";
import { CnnFeatureMapExplorer } from "../../../components/visualization/CnnFeatureMapExplorer";
import { Sparkles, AlertCircle, Info, CheckCircle2, ArrowRight, Activity, Eye, Grid } from "lucide-react";

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState<"diagnostics" | "attention" | "cnn">("diagnostics");

  const simulation = useMemo(() => {
    return runOptimizationSimulation({
      objective: "quadratic",
      optimizer: { type: "sgd", learningRate: 0.19 },
      initialPoint: [-4, 4],
      maxSteps: 60,
      seed: 42,
    });
  }, []);

  const report = useMemo(() => {
    return analyzeTraceDiagnostics(simulation.trace);
  }, [simulation]);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-violet-400" />
            Rewind Insights Diagnostic Center
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Evidence-backed heuristic diagnostics and internal model representation inspection.
          </p>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
          <button
            onClick={() => setActiveTab("diagnostics")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "diagnostics"
                ? "bg-violet-500/20 border border-violet-500/50 text-violet-300"
                : "text-[var(--text-muted)] hover:text-white"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Heuristics
          </button>
          <button
            onClick={() => setActiveTab("attention")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "attention"
                ? "bg-cyan-500/20 border border-cyan-500/50 text-cyan-300"
                : "text-[var(--text-muted)] hover:text-white"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Attention Matrix
          </button>
          <button
            onClick={() => setActiveTab("cnn")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "cnn"
                ? "bg-purple-500/20 border border-purple-500/50 text-purple-300"
                : "text-[var(--text-muted)] hover:text-white"
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            CNN Feature Maps
          </button>
        </div>
      </div>

      {activeTab === "attention" ? (
        <AttentionMatrixInspector />
      ) : activeTab === "cnn" ? (
        <CnnFeatureMapExplorer />
      ) : (
        <div className="space-y-4">
          {report.findings.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No Diagnostic Anomalies</h3>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Optimization converged smoothly without oscillation or plateauing.
              </p>
            </div>
          ) : (
            report.findings.map((finding) => (
              <div
                key={finding.id}
                className="p-6 rounded-2xl glass-panel glass-card-interactive hover:border-violet-500/50 space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800 text-[10px] font-mono text-amber-300 uppercase">
                        {finding.category}
                      </span>
                      <span className="text-xs text-[var(--text-muted)] font-mono">
                        Detector: {finding.detectorName} v{finding.detectorVersion}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white">{finding.title}</h3>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-violet-950/60 border border-violet-800 text-xs font-mono text-violet-300 shrink-0">
                    Steps {finding.stepRange[0]}–{finding.stepRange[1]}
                  </span>
                </div>

                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  {finding.summary}
                </p>

                {/* Exact Evidence Citation Box */}
                <div className="p-3.5 rounded-xl bg-[var(--background)] border border-[var(--border)] font-mono text-xs text-cyan-300">
                  <span className="text-[10px] uppercase text-[var(--text-muted)] block mb-1">
                    Recorded Evidence
                  </span>
                  {finding.evidenceExplanation}
                </div>

                {/* Actionable Recommendations */}
                <div>
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">
                    Actionable Recommendations:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[var(--text-muted)]">
                    {finding.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-cyan-400 mt-0.5">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

