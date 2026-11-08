import React from "react";
import Link from "next/link";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { HeroDemo } from "../components/HeroDemo";
import {
  Sparkles,
  ArrowRight,
  Play,
  RotateCcw,
  Cpu,
  Eye,
  GitCompare,
  GraduationCap,
  FileCode,
  ShieldCheck,
  Terminal,
  Activity,
  Layers,
  Box,
  Lock,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] selection:bg-cyan-500 selection:text-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden glow-bg">
        {/* Ambient Glow Lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[360px] bg-gradient-to-tr from-cyan-500/15 via-blue-500/10 to-violet-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-medium mb-6 backdrop-blur-md shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>Deterministic Machine Learning Replay Engine</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.08]">
            Every Model Has a Story. <br />
            <span className="brand-gradient-text">
              Replay How It Learned.
            </span>
          </h1>

          {/* Punchy Subhead */}
          <p className="mt-5 text-base sm:text-lg text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
            Scrub through every parameter update. Replay gradient trajectories in 2D & 3D.
            Uncover exactly why your network converged or failed — zero cloud dependencies.
          </p>

          {/* Hero CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/studio"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Open Rewind Studio — Free
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </Link>
            <Link
              href="/studio/replay/sample"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-white/5 hover:bg-white/10 border border-white/10 text-white backdrop-blur-sm transition-colors"
            >
              <Play className="w-4 h-4 text-cyan-400" />
              Watch Sample Replay
            </Link>
          </div>

          {/* Live Interactive Optimizer Showcase */}
          <div className="mt-12">
            <HeroDemo />
          </div>
        </div>
      </section>

      {/* Proof Stats Bar */}
      <section className="border-y border-white/5 bg-[var(--surface)]/50 backdrop-blur-sm py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">60 FPS</div>
              <div className="text-xs text-[var(--text-muted)] mt-1">Timeline Scrubbing Sync</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">100%</div>
              <div className="text-xs text-[var(--text-muted)] mt-1">In-Browser Privacy</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-violet-400 font-mono">2D & 3D</div>
              <div className="text-xs text-[var(--text-muted)] mt-1">Visual Representation Parity</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">Zero</div>
              <div className="text-xs text-[var(--text-muted)] mt-1">Cloud Setup Required</div>
            </div>
          </div>
        </div>
      </section>

      {/* Flagship Bento Grid Showcase */}
      <section className="py-20 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">
              Intelligent ML Inspection
            </h2>
            <p className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              Engineered for Deep Learning Clarity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Bento Card 1 (Span 2): Replay Engine */}
            <div className="md:col-span-2 p-7 rounded-3xl glass-panel glass-card-interactive flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono text-cyan-300 px-2.5 py-1 rounded-md bg-cyan-950/60 border border-cyan-800/40">
                    O(1) Step Indexing
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Deterministic Timeline Replay
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-xl">
                  Step backward and forward through training iterations. Synchronize loss curves, 2D contours,
                  and 3D objective surfaces with zero latency or dropped frames.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                <Link
                  href="/studio/replay/sample"
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 group"
                >
                  Explore Replay Viewer <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-mono">
                  <span>Space = Play/Pause</span> • <span>← / → = Step</span>
                </div>
              </div>
            </div>

            {/* Bento Card 2: Evidence-Backed Insights */}
            <div className="p-7 rounded-3xl glass-panel glass-card-interactive flex flex-col justify-between shadow-xl">
              <div>
                <div className="w-10 h-10 rounded-xl bg-violet-950/80 border border-violet-800/60 flex items-center justify-center text-violet-400 mb-4">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Evidence-Backed Insights
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  Automatic heuristic detectors flag loss plateaus, vanishing/exploding gradients, and
                  learning rate oscillations citing exact step ranges.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/5">
                <Link
                  href="/studio/insights"
                  className="text-xs font-semibold text-violet-400 hover:text-violet-300 inline-flex items-center gap-1 group"
                >
                  View Diagnostic Cards <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Bento Card 3: 100% In-Browser Privacy */}
            <div className="p-7 rounded-3xl glass-panel glass-card-interactive flex flex-col justify-between shadow-xl">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400 mb-4">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  100% Local-First Privacy
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  Everything executes inside Web Workers and IndexedDB on your machine.
                  No model weights are uploaded. No tracking cookies. Zero telemetry.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/5">
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Client-Side Sandbox Guarded
                </span>
              </div>
            </div>

            {/* Bento Card 4 (Span 2): Universal Python SDK & CSV Bridge */}
            <div className="md:col-span-2 p-7 rounded-3xl glass-panel glass-card-interactive flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400">
                    <FileCode className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono text-blue-300 px-2.5 py-1 rounded-md bg-blue-950/60 border border-blue-800/40">
                    PyTorch & CSV Ready
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Universal Python SDK & CSV Ingestor
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-xl">
                  Drop in training CSVs from PyTorch, Wandb, or Keras with automated column detection
                  and formula injection sanitization. Or record live runs with the lightweight Python SDK.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                <Link
                  href="/studio/import"
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 group"
                >
                  Import CSV / .rvtrace <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/docs"
                  className="text-xs text-[var(--text-muted)] hover:text-white transition-colors"
                >
                  Read RVTS Spec →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Integration Snippet */}
      <section className="py-20 border-b border-white/5 bg-[var(--surface)]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/50 border border-blue-800/50 text-blue-300 text-xs font-medium mb-4">
                <Terminal className="w-3.5 h-3.5" /> 3-Line Integration
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Record in Python. <br />
                Replay in Any Browser.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                Connect your existing PyTorch or Scikit-learn scripts with zero vendor lock-in.
                Our non-blocking recorder streams step records to a portable <code className="text-cyan-300">.rvtrace</code> file ready for instant browser inspection.
              </p>

              <div className="mt-6 flex flex-wrap gap-4 text-xs font-mono text-[var(--text-muted)]">
                <span className="flex items-center gap-1.5 text-white">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Non-blocking I/O
                </span>
                <span className="flex items-center gap-1.5 text-white">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> CLI validation tools
                </span>
                <span className="flex items-center gap-1.5 text-white">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Open JSON Lines schema
                </span>
              </div>
            </div>

            {/* Code Snippet Box */}
            <div className="rounded-2xl border border-white/10 bg-black/60 p-5 font-mono text-xs overflow-x-auto shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5 text-[var(--text-muted)] text-[11px]">
                <span className="text-slate-400">train_and_record.py</span>
                <span className="text-cyan-400">pip install rewindverse-trace</span>
              </div>
              <pre className="text-slate-300 leading-relaxed">
{`from rewindverse_trace import RunRecorder

with RunRecorder("experiment_01", output_path="traces/run.rvtrace") as rec:
    for epoch in range(num_epochs):
        loss, grad_norm = train_step(model, batch)
        rec.log_step(
            step=epoch,
            metrics={"loss": loss, "grad_norm": grad_norm},
            lr=optimizer.param_groups[0]["lr"]
        )

# Replay instantly:
# $ rvtrace view traces/run.rvtrace`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Conversion Portal */}
      <section className="py-24 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Stop debugging models in the dark.
          </h2>
          <p className="mt-4 text-[var(--text-muted)] text-base sm:text-lg">
            Experience deterministic ML replay today. Free, open, and instant.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Sparkles className="w-5 h-5" />
              Launch Rewind Studio
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
