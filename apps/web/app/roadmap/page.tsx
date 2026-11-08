import React from "react";
import Link from "next/link";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { CheckCircle2, Clock, Circle, ArrowRight } from "lucide-react";

export default function RoadmapPage() {
  const milestones = [
    {
      version: "v0.1 — Replay Foundation",
      status: "In Progress / Core Built",
      statusColor: "text-emerald-400 bg-emerald-950/60 border-emerald-800",
      description: "Interactive Optimizer Lab, RVTS format specification, deterministic Web Worker replay, CSV importer, and basic heuristics.",
      items: [
        "2D Quadratic, Rosenbrock, and Saddle objectives with SGD, Momentum, Adam",
        "Deterministic PRNG and Web Worker off-thread execution",
        "RVTS JSON Lines validator and capability-aware viewer",
        "Initial heuristic diagnostics (Plateau, Divergence, Oscillation)",
      ],
    },
    {
      version: "v0.2 — Supervised Learning & Comparison",
      status: "Next Horizon",
      statusColor: "text-cyan-400 bg-cyan-950/60 border-cyan-800",
      description: "Logistic regression lab, 2D decision boundary visualization, threshold sliders, and run compare workspace.",
      items: [
        "Binary classification lab with decision boundary overlays",
        "Threshold tuner with real-time confusion matrix",
        "Multi-run compare mode with alignment checks",
        "First 3 interactive Academy lessons with predict-before-run challenges",
      ],
    },
    {
      version: "v0.3 — Neural Learning",
      status: "Scheduled",
      statusColor: "text-violet-400 bg-violet-950/60 border-violet-800",
      description: "Small multi-layer perceptron (MLP) forward/backward propagation inspector and activation trajectories.",
      items: [
        "MLP training with backpropagation summaries",
        "Gradient flow inspection across layers",
        "Vanishing/exploding gradient detector with layer-level citations",
      ],
    },
    {
      version: "v1.0 — Public Release & Python Bridge",
      status: "Gated Target",
      statusColor: "text-slate-400 bg-slate-900 border-slate-700",
      description: "Python SDK (RunRecorder), CLI tools, optional read-only cloud sharing with Neon DB and S3 object storage.",
      items: [
        "rewindverse-trace PyPI package with PyTorch hooks",
        "rvtrace CLI (validate, inspect, view)",
        "Opt-in read-only share links (/share/[token]) backed by Neon Postgres and S3",
        "Full WCAG 2.2 AA accessibility and security sign-off",
      ],
    },
    {
      version: "v1.1+ — Data Observatory & Model Intelligence",
      status: "Future Expansion",
      statusColor: "text-slate-400 bg-slate-900 border-slate-700",
      description: "Dataset profiling, missingness, duplicate analysis, and calibration curve evaluation.",
      items: [
        "Rewind Data Observatory: local CSV profiling and data quality indicators",
        "Rewind Model Intelligence: calibration curves, error slicing, and model cards",
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Delivery Roadmap
          </span>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Transparent Release Horizons
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            Every product goal is gated by verified evidence and reproducible delivery.
            We do not claim capabilities before they pass automated test gates.
          </p>
        </div>

        <div className="space-y-6">
          {milestones.map((m) => (
            <div
              key={m.version}
              className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-lg font-bold text-white">{m.version}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-mono border self-start sm:self-auto ${m.statusColor}`}
                >
                  {m.status}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                {m.description}
              </p>
              <ul className="space-y-2 pt-2 border-t border-[var(--border)] text-xs text-slate-300">
                {m.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

