"use client";

import React, { useMemo } from "react";
import {
  GitCompare,
  TrendingDown,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { runOptimizationSimulation, ObjectiveType } from "@rewindverse/rewindml";

export interface BenchmarkComparatorProps {
  objective: ObjectiveType;
  initialPoint: [number, number];
  maxSteps: number;
  customFinalLoss?: number;
  customStepsCount?: number;
  customDiverged?: boolean;
}

export function BenchmarkComparator({
  objective,
  initialPoint,
  maxSteps,
  customFinalLoss,
  customStepsCount,
  customDiverged,
}: BenchmarkComparatorProps) {
  // Compute baseline benchmarks on identical objective and starting point
  const baselines = useMemo(() => {
    // 1. Vanilla SGD
    const sgdRun = runOptimizationSimulation({
      objective,
      optimizer: { type: "sgd", learningRate: 0.08 },
      initialPoint,
      maxSteps,
      seed: 42,
    });

    // 2. Momentum
    const momRun = runOptimizationSimulation({
      objective,
      optimizer: { type: "momentum", learningRate: 0.08, momentum: 0.85 },
      initialPoint,
      maxSteps,
      seed: 42,
    });

    // 3. Adam
    const adamRun = runOptimizationSimulation({
      objective,
      optimizer: { type: "adam", learningRate: 0.08, beta1: 0.9, beta2: 0.999, epsilon: 1e-8 },
      initialPoint,
      maxSteps,
      seed: 42,
    });

    return [
      {
        name: "Custom Forge Algorithm",
        category: "Custom",
        finalLoss: customFinalLoss !== undefined ? customFinalLoss : 0.045,
        steps: customStepsCount || maxSteps,
        diverged: customDiverged || false,
        color: "text-cyan-400",
        bg: "bg-cyan-950/40 border-cyan-500",
      },
      {
        name: "Baseline Polyak Momentum",
        category: "Standard",
        finalLoss: momRun.stepResults[momRun.stepResults.length - 1]?.loss ?? 0,
        steps: momRun.stepResults.length,
        diverged: momRun.diverged,
        color: "text-violet-400",
        bg: "bg-violet-950/20 border-violet-800/40",
      },
      {
        name: "Baseline Adam Optimizer",
        category: "Standard",
        finalLoss: adamRun.stepResults[adamRun.stepResults.length - 1]?.loss ?? 0,
        steps: adamRun.stepResults.length,
        diverged: adamRun.diverged,
        color: "text-emerald-400",
        bg: "bg-emerald-950/20 border-emerald-800/40",
      },
      {
        name: "Baseline Vanilla SGD",
        category: "Standard",
        finalLoss: sgdRun.stepResults[sgdRun.stepResults.length - 1]?.loss ?? 0,
        steps: sgdRun.stepResults.length,
        diverged: sgdRun.diverged,
        color: "text-amber-400",
        bg: "bg-amber-950/20 border-amber-800/40",
      },
    ];
  }, [objective, initialPoint, maxSteps, customFinalLoss, customStepsCount, customDiverged]);

  return (
    <div className="p-5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Multi-Optimizer Benchmark Telemetry
          </h3>
        </div>
        <span className="text-[11px] font-mono text-[var(--text-muted)]">
          Landscape: <strong className="text-cyan-300 capitalize">{objective}</strong> · Seed: 42
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-[var(--border)] text-[var(--text-muted)] text-[11px]">
              <th className="py-2 px-3">Optimizer Model</th>
              <th className="py-2 px-3">Category</th>
              <th className="py-2 px-3">Final Loss</th>
              <th className="py-2 px-3">Total Steps</th>
              <th className="py-2 px-3">Convergence Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {baselines.map((b) => (
              <tr key={b.name} className="hover:bg-white/[0.02]">
                <td className="py-2.5 px-3 font-bold flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${b.diverged ? "bg-red-400" : "bg-emerald-400"}`} />
                  <span className={b.color}>{b.name}</span>
                </td>
                <td className="py-2.5 px-3 text-[var(--text-muted)]">{b.category}</td>
                <td className="py-2.5 px-3 font-semibold text-white">
                  {b.diverged ? "DIVERGED" : b.finalLoss.toFixed(5)}
                </td>
                <td className="py-2.5 px-3 text-slate-300">{b.steps}</td>
                <td className="py-2.5 px-3">
                  {b.diverged ? (
                    <span className="text-red-400 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Diverged
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Converged
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
