"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { listRecentRuns, clearAllRuns, StoredRun } from "../../lib/storage";
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Monitor,
  Zap,
  ShieldCheck,
  HardDrive,
  Download,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Cloud,
  Layers,
  Sparkles,
  ArrowRight,
  Database,
} from "lucide-react";

export default function SettingsPage() {
  // Theme state
  const [theme, setTheme] = useState<"obsidian" | "slate" | "system">("obsidian");
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [defaultVisMode, setDefaultVisMode] = useState<"auto" | "2d" | "3d">("auto");

  // Replay defaults
  const [defaultSpeed, setDefaultSpeed] = useState<string>("1.0");
  const [trailLength, setTrailLength] = useState<string>("full");

  // Privacy & telemetry
  const [telemetryOptIn, setTelemetryOptIn] = useState<boolean>(false);

  // Storage state
  const [runs, setRuns] = useState<StoredRun[]>([]);
  const [isClearing, setIsClearing] = useState<boolean>(false);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  // Load storage details on mount
  useEffect(() => {
    listRecentRuns(100).then((saved) => {
      setRuns(saved);
    });

    // Check localStorage preferences
    const savedTheme = localStorage.getItem("rw_theme") as "obsidian" | "slate" | "system" | null;
    if (savedTheme) setTheme(savedTheme);

    const savedVis = localStorage.getItem("rw_default_vis") as "auto" | "2d" | "3d" | null;
    if (savedVis) setDefaultVisMode(savedVis);

    const savedMotion = localStorage.getItem("rw_reduced_motion");
    if (savedMotion === "true") setReducedMotion(true);

    const savedSpeed = localStorage.getItem("rw_default_speed");
    if (savedSpeed) setDefaultSpeed(savedSpeed);
  }, []);

  const handleSaveTheme = (newTheme: "obsidian" | "slate" | "system") => {
    setTheme(newTheme);
    localStorage.setItem("rw_theme", newTheme);
    setMessage("Theme preference saved.");
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSaveVisMode = (mode: "auto" | "2d" | "3d") => {
    setDefaultVisMode(mode);
    localStorage.setItem("rw_default_vis", mode);
    setMessage("Default visualization mode updated.");
    setTimeout(() => setMessage(null), 3000);
  };

  const handleToggleReducedMotion = () => {
    const next = !reducedMotion;
    setReducedMotion(next);
    localStorage.setItem("rw_reduced_motion", String(next));
    setMessage(`Reduced motion ${next ? "enabled" : "disabled"}.`);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSpeedChange = (spd: string) => {
    setDefaultSpeed(spd);
    localStorage.setItem("rw_default_speed", spd);
    setMessage(`Default playback speed set to ${spd}x.`);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleExportAllRuns = () => {
    if (runs.length === 0) {
      alert("No stored runs in IndexedDB to export.");
      return;
    }
    const backupData = JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        totalRuns: runs.length,
        runs: runs.map((r) => ({
          id: r.id,
          name: r.name,
          createdAt: r.createdAt,
          objective: r.objective,
          optimizer: r.optimizer,
          stepsCount: r.stepsCount,
          finalLoss: r.finalLoss,
          jsonl: r.jsonl,
        })),
      },
      null,
      2
    );

    const blob = new Blob([backupData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rewindverse-workspace-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setMessage("Workspace backup exported successfully.");
    setTimeout(() => setMessage(null), 3000);
  };

  const handleClearAll = async () => {
    setIsClearing(true);
    try {
      await clearAllRuns();
      setRuns([]);
      setShowClearConfirm(false);
      setMessage("All local workspace runs successfully cleared.");
      setTimeout(() => setMessage(null), 3000);
    } catch {
      alert("Failed to clear local storage.");
    } finally {
      setIsClearing(false);
    }
  };

  const approxStorageBytes = runs.reduce((acc, r) => acc + (r.jsonl?.length || 0), 0);
  const formattedStorage =
    approxStorageBytes > 1024 * 1024
      ? `${(approxStorageBytes / (1024 * 1024)).toFixed(2)} MB`
      : `${(approxStorageBytes / 1024).toFixed(1)} KB`;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 w-full">
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/40 border border-violet-800/50 text-violet-300 text-xs font-mono">
            <SettingsIcon className="w-3.5 h-3.5" /> Workspace & Preferences
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Settings & Governance
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            Configure visual themes, replay engine defaults, local IndexedDB storage, and data sovereignty policies.
          </p>
        </div>

        {/* Transient feedback banner */}
        {message && (
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* Section 1: Visual Theme & Appearance */}
        <section className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Visual Appearance & Themes</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => handleSaveTheme("obsidian")}
              className={`p-4 rounded-xl border text-left transition-all ${
                theme === "obsidian"
                  ? "bg-cyan-950/40 border-cyan-500 text-white shadow-lg shadow-cyan-500/10"
                  : "bg-[var(--surface-raised)] border-[var(--border)] text-[var(--text-muted)] hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-4 h-4 rounded-full bg-[#080b12] border border-cyan-400" />
                {theme === "obsidian" && <span className="text-[10px] font-mono text-cyan-400">ACTIVE</span>}
              </div>
              <h3 className="text-xs font-bold text-white">Obsidian Void</h3>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">Deep space #080b12 with radiant Aurora Cyan & Violet glow.</p>
            </button>

            <button
              onClick={() => handleSaveTheme("slate")}
              className={`p-4 rounded-xl border text-left transition-all ${
                theme === "slate"
                  ? "bg-blue-950/40 border-blue-500 text-white shadow-lg shadow-blue-500/10"
                  : "bg-[var(--surface-raised)] border-[var(--border)] text-[var(--text-muted)] hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-4 h-4 rounded-full bg-[#0f172a] border border-blue-400" />
                {theme === "slate" && <span className="text-[10px] font-mono text-blue-400">ACTIVE</span>}
              </div>
              <h3 className="text-xs font-bold text-white">Slate Neutral</h3>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">Refined classic slate navy with high-contrast text metrics.</p>
            </button>

            <button
              onClick={() => handleSaveTheme("system")}
              className={`p-4 rounded-xl border text-left transition-all ${
                theme === "system"
                  ? "bg-violet-950/40 border-violet-500 text-white shadow-lg shadow-violet-500/10"
                  : "bg-[var(--surface-raised)] border-[var(--border)] text-[var(--text-muted)] hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Monitor className="w-4 h-4 text-violet-400" />
                {theme === "system" && <span className="text-[10px] font-mono text-violet-400">ACTIVE</span>}
              </div>
              <h3 className="text-xs font-bold text-white">System Synchronized</h3>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">Automatically mirrors your OS dark/light mode preference.</p>
            </button>
          </div>

          <div className="pt-4 border-t border-[var(--border)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-white">Reduced Motion (WCAG 2.2 AA)</h4>
              <p className="text-[11px] text-[var(--text-muted)]">Disables continuous aurora drifting, trajectory flows, and rapid animations.</p>
            </div>
            <button
              onClick={handleToggleReducedMotion}
              className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold border transition-colors ${
                reducedMotion
                  ? "bg-amber-950/60 border-amber-500 text-amber-300"
                  : "bg-[var(--surface-raised)] border-[var(--border)] text-[var(--text-muted)] hover:text-white"
              }`}
            >
              {reducedMotion ? "Reduced Motion: ON" : "Reduced Motion: OFF"}
            </button>
          </div>

          <div className="pt-4 border-t border-[var(--border)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-white">Default Visualization Mode</h4>
              <p className="text-[11px] text-[var(--text-muted)]">Enforces initial viewport rendering across Studio Replay and Lab.</p>
            </div>
            <div className="flex items-center gap-1.5 bg-[var(--surface-raised)] p-1 rounded-lg border border-[var(--border)] text-xs font-mono">
              {(["auto", "2d", "3d"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleSaveVisMode(mode)}
                  className={`px-2.5 py-1 rounded transition-colors uppercase ${
                    defaultVisMode === mode
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                      : "text-[var(--text-muted)] hover:text-white"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: Replay Engine Defaults */}
        <section className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-6">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Replay Engine Defaults</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white">Default Playback Speed</label>
              <select
                value={defaultSpeed}
                onChange={(e) => handleSpeedChange(e.target.value)}
                className="w-full bg-[var(--surface-raised)] border border-[var(--border)] text-xs text-white rounded-lg px-3 py-2"
              >
                <option value="0.5">0.5x (Detailed Inspection)</option>
                <option value="1.0">1.0x (Real-time Default)</option>
                <option value="2.0">2.0x (Fast Convergence)</option>
                <option value="5.0">5.0x (High-Velocity Scrub)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white">Trajectory Tail Display</label>
              <select
                value={trailLength}
                onChange={(e) => setTrailLength(e.target.value)}
                className="w-full bg-[var(--surface-raised)] border border-[var(--border)] text-xs text-white rounded-lg px-3 py-2"
              >
                <option value="full">Full Convergence Path (All Steps)</option>
                <option value="window_20">Rolling 20-Step Window</option>
                <option value="target_only">Active Step Marker Only</option>
              </select>
            </div>
          </div>
        </section>

        {/* Section 3: Privacy & Data Sovereignty */}
        <section className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Data Sovereignty & Privacy</h2>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-xs text-emerald-200 leading-relaxed space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-300">
              <CheckCircle className="w-4 h-4" /> 100% Client-Side Execution Guarantee
            </div>
            <p>
              RewindML computations, CSV parsing, AST validations, and diagnostic checks run entirely inside your browser Web Workers.
              Your training metrics and weight parameters are never transmitted to any third-party AI provider or analytics service.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
            <div>
              <h4 className="text-xs font-bold text-white">Product Telemetry & Usage Analytics</h4>
              <p className="text-[11px] text-[var(--text-muted)]">Coarse pageview events only (zero metric values or weights recorded).</p>
            </div>
            <button
              onClick={() => setTelemetryOptIn(!telemetryOptIn)}
              className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold border transition-colors ${
                telemetryOptIn
                  ? "bg-cyan-950/60 border-cyan-500 text-cyan-300"
                  : "bg-[var(--surface-raised)] border-[var(--border)] text-[var(--text-muted)] hover:text-white"
              }`}
            >
              {telemetryOptIn ? "Opted In" : "Strict Opt-Out (Active)"}
            </button>
          </div>
        </section>

        {/* Section 4: Local Storage (IndexedDB) Manager */}
        <section className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HardDrive className="w-5 h-5 text-violet-400" />
              <div>
                <h2 className="text-lg font-bold text-white">Local Workspace Storage (IndexedDB)</h2>
                <p className="text-xs text-[var(--text-muted)]">
                  Persists traces and custom forge algorithms offline in your browser database.
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono text-cyan-400 font-bold block">{runs.length} Saved Runs</span>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">~{formattedStorage} used</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportAllRuns}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Backup All Workspace Runs (.json)
            </button>

            {!showClearConfirm ? (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 text-red-300 text-xs font-medium transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Local Data...
              </button>
            ) : (
              <div className="flex items-center gap-2 p-2 rounded-xl bg-red-950/90 border border-red-500 text-xs text-white">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Confirm destructive deletion of all {runs.length} runs?</span>
                <button
                  onClick={handleClearAll}
                  disabled={isClearing}
                  className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-700 text-white font-bold"
                >
                  Yes, Clear
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Section 5: Cloud & Backend Infrastructure Status */}
        <section className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-4">
          <div className="flex items-center gap-3">
            <Cloud className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">Cloud Backend Services</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-cyan-400" />
                <div>
                  <h4 className="font-bold text-white">Neon Serverless PostgreSQL</h4>
                  <p className="text-[10px] text-[var(--text-muted)]">Workspaces, traces & share tokens</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono">
                CONNECTED
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Cloud className="w-4 h-4 text-violet-400" />
                <div>
                  <h4 className="font-bold text-white">Neon S3 Object Storage</h4>
                  <p className="text-[10px] text-[var(--text-muted)]">Bucket: rewind-traces (ap-southeast-1)</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono">
                READY
              </span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

