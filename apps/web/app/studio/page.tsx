"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Cpu,
  RotateCcw,
  UploadCloud,
  ArrowRight,
  BookOpen,
  Clock,
  Trash2,
  Play,
  Database,
  CheckCircle2,
  GitCompare,
  Sparkles,
  Layers,
  Wrench,
} from "lucide-react";
import { listRecentRuns, deleteRunById, StoredRun } from "../../lib/storage";

export default function StudioHomePage() {
  const [savedRuns, setSavedRuns] = useState<StoredRun[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadRuns = async () => {
    try {
      const runs = await listRecentRuns(10);
      setSavedRuns(runs);
    } catch (err) {
      console.error("Failed to load local runs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRuns();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Delete this local experiment run?")) {
      await deleteRunById(id);
      loadRuns();
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome & Status Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Rewind Studio Workspace
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Deterministic browser-first ML training, replay analysis, and diagnostics.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] text-xs text-emerald-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          RewindML Engine Ready (Offline)
        </div>
      </div>

      {/* Quick Action Workspace Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Algorithm Forge */}
        <Link
          href="/studio/forge"
          className="p-6 rounded-2xl glass-panel glass-card-interactive group flex flex-col justify-between border-cyan-500/30"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-950/80 to-blue-950/80 border border-cyan-700/60 flex items-center justify-center text-cyan-300 mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/10">
              <Wrench className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="text-base font-bold text-white">Algorithm Forge</h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                New
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Safe visual node builder, formula DSL editor, fork workflow, and local Web Worker interpreter.
            </p>
          </div>
          <div className="mt-5 flex items-center text-xs font-semibold text-cyan-400 gap-1.5">
            Launch Forge <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Algorithm Catalogue */}
        <Link
          href="/studio/algorithms"
          className="p-6 rounded-2xl glass-panel glass-card-interactive group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-800/60 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="text-base font-bold text-white">Algorithm Catalogue</h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Registry
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Browse verified mathematical formulas, assumptions, RVTS trace capabilities, and provenance standards.
            </p>
          </div>
          <div className="mt-5 flex items-center text-xs font-semibold text-purple-400 gap-1.5">
            Explore Catalogue <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Launch Lab */}
        <Link
          href="/studio/lab"
          className="p-6 rounded-2xl glass-panel glass-card-interactive group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-800/60 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5">Interactive Optimizer Lab</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Continuous 2D & 3D loss surfaces, binary classifier decision boundaries, and real-time step streaming.
            </p>
          </div>
          <div className="mt-5 flex items-center text-xs font-semibold text-cyan-400 gap-1.5">
            Launch Lab <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Replay Viewer */}
        <Link
          href="/studio/replay/sample"
          className="p-6 rounded-2xl glass-panel glass-card-interactive group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-800/60 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5">Trace Replay Viewer</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              O(1) deterministic scrubbing, 3D surface trajectories, neural architecture graphs, and parameter inspection.
            </p>
          </div>
          <div className="mt-5 flex items-center text-xs font-semibold text-blue-400 gap-1.5">
            Open Replay <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Run Compare */}
        <Link
          href="/studio/compare"
          className="p-6 rounded-2xl glass-panel glass-card-interactive group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <GitCompare className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5">Dual-Run Compare</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Simultaneous 3D dual-trajectory overlays, synchronized scrubbers, and convergence ratio metrics.
            </p>
          </div>
          <div className="mt-5 flex items-center text-xs font-semibold text-emerald-400 gap-1.5">
            Compare Runs <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Diagnostic Insights */}
        <Link
          href="/studio/insights"
          className="p-6 rounded-2xl glass-panel glass-card-interactive group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-violet-950/60 border border-violet-800/60 flex items-center justify-center text-violet-400 mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5">Insights & Internals</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Heuristic failure detectors, multi-head attention matrices, and CNN spatial activation filters.
            </p>
          </div>
          <div className="mt-5 flex items-center text-xs font-semibold text-violet-400 gap-1.5">
            View Insights <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* 3D Embedding Projector */}
        <Link
          href="/studio/embeddings"
          className="p-6 rounded-2xl glass-panel glass-card-interactive group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-950/60 border border-indigo-800/60 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5">3D Embedding Projector</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Interactive high-dimensional vector space exploration with deterministic Power Iteration PCA in 3D.
            </p>
          </div>
          <div className="mt-5 flex items-center text-xs font-semibold text-indigo-400 gap-1.5">
            Explore Embeddings <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Import Center */}
        <Link
          href="/studio/import"
          className="p-6 rounded-2xl glass-panel glass-card-interactive group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-800/60 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5">Import Trace or CSV</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Drop in PyTorch/Wandb CSV files with automatic column mapping or load verified <code className="text-purple-300">.rvtrace</code> logs.
            </p>
          </div>
          <div className="mt-5 flex items-center text-xs font-semibold text-purple-400 gap-1.5">
            Upload File <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Local Experiment Runs Section */}
      <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            Your Saved Experiment Runs (IndexedDB)
          </h3>
          <span className="text-xs font-mono text-[var(--text-muted)]">
            {savedRuns.length} stored locally
          </span>
        </div>

        {savedRuns.length === 0 ? (
          <div className="p-8 rounded-xl bg-[var(--surface-raised)] border border-dashed border-[var(--border)] text-center">
            <p className="text-xs text-[var(--text-muted)]">
              No saved experiments yet. Run an optimization simulation in the Optimizer Lab and click &quot;Save Run&quot; to keep your runs locally!
            </p>
            <div className="mt-4">
              <Link
                href="/studio/lab"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-950/60 border border-cyan-800 text-cyan-300 hover:bg-cyan-900/60"
              >
                Go to Optimizer Lab <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {savedRuns.map((run) => (
              <div
                key={run.id}
                className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] hover:border-cyan-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-white">{run.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800 text-cyan-300">
                      {run.optimizer.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-[var(--text-muted)] font-mono space-x-3">
                    <span>Steps: {run.stepsCount}</span>
                    <span>Final Loss: {run.finalLoss.toFixed(5)}</span>
                    <span>Date: {new Date(run.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/studio/replay/${run.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm hover:scale-[1.02] transition-transform"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    Replay Run
                  </Link>
                  <button
                    onClick={(e) => handleDelete(run.id, e)}
                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-950/30 transition-colors"
                    title="Delete local run"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Featured Guided Experiments & Academy Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Standard Benchmark Experiments
            </h3>
            <span className="text-xs text-[var(--text-muted)]">Curated Fixtures</span>
          </div>

          <div className="space-y-3">
            {[
              {
                title: "Anisotropic Quadratic Ravine",
                desc: "Compare how vanilla SGD oscillates perpendicular to the gradient while Momentum accelerates along the valley floor.",
                objective: "quadratic",
                optimizer: "momentum",
                href: "/studio/lab?objective=quadratic&optimizer=momentum",
              },
              {
                title: "Rosenbrock Banana Valley Escape",
                desc: "Test Adam's second moment scaling when navigating curved valleys with steep non-convex walls.",
                objective: "rosenbrock",
                optimizer: "adam",
                href: "/studio/lab?objective=rosenbrock&optimizer=adam",
              },
              {
                title: "Saddle Point Instability",
                desc: "Observe how gradient descent escapes an unstable saddle point with noisy or momentum updates.",
                objective: "saddle",
                optimizer: "sgd",
                href: "/studio/lab?objective=saddle&optimizer=sgd",
              },
            ].map((exp) => (
              <div
                key={exp.title}
                className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <h4 className="text-sm font-bold text-white">{exp.title}</h4>
                  <p className="text-xs text-[var(--text-muted)] mt-1">{exp.desc}</p>
                </div>
                <Link
                  href={exp.href}
                  className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-950/60 border border-cyan-800/80 text-cyan-300 hover:bg-cyan-900/60 transition-colors"
                >
                  Load Lab
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Academy Lesson Card */}
        <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-400 mb-3">
              <BookOpen className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Rewind Academy</span>
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Lesson 1: The Ravine Dilemma
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">
              Predict how changing the learning rate from 0.05 to 0.2 alters optimizer trajectories before executing the run.
            </p>
            <div className="text-xs text-[var(--text-muted)] space-y-1.5 font-mono">
              <div>• Level: Beginner</div>
              <div>• Est. Time: 5 mins</div>
              <div>• Concepts: SGD, Ravines, Learning Rate</div>
            </div>
          </div>

          <div className="pt-6 border-t border-[var(--border)]">
            <Link
              href="/studio/academy"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 transition-colors"
            >
              Start Lesson <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
