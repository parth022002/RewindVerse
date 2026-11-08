"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import {
  Sparkles,
  ArrowRight,
  Play,
  RotateCcw,
  Sliders,
  CheckCircle2,
  FileCode,
  Terminal,
  Activity,
  Layers,
  ShieldCheck,
  ChevronRight,
  Eye,
  GitCompare,
} from "lucide-react";

const STAGES = [
  {
    id: "train",
    num: "01",
    title: "Train Your Model",
    subtitle: "In Python or In-Browser",
    desc: "Train models using PyTorch, Scikit-learn, TensorFlow, or our native in-browser RewindML engine. You control your architecture, loss function, and optimizer hyperparameters with zero proprietary wrappers.",
    code: `# Standard PyTorch loop with RewindVerse
import torch
import torch.nn as nn
from rewindverse_trace import RunRecorder

model = MyClassifier()
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)`,
    highlight: "Zero vendor lock-in. Works with any existing machine learning workflow.",
    tags: ["PyTorch", "Scikit-Learn", "RewindML Engine", "Web Workers"],
  },
  {
    id: "record",
    num: "02",
    title: "Record Training Trajectories",
    subtitle: "Streaming RVTS Telemetry",
    desc: "A lightweight context manager logs step metrics, parameter slices, and gradient norms asynchronously to a portable .rvtrace JSON Lines file with negligible microsecond overhead.",
    code: `with RunRecorder("run_01", output_path="experiment.rvtrace") as rec:
    for epoch, (x, y) in enumerate(dataloader):
        loss = criterion(model(x), y)
        loss.backward()
        optimizer.step()

        # Log step telemetry
        rec.log_step(step=epoch, metrics={"loss": loss.item()})`,
    highlight: "Non-blocking streaming I/O. Formula-sanitized and validated against JSON Schema Draft 2020-12.",
    tags: ["RVTS v0.1.0", "Microsecond Overhead", "JSON Lines", "Safe Serialization"],
  },
  {
    id: "replay",
    num: "03",
    title: "Deterministic Replay",
    subtitle: "O(1) Step Indexing in 2D & 3D",
    desc: "Drop the .rvtrace file into Rewind Studio or scrub local runs. Step forward, rewind, pause, and seek with zero dropped frames. Loss curves, parameter paths, and 3D objective surfaces stay synchronized in real-time.",
    code: `// Browser Replay State Machine:
replayEngine.seekIndex(42);
// Synchronously updates:
// 1. Loss trajectory SVG curve
// 2. 2D parameter contour canvas
// 3. 3D WebGL surface active sphere marker
// 4. Exact gradient tensor inspector`,
    highlight: "Hardware-accelerated 60 FPS scrubber with full keyboard navigation (Space, Arrow keys, Home, End).",
    tags: ["WebGL 2", "Three.js", "Synchronized Scrubber", "Keyboard Shortcuts"],
  },
  {
    id: "inspect",
    num: "04",
    title: "Deep Parameter Inspection",
    subtitle: "Layer Prisms & Embeddings",
    desc: "Move beyond scalar loss charts. Orbit 3D neural layer graphs, inspect multi-head attention matrix alignments, explore convolutional feature maps, or project high-dimensional representations via local PCA.",
    code: `// Deterministic in-browser PCA projection:
const [pc1, pc2, pc3] = computeTop3PrincipalComponents(embeddings);
// Renders 3D glassmorphic vector space
// Discloses exact subspace explained variance (84.7%)`,
    highlight: "Rigorous scientific disclosure: projected slices and attention matrices explicitly state their provenance.",
    tags: ["Power Iteration PCA", "Attention Matrix", "CNN Feature Maps", "Provenance Badging"],
  },
  {
    id: "understand",
    num: "05",
    title: "Diagnostic Insights & Action",
    subtitle: "Evidence-Backed Failure Analysis",
    desc: "Rewind Insights scans the trace for divergence, loss plateaus, vanishing gradients, and learning rate instability. Every finding cites exact step ranges and delivers concrete remediation recommendations.",
    code: `Diagnostic Report:
- Finding: Learning Rate Oscillation (High Severity)
- Steps: 12 to 28
- Evidence: Loss variance σ=0.48 exceeding threshold 0.15
- Recommendation: Decay learning rate by 50% or introduce momentum β=0.9`,
    highlight: "Explains WHY the run failed, pinpointing exact epochs and citing numerical evidence.",
    tags: ["Automated Heuristics", "Exact Step Citations", "Remediation Guides", "Explainable ML"],
  },
  {
    id: "forge",
    num: "06",
    title: "Algorithm Forge & Custom Rules",
    subtitle: "Declarative Update Engineering",
    desc: "Design new optimization algorithms or customize built-in baselines. Use Mode A (parameter fork), Mode B (visual node pipeline), or Mode C (algebraic formula DSL) validated by an allowlisted AST interpreter with zero eval risks.",
    code: `// Algorithm Forge Declarative Manifest:
{
  "mode": "formula",
  "formula": "p - lr * clamp(g, -1, 1) - lr * wd * p",
  "parameters": { "learningRate": 0.05, "wd": 0.01 },
  "executionBudget": { "fuelLimit": 50000, "maxSteps": 300 }
}
// Executes in client Web Worker sandbox with fuel accounting`,
    highlight: "Safe in-browser algorithm experimentation without arbitrary code execution vulnerabilities.",
    tags: ["AST Allowlist", "Fuel Accounting", "Worker Isolation", "Declarative Manifests"],
  },
];

export default function HowItWorksPage() {
  const [activeStageId, setActiveStageId] = useState<string>("train");
  const activeStage = STAGES.find((s) => s.id === activeStageId) || STAGES[0];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] selection:bg-cyan-500 selection:text-black">
      <Navbar />

      <main className="flex-1">
        {/* Header Hero */}
        <section className="relative pt-16 pb-14 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-medium mb-5 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The 6-Stage Core Workflow</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              From Model Script to <br />
              <span className="brand-gradient-text">Complete Training Story.</span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
              Understand the complete journey: how models log step telemetry, stream portable RVTS traces,
              replay deterministically inside any browser, and customize update rules in Algorithm Forge.
            </p>
          </div>
        </section>

        {/* Interactive 6-Stage Stepper Navigation */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 p-2 rounded-2xl glass-panel">
            {STAGES.map((stage) => (
              <button
                key={stage.id}
                onClick={() => setActiveStageId(stage.id)}
                className={`flex flex-col items-start p-3.5 rounded-xl text-left transition-all ${
                  activeStageId === stage.id
                    ? "bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-violet-500/20 border border-cyan-500/50 shadow-md"
                    : "hover:bg-white/5 border border-transparent text-[var(--text-muted)] hover:text-white"
                }`}
              >
                <span className={`text-[11px] font-mono font-bold mb-1 ${activeStageId === stage.id ? "text-cyan-400" : "text-slate-500"}`}>
                  STAGE {stage.num}
                </span>
                <span className="text-xs sm:text-sm font-bold text-white leading-tight">
                  {stage.title}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Active Stage Deep Dive */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start p-8 rounded-3xl glass-panel shadow-2xl">
            {/* Left Narrative Column */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-950/60 border border-cyan-800/60 text-xs font-mono text-cyan-300">
                <span>Stage {activeStage.num} of 05</span> • <span>{activeStage.subtitle}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {activeStage.title}
              </h2>

              <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                {activeStage.desc}
              </p>

              {/* Highlight Callout */}
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200/90 leading-relaxed flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{activeStage.highlight}</span>
              </div>

              {/* Capability Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {activeStage.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-white/5 border border-white/10 text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Code & Mechanism Box */}
            <div className="lg:col-span-6 rounded-2xl border border-white/10 bg-black/70 p-5 font-mono text-xs shadow-2xl backdrop-blur-xl overflow-hidden">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-[11px] text-[var(--text-muted)]">
                <span className="text-cyan-400">Mechanism Preview</span>
                <span className="text-slate-400">Stage {activeStage.num}</span>
              </div>
              <pre className="text-slate-200 leading-relaxed overflow-x-auto p-1">
                {activeStage.code}
              </pre>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center pb-20">
          <div className="p-8 sm:p-12 rounded-3xl glass-panel text-center relative overflow-hidden">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Ready to see the workflow in action?
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-lg mx-auto mb-6">
              Launch Rewind Studio right now. Simulate optimizers in 3D, inspect recorded checkpoints, or drag and drop your own training CSV.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/studio"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:scale-[1.02] transition-transform"
              >
                <Sparkles className="w-4 h-4" />
                Open Rewind Studio
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/visualizations"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
              >
                <Eye className="w-4 h-4 text-cyan-400" />
                Explore 3D Visualizer Gallery
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

