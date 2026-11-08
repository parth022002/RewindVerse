"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  AlgorithmManifest,
  ForgeCreationMode,
  FORGE_TEMPLATES,
  validateAlgorithmManifest,
  runForgeAlgorithm,
  ForgeRunResult,
  ObjectiveType,
  getObjective,
} from "@rewindverse/rewindml";
import {
  Wrench,
  ShieldCheck,
  Zap,
  Play,
  Pause,
  RotateCcw,
  Download,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Code2,
  GitBranch,
  Layers,
  ArrowRight,
  Database,
  Calculator,
  Compass,
  Flame,
  FileText,
  Sparkles,
} from "lucide-react";

import { DataWorkbench } from "../../../features/algorithm-forge/DataWorkbench";
import { EquationStudio } from "../../../features/algorithm-forge/EquationStudio";
import { FlowBuilder } from "../../../features/algorithm-forge/FlowBuilder";
import { CodeStudio } from "../../../features/algorithm-forge/CodeStudio";
import { BenchmarkComparator } from "../../../features/algorithm-forge/BenchmarkComparator";

const ThreeSurfaceViewer = dynamic(
  () =>
    import("../../../components/visualization/ThreeSurfaceViewer").then(
      (m) => m.ThreeSurfaceViewer
    ),
  { ssr: false }
);

type ActiveForgeTab = "equation" | "flow" | "code" | "data" | "customize";

export default function AlgorithmForgePage() {
  const [activeTab, setActiveTab] = useState<ActiveForgeTab>("equation");
  const [manifest, setManifest] = useState<AlgorithmManifest>(FORGE_TEMPLATES[0]);
  const [selectedObjective, setSelectedObjective] = useState<ObjectiveType>("quadratic");
  const [initialX, setInitialX] = useState<number>(-2.8);
  const [initialY, setInitialY] = useState<number>(2.5);
  const [maxSteps, setMaxSteps] = useState<number>(100);
  const [visDimension, setVisDimension] = useState<"2d" | "3d">("2d");

  // Execution Results
  const [runResult, setRunResult] = useState<ForgeRunResult | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionError, setExecutionError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Real-time Static Validation
  const validation = useMemo(() => {
    return validateAlgorithmManifest(manifest);
  }, [manifest]);

  // Handle template selection
  const handleSelectTemplate = (templateId: string) => {
    const tmpl = FORGE_TEMPLATES.find((t) => t.id === templateId);
    if (tmpl) {
      setManifest(JSON.parse(JSON.stringify(tmpl)));
      setRunResult(null);
    }
  };

  // Run Sandboxed Execution
  const handleRunAlgorithm = useCallback(() => {
    if (!validation.valid) return;
    setIsRunning(true);
    setExecutionError(null);

    try {
      const result = runForgeAlgorithm({
        manifest,
        objective: selectedObjective,
        initialPoint: [initialX, initialY],
        maxSteps,
      });
      setRunResult(result);
      setActiveStep(result.stepResults.length - 1);
    } catch (err: any) {
      setExecutionError(err.message || "Execution failed");
    } finally {
      setIsRunning(false);
    }
  }, [validation.valid, manifest, selectedObjective, initialX, initialY, maxSteps]);

  // Auto-run on first load
  useEffect(() => {
    handleRunAlgorithm();
  }, [handleRunAlgorithm]);

  // Animation player loop
  useEffect(() => {
    if (!isPlaying || !runResult) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= runResult.stepResults.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying, runResult]);

  // Draw 2D Contour & Trajectory Canvas
  useEffect(() => {
    if (visDimension !== "2d") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const obj = getObjective(selectedObjective);
    const [xMin, xMax] = obj.domain.x;
    const [yMin, yMax] = obj.domain.y;

    const toCanvasX = (x: number) => ((x - xMin) / (xMax - xMin)) * width;
    const toCanvasY = (y: number) => ((yMax - y) / (yMax - yMin)) * height;

    // Draw coordinate grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let c = 0; c <= 8; c++) {
      const gx = (c / 8) * width;
      const gy = (c / 8) * height;
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, height);
      ctx.moveTo(0, gy);
      ctx.lineTo(width, gy);
      ctx.stroke();
    }

    // Draw stylized contour ellipses
    ctx.strokeStyle = "rgba(0, 242, 254, 0.18)";
    for (let r = 1; r <= 7; r++) {
      ctx.beginPath();
      const radiusX = (r / 7) * (width * 0.45);
      const radiusY =
        selectedObjective === "quadratic"
          ? (r / 7) * (height * 0.22)
          : (r / 7) * (height * 0.42);
      ctx.ellipse(width / 2, height / 2, radiusX, radiusY, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw global minimum target
    if (obj.globalMinimum) {
      const minX = toCanvasX(obj.globalMinimum[0]);
      const minY = toCanvasY(obj.globalMinimum[1]);
      ctx.fillStyle = "rgba(16, 185, 129, 0.8)";
      ctx.beginPath();
      ctx.arc(minX, minY, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw trajectory points if runResult exists
    if (runResult && runResult.stepResults.length > 0) {
      const visibleSteps = runResult.stepResults.slice(0, activeStep + 1);

      if (visibleSteps.length > 1) {
        ctx.strokeStyle = runResult.diverged ? "#ef4444" : "#00f2fe";
        ctx.lineWidth = 2.5;
        ctx.shadowColor = runResult.diverged ? "#ef4444" : "#00f2fe";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(toCanvasX(visibleSteps[0].x), toCanvasY(visibleSteps[0].y));
        for (let i = 1; i < visibleSteps.length; i++) {
          ctx.lineTo(toCanvasX(visibleSteps[i].x), toCanvasY(visibleSteps[i].y));
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Draw current active location point
      const current = visibleSteps[visibleSteps.length - 1];
      if (current) {
        const cx = toCanvasX(current.x);
        const cy = toCanvasY(current.y);

        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#00f2fe";
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  }, [runResult, activeStep, selectedObjective, visDimension]);

  // Export Trace File
  const handleDownloadTrace = () => {
    if (!runResult) return;
    const blob = new Blob([runResult.jsonl], { type: "application/x-jsonlines" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${manifest.id}_trace.rvtrace`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export Manifest JSON
  const handleDownloadManifest = () => {
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${manifest.id}_manifest.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export Markdown Research Report
  const handleExportResearchReport = () => {
    const lastStep = runResult?.stepResults[runResult.stepResults.length - 1];
    const md = [
      `# Algorithm Forge Research Report`,
      ``,
      `**Algorithm ID:** \`${manifest.id}\`  `,
      `**Algorithm Name:** ${manifest.name}  `,
      `**Mode:** \`${manifest.mode}\`  `,
      `**Author:** ${manifest.author || "Research Scientist"}  `,
      `**Date:** ${new Date().toISOString()}  `,
      ``,
      `---`,
      ``,
      `## 1. Mathematical Formulation & Architecture`,
      `- **Equation / Update Rule:** \`${manifest.formula || "Custom AST Nodes"}\``,
      `- **Objective Loss:** \`${selectedObjective}\` (Starting Point: [${initialX}, ${initialY}])`,
      `- **Declared Capabilities:** \`metrics.loss, parameters.snapshot, gradients.summary\``,
      `- **Fuel Limit:** ${manifest.executionBudget.fuelLimit.toLocaleString()} steps`,
      ``,
      `## 2. Convergence Telemetry`,
      `- **Final Convergence Loss:** ${lastStep?.loss.toFixed(6) || "N/A"}`,
      `- **Total Recorded Steps:** ${runResult?.stepResults.length || 0}`,
      `- **Divergence Status:** ${runResult?.diverged ? "DIVERGED" : "CONVERGED"}`,
      `- **AST Validation:** ${validation.valid ? "PASSED (Safe)" : "FAILED"}`,
      ``,
      `## 3. Provenance & Research Governance`,
      `- **Standard:** RVTS v0.1.0 & ADVANCED_ALGORITHM_FORGE_SPECIFICATION.md`,
      `- **Security Invariant:** Zero JavaScript eval() execution; allowlisted recursive AST evaluation.`,
    ].join("\n");

    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${manifest.id}_research_report.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold tracking-wider uppercase mb-1">
            <Wrench className="w-4 h-4" />
            <span>Algorithm Research Workbench</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <span>Algorithm Forge</span>
            <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Full Research Control</span>
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 max-w-2xl">
            Design, craft, and evaluate machine learning algorithms. Full authoring control across
            data datasets, mathematical equations, flowchart node graphs, and Python research contracts.
          </p>
        </div>

        {/* Security & System Indicators */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs text-slate-300">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Fuel: {manifest.executionBudget.fuelLimit.toLocaleString()}</span>
          </div>
          <Link
            href="/studio/algorithms"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] text-xs text-cyan-400 hover:text-white transition-colors"
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Catalogue</span>
          </Link>
        </div>
      </div>

      {/* Main Workspace Layout (Two Columns on Large Screens) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: 5 Research Authoring Studios (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Template Selector Banner */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-semibold text-[var(--text-muted)]">
                Starter Research Templates
              </span>
              <span className="text-xs font-mono text-cyan-400">
                Mode: {activeTab.toUpperCase()}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {FORGE_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => handleSelectTemplate(tmpl.id)}
                  className={`text-left p-3 rounded-xl border text-xs transition-all ${
                    manifest.id === tmpl.id
                      ? "bg-cyan-500/15 border-cyan-500/50 text-white font-medium"
                      : "bg-[var(--surface-raised)] border-[var(--border)] text-[var(--text-muted)] hover:text-white"
                  }`}
                >
                  <div className="font-semibold text-white">{tmpl.name}</div>
                  <div className="text-[11px] text-[var(--text-muted)] line-clamp-1 mt-0.5">
                    {tmpl.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Research Studio Tabs */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-xl">
            <div className="flex flex-wrap border-b border-[var(--border)] bg-[var(--surface-raised)]">
              {[
                { id: "equation", label: "Equation Studio", icon: Calculator },
                { id: "flow", label: "Visual Flowchart", icon: Layers },
                { id: "code", label: "Code Studio", icon: Code2 },
                { id: "data", label: "Data Workbench", icon: Database },
                { id: "customize", label: "Customize Hyperparams", icon: Sliders },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as ActiveForgeTab)}
                    className={`flex-1 py-3 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-all min-w-[110px] ${
                      isActive
                        ? "border-cyan-400 text-cyan-300 bg-[var(--surface)]"
                        : "border-transparent text-[var(--text-muted)] hover:text-white"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Panes */}
            <div className="p-6">
              {activeTab === "data" && <DataWorkbench />}

              {activeTab === "equation" && (
                <EquationStudio
                  formula={manifest.formula || "theta - lr * grad"}
                  onFormulaChange={(val) =>
                    setManifest({
                      ...manifest,
                      mode: "formula",
                      formula: val,
                    })
                  }
                />
              )}

              {activeTab === "flow" && (
                <FlowBuilder
                  nodes={manifest.nodes || []}
                  edges={manifest.edges || []}
                  onNodesChange={(nodes) =>
                    setManifest({ ...manifest, mode: "visual_nodes", nodes })
                  }
                  onEdgesChange={(edges) =>
                    setManifest({ ...manifest, mode: "visual_nodes", edges })
                  }
                />
              )}

              {activeTab === "code" && <CodeStudio />}

              {activeTab === "customize" && (
                <div className="space-y-5">
                  <div className="text-xs text-[var(--text-muted)]">
                    Tune hyperparameter schedules, momentum damping, decoupled weight decay, and execution limits.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-slate-300 block mb-1">
                        Learning Rate (η)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.001"
                        max="2.0"
                        value={manifest.parameters.learningRate ?? 0.08}
                        onChange={(e) =>
                          setManifest({
                            ...manifest,
                            parameters: {
                              ...manifest.parameters,
                              learningRate: parseFloat(e.target.value) || 0.01,
                            },
                          })
                        }
                        className="w-full bg-[var(--surface-raised)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-300 block mb-1">
                        Momentum Factor (μ)
                      </label>
                      <input
                        type="number"
                        step="0.05"
                        min="0"
                        max="0.99"
                        value={manifest.parameters.momentum ?? 0.85}
                        onChange={(e) =>
                          setManifest({
                            ...manifest,
                            parameters: {
                              ...manifest.parameters,
                              momentum: parseFloat(e.target.value) || 0,
                            },
                          })
                        }
                        className="w-full bg-[var(--surface-raised)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-300 block mb-1">
                        Decoupled Weight Decay (λ)
                      </label>
                      <input
                        type="number"
                        step="0.005"
                        min="0"
                        max="0.5"
                        value={manifest.parameters.weightDecay ?? 0.01}
                        onChange={(e) =>
                          setManifest({
                            ...manifest,
                            parameters: {
                              ...manifest.parameters,
                              weightDecay: parseFloat(e.target.value) || 0,
                            },
                          })
                        }
                        className="w-full bg-[var(--surface-raised)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-300 block mb-1">
                        Max Steps Budget
                      </label>
                      <input
                        type="number"
                        step="10"
                        min="10"
                        max="500"
                        value={maxSteps}
                        onChange={(e) => setMaxSteps(parseInt(e.target.value) || 50)}
                        className="w-full bg-[var(--surface-raised)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Research Test Bench & Live Replay Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Test Bench Card */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider">
                <Compass className="w-4 h-4" />
                <span>Research Test Bench</span>
              </div>

              {/* 2D / 3D Dimension Switcher */}
              <div className="flex items-center gap-1 bg-[var(--surface-raised)] p-0.5 rounded-lg border border-[var(--border)] text-xs font-mono font-bold">
                <button
                  onClick={() => setVisDimension("2d")}
                  className={`px-2 py-1 rounded transition-colors ${
                    visDimension === "2d"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                      : "text-[var(--text-muted)] hover:text-white"
                  }`}
                >
                  2D
                </button>
                <button
                  onClick={() => setVisDimension("3d")}
                  className={`px-2 py-1 rounded transition-colors ${
                    visDimension === "3d"
                      ? "bg-violet-500/20 text-violet-300 border border-violet-500/40"
                      : "text-[var(--text-muted)] hover:text-white"
                  }`}
                >
                  3D
                </button>
              </div>
            </div>

            {/* Test Landscape Selector */}
            <div className="space-y-1.5">
              <label className="text-xs text-[var(--text-muted)] block">
                Objective Landscape f(x, y)
              </label>
              <select
                value={selectedObjective}
                onChange={(e) => setSelectedObjective(e.target.value as ObjectiveType)}
                className="w-full bg-[var(--surface-raised)] border border-[var(--border)] text-xs text-white rounded-xl px-3 py-2.5 outline-none focus:border-cyan-500"
              >
                <option value="quadratic">Quadratic Ravine (Curvature κ = 10)</option>
                <option value="rosenbrock">Rosenbrock Banana Valley (Non-Convex)</option>
                <option value="saddle">Saddle Point (Unstable Equilibria)</option>
              </select>
            </div>

            {/* Initial Point Coordinates */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[var(--text-muted)] block mb-1">Start θ_x</label>
                <input
                  type="number"
                  step="0.2"
                  value={initialX}
                  onChange={(e) => setInitialX(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[var(--surface-raised)] border border-[var(--border)] rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[var(--text-muted)] block mb-1">Start θ_y</label>
                <input
                  type="number"
                  step="0.2"
                  value={initialY}
                  onChange={(e) => setInitialY(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[var(--surface-raised)] border border-[var(--border)] rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            {/* Visualizer Viewport */}
            <div className="rounded-xl overflow-hidden border border-[var(--border)] bg-[#05070e] relative aspect-square flex items-center justify-center">
              {visDimension === "2d" ? (
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={400}
                  className="w-full h-full object-contain"
                />
              ) : (
                <ThreeSurfaceViewer
                  objectiveType={selectedObjective}
                  trajectory={runResult?.stepResults || []}
                  currentStepIndex={activeStep}
                  className="w-full h-full"
                />
              )}

              {/* HUD Badge */}
              <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/60 backdrop-blur-md text-[10px] font-mono text-cyan-300 border border-white/10 pointer-events-none">
                Step: {activeStep} / {Math.max(0, (runResult?.stepResults.length || 1) - 1)}
              </div>
            </div>

            {/* Run & Player Controls */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunAlgorithm}
                  disabled={isRunning || !validation.valid}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-violet-600 text-[#080b12] text-xs font-bold hover:shadow-cyan-500/25 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 fill-[#080b12]" />
                  <span>Execute Algorithm</span>
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  disabled={!runResult}
                  className="p-2.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-white hover:border-cyan-500 transition-colors"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setActiveStep(0)}
                  disabled={!runResult}
                  className="p-2.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-white hover:border-cyan-500 transition-colors"
                  title="Reset to Step 0"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Scrubber slider */}
              {runResult && (
                <input
                  type="range"
                  min="0"
                  max={Math.max(0, runResult.stepResults.length - 1)}
                  value={activeStep}
                  onChange={(e) => {
                    setIsPlaying(false);
                    setActiveStep(parseInt(e.target.value));
                  }}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              )}
            </div>

            {/* Telemetry Metrics */}
            {runResult && (
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)]">
                  <span className="text-[10px] text-[var(--text-muted)] block">Initial Loss</span>
                  <span className="text-white font-bold">
                    {(runResult.stepResults[0]?.loss ?? 0).toFixed(4)}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)]">
                  <span className="text-[10px] text-[var(--text-muted)] block">Final Step Loss</span>
                  <span className="text-cyan-300 font-bold">
                    {(runResult.stepResults[runResult.stepResults.length - 1]?.loss ?? 0).toFixed(4)}
                  </span>
                </div>
              </div>
            )}

            {/* Export Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border)]">
              <button
                onClick={handleDownloadTrace}
                disabled={!runResult}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] hover:border-cyan-500/50 text-xs font-mono text-cyan-300 transition-all disabled:opacity-40"
              >
                <Download className="w-3 h-3" />
                <span>Export .rvtrace</span>
              </button>
              <button
                onClick={handleDownloadManifest}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] hover:border-violet-500/50 text-xs font-mono text-violet-300 transition-all"
              >
                <Download className="w-3 h-3" />
                <span>Manifest .json</span>
              </button>
              <button
                onClick={handleExportResearchReport}
                disabled={!runResult}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] hover:border-emerald-500/50 text-xs font-mono text-emerald-300 transition-all disabled:opacity-40"
              >
                <FileText className="w-3 h-3" />
                <span>Report .md</span>
              </button>
            </div>
          </div>

          {/* Multi-Algorithm Benchmark Comparison */}
          <BenchmarkComparator
            objective={selectedObjective}
            initialPoint={[initialX, initialY]}
            maxSteps={maxSteps}
            customFinalLoss={runResult?.stepResults[runResult.stepResults.length - 1]?.loss}
            customStepsCount={runResult?.stepResults.length}
            customDiverged={runResult?.diverged}
          />
        </div>
      </div>
    </div>
  );
}
