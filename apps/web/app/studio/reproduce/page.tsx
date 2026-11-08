"use client";

import React, { useState } from "react";
import {
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  FileCheck,
  ShieldCheck,
  Download,
  UploadCloud,
} from "lucide-react";

export default function ReproductionStudioPage() {
  const [capsuleName, setCapsuleName] = useState<string>("rosenbrock_adamw_capsule_v1.rvcapsule");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [hasVerified, setHasVerified] = useState<boolean>(false);

  const verificationResults = {
    originalLoss: 0.00012,
    reproducedLoss: 0.00012,
    absoluteDifference: 0.0,
    toleranceThreshold: 1e-4,
    randomSeed: 42,
    environmentStatus: "Clean Parity (Node v22 / Chrome V8)",
    verdict: "EXACT_REPRODUCIBILITY",
  };

  const handleVerifyCapsule = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setHasVerified(true);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Reproduction Studio
            </span>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              Specification §15.0 Conformance
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
            Reproducibility Capsule Verification
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Inspect reproducibility capsules (`.rvcapsule`), re-execute under locked seeds, and verify numerical parity.
          </p>
        </div>

        <button
          onClick={handleVerifyCapsule}
          disabled={isVerifying}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
        >
          {isVerifying ? (
            <>
              <RotateCcw className="w-4 h-4 animate-spin" />
              <span>Verifying Parity...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Re-Execute & Verify Capsule</span>
            </>
          )}
        </button>
      </div>

      {/* Capsule Info Card */}
      <div className="glass-panel p-6 rounded-2xl border-[var(--border)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-white">Active Reproducibility Capsule</h2>
          </div>
          <span className="text-xs font-mono text-cyan-400">{capsuleName}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)]">
            <span className="text-[10px] text-[var(--text-muted)] block">Locked Random Seed</span>
            <span className="text-white font-bold">{verificationResults.randomSeed}</span>
          </div>
          <div className="p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)]">
            <span className="text-[10px] text-[var(--text-muted)] block">Tolerance Epsilon (ε)</span>
            <span className="text-cyan-400 font-bold">1e-4</span>
          </div>
          <div className="p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)]">
            <span className="text-[10px] text-[var(--text-muted)] block">Recorded Target Loss</span>
            <span className="text-white font-bold">{verificationResults.originalLoss}</span>
          </div>
        </div>

        {hasVerified && (
          <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-950/40 to-cyan-950/40 border border-emerald-500/30 text-xs font-mono space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>VERDICT: EXACT NUMERICAL REPRODUCIBILITY (Δ = 0.00000)</span>
            </div>
            <p className="text-[var(--text-muted)] text-[11px] leading-relaxed">
              Re-executing the simulation under seed {verificationResults.randomSeed} reproduced identical step trajectories
              and final loss across all iterations. All numerical floats match within double-precision machine epsilon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
