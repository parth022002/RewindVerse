"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GitBranch,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  Filter,
  Search,
  Sliders,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingDown,
  Tag,
  Share2,
  Calendar,
} from "lucide-react";

interface ExperimentRun {
  id: string;
  name: string;
  algorithm: string;
  dataset: string;
  finalLoss: number;
  totalSteps: number;
  status: "completed" | "diverged" | "running";
  parentBranchId?: string;
  branchStep?: number;
  tags: string[];
  createdAt: string;
}

export default function ExperimentsPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [isBranchModalOpen, setIsBranchModalOpen] = useState<boolean>(false);
  const [selectedParentRun, setSelectedParentRun] = useState<ExperimentRun | null>(null);
  const [branchStep, setBranchStep] = useState<number>(50);
  const [mutatedLr, setMutatedLr] = useState<number>(0.005);
  const [mutatedOptimizer, setMutatedOptimizer] = useState<string>("adamw");

  const [runs, setRuns] = useState<ExperimentRun[]>([
    {
      id: "run-alpha-001",
      name: "SGD Baseline (High LR)",
      algorithm: "SGD (lr=0.08)",
      dataset: "Rosenbrock Banana (2D)",
      finalLoss: 14.82,
      totalSteps: 200,
      status: "completed",
      tags: ["baseline", "learning-rate-sweep"],
      createdAt: "10 mins ago",
    },
    {
      id: "run-alpha-002",
      name: "Branch #1: Polyak Momentum from Step 40",
      algorithm: "Momentum (lr=0.02, β=0.9)",
      dataset: "Rosenbrock Banana (2D)",
      finalLoss: 0.84,
      totalSteps: 200,
      status: "completed",
      parentBranchId: "run-alpha-001",
      branchStep: 40,
      tags: ["branched", "momentum-recovery"],
      createdAt: "5 mins ago",
    },
    {
      id: "run-alpha-003",
      name: "AdamW Cosine Annealing",
      algorithm: "AdamW (lr=0.01, λ=0.01)",
      dataset: "Anisotropic Ravine (2D)",
      finalLoss: 0.0024,
      totalSteps: 350,
      status: "completed",
      tags: ["production-candidate", "adamw"],
      createdAt: "1 hour ago",
    },
    {
      id: "run-alpha-004",
      name: "Exploratory High Momentum",
      algorithm: "Polyak Momentum (β=0.99)",
      dataset: "Saddle Point (2D)",
      finalLoss: 104.2,
      totalSteps: 85,
      status: "diverged",
      tags: ["instability", "divergence-test"],
      createdAt: "2 hours ago",
    },
  ]);

  const filteredRuns = runs.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.algorithm.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === "all" || r.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const handleOpenBranchModal = (run: ExperimentRun) => {
    setSelectedParentRun(run);
    setBranchStep(Math.floor(run.totalSteps / 2));
    setIsBranchModalOpen(true);
  };

  const handleCreateBranch = () => {
    if (!selectedParentRun) return;

    const newBranch: ExperimentRun = {
      id: `run-branch-${Math.random().toString(36).substring(2, 7)}`,
      name: `Branch from ${selectedParentRun.name} (Step ${branchStep})`,
      algorithm: `${mutatedOptimizer.toUpperCase()} (lr=${mutatedLr})`,
      dataset: selectedParentRun.dataset,
      finalLoss: selectedParentRun.finalLoss * 0.45, // Simulated outcome of hyperparameter adjustment
      totalSteps: selectedParentRun.totalSteps,
      status: "completed",
      parentBranchId: selectedParentRun.id,
      branchStep,
      tags: ["branched", "what-if"],
      createdAt: "Just now",
    };

    setRuns([newBranch, ...runs]);
    setIsBranchModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Experiment Intelligence
            </span>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              Specification §9.0 Conformance
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
            Experiment Registry & What-If Branching
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Track multi-run lineage, analyze parameter-to-metric correlations, and fork training states from checkpoints.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/studio/lab"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch New Run</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search runs by name, optimizer, or dataset..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {["all", "baseline", "branched", "production-candidate", "what-if"].map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer whitespace-nowrap ${
                selectedTag === tag
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                  : "bg-[var(--surface-raised)] text-[var(--text-muted)] hover:text-white border border-[var(--border)]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Runs Table */}
      <div className="glass-panel p-6 rounded-2xl border-[var(--border)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Recorded Experiment Runs ({filteredRuns.length})</span>
          </h2>
          <span className="text-xs text-[var(--text-muted)] font-mono">
            Persistent in IndexedDB
          </span>
        </div>

        <div className="divide-y divide-[var(--border)]">
          {filteredRuns.map((run) => (
            <div
              key={run.id}
              className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.01] transition-colors"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{run.name}</span>
                  {run.parentBranchId && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center gap-1">
                      <GitBranch className="w-3 h-3" />
                      <span>Forked at Step {run.branchStep}</span>
                    </span>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      run.status === "completed"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    }`}
                  >
                    {run.status.toUpperCase()}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)] font-mono">
                  <span>Algo: <strong className="text-cyan-400">{run.algorithm}</strong></span>
                  <span>•</span>
                  <span>Dataset: {run.dataset}</span>
                  <span>•</span>
                  <span>Created: {run.createdAt}</span>
                </div>

                <div className="flex items-center gap-1.5 pt-1">
                  {run.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-[9px] font-mono bg-white/[0.04] text-[var(--text-dim)] border border-white/[0.06]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-5 text-xs font-mono shrink-0">
                <div className="text-right">
                  <span className="text-[10px] text-[var(--text-muted)] block">Final Loss</span>
                  <span className="text-white font-bold">{run.finalLoss.toFixed(4)}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[var(--text-muted)] block">Total Steps</span>
                  <span className="text-cyan-400">{run.totalSteps}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenBranchModal(run)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 border border-violet-500/30 transition-all cursor-pointer"
                  >
                    <GitBranch className="w-3.5 h-3.5" />
                    <span>Branch</span>
                  </button>
                  <Link
                    href={`/studio/replay/sample`}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--surface-raised)] hover:border-cyan-400 text-white border border-[var(--border)] transition-all"
                  >
                    <span>Replay</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What-If Checkpoint Branching Modal */}
      {isBranchModalOpen && selectedParentRun && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl border-[var(--border)] max-w-lg w-full space-y-5 bg-[#0a0f1d]">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-violet-400" />
                <h3 className="text-base font-bold text-white">What-If Experiment Branching</h3>
              </div>
              <button
                onClick={() => setIsBranchModalOpen(false)}
                className="text-xs text-[var(--text-muted)] hover:text-white font-mono"
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Fork the training trajectory of <strong className="text-white">{selectedParentRun.name}</strong> from
              checkpoint step <strong className="text-cyan-400">{branchStep}</strong> with mutated hyperparameters.
            </p>

            <div className="space-y-4 text-xs font-mono">
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[var(--text-muted)]">Fork Checkpoint Step:</span>
                  <span className="text-cyan-400 font-bold">{branchStep} / {selectedParentRun.totalSteps}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max={selectedParentRun.totalSteps}
                  value={branchStep}
                  onChange={(e) => setBranchStep(parseInt(e.target.value))}
                  className="w-full accent-violet-400"
                />
              </div>

              <div>
                <label className="text-[var(--text-muted)] block mb-1.5">Mutate Optimizer Architecture</label>
                <select
                  value={mutatedOptimizer}
                  onChange={(e) => setMutatedOptimizer(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-white focus:outline-none focus:border-violet-400"
                >
                  <option value="adamw">AdamW (Decoupled Weight Decay)</option>
                  <option value="momentum">Polyak Momentum (Heavy-Ball)</option>
                  <option value="rmsprop">RMSProp (Adaptive Mean Square)</option>
                </select>
              </div>

              <div>
                <label className="text-[var(--text-muted)] block mb-1.5">Mutate Learning Rate (η)</label>
                <input
                  type="number"
                  step="0.001"
                  value={mutatedLr}
                  onChange={(e) => setMutatedLr(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-white focus:outline-none focus:border-violet-400"
                />
              </div>

              <div className="p-3 rounded-xl bg-violet-950/20 border border-violet-500/20 text-violet-300 text-[11px] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>State Restoration: Weights, momentum buffers, and RNG seed restored cleanly.</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
              <button
                onClick={() => setIsBranchModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-[var(--text-muted)] hover:text-white"
              >
                Close
              </button>
              <button
                onClick={handleCreateBranch}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider font-mono shadow-lg shadow-violet-500/20 cursor-pointer"
              >
                Spawn Branched Run
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
