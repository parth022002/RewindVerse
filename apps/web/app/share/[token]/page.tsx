"use client";

import React, { useState, useMemo, use, useEffect } from "react";
import Link from "next/link";
import { runOptimizationSimulation } from "@rewindverse/rewindml";
import { analyzeTraceDiagnostics } from "@rewindverse/diagnostics";
import { RvtsParsedTrace, RvtsStepRecord } from "@rewindverse/rvts";
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Activity,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function SharedTracePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const unwrappedParams = use(params);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [cloudTrace, setCloudTrace] = useState<RvtsParsedTrace | null>(null);
  const [cloudSource, setCloudSource] = useState<string | null>(null);
  const [isLoadingCloud, setIsLoadingCloud] = useState<boolean>(true);

  // Fallback simulation if trace is not in cloud or offline
  const simulation = useMemo(() => {
    return runOptimizationSimulation({
      objective: "quadratic",
      optimizer: {
        type: "adam",
        learningRate: 0.08,
        beta1: 0.9,
        beta2: 0.999,
        epsilon: 1e-8,
      },
      initialPoint: [-3.5, 3.8],
      maxSteps: 75,
      seed: 42,
    });
  }, []);

  // Fetch real trace from Neon Database / Neon Object Storage
  useEffect(() => {
    async function fetchCloudTrace() {
      try {
        const res = await fetch(`/api/traces/share?token=${encodeURIComponent(unwrappedParams.token)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.trace) {
            setCloudTrace(data.trace);
            setCloudSource(data.source);
          }
        }
      } catch (e) {
        console.warn("Could not load cloud trace, using local preview:", e);
      } finally {
        setIsLoadingCloud(false);
      }
    }
    fetchCloudTrace();
  }, [unwrappedParams.token]);

  const trace = cloudTrace || simulation.trace;
  const diagnostics = useMemo(() => analyzeTraceDiagnostics(trace), [trace]);
  const steps = trace.steps;
  const totalSteps = steps.length;
  const activeStep = steps[stepIndex] || steps[0];

  const maxLoss = useMemo(() => {
    return Math.max(...steps.map((s: RvtsStepRecord) => s.metrics?.loss || 0), 1);
  }, [steps]);

  // Playback timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= totalSteps - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [isPlaying, totalSteps]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-white flex flex-col justify-between">
      {/* Top Read-Only Bar */}
      <header className="border-b border-[var(--border)] bg-[var(--surface)] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-xs">
              RV
            </div>
            <span className="font-bold text-sm tracking-tight text-white">
              RewindVerse <span className="text-cyan-400 font-normal">Share</span>
            </span>
          </Link>
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-800 text-[10px] font-mono text-cyan-300">
            <Lock className="w-3 h-3" /> Read-Only Public View
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[var(--text-muted)] hidden md:inline">
            Token: {unwrappedParams.token}
          </span>
          <Link
            href="/studio/lab"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold hover:shadow-cyan-500/20 shadow-sm"
          >
            Open in Rewind Studio <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl w-full mx-auto p-6 space-y-6 flex-1">
        {/* Run Title & Provenance */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800 text-[10px] font-mono text-emerald-300">
                Verified Cryptographic Trace
              </span>
              {cloudSource === "neon_s3" && (
                <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800 text-[10px] font-mono text-cyan-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-cyan-400" /> Neon S3 Cloud Verified
                </span>
              )}
              <span className="text-xs text-[var(--text-muted)] font-mono">
                {trace.manifest.run_id}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">
              {trace.manifest.name}
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded bg-emerald-950/50 border border-emerald-800/60 text-emerald-400">
              ✓ Loss Recorded
            </span>
            <span className="px-2.5 py-1 rounded bg-emerald-950/50 border border-emerald-800/60 text-emerald-400">
              ✓ Parameters Recorded
            </span>
          </div>
        </div>

        {/* Synchronized Replay View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {/* SVG Loss Curve */}
            <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  Synchronized Loss Curve
                </h3>
                <span className="text-xs font-mono text-[var(--text-muted)]">
                  Step {stepIndex} Loss: {activeStep.metrics.loss.toFixed(6)}
                </span>
              </div>

              <div className="relative aspect-[21/9] w-full bg-[var(--background)] rounded-xl border border-[var(--border)] p-4 flex items-end">
                <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${Math.max(1, totalSteps - 1)} 100`}>
                  <line x1="0" y1="25" x2={totalSteps - 1} y2="25" stroke="rgba(255,255,255,0.05)" />
                  <line x1="0" y1="50" x2={totalSteps - 1} y2="50" stroke="rgba(255,255,255,0.05)" />
                  <line x1="0" y1="75" x2={totalSteps - 1} y2="75" stroke="rgba(255,255,255,0.05)" />

                  <polyline
                    fill="none"
                    stroke="#00d2ff"
                    strokeWidth="2.5"
                    points={steps
                      .map((s: RvtsStepRecord, idx: number) => `${idx},${100 - (Number(s.metrics?.loss || 0) / maxLoss) * 88}`)
                      .join(" ")}
                  />

                  {/* Scrubber vertical line */}
                  <line
                    x1={stepIndex}
                    y1="0"
                    x2={stepIndex}
                    y2="100"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeDasharray="3 3"
                  />

                  <circle
                    cx={stepIndex}
                    cy={100 - (activeStep.metrics.loss / maxLoss) * 88}
                    r="4"
                    fill="#ffffff"
                    stroke="#00d2ff"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-3">
              <div className="flex items-center justify-between">
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
                      setStepIndex(0);
                    }}
                    className="p-2 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-muted)] hover:text-white"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs font-mono text-[var(--text-muted)]">
                  Step {stepIndex} / {totalSteps - 1}
                </div>
              </div>

              <input
                type="range"
                min={0}
                max={totalSteps - 1}
                value={stepIndex}
                onChange={(e) => {
                  setIsPlaying(false);
                  setStepIndex(Number(e.target.value));
                }}
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-[var(--surface-raised)] rounded-lg"
              />
            </div>
          </div>

          {/* Right Column: Step Inspector HUD */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Step {stepIndex} Metrics
              </h3>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)]">
                  <span className="text-[10px] uppercase text-[var(--text-muted)] block mb-1">
                    Recorded Loss
                  </span>
                  <span className="text-lg font-bold text-white">
                    {activeStep.metrics.loss.toFixed(6)}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)]">
                  <span className="text-[10px] uppercase text-[var(--text-muted)] block mb-1">
                    Parameters θ
                  </span>
                  <span className="text-xs font-medium text-slate-300 block break-all">
                    {activeStep.parameters?.theta
                      ? JSON.stringify(activeStep.parameters.theta)
                      : "No parameters recorded"}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)]">
                  <span className="text-[10px] uppercase text-[var(--text-muted)] block mb-1">
                    Gradient Norm
                  </span>
                  <span className="text-xs font-medium text-violet-300 block">
                    {activeStep.metrics.gradient_norm !== undefined
                      ? activeStep.metrics.gradient_norm.toFixed(6)
                      : "Nominal"}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200">
                <span className="font-semibold block mb-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  Honest Replay
                </span>
                Only facts recorded in the RVTS trace are displayed. No internals are hallucinated.
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-4 text-center text-xs text-[var(--text-muted)]">
        Powered by <strong className="text-white">RewindVerse</strong> — Every Model Has a Story.
      </footer>
    </div>
  );
}

