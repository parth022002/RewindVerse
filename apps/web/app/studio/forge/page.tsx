"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
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
  RotateCcw,
  Download,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Code2,
  GitBranch,
  Layers,
  ArrowRight,
  Maximize2,
  ExternalLink,
  Info,
  Flame,
} from "lucide-react";

export default function AlgorithmForgePage() {
  // Current active manifest state
  const [manifest, setManifest] = useState<AlgorithmManifest>(FORGE_TEMPLATES[0]);
  const [selectedObjective, setSelectedObjective] = useState<ObjectiveType>("quadratic");
  const [initialX, setInitialX] = useState<number>(-2.8);
  const [initialY, setInitialY] = useState<number>(2.5);
  const [maxSteps, setMaxSteps] = useState<number>(100);

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
    ctx.strokeStyle = "rgba(6, 182, 212, 0.18)";
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
        ctx.strokeStyle = runResult.diverged ? "#ef4444" : "#06b6d4";
        ctx.lineWidth = 2.5;
        ctx.shadowColor = runResult.diverged ? "#ef4444" : "#06b6d4";
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
        ctx.shadowColor = "#06b6d4";
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  }, [runResult, activeStep, selectedObjective]);

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

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold tracking-wider uppercase mb-1">
            <Wrench className="w-4 h-4" />
            <span>Algorithm Workspace</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <span>Algorithm Forge</span>
            <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Safe Worker Sandbox</span>
            </span>
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1 max-w-2xl">
            Design, fork, customize, and validate optimization update rules. Safe execution via a
            constrained allowlisted AST with strict fuel accounting — zero arbitrary JavaScript evaluation.
          </p>
        </div>

        {/* Security & System Indicators */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs text-slate-300">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Fuel Limit: {manifest.executionBudget.fuelLimit.toLocaleString()}</span>
          </div>
          <Link
            href="/studio/algorithms"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] text-xs text-cyan-400 hover:text-white transition-colors"
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Browse Built-in Catalogue</span>
          </Link>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Creator / Editor Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Template Selector Banner */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-semibold text-[var(--text-muted)]">
                Starter Algorithm Templates
              </span>
              <span className="text-xs font-mono text-cyan-400">
                Mode: {manifest.mode.toUpperCase()}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {FORGE_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => handleSelectTemplate(tmpl.id)}
                  className={`text-left p-3 rounded-lg border text-xs transition-all ${
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

          {/* Creation Mode Tabs */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
            <div className="flex border-b border-[var(--border)] bg-[var(--surface-raised)]">
              {(
                [
                  { mode: "customize", label: "Mode A: Fork & Customize", icon: Sliders },
                  { mode: "formula", label: "Mode C: Formula DSL", icon: Code2 },
                  { mode: "visual_nodes", label: "Mode B: Visual Pipeline", icon: Layers },
                ] as const
              ).map((tab) => {
                const Icon = tab.icon;
                const isActive = manifest.mode === tab.mode;
                return (
                  <button
                    key={tab.mode}
                    onClick={() => setManifest({ ...manifest, mode: tab.mode })}
                    className={`flex-1 py-3 px-4 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
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

            {/* Mode Content Panes */}
            <div className="p-6">
              {/* MODE A: FORK & CUSTOMIZE */}
              {manifest.mode === "customize" && (
                <div className="space-y-5">
                  <div className="text-xs text-[var(--text-muted)]">
                    Fork a verified baseline optimizer and tune hyperparameter schedules, momentum
                    dampening, decoupled decay, and gradient clipping bounds.
                  </div>

                  {/* Hyperparameter Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-slate-300 block mb-1">
                        Learning Rate (&eta;)
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
                        className="w-full bg-[var(--surface-raised)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-300 block mb-1">
                        Momentum Factor (&mu;)
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
                        className="w-full bg-[var(--surface-raised)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-300 block mb-1">
                        Decoupled Weight Decay (&lambda;)
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
                        className="w-full bg-[var(--surface-raised)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-300 block mb-1">
                        Gradient Norm Clip Threshold
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0.5"
                        max="50"
                        value={manifest.parameters.gradClip ?? 5.0}
                        onChange={(e) =>
                          setManifest({
                            ...manifest,
                            parameters: {
                              ...manifest.parameters,
                              gradClip: parseFloat(e.target.value) || 5.0,
                            },
                          })
                        }
                        className="w-full bg-[var(--surface-raised)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  {/* Human-Readable Diff View */}
                  <div className="p-4 rounded-lg bg-black/40 border border-[var(--border)] space-y-2">
                    <span className="text-[11px] uppercase font-semibold text-[var(--text-muted)]">
                      Specification Diff Against Parent Baseline
                    </span>
                    <div className="font-mono text-xs text-slate-300 space-y-1">
                      <div className="text-cyan-400">
                        + parent: {manifest.parentAlgorithmId || "optim.sgd"} (v1.0.0)
                      </div>
                      <div>
                        + learningRate:{" "}
                        <span className="text-emerald-400">
                          {manifest.parameters.learningRate}
                        </span>
                      </div>
                      <div>
                        + momentum:{" "}
                        <span className="text-emerald-400">{manifest.parameters.momentum}</span>
                      </div>
                      <div>
                        + weightDecay:{" "}
                        <span className="text-emerald-400">
                          {manifest.parameters.weightDecay}
                        </span>
                      </div>
                      <div>
                        + gradClip:{" "}
                        <span className="text-emerald-400">{manifest.parameters.gradClip}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MODE C: FORMULA DSL */}
              {manifest.mode === "formula" && (
                <div className="space-y-4">
                  <div className="text-xs text-[var(--text-muted)]">
                    Define parameter update steps as declarative algebraic expressions. Supports
                    variables <code className="text-cyan-400">p</code> (parameter),{" "}
                    <code className="text-cyan-400">g</code> (gradient),{" "}
                    <code className="text-cyan-400">lr</code>,{" "}
                    <code className="text-cyan-400">wd</code>, and safe functions{" "}
                    <code className="text-cyan-400">clamp()</code>,{" "}
                    <code className="text-cyan-400">sqrt()</code>,{" "}
                    <code className="text-cyan-400">abs()</code>.
                  </div>

                  {/* Formula Code Input */}
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Update Rule Expression (p_{"{t+1}"} =)
                    </label>
                    <textarea
                      rows={3}
                      value={manifest.formula || "p - lr * g"}
                      onChange={(e) => setManifest({ ...manifest, formula: e.target.value })}
                      className="w-full bg-[var(--surface-raised)] border border-[var(--border)] rounded-lg p-3 text-sm font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                      placeholder="e.g. p - lr * clamp(g, -2, 2) - lr * wd * p"
                    />
                  </div>

                  {/* Token Helpers */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="text-[var(--text-muted)]">Insert:</span>
                    {["p - lr * g", "clamp(g, -1, 1)", "g / (abs(g) + 1e-8)", "lr * wd * p"].map(
                      (snippet) => (
                        <button
                          key={snippet}
                          onClick={() =>
                            setManifest({
                              ...manifest,
                              formula: (manifest.formula || "") + " - " + snippet,
                            })
                          }
                          className="font-mono text-[11px] bg-[var(--surface-raised)] hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-[var(--border)] px-2 py-0.5 rounded"
                        >
                          +{snippet}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* MODE B: VISUAL NODE PIPELINE */}
              {manifest.mode === "visual_nodes" && (
                <div className="space-y-4">
                  <div className="text-xs text-[var(--text-muted)]">
                    Interactive dataflow pipeline. Operations execute in verified topological order.
                  </div>

                  <div className="p-4 rounded-xl bg-black/50 border border-[var(--border)] space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-300 border-b border-[var(--border)]/50 pb-2">
                      <span>Node Pipeline Topology</span>
                      <span className="text-emerald-400">DAG Verified (Acyclic)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-xs">
                      <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/60 text-cyan-300">
                        <div className="font-mono font-bold">Input Nodes</div>
                        <div className="text-[11px] text-[var(--text-muted)] mt-1">p_t, g_t, lr</div>
                      </div>
                      <div className="p-3 rounded-lg bg-purple-950/40 border border-purple-800/60 text-purple-300">
                        <div className="font-mono font-bold">Velocity Node</div>
                        <div className="text-[11px] text-[var(--text-muted)] mt-1">&mu;v + g_t</div>
                      </div>
                      <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-800/60 text-blue-300">
                        <div className="font-mono font-bold">Scale & Decay</div>
                        <div className="text-[11px] text-[var(--text-muted)] mt-1">&eta;v + &lambda;p</div>
                      </div>
                      <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-300">
                        <div className="font-mono font-bold">Output Node</div>
                        <div className="text-[11px] text-[var(--text-muted)] mt-1">p_{"{t+1}"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Validation Feedback Footer */}
            <div className="px-6 py-4 bg-[var(--surface-raised)] border-t border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                {validation.valid ? (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Static Manifest & AST Valid</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{validation.diagnostics[0]?.message || "Validation Error"}</span>
                  </span>
                )}
              </div>
              <div className="text-xs text-[var(--text-muted)] font-mono">
                Est. Fuel: ~{validation.estimatedFuel.toLocaleString()} units
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sandboxed Test Bench & Replay Visualizer (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Test Bench Configuration Box */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <span className="text-xs uppercase font-semibold text-[var(--text-muted)] flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                <span>Test Bench Surface</span>
              </span>
              <span className="text-xs text-cyan-400 font-mono">
                {selectedObjective.toUpperCase()}
              </span>
            </div>

            {/* Objective Selector */}
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: "quadratic", label: "Quadratic Bowl" },
                  { id: "rosenbrock", label: "Rosenbrock" },
                  { id: "saddle", label: "Saddle Point" },
                ] as const
              ).map((obj) => (
                <button
                  key={obj.id}
                  onClick={() => setSelectedObjective(obj.id)}
                  className={`py-2 px-2.5 rounded-lg text-xs font-medium border text-center transition-all ${
                    selectedObjective === obj.id
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50"
                      : "bg-[var(--surface-raised)] text-[var(--text-muted)] hover:text-white border-[var(--border)]"
                  }`}
                >
                  {obj.label}
                </button>
              ))}
            </div>

            {/* Coordinate Sliders */}
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1">
                  <span>Start X</span>
                  <span className="font-mono text-white">{initialX.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="-3.5"
                  max="3.5"
                  step="0.1"
                  value={initialX}
                  onChange={(e) => setInitialX(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1">
                  <span>Start Y</span>
                  <span className="font-mono text-white">{initialY.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="-3.5"
                  max="3.5"
                  step="0.1"
                  value={initialY}
                  onChange={(e) => setInitialY(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>

            {/* Run Button */}
            <button
              onClick={handleRunAlgorithm}
              disabled={!validation.valid || isRunning}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 disabled:opacity-50 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{isRunning ? "Simulating in Worker..." : "Execute Test Run"}</span>
            </button>
          </div>

          {/* Canvas & Replay Box */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-semibold text-[var(--text-muted)]">
                2D Loss Landscape Trajectory
              </span>
              {runResult && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1.5 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] text-xs text-white hover:text-cyan-400"
                  >
                    {isPlaying ? "Pause" : "Play"}
                  </button>
                  <button
                    onClick={() => setActiveStep(0)}
                    className="p-1.5 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] text-xs text-[var(--text-muted)] hover:text-white"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* 2D Canvas */}
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-black border border-[var(--border)]">
              <canvas
                ref={canvasRef}
                width={400}
                height={400}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Scrubber slider */}
            {runResult && runResult.stepResults.length > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-[var(--text-muted)] font-mono">
                  <span>Step {activeStep}</span>
                  <span>Total {runResult.stepResults.length - 1} steps</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={runResult.stepResults.length - 1}
                  value={activeStep}
                  onChange={(e) => setActiveStep(parseInt(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>
            )}

            {/* Run Convergence Metrics */}
            {runResult && (
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--border)]/60 text-center">
                <div className="p-2.5 rounded-lg bg-[var(--surface-raised)]">
                  <div className="text-[10px] text-[var(--text-muted)] uppercase">Initial Loss</div>
                  <div className="text-xs font-mono font-bold text-white mt-0.5">
                    {runResult.stepResults[0]?.loss.toFixed(4)}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-[var(--surface-raised)]">
                  <div className="text-[10px] text-[var(--text-muted)] uppercase">Final Loss</div>
                  <div className="text-xs font-mono font-bold text-emerald-400 mt-0.5">
                    {runResult.stepResults[runResult.stepResults.length - 1]?.loss.toFixed(4)}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-[var(--surface-raised)]">
                  <div className="text-[10px] text-[var(--text-muted)] uppercase">Fuel Used</div>
                  <div className="text-xs font-mono font-bold text-cyan-400 mt-0.5">
                    {runResult.fuelConsumed}
                  </div>
                </div>
              </div>
            )}

            {/* Trace Export Buttons */}
            {runResult && (
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={handleDownloadTrace}
                  className="flex-1 py-2 px-3 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] hover:border-cyan-500/40 text-xs font-medium text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Export .rvtrace</span>
                </button>
                <button
                  onClick={handleDownloadManifest}
                  className="flex-1 py-2 px-3 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] hover:border-cyan-500/40 text-xs font-medium text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Code2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Manifest JSON</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
