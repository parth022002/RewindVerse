"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { runOptimizationSimulation, ObjectiveType, OptimizerType } from "@rewindverse/rewindml";
import { Play, Pause, RotateCcw, Sparkles, ChevronRight, Layers, Box } from "lucide-react";
import Link from "next/link";

const ThreeSurfaceViewer = dynamic(
  () =>
    import("./visualization/ThreeSurfaceViewer").then(
      (m) => m.ThreeSurfaceViewer
    ),
  { ssr: false }
);

export function HeroDemo() {
  const [optimizer, setOptimizer] = useState<OptimizerType>("momentum");
  const [objective, setObjective] = useState<ObjectiveType>("quadratic");
  const [learningRate, setLearningRate] = useState<number>(0.08);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<"2d" | "3d">("3d");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const initialPoint: [number, number] = useMemo(() => {
    if (objective === "rosenbrock") return [-1.2, 1.0];
    if (objective === "saddle") return [-1.5, 0.2];
    return [-4, 4];
  }, [objective]);

  // Deterministic simulation
  const simulation = useMemo(() => {
    return runOptimizationSimulation({
      objective,
      optimizer:
        optimizer === "adam"
          ? { type: "adam", learningRate, beta1: 0.9, beta2: 0.999, epsilon: 1e-8 }
          : optimizer === "momentum"
          ? { type: "momentum", learningRate, momentum: 0.85 }
          : { type: "sgd", learningRate },
      initialPoint,
      maxSteps: 60,
      seed: 42,
    });
  }, [optimizer, objective, learningRate, initialPoint]);

  const maxSteps = simulation.stepResults.length - 1;

  // Auto playback loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev >= maxSteps ? 0 : prev + 1));
    }, 110);
    return () => clearInterval(interval);
  }, [isPlaying, maxSteps]);

  // Render 2D contour & trajectory onto canvas
  useEffect(() => {
    if (viewMode !== "2d") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const toCanvasX = (x: number) => ((x + 5) / 10) * width;
    const toCanvasY = (y: number) => ((5 - y) / 10) * height;

    // Draw subtle contour rings
    ctx.strokeStyle = "rgba(58, 123, 213, 0.16)";
    ctx.lineWidth = 1;
    for (let r = 1; r <= 6; r++) {
      ctx.beginPath();
      const rx = (r / 6) * (width / 2);
      const ry = (r / 6) * (height / 2) * 0.35;
      ctx.ellipse(width / 2, height / 2, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Coordinate grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    // Draw trajectory up to current step
    const currentSteps = simulation.stepResults.slice(0, stepIndex + 1);
    if (currentSteps.length > 1) {
      ctx.strokeStyle = "#00f0ff";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "#00d2ff";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(toCanvasX(currentSteps[0].x), toCanvasY(currentSteps[0].y));
      for (let i = 1; i < currentSteps.length; i++) {
        ctx.lineTo(toCanvasX(currentSteps[i].x), toCanvasY(currentSteps[i].y));
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Active marker
    if (currentSteps.length > 0) {
      const active = currentSteps[currentSteps.length - 1];
      const cx = toCanvasX(active.x);
      const cy = toCanvasY(active.y);

      ctx.fillStyle = "rgba(0, 210, 255, 0.35)";
      ctx.beginPath();
      ctx.arc(cx, cy, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [simulation, stepIndex, viewMode]);

  const activeStep = simulation.stepResults[stepIndex] || simulation.stepResults[0];

  const trajectoryPoints = useMemo(() => {
    return simulation.stepResults.map((s, idx) => ({
      step: idx,
      x: s.x,
      y: s.y,
      loss: s.loss,
    }));
  }, [simulation]);

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-white/10 bg-[var(--surface-raised)]/90 backdrop-blur-2xl shadow-[0_0_80px_-20px_rgba(0,210,255,0.25)] p-4 sm:p-6 text-left transition-all">
      {/* Top Header & Controls Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/5">
        {/* Left: Optimizer & Landscape Switchers */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 2D / 3D Mode Toggle */}
          <div className="inline-flex rounded-xl bg-black/60 p-1 border border-white/10">
            <button
              onClick={() => setViewMode("3d")}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                viewMode === "3d"
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25"
                  : "text-[var(--text-muted)] hover:text-white"
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              3D Orbit
            </button>
            <button
              onClick={() => setViewMode("2d")}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                viewMode === "2d"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25"
                  : "text-[var(--text-muted)] hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              2D Contour
            </button>
          </div>

          {/* Optimizer Selector */}
          <div className="inline-flex rounded-xl bg-black/40 p-1 border border-white/10">
            {(["sgd", "momentum", "adam"] as OptimizerType[]).map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  setOptimizer(opt);
                  setStepIndex(0);
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  optimizer === opt
                    ? "bg-white/15 text-white font-bold"
                    : "text-[var(--text-muted)] hover:text-white"
                }`}
              >
                {opt.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Objective Surface Selector */}
          <select
            value={objective}
            onChange={(e) => {
              setObjective(e.target.value as ObjectiveType);
              setStepIndex(0);
            }}
            className="bg-black/40 border border-white/10 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium"
          >
            <option value="quadratic">Quadratic Ravine</option>
            <option value="rosenbrock">Rosenbrock Valley</option>
            <option value="saddle">Saddle Point</option>
          </select>
        </div>

        {/* Right: Transport & Learning Rate */}
        <div className="flex items-center gap-2">
          <select
            value={learningRate}
            onChange={(e) => {
              setLearningRate(Number(e.target.value));
              setStepIndex(0);
            }}
            className="bg-black/40 border border-white/10 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
          >
            <option value={0.03}>η = 0.03</option>
            <option value={0.08}>η = 0.08</option>
            <option value={0.18}>η = 0.18</option>
          </select>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 hover:bg-white/10 border border-white/10 text-xs font-medium text-white transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-cyan-400" /> : <Play className="w-3.5 h-3.5 text-cyan-400" />}
            {isPlaying ? "Pause" : "Play"}
          </button>

          <button
            onClick={() => setStepIndex(0)}
            className="p-1.5 rounded-lg bg-black/40 hover:bg-white/10 border border-white/10 text-[var(--text-muted)] hover:text-white transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main View Area & Live Telemetry HUD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-4 items-center">
        {/* Canvas / 3D Surface Viewport */}
        <div className="md:col-span-2 relative aspect-[16/10] rounded-2xl bg-black/50 border border-white/5 overflow-hidden flex items-center justify-center">
          {viewMode === "3d" ? (
            <ThreeSurfaceViewer
              objectiveType={objective}
              trajectory={trajectoryPoints}
              currentStepIndex={stepIndex}
              className="w-full h-full"
            />
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={520}
                height={325}
                className="w-full h-full object-contain"
              />
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-mono text-cyan-300 border border-white/10 flex items-center gap-1.5 pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                {objective.toUpperCase()} (2D Contour Projection)
              </div>
              <div className="absolute bottom-3 right-3 text-[10px] font-mono text-[var(--text-muted)] bg-black/60 px-2 py-0.5 rounded border border-white/5 pointer-events-none">
                Step {stepIndex} / {maxSteps}
              </div>
            </div>
          )}
        </div>

        {/* Live Metrics HUD */}
        <div className="space-y-2.5 font-mono text-xs">
          <div className="bg-black/30 p-3 rounded-xl border border-white/5">
            <span className="text-[10px] uppercase text-[var(--text-muted)] block mb-0.5">
              Loss f(θ)
            </span>
            <span className="text-xl font-bold text-white tracking-tight">
              {activeStep ? activeStep.loss.toFixed(6) : "0.000000"}
            </span>
          </div>

          <div className="bg-black/30 p-3 rounded-xl border border-white/5">
            <span className="text-[10px] uppercase text-[var(--text-muted)] block mb-0.5">
              Parameters [θ₁, θ₂]
            </span>
            <span className="text-xs font-semibold text-cyan-300">
              [{activeStep ? activeStep.x.toFixed(3) : "0"}, {activeStep ? activeStep.y.toFixed(3) : "0"}]
            </span>
          </div>

          <div className="bg-black/30 p-3 rounded-xl border border-white/5">
            <span className="text-[10px] uppercase text-[var(--text-muted)] block mb-0.5">
              Gradient Norm ||∇f||
            </span>
            <span className="text-xs font-semibold text-purple-300">
              {activeStep ? activeStep.gradNorm.toFixed(5) : "0"}
            </span>
          </div>

          <Link
            href={`/studio/lab?objective=${objective}&optimizer=${optimizer}`}
            className="group flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-cyan-950/60 to-blue-950/40 border border-cyan-800/40 text-cyan-200 text-xs font-sans hover:border-cyan-500/50 transition-all shadow-md"
          >
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Open in Rewind Lab
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Scrubber Slider */}
      <div className="pt-1">
        <input
          type="range"
          min={0}
          max={maxSteps}
          value={stepIndex}
          onChange={(e) => {
            setIsPlaying(false);
            setStepIndex(Number(e.target.value));
          }}
          className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-black/40 rounded-lg"
        />
      </div>
    </div>
  );
}
