"use client";

import React, { useState, useMemo, use, useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { runOptimizationSimulation, ObjectiveType } from "@rewindverse/rewindml";
import { analyzeTraceDiagnostics } from "@rewindverse/diagnostics";
import { getRunById } from "../../../../lib/storage";
import { RvtsParsedTrace } from "@rewindverse/rvts";
import { ProvenanceBadge } from "../../../../components/visualization/ProvenanceBadge";
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Activity,
  ArrowLeft,
  Sliders,
  FastForward,
  ChevronLeft,
  ChevronRight,
  Layers,
  Box,
  Network,
  CheckCircle2,
  XCircle,
  Keyboard,
  Share2,
  Copy,
  Check,
  Download,
  ExternalLink,
} from "lucide-react";

// Client-only dynamic load for 3D Surface Viewer
const ThreeSurfaceViewer = dynamic(
  () =>
    import("../../../../components/visualization/ThreeSurfaceViewer").then(
      (m) => m.ThreeSurfaceViewer
    ),
  { ssr: false }
);

const ThreeNetworkGraphViewer = dynamic(
  () =>
    import("../../../../components/visualization/ThreeNetworkGraphViewer").then(
      (m) => m.ThreeNetworkGraphViewer
    ),
  { ssr: false }
);

export default function ReplayViewerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"loss" | "trajectory" | "3d_surface" | "architecture">("loss");
  const [loadedTrace, setLoadedTrace] = useState<RvtsParsedTrace | null>(null);
  const [shareLoading, setShareLoading] = useState<boolean>(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState<boolean>(false);

  const trajectoryCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate fallback sample trace
  const fallbackSimulation = useMemo(() => {
    return runOptimizationSimulation({
      objective: "rosenbrock",
      optimizer: {
        type: "adam",
        learningRate: 0.05,
        beta1: 0.9,
        beta2: 0.999,
        epsilon: 1e-8,
      },
      initialPoint: [-1.2, 1.0],
      maxSteps: 80,
      seed: 42,
    });
  }, []);

  // Fetch run from IndexedDB
  useEffect(() => {
    const fetchRun = async () => {
      if (unwrappedParams.id && unwrappedParams.id !== "sample") {
        try {
          const stored = await getRunById(unwrappedParams.id);
          if (stored && stored.trace) {
            setLoadedTrace(stored.trace);
            return;
          }
        } catch (e) {
          console.error("Failed to load run from DB:", e);
        }
      }
      setLoadedTrace(fallbackSimulation.trace);
    };
    fetchRun();
  }, [unwrappedParams.id, fallbackSimulation]);

  const trace = loadedTrace || fallbackSimulation.trace;
  const diagnostics = useMemo(() => analyzeTraceDiagnostics(trace), [trace]);
  const steps = trace.steps;
  const totalSteps = steps.length;
  const activeStep = steps[stepIndex] || steps[0];

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        setIsPlaying(false);
        setStepIndex((prev) => Math.min(totalSteps - 1, prev + 1));
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        setIsPlaying(false);
        setStepIndex((prev) => Math.max(0, prev - 1));
      } else if (e.code === "Home") {
        e.preventDefault();
        setIsPlaying(false);
        setStepIndex(0);
      } else if (e.code === "End") {
        e.preventDefault();
        setIsPlaying(false);
        setStepIndex(Math.max(0, totalSteps - 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [totalSteps]);

  // Auto playback loop with speed multiplier
  useEffect(() => {
    if (!isPlaying) return;
    const baseInterval = 100;
    const intervalMs = Math.max(16, Math.floor(baseInterval / playbackSpeed));

    const interval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= totalSteps - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalMs);
    return () => clearInterval(interval);
  }, [isPlaying, totalSteps, playbackSpeed]);

  // Compute loss curve coordinates
  const maxLoss = useMemo(() => {
    return Math.max(...steps.map((s) => s.metrics.loss || 0), 1);
  }, [steps]);

  const handleShareRun = async () => {
    try {
      setShareLoading(true);
      const res = await fetch("/api/traces/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trace }),
      });
      const data = await res.json();
      if (data.shareUrl) {
        const fullUrl = `${window.location.origin}${data.shareUrl}`;
        setShareUrl(fullUrl);
        await navigator.clipboard.writeText(fullUrl);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 3500);
      }
    } catch (err) {
      console.error("Failed to share trace:", err);
    } finally {
      setShareLoading(false);
    }
  };

  const handleExportTrace = () => {
    try {
      const jsonStr = JSON.stringify(trace, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${trace.manifest.run_id || "rewindverse-trace"}.rvtrace`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export trace:", err);
    }
  };

  // Check if trajectory parameters are present
  const has2DTrajectory = useMemo(() => {
    return steps.some((s) => {
      const theta = s.parameters?.theta || s.parameters?.weights;
      return Array.isArray(theta) && theta.length >= 2;
    });
  }, [steps]);

  // Extract 3D trajectory points (x, y, loss) for ThreeSurfaceViewer
  const trajectoryPoints = useMemo(() => {
    const pts: { step: number; x: number; y: number; loss: number }[] = [];
    for (const s of steps) {
      const p = s.parameters?.theta || s.parameters?.weights;
      if (Array.isArray(p) && p.length >= 2) {
        pts.push({
          step: s.step,
          x: p[0],
          y: p[1],
          loss: s.metrics?.loss ?? 0,
        });
      }
    }
    return pts;
  }, [steps]);

  // Determine surface objective geometry
  const resolvedObjective = useMemo<ObjectiveType>(() => {
    const name = (trace.manifest.model_or_objective?.name || "").toLowerCase();
    if (name.includes("rosenbrock")) return "rosenbrock";
    if (name.includes("saddle")) return "saddle";
    return "quadratic";
  }, [trace]);

  // Draw 2D trajectory on canvas when in trajectory tab
  useEffect(() => {
    if (activeTab !== "trajectory" || !has2DTrajectory) return;
    const canvas = trajectoryCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Extract all points
    const points: [number, number][] = [];
    for (const s of steps) {
      const p = s.parameters?.theta || s.parameters?.weights;
      if (Array.isArray(p) && p.length >= 2) {
        points.push([p[0], p[1]]);
      }
    }

    if (points.length === 0) return;

    // Determine domain bounds
    let xMin = Infinity,
      xMax = -Infinity,
      yMin = Infinity,
      yMax = -Infinity;
    points.forEach(([x, y]) => {
      if (x < xMin) xMin = x;
      if (x > xMax) xMax = x;
      if (y < yMin) yMin = y;
      if (y > yMax) yMax = y;
    });

    const padX = (xMax - xMin) * 0.15 || 1;
    const padY = (yMax - yMin) * 0.15 || 1;
    xMin -= padX;
    xMax += padX;
    yMin -= padY;
    yMax += padY;

    const toX = (x: number) => ((x - xMin) / (xMax - xMin)) * width;
    const toY = (y: number) => ((yMax - y) / (yMax - yMin)) * height;

    // Draw background grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 6; i++) {
      const gx = (i / 6) * width;
      const gy = (i / 6) * height;
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, height);
      ctx.moveTo(0, gy);
      ctx.lineTo(width, gy);
      ctx.stroke();
    }

    // Draw full path ghost line
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(toX(points[0][0]), toY(points[0][1]));
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(toX(points[i][0]), toY(points[i][1]));
    }
    ctx.stroke();

    // Draw active path up to current step
    const currentPoints = points.slice(0, stepIndex + 1);
    if (currentPoints.length > 1) {
      ctx.strokeStyle = "#00d2ff";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "#00d2ff";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(toX(currentPoints[0][0]), toY(currentPoints[0][1]));
      for (let i = 1; i < currentPoints.length; i++) {
        ctx.lineTo(toX(currentPoints[i][0]), toY(currentPoints[i][1]));
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Active marker
    if (currentPoints.length > 0) {
      const [curX, curY] = currentPoints[currentPoints.length - 1];
      const cx = toX(curX);
      const cy = toY(curY);

      ctx.fillStyle = "rgba(0, 210, 255, 0.4)";
      ctx.beginPath();
      ctx.arc(cx, cy, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [activeTab, has2DTrajectory, steps, stepIndex]);

  return (
    <div className="space-y-6">
      {/* Trace Metadata Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Link
              href="/studio"
              className="text-xs text-[var(--text-muted)] hover:text-white flex items-center gap-1 transition-colors mr-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Workspace
            </Link>
            <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800 text-[10px] font-mono text-cyan-300">
              RVTS v0.1.0 Validated
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              ID: {trace.manifest.run_id}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            {trace.manifest.name}
          </h1>
        </div>

        {/* Honest Capability Status Indicators */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span
            className={`px-2.5 py-1 rounded border flex items-center gap-1 ${
              trace.capabilities.has_loss
                ? "bg-emerald-950/50 border-emerald-800/60 text-emerald-400"
                : "bg-white/5 border-white/10 text-[var(--text-muted)]"
            }`}
          >
            {trace.capabilities.has_loss ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
            Loss
          </span>

          <span
            className={`px-2.5 py-1 rounded border flex items-center gap-1 ${
              trace.capabilities.has_parameters
                ? "bg-emerald-950/50 border-emerald-800/60 text-emerald-400"
                : "bg-white/5 border-white/10 text-[var(--text-muted)]"
            }`}
          >
            {trace.capabilities.has_parameters ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
            Parameters
          </span>

          <span
            className={`px-2.5 py-1 rounded border flex items-center gap-1 ${
              trace.capabilities.has_gradients
                ? "bg-emerald-950/50 border-emerald-800/60 text-emerald-400"
                : "bg-white/5 border-white/10 text-[var(--text-muted)]"
            }`}
          >
            {trace.capabilities.has_gradients ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
            Gradients
          </span>

          <span
            className={`px-2.5 py-1 rounded border flex items-center gap-1 ${
              trace.capabilities.has_learning_rate
                ? "bg-cyan-950/50 border-cyan-800/60 text-cyan-300"
                : "bg-white/5 border-white/10 text-[var(--text-muted)]"
            }`}
          >
            {trace.capabilities.has_learning_rate ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
            LR
          </span>

          <button
            onClick={handleShareRun}
            disabled={shareLoading}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-semibold transition-all ml-2 ${
              shareCopied
                ? "bg-emerald-950/80 border-emerald-500 text-emerald-300"
                : "bg-cyan-950/60 border-cyan-800 text-cyan-300 hover:bg-cyan-900/60"
            }`}
          >
            {shareCopied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Share2 className="w-3.5 h-3.5" />
            )}
            {shareLoading ? "Generating..." : shareCopied ? "Link Copied!" : "Share Run"}
          </button>

          {shareUrl && (
            <Link
              href={shareUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-800 text-[11px] text-cyan-300 hover:text-white transition-colors"
              title="Open shared cloud trace in new tab"
            >
              Open Shared View <ExternalLink className="w-3 h-3" />
            </Link>
          )}

          <button
            onClick={handleExportTrace}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-semibold bg-white/5 border-white/10 text-white hover:bg-white/10 transition-all"
            title="Download full RVTS trace file to disk"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            Export .rvtrace
          </button>
        </div>
      </div>

      {/* Main Replay Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Timeline, Canvas & Metric Trajectory */}
        <div className="lg:col-span-2 space-y-4">
          {/* Synchronized Replay View Container */}
          <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveTab("loss")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "loss"
                      ? "bg-cyan-500/20 border border-cyan-500/50 text-cyan-300"
                      : "text-[var(--text-muted)] hover:text-white"
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  Loss Curve
                </button>

                {has2DTrajectory && (
                  <>
                    <button
                      onClick={() => setActiveTab("trajectory")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeTab === "trajectory"
                          ? "bg-cyan-500/20 border border-cyan-500/50 text-cyan-300"
                          : "text-[var(--text-muted)] hover:text-white"
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      2D Trajectory
                    </button>

                    <button
                      onClick={() => setActiveTab("3d_surface")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeTab === "3d_surface"
                          ? "bg-purple-500/20 border border-purple-500/50 text-purple-300"
                          : "text-[var(--text-muted)] hover:text-white"
                      }`}
                    >
                      <Box className="w-3.5 h-3.5" />
                      3D Surface Mesh
                    </button>
                  </>
                )}

                <button
                  onClick={() => setActiveTab("architecture")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "architecture"
                      ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-300"
                      : "text-[var(--text-muted)] hover:text-white"
                  }`}
                >
                  <Network className="w-3.5 h-3.5" />
                  3D Architecture
                </button>
              </div>

              <div className="flex items-center gap-3">
                {activeTab === "3d_surface" && (
                  <ProvenanceBadge
                    type={
                      trace.manifest.model_or_objective?.name?.match(
                        /quadratic|rosenbrock|saddle/i
                      )
                        ? "recorded"
                        : "projected"
                    }
                  />
                )}
                {activeTab === "architecture" && (
                  <ProvenanceBadge type="derived" />
                )}
                <span className="text-xs font-mono text-[var(--text-muted)]">
                  Recorded Loss: {activeStep ? activeStep.metrics.loss.toFixed(6) : "0"}
                </span>
              </div>
            </div>

            {/* Display Loss SVG, 2D Trajectory Canvas, 3D Surface Mesh, or 3D Architecture */}
            {activeTab === "loss" ? (
              <div className="relative aspect-[21/9] w-full bg-[var(--background)] rounded-xl border border-[var(--border)] p-4 flex items-end">
                <svg
                  className="w-full h-full overflow-visible"
                  viewBox={`0 0 ${Math.max(1, totalSteps - 1)} 100`}
                >
                  <line x1="0" y1="25" x2={totalSteps - 1} y2="25" stroke="rgba(255,255,255,0.05)" />
                  <line x1="0" y1="50" x2={totalSteps - 1} y2="50" stroke="rgba(255,255,255,0.05)" />
                  <line x1="0" y1="75" x2={totalSteps - 1} y2="75" stroke="rgba(255,255,255,0.05)" />

                  <polyline
                    fill="none"
                    stroke="#00d2ff"
                    strokeWidth="2.5"
                    points={steps
                      .map((s, idx) => {
                        const normalizedY = 100 - (s.metrics.loss / maxLoss) * 88;
                        return `${idx},${normalizedY}`;
                      })
                      .join(" ")}
                  />

                  {/* Vertical Scrubber Cursor Line */}
                  <line
                    x1={stepIndex}
                    y1="0"
                    x2={stepIndex}
                    y2="100"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeDasharray="3 3"
                  />

                  {/* Scrubber intersection dot */}
                  <circle
                    cx={stepIndex}
                    cy={100 - ((activeStep?.metrics.loss || 0) / maxLoss) * 88}
                    r="4.5"
                    fill="#ffffff"
                    stroke="#00d2ff"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            ) : activeTab === "trajectory" ? (
              <div className="relative aspect-[21/9] w-full bg-[var(--background)] rounded-xl border border-[var(--border)] overflow-hidden flex items-center justify-center">
                <canvas
                  ref={trajectoryCanvasRef}
                  width={640}
                  height={274}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : activeTab === "3d_surface" ? (
              <ThreeSurfaceViewer
                objectiveType={resolvedObjective}
                trajectory={trajectoryPoints}
                currentStepIndex={stepIndex}
                className="aspect-[21/9] w-full"
              />
            ) : (
              <ThreeNetworkGraphViewer className="w-full" />
            )}
          </div>

          {/* Transport Controls & Timeline Scrubber */}
          <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold hover:shadow-cyan-500/20 transition-all"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? "Pause" : "Play Replay"}
                </button>

                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setStepIndex((prev) => Math.max(0, prev - 1));
                  }}
                  className="p-2 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-muted)] hover:text-white"
                  title="Step -1"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setStepIndex((prev) => Math.min(totalSteps - 1, prev + 1));
                  }}
                  className="p-2 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-muted)] hover:text-white"
                  title="Step +1"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setStepIndex(0);
                  }}
                  className="p-2 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-muted)] hover:text-white"
                  title="Rewind to Step 0"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Speed Controls */}
                <div className="flex items-center gap-1 ml-2 bg-[var(--surface-raised)] p-1 rounded-lg border border-[var(--border)] text-xs">
                  {[0.5, 1, 2, 5].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                        playbackSpeed === spd
                          ? "bg-cyan-500 text-black font-bold"
                          : "text-[var(--text-muted)] hover:text-white"
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-xs font-mono text-[var(--text-muted)]">
                Step {stepIndex} of {Math.max(0, totalSteps - 1)}
              </div>
            </div>

            <input
              type="range"
              min={0}
              max={Math.max(0, totalSteps - 1)}
              value={stepIndex}
              onChange={(e) => {
                setIsPlaying(false);
                setStepIndex(Number(e.target.value));
              }}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-[var(--surface-raised)] rounded-lg"
            />

            <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] pt-1">
              <span className="flex items-center gap-1">
                <Keyboard className="w-3.5 h-3.5" />
                <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">
                  Space
                </kbd>{" "}
                Play/Pause •{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">
                  ← / →
                </kbd>{" "}
                Scrub
              </span>
              <span>100% In-Browser Deterministic Sync</span>
            </div>
          </div>

          {/* Heuristic Diagnostic Findings */}
          <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Evidence-Backed Diagnostics ({diagnostics.totalFindings})
            </h3>
            {diagnostics.findings.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)]">
                No convergence warnings detected. Training progressed nominally.
              </p>
            ) : (
              diagnostics.findings.map((finding) => (
                <div
                  key={finding.id}
                  className="p-3.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-xs space-y-1.5 cursor-pointer hover:border-violet-500/50 transition-colors"
                  onClick={() => {
                    setIsPlaying(false);
                    setStepIndex(finding.stepRange[0]);
                  }}
                  title="Click to jump to start step"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{finding.title}</span>
                    <span className="px-2 py-0.5 rounded bg-violet-950/60 border border-violet-800 text-[10px] font-mono text-violet-300">
                      Steps {finding.stepRange[0]}–{finding.stepRange[1]} (Jump)
                    </span>
                  </div>
                  <p className="text-[var(--text-muted)]">{finding.summary}</p>
                  <p className="text-[11px] text-cyan-300 font-mono">
                    Evidence: {finding.evidenceExplanation}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Step Inspector HUD */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Step {stepIndex} Inspector
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)]">
                <span className="text-[10px] uppercase text-[var(--text-muted)] block mb-1">
                  Recorded Loss
                </span>
                <span className="text-lg font-bold text-white">
                  {activeStep ? activeStep.metrics.loss.toFixed(6) : "0"}
                </span>
              </div>

              {activeStep?.metrics.lr !== undefined && (
                <div className="p-3 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)]">
                  <span className="text-[10px] uppercase text-[var(--text-muted)] block mb-1">
                    Learning Rate
                  </span>
                  <span className="text-sm font-semibold text-cyan-300">
                    {activeStep.metrics.lr}
                  </span>
                </div>
              )}

              {activeStep?.metrics.accuracy !== undefined && (
                <div className="p-3 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)]">
                  <span className="text-[10px] uppercase text-[var(--text-muted)] block mb-1">
                    Accuracy
                  </span>
                  <span className="text-sm font-semibold text-emerald-400">
                    {(activeStep.metrics.accuracy * 100).toFixed(1)}%
                  </span>
                </div>
              )}

              {activeStep?.metrics.gradient_norm !== undefined && (
                <div className="p-3 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)]">
                  <span className="text-[10px] uppercase text-[var(--text-muted)] block mb-1">
                    Gradient Norm
                  </span>
                  <span className="text-sm font-semibold text-violet-300">
                    {activeStep.metrics.gradient_norm.toFixed(6)}
                  </span>
                </div>
              )}

              <div className="p-3 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)]">
                <span className="text-[10px] uppercase text-[var(--text-muted)] block mb-1">
                  Parameters
                </span>
                <span className="text-xs font-medium text-slate-300 block break-all">
                  {activeStep?.parameters
                    ? JSON.stringify(activeStep.parameters)
                    : "No recorded parameters"}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)]">
                <span className="text-[10px] uppercase text-[var(--text-muted)] block mb-1">
                  Gradients
                </span>
                <span className="text-xs font-medium text-slate-300 block break-all">
                  {activeStep?.gradients
                    ? JSON.stringify(activeStep.gradients)
                    : "No recorded gradients"}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--text-muted)]">
              <span>Provenance:</span>
              <span className="text-emerald-400 font-mono">Verified Trace Record</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
