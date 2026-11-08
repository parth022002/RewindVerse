"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { runOptimizationSimulation, ObjectiveType } from "@rewindverse/rewindml";
import { listRecentRuns, StoredRun, getRunById } from "../../../lib/storage";
import { RvtsParsedTrace } from "@rewindverse/rvts";
import { ViewModeSelector } from "../../../components/visualization/ViewModeSelector";
import { ProvenanceBadge } from "../../../components/visualization/ProvenanceBadge";
import { ViewMode } from "../../../lib/visualization/types";
import {
  GitCompare,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Layers,
  ArrowRight,
  TrendingDown,
  Download,
} from "lucide-react";

// Client-only dynamic load for 3D Surface Viewer
const ThreeSurfaceViewer = dynamic(
  () =>
    import("../../../components/visualization/ThreeSurfaceViewer").then(
      (m) => m.ThreeSurfaceViewer
    ),
  { ssr: false }
);

interface TrajectoryPoint {
  step: number;
  x: number;
  y: number;
  loss: number;
}

interface CompareRunData {
  id: string;
  name: string;
  optimizer: string;
  objective: string;
  objectiveType: ObjectiveType;
  steps: { step: number; loss: number }[];
  trajectory: TrajectoryPoint[];
  finalLoss: number;
  totalSteps: number;
}

export default function ComparePage() {
  const [storedRuns, setStoredRuns] = useState<StoredRun[]>([]);
  const [selectedRunAId, setSelectedRunAId] = useState<string>("default_sgd");
  const [selectedRunBId, setSelectedRunBId] = useState<string>("default_adam");
  const [loadedCustomA, setLoadedCustomA] = useState<RvtsParsedTrace | null>(null);
  const [loadedCustomB, setLoadedCustomB] = useState<RvtsParsedTrace | null>(null);

  // 2D / 3D Visualization preference state
  const [viewMode, setViewMode] = useState<ViewMode>("3d");
  const [compareStep, setCompareStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    listRecentRuns().then(setStoredRuns).catch(console.error);
  }, []);

  // Built-in benchmark presets with complete 3D trajectory data
  const benchmarkSGD: CompareRunData = useMemo(() => {
    const sim = runOptimizationSimulation({
      objective: "quadratic",
      optimizer: { type: "sgd", learningRate: 0.08 },
      initialPoint: [-4, 4],
      maxSteps: 60,
      seed: 42,
    });
    return {
      id: "default_sgd",
      name: "Benchmark: Quadratic Ravine (SGD η=0.08)",
      optimizer: "SGD",
      objective: "Quadratic Ravine",
      objectiveType: "quadratic",
      steps: sim.stepResults.map((s, idx) => ({ step: idx, loss: s.loss })),
      trajectory: sim.stepResults.map((s, idx) => ({
        step: idx,
        x: s.x,
        y: s.y,
        loss: s.loss,
      })),
      finalLoss: sim.stepResults[sim.stepResults.length - 1]?.loss ?? 0,
      totalSteps: sim.stepResults.length,
    };
  }, []);

  const benchmarkAdam: CompareRunData = useMemo(() => {
    const sim = runOptimizationSimulation({
      objective: "quadratic",
      optimizer: { type: "adam", learningRate: 0.08, beta1: 0.9, beta2: 0.999, epsilon: 1e-8 },
      initialPoint: [-4, 4],
      maxSteps: 60,
      seed: 42,
    });
    return {
      id: "default_adam",
      name: "Benchmark: Quadratic Ravine (Adam η=0.08)",
      optimizer: "Adam",
      objective: "Quadratic Ravine",
      objectiveType: "quadratic",
      steps: sim.stepResults.map((s, idx) => ({ step: idx, loss: s.loss })),
      trajectory: sim.stepResults.map((s, idx) => ({
        step: idx,
        x: s.x,
        y: s.y,
        loss: s.loss,
      })),
      finalLoss: sim.stepResults[sim.stepResults.length - 1]?.loss ?? 0,
      totalSteps: sim.stepResults.length,
    };
  }, []);

  const benchmarkMomentum: CompareRunData = useMemo(() => {
    const sim = runOptimizationSimulation({
      objective: "quadratic",
      optimizer: { type: "momentum", learningRate: 0.08, momentum: 0.85 },
      initialPoint: [-4, 4],
      maxSteps: 60,
      seed: 42,
    });
    return {
      id: "default_momentum",
      name: "Benchmark: Quadratic Ravine (Momentum β=0.85)",
      optimizer: "Momentum",
      objective: "Quadratic Ravine",
      objectiveType: "quadratic",
      steps: sim.stepResults.map((s, idx) => ({ step: idx, loss: s.loss })),
      trajectory: sim.stepResults.map((s, idx) => ({
        step: idx,
        x: s.x,
        y: s.y,
        loss: s.loss,
      })),
      finalLoss: sim.stepResults[sim.stepResults.length - 1]?.loss ?? 0,
      totalSteps: sim.stepResults.length,
    };
  }, []);

  // Fetch custom runs when selected
  useEffect(() => {
    if (selectedRunAId.startsWith("default_")) {
      setLoadedCustomA(null);
    } else {
      getRunById(selectedRunAId).then((r) => setLoadedCustomA(r?.trace || null));
    }
  }, [selectedRunAId]);

  useEffect(() => {
    if (selectedRunBId.startsWith("default_")) {
      setLoadedCustomB(null);
    } else {
      getRunById(selectedRunBId).then((r) => setLoadedCustomB(r?.trace || null));
    }
  }, [selectedRunBId]);

  // Helper to resolve custom trace data
  const parseCustomRun = (
    trace: RvtsParsedTrace,
    fallbackObjective: ObjectiveType
  ): CompareRunData => {
    const steps = trace.steps.map((s) => ({
      step: s.step,
      loss: s.metrics?.loss ?? 0,
    }));
    const trajectory: TrajectoryPoint[] = [];
    for (const s of trace.steps) {
      const p = s.parameters?.theta || s.parameters?.weights;
      if (Array.isArray(p) && p.length >= 2) {
        trajectory.push({
          step: s.step,
          x: p[0],
          y: p[1],
          loss: s.metrics?.loss ?? 0,
        });
      }
    }

    const objName = (trace.manifest.model_or_objective?.name || "").toLowerCase();
    const resolvedObj: ObjectiveType = objName.includes("rosenbrock")
      ? "rosenbrock"
      : objName.includes("saddle")
      ? "saddle"
      : fallbackObjective;

    return {
      id: trace.manifest.run_id,
      name: trace.manifest.name,
      optimizer: String(trace.manifest.hyperparameters?.optimizer || "Custom"),
      objective: trace.manifest.model_or_objective?.name || "Workspace Run",
      objectiveType: resolvedObj,
      steps,
      trajectory,
      finalLoss: steps[steps.length - 1]?.loss ?? 0,
      totalSteps: steps.length,
    };
  };

  // Resolve Run A data
  const runA: CompareRunData = useMemo(() => {
    if (loadedCustomA) {
      return parseCustomRun(loadedCustomA, "quadratic");
    }
    if (selectedRunAId === "default_adam") return benchmarkAdam;
    if (selectedRunAId === "default_momentum") return benchmarkMomentum;
    return benchmarkSGD;
  }, [loadedCustomA, selectedRunAId, benchmarkSGD, benchmarkAdam, benchmarkMomentum]);

  // Resolve Run B data
  const runB: CompareRunData = useMemo(() => {
    if (loadedCustomB) {
      return parseCustomRun(loadedCustomB, "quadratic");
    }
    if (selectedRunBId === "default_sgd") return benchmarkSGD;
    if (selectedRunBId === "default_momentum") return benchmarkMomentum;
    return benchmarkAdam;
  }, [loadedCustomB, selectedRunBId, benchmarkSGD, benchmarkAdam, benchmarkMomentum]);

  const maxSteps = Math.max(runA.steps.length, runB.steps.length, 1);
  const maxLoss = Math.max(
    runA.steps[0]?.loss || 1,
    runB.steps[0]?.loss || 1,
    ...runA.steps.map((s) => s.loss),
    ...runB.steps.map((s) => s.loss),
    1
  );

  // Auto playback loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCompareStep((prev) => {
        if (prev >= maxSteps - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 110);
    return () => clearInterval(interval);
  }, [isPlaying, maxSteps]);

  const lossRatio =
    runA.finalLoss > 0
      ? (runB.finalLoss / runA.finalLoss).toFixed(2)
      : "N/A";

  const has3DParity = runA.trajectory.length > 0 && runB.trajectory.length > 0;

  const handleExportComparison = () => {
    try {
      const report = {
        exported_at: new Date().toISOString(),
        run_a: {
          id: runA.id,
          name: runA.name,
          optimizer: runA.optimizer,
          objective: runA.objective,
          final_loss: runA.finalLoss,
          total_steps: runA.totalSteps,
        },
        run_b: {
          id: runB.id,
          name: runB.name,
          optimizer: runB.optimizer,
          objective: runB.objective,
          final_loss: runB.finalLoss,
          total_steps: runB.totalSteps,
        },
        metrics: {
          loss_ratio_b_over_a: lossRatio,
        },
      };
      const jsonStr = JSON.stringify(report, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rewindverse-compare-${runA.id}-vs-${runB.id}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export comparison report:", err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <GitCompare className="w-6 h-6 text-emerald-400" />
            Rewind Compare
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Side-by-side run alignment, simultaneous 2D/3D dual-trajectory replay, and convergence comparison.
          </p>
        </div>

        {/* View Mode Toolbar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={handleExportComparison}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold bg-white/5 border-white/10 text-white hover:bg-white/10 transition-all"
            title="Download JSON comparison summary"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            Export JSON
          </button>
          <ProvenanceBadge type={has3DParity ? "recorded" : "derived"} />
          <ViewModeSelector
            currentMode={viewMode}
            onModeChange={setViewMode}
            supports3D={has3DParity}
          />
        </div>
      </div>

      {/* Selectors for Run A and Run B */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-[var(--surface)] border border-cyan-500/30 space-y-2">
          <label className="block text-xs font-bold text-cyan-400 uppercase tracking-wider">
            Run A (Cyan Path)
          </label>
          <select
            value={selectedRunAId}
            onChange={(e) => {
              setSelectedRunAId(e.target.value);
              setCompareStep(0);
            }}
            className="w-full bg-[var(--surface-raised)] border border-[var(--border)] text-xs text-white rounded-lg px-3 py-2"
          >
            <optgroup label="Presets & Benchmarks">
              <option value="default_sgd">Benchmark: SGD (Quadratic Ravine)</option>
              <option value="default_momentum">Benchmark: Momentum (Quadratic Ravine)</option>
              <option value="default_adam">Benchmark: Adam (Quadratic Ravine)</option>
            </optgroup>
            {storedRuns.length > 0 && (
              <optgroup label="Your Workspace Runs">
                {storedRuns.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.stepsCount} steps)
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        </div>

        <div className="p-4 rounded-xl bg-[var(--surface)] border border-purple-500/30 space-y-2">
          <label className="block text-xs font-bold text-purple-400 uppercase tracking-wider">
            Run B (Violet Path)
          </label>
          <select
            value={selectedRunBId}
            onChange={(e) => {
              setSelectedRunBId(e.target.value);
              setCompareStep(0);
            }}
            className="w-full bg-[var(--surface-raised)] border border-[var(--border)] text-xs text-white rounded-lg px-3 py-2"
          >
            <optgroup label="Presets & Benchmarks">
              <option value="default_adam">Benchmark: Adam (Quadratic Ravine)</option>
              <option value="default_momentum">Benchmark: Momentum (Quadratic Ravine)</option>
              <option value="default_sgd">Benchmark: SGD (Quadratic Ravine)</option>
            </optgroup>
            {storedRuns.length > 0 && (
              <optgroup label="Your Workspace Runs">
                {storedRuns.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.stepsCount} steps)
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        </div>
      </div>

      {/* Comparison Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Run A Summary */}
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              {runA.name}
            </span>
            <span className="text-xs font-mono text-[var(--text-muted)]">{runA.optimizer}</span>
          </div>
          <div className="text-xs font-mono space-y-1.5 text-[var(--text-muted)]">
            <div className="flex justify-between">
              <span>Final Loss:</span>
              <span className="text-white font-bold">{runA.finalLoss.toFixed(6)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Steps:</span>
              <span className="text-white">{runA.totalSteps}</span>
            </div>
            <div className="flex justify-between">
              <span>Objective:</span>
              <span className="text-cyan-300">{runA.objective}</span>
            </div>
          </div>
        </div>

        {/* Run B Summary */}
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">
              {runB.name}
            </span>
            <span className="text-xs font-mono text-[var(--text-muted)]">{runB.optimizer}</span>
          </div>
          <div className="text-xs font-mono space-y-1.5 text-[var(--text-muted)]">
            <div className="flex justify-between">
              <span>Final Loss:</span>
              <span className="text-white font-bold">{runB.finalLoss.toFixed(6)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Steps:</span>
              <span className="text-white">{runB.totalSteps}</span>
            </div>
            <div className="flex justify-between">
              <span>Objective:</span>
              <span className="text-violet-300">{runB.objective}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Synchronized Replay & Scrubber Controls */}
      <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold hover:shadow-cyan-500/20 shadow-md transition-all"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? "Pause" : "Play Dual Replay"}
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setCompareStep((prev) => Math.min(maxSteps - 1, prev + 1));
              }}
              className="px-3 py-2 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] text-xs text-white hover:bg-[var(--surface-overlay)]"
            >
              Step +1
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setCompareStep(0);
              }}
              className="p-2 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-muted)] hover:text-white"
              title="Reset to Step 0"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="text-xs font-mono text-[var(--text-muted)]">
            Synchronized Step: <strong className="text-white font-bold">{compareStep}</strong> / {maxSteps - 1}
          </div>
        </div>

        <input
          type="range"
          min={0}
          max={maxSteps - 1}
          value={compareStep}
          onChange={(e) => {
            setIsPlaying(false);
            setCompareStep(Number(e.target.value));
          }}
          className="w-full accent-cyan-400 cursor-pointer h-2 bg-[var(--surface-raised)] rounded-lg"
        />
      </div>

      {/* Main Visualization: 3D Surface vs 2D Overlay Chart */}
      {viewMode === "3d" && has3DParity ? (
        <ThreeSurfaceViewer
          objectiveType={runA.objectiveType}
          trajectory={runA.trajectory}
          secondaryTrajectory={runB.trajectory}
          currentStepIndex={compareStep}
        />
      ) : (
        /* 2D Overlay Chart */
        <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Overlay Loss Trajectory (2D)
            </h3>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-3 h-0.5 bg-cyan-400" /> {runA.name.slice(0, 22)}...
              </span>
              <span className="flex items-center gap-1.5 text-violet-400">
                <span className="w-3 h-0.5 bg-violet-400" /> {runB.name.slice(0, 22)}...
              </span>
            </div>
          </div>

          <div className="relative aspect-[21/9] w-full bg-[var(--background)] rounded-xl border border-[var(--border)] p-4 flex items-end">
            <svg
              className="w-full h-full overflow-visible"
              viewBox={`0 0 ${Math.max(1, maxSteps - 1)} 100`}
            >
              {/* Horizontal Grid lines */}
              <line x1="0" y1="25" x2={maxSteps - 1} y2="25" stroke="rgba(255,255,255,0.05)" />
              <line x1="0" y1="50" x2={maxSteps - 1} y2="50" stroke="rgba(255,255,255,0.05)" />
              <line x1="0" y1="75" x2={maxSteps - 1} y2="75" stroke="rgba(255,255,255,0.05)" />

              {/* Scrubber indicator line */}
              <line
                x1={compareStep}
                y1="0"
                x2={compareStep}
                y2="100"
                stroke="rgba(255, 255, 255, 0.4)"
                strokeDasharray="3 3"
              />

              {/* Run A Polyline: Cyan */}
              {runA.steps.length > 1 && (
                <polyline
                  fill="none"
                  stroke="#00d2ff"
                  strokeWidth="2.5"
                  points={runA.steps
                    .map((s, idx) => `${idx},${100 - (s.loss / maxLoss) * 88}`)
                    .join(" ")}
                />
              )}

              {/* Run B Polyline: Violet */}
              {runB.steps.length > 1 && (
                <polyline
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="2.5"
                  points={runB.steps
                    .map((s, idx) => `${idx},${100 - (s.loss / maxLoss) * 88}`)
                    .join(" ")}
                />
              )}

              {/* Active step dots */}
              {runA.steps[compareStep] && (
                <circle
                  cx={compareStep}
                  cy={100 - (runA.steps[compareStep].loss / maxLoss) * 88}
                  r="5"
                  fill="#00d2ff"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              )}
              {runB.steps[compareStep] && (
                <circle
                  cx={compareStep}
                  cy={100 - (runB.steps[compareStep].loss / maxLoss) * 88}
                  r="5"
                  fill="#a855f7"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              )}
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-2 border-t border-[var(--border)]">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Comparison metric: Run B / Run A final loss ratio ={" "}
              <strong className="text-white font-mono">{lossRatio}x</strong>
            </span>
            <span className="font-mono text-[11px]">Normalized to global peak loss</span>
          </div>
        </div>
      )}
    </div>
  );
}
