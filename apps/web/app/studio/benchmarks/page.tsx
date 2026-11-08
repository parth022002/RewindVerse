"use client";

import React, { useState } from "react";
import {
  Trophy,
  ShieldCheck,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  Filter,
  BarChart3,
  TrendingDown,
  Clock,
  Compass,
  FileCheck,
} from "lucide-react";

interface BenchmarkEntry {
  id: string;
  rank: number;
  algorithmName: string;
  author: string;
  track: "optimization" | "classical_ml" | "robustness";
  scoreMetric: string;
  scoreValue: number;
  stepsToConvergence: number;
  runtimeMs: number;
  verificationTier: "verified" | "reproducible" | "self_reported";
  date: string;
}

export default function BenchmarksPage() {
  const [selectedTrack, setSelectedTrack] = useState<string>("optimization");
  const [isRunningBench, setIsRunningBench] = useState<boolean>(false);

  const [leaderboard, setLeaderboard] = useState<BenchmarkEntry[]>([
    {
      id: "bm-001",
      rank: 1,
      algorithmName: "AdamW (Decoupled Weight Decay)",
      author: "RewindML Core Team",
      track: "optimization",
      scoreMetric: "Final Loss",
      scoreValue: 0.00012,
      stepsToConvergence: 142,
      runtimeMs: 24,
      verificationTier: "verified",
      date: "2026-11-05",
    },
    {
      id: "bm-002",
      rank: 2,
      algorithmName: "Polyak Heavy-Ball Momentum",
      author: "Algorithm Forge Community",
      track: "optimization",
      scoreMetric: "Final Loss",
      scoreValue: 0.00284,
      stepsToConvergence: 188,
      runtimeMs: 19,
      verificationTier: "verified",
      date: "2026-11-06",
    },
    {
      id: "bm-003",
      rank: 3,
      algorithmName: "Nesterov Accelerated Gradient (NAG)",
      author: "Research Contributor",
      track: "optimization",
      scoreMetric: "Final Loss",
      scoreValue: 0.00512,
      stepsToConvergence: 220,
      runtimeMs: 28,
      verificationTier: "reproducible",
      date: "2026-11-07",
    },
    {
      id: "bm-004",
      rank: 4,
      algorithmName: "Vanilla SGD with Step Decay",
      author: "Baseline Benchmark",
      track: "optimization",
      scoreMetric: "Final Loss",
      scoreValue: 0.0482,
      stepsToConvergence: 490,
      runtimeMs: 15,
      verificationTier: "verified",
      date: "2026-11-01",
    },
    {
      id: "bm-101",
      rank: 1,
      algorithmName: "Stratified L2 Logistic Regression",
      author: "RewindML Core Team",
      track: "classical_ml",
      scoreMetric: "F1 Score",
      scoreValue: 0.942,
      stepsToConvergence: 50,
      runtimeMs: 12,
      verificationTier: "verified",
      date: "2026-11-04",
    },
  ]);

  const filteredEntries = leaderboard.filter((e) => e.track === selectedTrack);

  const handleRunTrack = () => {
    setIsRunningBench(true);
    setTimeout(() => {
      setIsRunningBench(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
              RewindBench
            </span>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              Specification §13.0 Conformance
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
            Standardized Benchmark Tracks & Verifiable Leaderboard
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Fair, reproducible evaluation with explicit verification tiers, fixed seeds, and transparent conditions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunTrack}
            disabled={isRunningBench}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
          >
            {isRunningBench ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>Running Benchmark Suite...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Submit to Track</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Benchmark Track Selector */}
      <div className="flex items-center gap-3 border-b border-[var(--border)] pb-2 overflow-x-auto text-xs font-mono">
        {[
          { id: "optimization", label: "Track A: Continuous Optimization (Rosenbrock)" },
          { id: "classical_ml", label: "Track B: Classical ML & Classification" },
          { id: "robustness", label: "Track C: Adversarial & Noise Perturbations" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTrack(t.id)}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              selectedTrack === t.id
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold"
                : "text-[var(--text-muted)] hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Verification Tiers Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
        <div className="p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <span className="text-white font-bold block">Independently Verified</span>
            <span className="text-[10px] text-[var(--text-muted)]">Automated container run with identical hash.</span>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <div>
            <span className="text-white font-bold block">Reproducible</span>
            <span className="text-[10px] text-[var(--text-muted)]">Code, seeds, and artifacts confirmed.</span>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] flex items-center gap-2.5">
          <FileCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <span className="text-white font-bold block">Self-Reported</span>
            <span className="text-[10px] text-[var(--text-muted)]">Submitted with trace log; pending review.</span>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="glass-panel p-6 rounded-2xl border-[var(--border)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Track Leaderboard Standings</h2>
          </div>
          <span className="text-xs text-[var(--text-muted)] font-mono">
            {filteredEntries.length} Verified Entries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--text-muted)]">
                <th className="pb-3 font-semibold">Rank</th>
                <th className="pb-3 font-semibold">Algorithm</th>
                <th className="pb-3 font-semibold">Author</th>
                <th className="pb-3 font-semibold">Primary Metric</th>
                <th className="pb-3 font-semibold">Steps</th>
                <th className="pb-3 font-semibold">Runtime</th>
                <th className="pb-3 font-semibold">Verification Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredEntries.map((e) => (
                <tr key={e.id} className="hover:bg-white/[0.02]">
                  <td className="py-3 font-bold text-amber-400">#{e.rank}</td>
                  <td className="py-3 font-bold text-white">{e.algorithmName}</td>
                  <td className="py-3 text-[var(--text-muted)]">{e.author}</td>
                  <td className="py-3 text-cyan-300 font-bold">
                    {e.scoreMetric}: {e.scoreValue}
                  </td>
                  <td className="py-3 text-white">{e.stepsToConvergence} steps</td>
                  <td className="py-3 text-[var(--text-muted)]">{e.runtimeMs} ms</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        e.verificationTier === "verified"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : e.verificationTier === "reproducible"
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {e.verificationTier.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
