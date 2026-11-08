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
  GitCompare,
  GraduationCap,
  FileCode,
  ShieldCheck,
  Terminal,
  Activity,
  Layers,
  Lock,
  CheckCircle2,
  ChevronRight,
  Wrench,
  BookOpen,
  Sliders,
  Maximize2,
  Eye,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] selection:bg-cyan-500 selection:text-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-14 pb-20 md:pt-24 md:pb-32 overflow-hidden glow-bg">
        {/* Core Radial Atmosphere */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-gradient-to-tr from-cyan-400/20 via-sky-500/10 to-violet-500/20 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-medium mb-6 backdrop-blur-xl shadow-lg shadow-cyan-500/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <span>Now with Algorithm Forge · Safe AST & Live Replay</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.08]">
            Every Model Has a Story. <br />
            <span className="brand-gradient-text">
              Replay How It Learned.
            </span>
          </h1>

          {/* Punchy Subhead */}
          <p className="mt-6 text-base sm:text-lg text-[var(--text-muted)] max-w-3xl mx-auto leading-relaxed">
            Scrub through every parameter update with millisecond accuracy. Replay gradient trajectories
            over continuous 2D & 3D loss surfaces. Create custom optimizers in our sandboxed Algorithm Forge.
          </p>

          {/* Hero CTAs */}
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/studio"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-600 text-[#080b12] shadow-xl shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Sparkles className="w-4 h-4 fill-[#080b12]" />
              Launch Studio Workspace
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </Link>
            <Link
              href="/studio/forge"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm bg-violet-950/40 hover:bg-violet-900/50 border border-violet-500/40 text-violet-200 backdrop-blur-xl shadow-lg shadow-violet-500/10 hover:border-violet-400 transition-all"
            >
              <Wrench className="w-4 h-4 text-violet-300" />
              Open Algorithm Forge
            </Link>
            <Link
              href="/studio/algorithms"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-slate-200 backdrop-blur-md transition-colors"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              Browse Catalogue
            </Link>
          </div>

          {/* Live Interactive Optimizer Showcase */}
          <div className="mt-14">
            <HeroDemo />
          </div>
        </div>
      </section>

      {/* Proof Stats Bar */}
      <section className="border-y border-white/[0.08] bg-[#0e1422]/60 backdrop-blur-xl py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">60 FPS</div>
              <div className="text-xs text-[var(--text-muted)] mt-1.5 font-medium">Timeline Scrubbing Sync</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-mono tracking-tight">100%</div>
              <div className="text-xs text-[var(--text-muted)] mt-1.5 font-medium">In-Browser Privacy</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-violet-400 font-mono tracking-tight">2D & 3D</div>
              <div className="text-xs text-[var(--text-muted)] mt-1.5 font-medium">Visual Representation Parity</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono tracking-tight">Zero</div>
              <div className="text-xs text-[var(--text-muted)] mt-1.5 font-medium">Cloud Setup Required</div>
            </div>
          </div>
        </div>
      </section>

      {/* Flagship Bento Grid Showcase */}
      <section className="py-24 border-b border-white/[0.08] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2.5">
              Intelligent ML Platform
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Engineered for Machine Learning Clarity
            </p>
            <p className="text-sm text-[var(--text-muted)] mt-2 max-w-xl mx-auto">
              Replace static end-state metrics with interactive time-travel replay and safe algorithm customization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Card 1 (Span 2): Replay Engine */}
            <div className="md:col-span-2 p-8 rounded-3xl glass-panel glass-card-interactive flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-cyan-950/80 border border-cyan-700/60 flex items-center justify-center text-cyan-300 shadow-md shadow-cyan-500/10">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono text-cyan-300 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60">
                    O(1) Step Indexing
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2.5">
                  Deterministic Timeline Replay
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-xl">
                  Step backward and forward through thousands of training iterations. Synchronize SVG loss curves,
                  2D contour maps, and 3D WebGL objective surfaces with millisecond response time.
                </p>
              </div>

              <div className="pt-6 mt-8 border-t border-white/[0.08] flex items-center justify-between">
                <Link
                  href="/studio/replay/sample"
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1.5 group"
                >
                  Explore Sample Replay <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="hidden sm:flex items-center gap-2 text-xs text-[var(--text-muted)] font-mono">
                  <span>Space = Play/Pause</span> • <span>← / → = Step</span>
                </div>
              </div>
            </div>

            {/* Bento Card 2: Algorithm Forge */}
            <div className="p-8 rounded-3xl glass-panel glass-card-interactive flex flex-col justify-between shadow-2xl border-violet-500/30">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-violet-950/80 border border-violet-700/60 flex items-center justify-center text-violet-300 shadow-md shadow-violet-500/10">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-violet-300 px-2.5 py-1 rounded-full bg-violet-950/60 border border-violet-800/60">
                    Mode A/B/C
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2.5">
                  Algorithm Forge
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  Design custom update rules with our safe allowlisted AST validator. Fork built-ins, build visual
                  pipelines, or write algebraic formulas with zero eval risks.
                </p>
              </div>

              <div className="pt-6 mt-8 border-t border-white/[0.08]">
                <Link
                  href="/studio/forge"
                  className="text-xs font-semibold text-violet-400 hover:text-violet-300 inline-flex items-center gap-1.5 group"
                >
                  Launch Forge Workspace <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Bento Card 3: Algorithm Catalogue */}
            <div className="p-8 rounded-3xl glass-panel glass-card-interactive flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-purple-950/80 border border-purple-700/60 flex items-center justify-center text-purple-300 shadow-md shadow-purple-500/10">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono text-purple-300 px-2.5 py-1 rounded-full bg-purple-950/60 border border-purple-800/60">
                    Verified Registry
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2.5">
                  Algorithm Catalogue
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  Explore verified analytical definitions, assumptions, RVTS trace capabilities, and provenance
                  badges across Optimization, Supervised, Unsupervised, and Deep Learning.
                </p>
              </div>

              <div className="pt-6 mt-8 border-t border-white/[0.08]">
                <Link
                  href="/studio/algorithms"
                  className="text-xs font-semibold text-purple-400 hover:text-purple-300 inline-flex items-center gap-1.5 group"
                >
                  Browse Full Registry <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Bento Card 4: Evidence-Backed Insights */}
            <div className="p-8 rounded-3xl glass-panel glass-card-interactive flex flex-col justify-between shadow-2xl">
              <div>
                <div className="w-11 h-11 rounded-xl bg-cyan-950/80 border border-cyan-700/60 flex items-center justify-center text-cyan-300 mb-5">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2.5">
                  Evidence-Backed Insights
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  Automatic heuristic detectors flag loss plateaus, vanishing/exploding gradients, and
                  learning rate oscillations with clickable step intervals.
                </p>
              </div>

              <div className="pt-6 mt-8 border-t border-white/[0.08]">
                <Link
                  href="/studio/insights"
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1.5 group"
                >
                  View Diagnostic Cards <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Bento Card 5 (Span 1 or 2): 100% In-Browser Privacy */}
            <div className="p-8 rounded-3xl glass-panel glass-card-interactive flex flex-col justify-between shadow-2xl">
              <div>
                <div className="w-11 h-11 rounded-xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400 mb-5">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2.5">
                  100% Local-First Privacy
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  Execution runs inside client Web Workers and IndexedDB. No weights are uploaded to cloud servers.
                  Zero analytics trackers. Zero third-party cookies.
                </p>
              </div>

              <div className="pt-6 mt-8 border-t border-white/[0.08]">
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Client-Side Sandbox Guaranteed
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Integration Snippet */}
      <section className="py-24 border-b border-white/[0.08] bg-[#080b12]/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 text-xs font-semibold mb-4">
                <Terminal className="w-3.5 h-3.5" /> 3-Line Python Integration
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
                Record in Python. <br />
                Replay in Any Modern Browser.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                Connect your existing PyTorch or Scikit-learn scripts with zero vendor lock-in.
                Our non-blocking recorder streams step records to a portable <code className="text-cyan-300 font-mono">.rvtrace</code> file ready for instant browser inspection.
              </p>

              <div className="mt-6 flex flex-wrap gap-5 text-xs font-mono text-[var(--text-muted)]">
                <span className="flex items-center gap-2 text-white">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Non-blocking I/O
                </span>
                <span className="flex items-center gap-2 text-white">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" /> CLI validation tools
                </span>
                <span className="flex items-center gap-2 text-white">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Open JSON Lines schema
                </span>
              </div>
            </div>

            {/* Code Snippet Box */}
            <div className="rounded-2xl border border-white/[0.1] bg-[#06080e]/90 p-6 font-mono text-xs overflow-x-auto shadow-2xl backdrop-blur-2xl">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.08] text-[var(--text-muted)] text-[11px]">
                <span className="text-slate-300 font-semibold">train_and_record.py</span>
                <span className="text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded">
                  pip install rewindverse-trace
                </span>
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
      <section className="py-28 text-center relative overflow-hidden">
        {/* Ambient Portal Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-cyan-500/15 via-violet-500/15 to-pink-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="p-10 sm:p-14 rounded-3xl glass-panel border border-cyan-500/30 shadow-2xl relative overflow-hidden">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Stop debugging models in the dark.
            </h2>
            <p className="mt-4 text-[var(--text-muted)] text-base sm:text-lg max-w-xl mx-auto">
              Experience deterministic ML replay and interactive algorithm design today. 100% free, private, and instant.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/studio"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-base bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-600 text-[#080b12] shadow-xl shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Sparkles className="w-5 h-5 fill-[#080b12]" />
                Launch Rewind Studio
                <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
              <Link
                href="/studio/forge"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-semibold text-base bg-[var(--surface-raised)] border border-[var(--border)] text-white hover:text-cyan-300 hover:border-cyan-500/40 transition-all"
              >
                <Wrench className="w-5 h-5 text-violet-400" />
                Algorithm Forge
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
