"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  runOptimizationSimulation,
  OBJECTIVES,
  ObjectiveType,
  OptimizerType,
  SimulationStepResult,
  generateBlobsDataset,
  trainLogisticRegression,
  computeDecisionBoundaryPoints,
  LogisticRegressionStepResult,
  ClassificationDataset,
} from "@rewindverse/rewindml";
import { saveRunLocally } from "../../../lib/storage";
import { ViewMode } from "../../../lib/visualization/types";
import { ViewModeSelector } from "../../../components/visualization/ViewModeSelector";
import { ProvenanceBadge } from "../../../components/visualization/ProvenanceBadge";
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Download,
  Sliders,
  CheckCircle2,
  BookmarkPlus,
  Layers,
  Target,
  RefreshCw,
  Share2,
  Copy,
  ExternalLink,
  UploadCloud,
  Check,
  Loader2,
  X,
  Database,
  Cloud,
} from "lucide-react";

// Safe dynamic imports for Three.js 3D canvases (prevents SSR canvas creation)
const ThreeSurfaceViewer = dynamic(
  () =>
    import("../../../components/visualization/ThreeSurfaceViewer").then(
      (m) => m.ThreeSurfaceViewer
    ),
  { ssr: false }
);

const ThreeDecisionSurfaceViewer = dynamic(
  () =>
    import("../../../components/visualization/ThreeDecisionSurfaceViewer").then(
      (m) => m.ThreeDecisionSurfaceViewer
    ),
  { ssr: false }
);

type LabMode = "landscape" | "classification";

export default function OptimizerLabPage() {
  const router = useRouter();
  const [labMode, setLabMode] = useState<LabMode>("landscape");
  const [viewMode, setViewMode] = useState<ViewMode>("3d");

  // Determine effective visual mode based on user preference and viewport
  const effectiveMode = useMemo(() => {
    if (viewMode === "auto") {
      return typeof window !== "undefined" && window.innerWidth >= 768 ? "3d" : "2d";
    }
    return viewMode;
  }, [viewMode]);

  // Landscape Mode States
  const [objectiveType, setObjectiveType] = useState<ObjectiveType>("quadratic");
  const [optimizerType, setOptimizerType] = useState<OptimizerType>("momentum");
  const [learningRate, setLearningRate] = useState<number>(0.08);
  const [momentum, setMomentum] = useState<number>(0.85);
  const [maxSteps, setMaxSteps] = useState<number>(100);
  const [noiseLevel, setNoiseLevel] = useState<number>(0);
  const [initialX, setInitialX] = useState<number>(-4);
  const [initialY, setInitialY] = useState<number>(4);

  // Classification Mode States
  const [clfSamples, setClfSamples] = useState<number>(80);
  const [clfEpochs, setClfEpochs] = useState<number>(120);
  const [clfLearningRate, setClfLearningRate] = useState<number>(0.15);
  const [clfSeed, setClfSeed] = useState<number>(42);

  // Playback & Persistence
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [shareLoading, setShareLoading] = useState<boolean>(false);
  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);
  const [shareData, setShareData] = useState<{
    token: string;
    shareUrl: string;
    s3Key?: string | null;
    mode: string;
  } | null>(null);
  const [shareCopied, setShareCopied] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // --- Optimization Simulation (Landscape) ---
  const landscapeSimulation = useMemo(() => {
    return runOptimizationSimulation({
      objective: objectiveType,
      optimizer:
        optimizerType === "adam"
          ? { type: "adam", learningRate, beta1: 0.9, beta2: 0.999, epsilon: 1e-8 }
          : optimizerType === "momentum"
          ? { type: "momentum", learningRate, momentum }
          : { type: "sgd", learningRate },
      initialPoint: [initialX, initialY],
      maxSteps,
      seed: 42,
      noiseLevel,
    });
  }, [objectiveType, optimizerType, learningRate, momentum, maxSteps, noiseLevel, initialX, initialY]);

  // --- Logistic Regression Dataset & Training (Classification) ---
  const classificationDataset: ClassificationDataset = useMemo(() => {
    return generateBlobsDataset(clfSamples, clfSeed);
  }, [clfSamples, clfSeed]);

  const classificationSimulation = useMemo(() => {
    return trainLogisticRegression({
      dataset: classificationDataset,
      learningRate: clfLearningRate,
      maxEpochs: clfEpochs,
      seed: clfSeed,
    });
  }, [classificationDataset, clfLearningRate, clfEpochs, clfSeed]);

  const activeStepsCount =
    labMode === "landscape"
      ? landscapeSimulation.stepResults.length
      : classificationSimulation.history.length;

  // Auto playback loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= activeStepsCount - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 70);
    return () => clearInterval(interval);
  }, [isPlaying, activeStepsCount]);

  // Reset step index on mode change
  useEffect(() => {
    setStepIndex(0);
    setIsPlaying(false);
  }, [labMode]);

  // Draw 2D canvas (either landscape contour or classification boundary)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    if (labMode === "landscape") {
      const obj = OBJECTIVES[objectiveType];
      const [xMin, xMax] = obj.domain.x;
      const [yMin, yMax] = obj.domain.y;

      const toCanvasX = (x: number) => ((x - xMin) / (xMax - xMin)) * width;
      const toCanvasY = (y: number) => ((yMax - y) / (yMax - yMin)) * height;

      // Draw grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      const gridCols = 10;
      for (let c = 0; c <= gridCols; c++) {
        const gx = (c / gridCols) * width;
        const gy = (c / gridCols) * height;
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
        ctx.stroke();
      }

      // Draw contour levels
      ctx.strokeStyle = "rgba(58, 123, 213, 0.25)";
      for (let r = 1; r <= 8; r++) {
        ctx.beginPath();
        const radiusX = (r / 8) * (width * 0.45);
        const radiusY =
          objectiveType === "quadratic"
            ? (r / 8) * (height * 0.2)
            : (r / 8) * (height * 0.45);
        ctx.ellipse(width / 2, height / 2, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw full trajectory up to current stepIndex
      const visibleSteps = landscapeSimulation.stepResults.slice(0, stepIndex + 1);
      if (visibleSteps.length > 1) {
        ctx.strokeStyle = "#00d2ff";
        ctx.lineWidth = 2.5;
        ctx.shadowColor = "#00d2ff";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(toCanvasX(visibleSteps[0].x), toCanvasY(visibleSteps[0].y));
        for (let i = 1; i < visibleSteps.length; i++) {
          ctx.lineTo(toCanvasX(visibleSteps[i].x), toCanvasY(visibleSteps[i].y));
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Draw current active location marker
      if (visibleSteps.length > 0) {
        const active = visibleSteps[visibleSteps.length - 1];
        const cx = toCanvasX(active.x);
        const cy = toCanvasY(active.y);

        // Ripple halo
        ctx.fillStyle = "rgba(0, 210, 255, 0.35)";
        ctx.beginPath();
        ctx.arc(cx, cy, 14, 0, Math.PI * 2);
        ctx.fill();

        // Core point
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Classification Canvas: 2D Points and moving decision boundary
      const xMin = -3.8;
      const xMax = 3.8;
      const yMin = -3.8;
      const yMax = 3.8;

      const toCanvasX = (x: number) => ((x - xMin) / (xMax - xMin)) * width;
      const toCanvasY = (y: number) => ((yMax - y) / (yMax - yMin)) * height;

      // Draw Cartesian axes
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(toCanvasX(0), 0);
      ctx.lineTo(toCanvasX(0), height);
      ctx.moveTo(0, toCanvasY(0));
      ctx.lineTo(width, toCanvasY(0));
      ctx.stroke();

      // Draw faint grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      for (let i = -3; i <= 3; i++) {
        if (i === 0) continue;
        ctx.beginPath();
        ctx.moveTo(toCanvasX(i), 0);
        ctx.lineTo(toCanvasX(i), height);
        ctx.moveTo(0, toCanvasY(i));
        ctx.lineTo(width, toCanvasY(i));
        ctx.stroke();
      }

      // Current active step result
      const curClfStep: LogisticRegressionStepResult =
        classificationSimulation.history[stepIndex] ||
        classificationSimulation.history[0];

      // Draw decision boundary line: w1*x + w2*y + b = 0
      if (curClfStep) {
        const boundary = computeDecisionBoundaryPoints(
          curClfStep.weights,
          curClfStep.bias,
          xMin,
          xMax,
          yMin,
          yMax
        );

        ctx.strokeStyle = "#00f0ff";
        ctx.lineWidth = 3;
        ctx.shadowColor = "#00d2ff";
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(toCanvasX(boundary.p1[0]), toCanvasY(boundary.p1[1]));
        ctx.lineTo(toCanvasX(boundary.p2[0]), toCanvasY(boundary.p2[1]));
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Draw data points
      for (const pt of classificationDataset.points) {
        const px = toCanvasX(pt.x);
        const py = toCanvasY(pt.y);

        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);

        if (pt.label === 0) {
          ctx.fillStyle = "rgba(0, 210, 255, 0.85)";
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1;
        } else {
          ctx.fillStyle = "rgba(168, 85, 247, 0.9)";
          ctx.strokeStyle = "#f3e8ff";
          ctx.lineWidth = 1;
        }
        ctx.fill();
        ctx.stroke();
      }
    }
  }, [
    labMode,
    landscapeSimulation,
    classificationSimulation,
    classificationDataset,
    stepIndex,
    objectiveType,
  ]);

  // Active step results
  const activeLandscapeResult: SimulationStepResult =
    landscapeSimulation.stepResults[stepIndex] || landscapeSimulation.stepResults[0];

  const activeClfResult: LogisticRegressionStepResult =
    classificationSimulation.history[stepIndex] ||
    classificationSimulation.history[0];

  const handleExportTrace = () => {
    const jsonl =
      labMode === "landscape"
        ? landscapeSimulation.jsonl
        : classificationSimulation.jsonl;
    const runId =
      labMode === "landscape"
        ? landscapeSimulation.trace.manifest.run_id
        : classificationSimulation.trace.manifest.run_id;

    const blob = new Blob([jsonl], { type: "application/x-ndjson" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${runId}.rvtrace`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveToWorkspace = async () => {
    try {
      if (labMode === "landscape") {
        const lastStep =
          landscapeSimulation.stepResults[landscapeSimulation.stepResults.length - 1];
        await saveRunLocally({
          id: landscapeSimulation.trace.manifest.run_id,
          name: landscapeSimulation.trace.manifest.name,
          createdAt: landscapeSimulation.trace.manifest.created_at,
          objective: objectiveType,
          optimizer: optimizerType,
          stepsCount: landscapeSimulation.stepResults.length,
          finalLoss: lastStep ? lastStep.loss : 0,
          jsonl: landscapeSimulation.jsonl,
          trace: landscapeSimulation.trace,
        });
      } else {
        const lastStep =
          classificationSimulation.history[
            classificationSimulation.history.length - 1
          ];
        await saveRunLocally({
          id: classificationSimulation.trace.manifest.run_id,
          name: classificationSimulation.trace.manifest.name,
          createdAt: classificationSimulation.trace.manifest.created_at,
          objective: "Binary Logistic Regression",
          optimizer: "BCE Gradient Descent",
          stepsCount: classificationSimulation.history.length,
          finalLoss: lastStep ? lastStep.loss : 0,
          jsonl: classificationSimulation.jsonl,
          trace: classificationSimulation.trace,
        });
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Save run failed:", err);
    }
  };

  const handleShareToCloud = async () => {
    try {
      setShareLoading(true);
      const activeTrace =
        labMode === "landscape"
          ? landscapeSimulation.trace
          : classificationSimulation.trace;

      const res = await fetch("/api/traces/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trace: activeTrace }),
      });

      const data = await res.json();
      if (data.success && data.shareUrl) {
        setShareData(data);
        setShareModalOpen(true);
        if (typeof window !== "undefined") {
          const fullUrl = `${window.location.origin}${data.shareUrl}`;
          try {
            await navigator.clipboard.writeText(fullUrl);
            setShareCopied(true);
            setTimeout(() => setShareCopied(false), 3000);
          } catch {}
        }
      }
    } catch (err) {
      console.error("Cloud share failed:", err);
    } finally {
      setShareLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Sliders className="w-6 h-6 text-cyan-400" />
            Interactive RewindML Lab
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Browser-native mathematical optimization & binary classification with live RVTS recording.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={handleSaveToWorkspace}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
              savedSuccess
                ? "bg-emerald-950/80 border-emerald-500 text-emerald-300"
                : "bg-cyan-950/60 border-cyan-800 text-cyan-300 hover:bg-cyan-900/60"
            }`}
          >
            {savedSuccess ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <BookmarkPlus className="w-3.5 h-3.5" />
            )}
            {savedSuccess ? "Saved to Workspace!" : "Save to Workspace"}
          </button>

          <button
            onClick={handleShareToCloud}
            disabled={shareLoading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs font-semibold text-white shadow-sm hover:scale-[1.02] transition-transform disabled:opacity-60 disabled:hover:scale-100"
            title="Upload trace to Neon Object Storage and generate share link"
          >
            {shareLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Share2 className="w-3.5 h-3.5" />
            )}
            {shareLoading ? "Uploading to Cloud..." : "Share to Cloud"}
          </button>

          <button
            onClick={handleExportTrace}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] hover:bg-[var(--surface-overlay)] text-xs font-semibold text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            Export .rvtrace
          </button>
        </div>
      </div>

      {/* Top Controls Row: Mode Switcher Tabs + 2D/3D Selector + Provenance */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 p-1 bg-[var(--surface)] border border-[var(--border)] rounded-xl w-fit">
          <button
            onClick={() => setLabMode("landscape")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              labMode === "landscape"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm"
                : "text-[var(--text-muted)] hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Continuous Loss Landscapes
          </button>

          <button
            onClick={() => setLabMode("classification")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              labMode === "classification"
                ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-sm"
                : "text-[var(--text-muted)] hover:text-white"
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            Binary Classification
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          <ProvenanceBadge
            type="derived"
            details="Calculated deterministically from analytical mathematical function."
          />
          <ViewModeSelector
            currentMode={viewMode}
            onModeChange={setViewMode}
            supports3D={true}
          />
        </div>
      </div>

      {/* Main Lab Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Canvas & Playback HUD */}
        <div className="lg:col-span-2 space-y-4">
          {/* Visual Presentation Area: 3D Surface vs 2D Canvas */}
          {effectiveMode === "3d" ? (
            labMode === "landscape" ? (
              <ThreeSurfaceViewer
                objectiveType={objectiveType}
                trajectory={landscapeSimulation.stepResults}
                currentStepIndex={stepIndex}
              />
            ) : (
              <ThreeDecisionSurfaceViewer
                weights={activeClfResult ? activeClfResult.weights : [0, 0]}
                bias={activeClfResult ? activeClfResult.bias : 0}
                dataPoints={classificationDataset.points}
                epoch={stepIndex}
                loss={activeClfResult ? activeClfResult.loss : 0}
                accuracy={activeClfResult ? activeClfResult.accuracy : 0}
              />
            )
          ) : (
            <div className="relative aspect-[16/10] rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden flex items-center justify-center shadow-xl">
              <canvas
                ref={canvasRef}
                width={640}
                height={400}
                className="w-full h-full object-contain"
              />
              {/* Overlay Badges */}
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-mono text-cyan-400 border border-white/10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                {labMode === "landscape"
                  ? OBJECTIVES[objectiveType].name
                  : "Hyperplane: w₁·x + w₂·y + b = 0"}
              </div>

              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-mono text-white border border-white/10">
                {labMode === "landscape" ? "Step" : "Epoch"} {stepIndex} / {activeStepsCount - 1}
              </div>
            </div>
          )}

          {/* Transport Controls & Scrubber */}
          <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold hover:shadow-cyan-500/20 shadow-md transition-all"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? "Pause" : "Play Replay"}
                </button>

                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setStepIndex((prev) => Math.min(activeStepsCount - 1, prev + 1));
                  }}
                  className="px-3 py-2 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] text-xs text-white hover:bg-[var(--surface-overlay)]"
                >
                  Step +1
                </button>

                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setStepIndex(0);
                  }}
                  className="p-2 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-muted)] hover:text-white"
                  title="Reset to Step 0"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs font-mono text-[var(--text-muted)]">
                Recorded {labMode === "landscape" ? "Steps" : "Epochs"}: {activeStepsCount}
              </div>
            </div>

            {/* Scrubber slider */}
            <input
              type="range"
              min={0}
              max={activeStepsCount - 1}
              value={stepIndex}
              onChange={(e) => {
                setIsPlaying(false);
                setStepIndex(Number(e.target.value));
              }}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-[var(--surface-raised)] rounded-lg"
            />
          </div>

          {/* Step Inspector HUD */}
          {labMode === "landscape" ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <span className="text-[10px] text-[var(--text-muted)] block mb-1">Loss</span>
                <span className="text-base font-bold text-white">
                  {activeLandscapeResult ? activeLandscapeResult.loss.toFixed(6) : "0"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <span className="text-[10px] text-[var(--text-muted)] block mb-1">Parameter θ₁ (x)</span>
                <span className="text-base font-bold text-cyan-300">
                  {activeLandscapeResult ? activeLandscapeResult.x.toFixed(4) : "0"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <span className="text-[10px] text-[var(--text-muted)] block mb-1">Parameter θ₂ (y)</span>
                <span className="text-base font-bold text-blue-300">
                  {activeLandscapeResult ? activeLandscapeResult.y.toFixed(4) : "0"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <span className="text-[10px] text-[var(--text-muted)] block mb-1">Gradient Norm</span>
                <span className="text-base font-bold text-violet-300">
                  {activeLandscapeResult ? activeLandscapeResult.gradNorm.toFixed(5) : "0"}
                </span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <span className="text-[10px] text-[var(--text-muted)] block mb-1">BCE Loss</span>
                <span className="text-base font-bold text-white">
                  {activeClfResult ? activeClfResult.loss.toFixed(5) : "0"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <span className="text-[10px] text-[var(--text-muted)] block mb-1">Accuracy</span>
                <span className="text-base font-bold text-emerald-400">
                  {activeClfResult ? (activeClfResult.accuracy * 100).toFixed(1) : "0"}%
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <span className="text-[10px] text-[var(--text-muted)] block mb-1">Weights [w₁, w₂]</span>
                <span className="text-xs font-bold text-cyan-300">
                  {activeClfResult
                    ? `[${activeClfResult.weights[0].toFixed(2)}, ${activeClfResult.weights[1].toFixed(2)}]`
                    : "[0, 0]"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <span className="text-[10px] text-[var(--text-muted)] block mb-1">Bias (b)</span>
                <span className="text-base font-bold text-purple-300">
                  {activeClfResult ? activeClfResult.bias.toFixed(3) : "0"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Parameters & Configuration Sidebar */}
        <div className="space-y-4">
          {labMode === "landscape" ? (
            <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Optimization Parameters
              </h3>

              {/* Objective Function */}
              <div>
                <label className="block text-xs font-medium text-white mb-2">
                  Objective Surface
                </label>
                <select
                  value={objectiveType}
                  onChange={(e) => {
                    setObjectiveType(e.target.value as ObjectiveType);
                    setStepIndex(0);
                  }}
                  className="w-full bg-[var(--surface-raised)] border border-[var(--border)] text-xs text-white rounded-lg px-3 py-2 focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="quadratic">Quadratic Ravine (f = 0.5*(x² + 10y²))</option>
                  <option value="rosenbrock">Rosenbrock Banana Valley</option>
                  <option value="saddle">Saddle Surface (f = x² - y²)</option>
                </select>
              </div>

              {/* Optimizer Selection */}
              <div>
                <label className="block text-xs font-medium text-white mb-2">
                  Optimizer Algorithm
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["sgd", "momentum", "adam"] as OptimizerType[]).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setOptimizerType(opt);
                        setStepIndex(0);
                      }}
                      className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                        optimizerType === opt
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-transparent shadow-sm"
                          : "bg-[var(--surface-raised)] border-[var(--border)] text-[var(--text-muted)] hover:text-white"
                      }`}
                    >
                      {opt.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Learning Rate */}
              <div>
                <div className="flex justify-between text-xs text-white mb-1.5">
                  <span>Learning Rate (η)</span>
                  <span className="font-mono text-cyan-400">{learningRate}</span>
                </div>
                <input
                  type="range"
                  min={0.001}
                  max={0.25}
                  step={0.005}
                  value={learningRate}
                  onChange={(e) => {
                    setLearningRate(Number(e.target.value));
                    setStepIndex(0);
                  }}
                  className="w-full accent-cyan-400 cursor-pointer h-2 bg-[var(--surface-raised)] rounded-lg"
                />
              </div>

              {/* Momentum (if applicable) */}
              {optimizerType === "momentum" && (
                <div>
                  <div className="flex justify-between text-xs text-white mb-1.5">
                    <span>Momentum Coefficient (β)</span>
                    <span className="font-mono text-cyan-400">{momentum}</span>
                  </div>
                  <input
                    type="range"
                    min={0.1}
                    max={0.99}
                    step={0.05}
                    value={momentum}
                    onChange={(e) => {
                      setMomentum(Number(e.target.value));
                      setStepIndex(0);
                    }}
                    className="w-full accent-cyan-400 cursor-pointer h-2 bg-[var(--surface-raised)] rounded-lg"
                  />
                </div>
              )}

              {/* Max Iterations */}
              <div>
                <div className="flex justify-between text-xs text-white mb-1.5">
                  <span>Max Steps</span>
                  <span className="font-mono text-cyan-400">{maxSteps}</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={250}
                  step={10}
                  value={maxSteps}
                  onChange={(e) => {
                    setMaxSteps(Number(e.target.value));
                    setStepIndex(0);
                  }}
                  className="w-full accent-cyan-400 cursor-pointer h-2 bg-[var(--surface-raised)] rounded-lg"
                />
              </div>

              {/* Stochastic Gradient Noise */}
              <div>
                <div className="flex justify-between text-xs text-white mb-1.5">
                  <span>Gradient Noise Level</span>
                  <span className="font-mono text-cyan-400">{noiseLevel}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={2}
                  step={0.1}
                  value={noiseLevel}
                  onChange={(e) => {
                    setNoiseLevel(Number(e.target.value));
                    setStepIndex(0);
                  }}
                  className="w-full accent-cyan-400 cursor-pointer h-2 bg-[var(--surface-raised)] rounded-lg"
                />
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Classification Parameters
              </h3>

              {/* Dataset Generator */}
              <div>
                <div className="flex justify-between text-xs text-white mb-1.5">
                  <span>Number of Samples</span>
                  <span className="font-mono text-cyan-400">{clfSamples}</span>
                </div>
                <input
                  type="range"
                  min={40}
                  max={160}
                  step={10}
                  value={clfSamples}
                  onChange={(e) => {
                    setClfSamples(Number(e.target.value));
                    setStepIndex(0);
                  }}
                  className="w-full accent-cyan-400 cursor-pointer h-2 bg-[var(--surface-raised)] rounded-lg"
                />
              </div>

              {/* Learning Rate */}
              <div>
                <div className="flex justify-between text-xs text-white mb-1.5">
                  <span>Learning Rate (η)</span>
                  <span className="font-mono text-cyan-400">{clfLearningRate}</span>
                </div>
                <input
                  type="range"
                  min={0.01}
                  max={0.5}
                  step={0.02}
                  value={clfLearningRate}
                  onChange={(e) => {
                    setClfLearningRate(Number(e.target.value));
                    setStepIndex(0);
                  }}
                  className="w-full accent-cyan-400 cursor-pointer h-2 bg-[var(--surface-raised)] rounded-lg"
                />
              </div>

              {/* Max Epochs */}
              <div>
                <div className="flex justify-between text-xs text-white mb-1.5">
                  <span>Epochs</span>
                  <span className="font-mono text-cyan-400">{clfEpochs}</span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={300}
                  step={10}
                  value={clfEpochs}
                  onChange={(e) => {
                    setClfEpochs(Number(e.target.value));
                    setStepIndex(0);
                  }}
                  className="w-full accent-cyan-400 cursor-pointer h-2 bg-[var(--surface-raised)] rounded-lg"
                />
              </div>

              {/* Random Seed Button */}
              <button
                onClick={() => {
                  setClfSeed((prev) => prev + 1);
                  setStepIndex(0);
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] hover:bg-[var(--surface-overlay)] text-xs font-semibold text-white transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                Resample Data Points (Seed: {clfSeed})
              </button>
            </div>
          )}

          {/* Diagnostic finding callout */}
          <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-cyan-200 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Live Diagnostic Callout
            </div>
            <p className="text-xs text-cyan-100/90 leading-relaxed font-sans">
              {labMode === "landscape"
                ? landscapeSimulation.diverged
                  ? "Warning: Simulation diverged due to high step size."
                  : activeLandscapeResult.gradNorm < 1e-4
                  ? "Convergence verified: Gradient magnitude fell below 1e-4."
                  : "Active descent in progress towards global stationary minimum."
                : activeClfResult && activeClfResult.accuracy >= 0.95
                ? "Separation achieved: Decision boundary correctly partitions 95%+ of points."
                : "Hyperplane rotating to minimize cross-entropy loss."}
            </p>
          </div>
        </div>
      </div>

      {/* Cloud Share Modal */}
      {shareModalOpen && shareData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[var(--surface)] border border-cyan-500/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-700/60 flex items-center justify-center text-cyan-400">
                  <Cloud className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Trace Uploaded to Cloud</h3>
                  <p className="text-[11px] text-[var(--text-muted)]">Permanent public playback URL</p>
                </div>
              </div>
              <button
                onClick={() => setShareModalOpen(false)}
                className="p-1 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface-raised)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cloud Storage Verification Details */}
            <div className="space-y-2 p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-xs font-mono">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                  <Database className="w-3 h-3 text-cyan-400" /> Storage Tier:
                </span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Neon S3 (rewind-traces)
                </span>
              </div>
              {shareData.s3Key && (
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[var(--text-muted)]">S3 Object Key:</span>
                  <span className="text-cyan-300 truncate max-w-[200px]">{shareData.s3Key}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[var(--text-muted)]">PostgreSQL Registry:</span>
                <span className="text-blue-300">Neon Serverless DB</span>
              </div>
            </div>

            {/* Link Input & Copy */}
            <div className="space-y-1.5">
              <label className="text-xs text-[var(--text-muted)] font-medium">Shareable Playback Link</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={
                    typeof window !== "undefined"
                      ? `${window.location.origin}${shareData.shareUrl}`
                      : shareData.shareUrl
                  }
                  className="flex-1 px-3 py-2 text-xs bg-[var(--surface-overlay)] border border-[var(--border)] rounded-lg text-white font-mono select-all focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={async () => {
                    if (typeof window !== "undefined") {
                      const fullUrl = `${window.location.origin}${shareData.shareUrl}`;
                      await navigator.clipboard.writeText(fullUrl);
                      setShareCopied(true);
                      setTimeout(() => setShareCopied(false), 3000);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                    shareCopied
                      ? "bg-emerald-950/80 border-emerald-500 text-emerald-300"
                      : "bg-cyan-950/60 border-cyan-800 text-cyan-300 hover:bg-cyan-900/60"
                  }`}
                >
                  {shareCopied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {shareCopied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setShareModalOpen(false)}
                className="px-3.5 py-2 rounded-lg text-xs font-medium text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface-raised)] transition-colors"
              >
                Close
              </button>
              <Link
                href={shareData.shareUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs font-semibold text-white shadow-sm transition-all"
              >
                Open Shared Playback <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
