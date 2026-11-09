import React from "react";
import Link from "next/link";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { HeroDemo } from "../components/HeroDemo";
import {
  AmbientMeshBackground,
  SignalGridBackground,
  TraceWaveBackground,
  SectionGlow,
} from "../components/backgrounds";
import {
  Sparkles,
  ArrowRight,
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
  Compass,
  Sliders,
  FolderKanban,
  Trophy,
  Database,
  Eye,
  FileCheck,
} from "lucide-react";

import { LearningOrbitHero } from "../components/hero/LearningOrbitClient";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text)] selection:bg-cyan-500 selection:text-black">
      {/* Background Atmosphere Layers */}
      <AmbientMeshBackground intensity="medium" />
      <SignalGridBackground opacity={0.035} />

      {/* 1. Header Navigation */}
      <Navbar />

      <main id="main-content" className="flex-1">
        {/* 2. Hero Section: Direct, Powerful Product Promise */}
        <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
          <SectionGlow color="cyan" position="top" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-semibold mb-6 backdrop-blur-xl shadow-lg shadow-cyan-500/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </span>
              <span>Deterministic Algorithm Exploration & Replay</span>
            </div>

            {/* Approved Hero Message */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.08]">
              Understand the algorithms <br className="hidden sm:inline" />
              <span className="brand-gradient-text">behind the results.</span>
            </h1>

            {/* Approved Hero Subhead */}
            <p className="mt-6 text-base sm:text-lg text-[var(--text-muted)] max-w-3xl mx-auto leading-relaxed">
              Bring your data, explore algorithms, run experiments and replay how every important step behaved.
              From non-convex loss manifolds to multi-run benchmark verification.
            </p>

            {/* Primary & Secondary Action Pair */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/studio"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-600 text-[#080b12] shadow-xl shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all focus-visible:ring-2 focus-visible:ring-cyan-500"
              >
                <Sparkles className="w-4 h-4 fill-[#080b12]" />
                <span>Open Rewind Studio</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </Link>
              <Link
                href="/explore"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm bg-[var(--surface-raised)] hover:bg-white/[0.08] border border-white/[0.1] text-white backdrop-blur-md transition-colors"
              >
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Explore the Platform</span>
              </Link>
            </div>

            {/* Signature 3D Learning Orbit Hero Visual */}
            <div className="mt-14 max-w-5xl mx-auto">
              <LearningOrbitHero />
            </div>
          </div>
        </section>

        {/* 3. Product Proof Demo: Train -> Record -> Replay -> Inspect */}
        <section className="py-20 border-y border-white/[0.08] bg-[#06080e]/60 relative">
          <TraceWaveBackground opacity={0.25} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block mb-2">
                Live Interactive Proof
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Train · Record · Replay · Inspect
              </h2>
              <p className="text-sm text-[var(--text-muted)] mt-3">
                Experience real-time parameter stepping. Toggle between 2D contour projections and 3D objective landscapes with zero server latency.
              </p>
            </div>

            <HeroDemo />
          </div>
        </section>

        {/* 4. How It Works: 4 Sequential Steps */}
        <section className="py-24 border-b border-white/[0.08] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block mb-2">
                End-to-End Workflow
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                How RewindVerse Works
              </h2>
              <p className="text-sm text-[var(--text-muted)] mt-2">
                From raw data input to mathematical transparency and reproducible research.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl border border-white/[0.08] bg-[var(--surface)] relative">
                <span className="text-xs font-mono font-bold text-cyan-400 block mb-3">STEP 01</span>
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 w-fit mb-4">
                  <Database className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Bring Your Data</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Import tabular CSVs, sequence arrays, or synthetic manifolds. Data Lab inspects schema, missing values, and distribution splits.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-white/[0.08] bg-[var(--surface)] relative">
                <span className="text-xs font-mono font-bold text-violet-400 block mb-3">STEP 02</span>
                <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400 w-fit mb-4">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Explore & Match</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Filter 48+ catalogue algorithms in Fit Lab. Inspect mathematical assumptions, complexity profiles, and suitability matrices.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-white/[0.08] bg-[var(--surface)] relative">
                <span className="text-xs font-mono font-bold text-sky-400 block mb-3">STEP 03</span>
                <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 w-fit mb-4">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Run & Record</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Execute inside the deterministic browser sandbox or attach our 3-line Python SDK recorder for non-blocking execution logging.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-white/[0.08] bg-[var(--surface)] relative">
                <span className="text-xs font-mono font-bold text-emerald-400 block mb-3">STEP 04</span>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit mb-4">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Replay & Understand</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Scrub timeline checkpoints, inspect gradients, detect plateau anomalies, and share cryptographic reproduction bundles.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Core Workflows: 4 Clear Cards (Build, Experiment, Understand, Reproduce) */}
        <section className="py-24 border-b border-white/[0.08] relative">
          <SectionGlow color="violet" position="left" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-400 block mb-2">
                Unified Architecture
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Four Pillars of Algorithm Research
              </h2>
              <p className="text-sm text-[var(--text-muted)] mt-2">
                Focused workspaces designed for researchers, machine-learning engineers, and students.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pillar 1: Build */}
              <div className="p-8 rounded-3xl border border-white/[0.08] bg-[var(--surface)] hover:border-cyan-500/30 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
                      <Wrench className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono text-cyan-300 px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-800/60">
                      Visual & AST Code
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">1. Build in Algorithm Forge</h3>
                  <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed mb-6">
                    Design custom update rules with node-based block graphs, LaTeX algebraic equations, or sandboxed TypeScript code.
                    Verified AST validation prevents eval risks while generating pure mathematical update traces.
                  </p>
                </div>
                <Link
                  href="/studio/forge"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 pt-4 border-t border-white/[0.06]"
                >
                  <span>Open Algorithm Forge</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Pillar 2: Experiment */}
              <div className="p-8 rounded-3xl border border-white/[0.08] bg-[var(--surface)] hover:border-violet-500/30 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono text-violet-300 px-2.5 py-1 rounded bg-violet-950/60 border border-violet-800/60">
                      Multi-Run Suite
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">2. Experiment with Precision</h3>
                  <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed mb-6">
                    Execute controlled runs across dataset splits, evaluate hyperparameter sensitivity, and test multi-candidate baselines.
                    Fit Lab automatically generates capability radar charts and algorithm compatibility scores.
                  </p>
                </div>
                <Link
                  href="/studio/experiments"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-400 hover:text-violet-300 pt-4 border-t border-white/[0.06]"
                >
                  <span>Open Experiment Lab</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Pillar 3: Understand */}
              <div className="p-8 rounded-3xl border border-white/[0.08] bg-[var(--surface)] hover:border-blue-500/30 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                      <Eye className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono text-blue-300 px-2.5 py-1 rounded bg-blue-950/60 border border-blue-800/60">
                      Explain & Replay
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">3. Understand Dynamics</h3>
                  <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed mb-6">
                    Step back in time to inspect exactly when and why optimization diverged. Automated heuristic detectors identify
                    exploding gradients, saddle point stalls, and learning rate oscillations with step-level evidence cards.
                  </p>
                </div>
                <Link
                  href="/studio/insights"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 pt-4 border-t border-white/[0.06]"
                >
                  <span>Explore Diagnostic Insights</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Pillar 4: Reproduce */}
              <div className="p-8 rounded-3xl border border-white/[0.08] bg-[var(--surface)] hover:border-emerald-500/30 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                      <FileCheck className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-800/60">
                      Audit & Verify
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">4. Reproduce Workflows</h3>
                  <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed mb-6">
                    Package code, hyperparameters, datasets, and execution traces into deterministic reproduction manifests.
                    RewindBench leaderboards guarantee benchmark verification without black-box metrics.
                  </p>
                </div>
                <Link
                  href="/studio/reproduce"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 pt-4 border-t border-white/[0.06]"
                >
                  <span>Open Reproduction Studio</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Visualization Showcase & 2D/3D Parity */}
        <section className="py-24 border-b border-white/[0.08] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block mb-2">
                  Multi-Dimensional Rendering
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
                  2D Contours, 3D Landscapes & Auto Adaptivity
                </h2>
                <p className="mt-4 text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                  Not every problem demands 3D. RewindVerse implements semantic visual parity: use high-density 2D contours
                  when analyzing precise gradient vectors, switch to 3D surfaces when exploring curvature saddles, or let
                  Auto Mode pick the optimal viewport based on data dimensionality.
                </p>

                <div className="mt-6 space-y-3 text-xs">
                  <div className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Synchronized timeline: step index remains locked across 2D, 3D, and metric curves</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Instant accessible fallback: full textual data summaries and tabular step inspect</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Hardware acceleration: WebGL 2 with progressive WebGPU readiness and context-loss recovery</span>
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    href="/visualizations"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white transition-colors"
                  >
                    <span>View Visualization Standards</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Visual Card Showcase */}
              <div className="p-6 rounded-3xl border border-white/[0.08] bg-[#06080e] shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08] text-xs font-mono">
                  <span className="text-cyan-400 font-bold">Rosenbrock Valley Saddle</span>
                  <span className="text-[var(--text-muted)]">Mode: Auto-Select</span>
                </div>
                <div className="aspect-[16/10] rounded-xl bg-[#080b12] border border-white/[0.04] p-4 flex flex-col justify-between relative">
                  <svg className="w-full h-full opacity-60" viewBox="0 0 400 240" fill="none">
                    {/* Parabolic contour curves */}
                    <path d="M 40 40 C 140 200, 260 200, 360 40" stroke="#06b6d4" strokeWidth="1.2" strokeOpacity="0.4" />
                    <path d="M 70 60 C 150 180, 250 180, 330 60" stroke="#06b6d4" strokeWidth="1.2" strokeOpacity="0.6" />
                    <path d="M 110 90 C 160 160, 240 160, 290 90" stroke="#3b82f6" strokeWidth="1.5" strokeOpacity="0.8" />
                    <path d="M 160 130 C 180 150, 220 150, 240 130" stroke="#8b5cf6" strokeWidth="2" />
                    {/* Gradient descent path */}
                    <path d="M 60 50 Q 120 160 200 145" stroke="#00f2fe" strokeWidth="2.5" strokeDasharray="4 4" />
                    <circle cx="200" cy="145" r="4" fill="#00f2fe" />
                  </svg>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] pt-2 border-t border-white/[0.04]">
                    <span>Minimum: (1.0, 1.0)</span>
                    <span className="text-emerald-400 font-bold">Curvature: Second-Order</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Algorithm Breadth: Core Disciplines */}
        <section className="py-24 border-b border-white/[0.08] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block mb-2">
                Mathematical Breadth
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Not Just a Deep Learning Gallery
              </h2>
              <p className="text-sm text-[var(--text-muted)] mt-2">
                RewindVerse spans optimization, statistics, classical ML, and neural networks with rigorous provenance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl border border-white/[0.08] bg-[var(--surface)]">
                <div className="text-xs font-mono font-bold text-cyan-400 mb-2">14 ALGORITHMS</div>
                <h3 className="font-bold text-white text-base mb-1">Optimization</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">
                  First-order, momentum-accelerated, adaptive, and quasi-Newton second-order solvers.
                </p>
                <div className="text-[11px] font-mono text-slate-300 space-y-1">
                  <div>• SGD & Heavy Ball</div>
                  <div>• AdamW & RMSProp</div>
                  <div>• L-BFGS & Nelder-Mead</div>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-white/[0.08] bg-[var(--surface)]">
                <div className="text-xs font-mono font-bold text-violet-400 mb-2">12 ALGORITHMS</div>
                <h3 className="font-bold text-white text-base mb-1">Deep Learning</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">
                  Multi-layer perceptrons, scaled dot-product attention routing, and residual blocks.
                </p>
                <div className="text-[11px] font-mono text-slate-300 space-y-1">
                  <div>• Scaled Dot-Product Attention</div>
                  <div>• Multi-Head Routing</div>
                  <div>• Residual MLP Blocks</div>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-white/[0.08] bg-[var(--surface)]">
                <div className="text-xs font-mono font-bold text-sky-400 mb-2">11 ALGORITHMS</div>
                <h3 className="font-bold text-white text-base mb-1">Classical ML</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">
                  Ensemble decision trees, maximum margin hyperplanes, and metric clustering.
                </p>
                <div className="text-[11px] font-mono text-slate-300 space-y-1">
                  <div>• Random Forest Classifiers</div>
                  <div>• Support Vector Machines</div>
                  <div>• K-Means & Hierarchical</div>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-white/[0.08] bg-[var(--surface)]">
                <div className="text-xs font-mono font-bold text-emerald-400 mb-2">7 ALGORITHMS</div>
                <h3 className="font-bold text-white text-base mb-1">Statistics & State</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">
                  Recursive state estimation, Markov Chain Monte Carlo, and dimensional reduction.
                </p>
                <div className="text-[11px] font-mono text-slate-300 space-y-1">
                  <div>• Extended Kalman Filter</div>
                  <div>• Metropolis-Hastings MCMC</div>
                  <div>• PCA & Spectral SVD</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Research & Python SDK Integration */}
        <section className="py-24 border-b border-white/[0.08] bg-[#06080e]/60 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 text-xs font-semibold mb-4">
                  <Terminal className="w-3.5 h-3.5" /> 3-Line Python SDK Integration
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
                  Record in PyTorch. <br />
                  Replay in Any Modern Browser.
                </h2>
                <p className="mt-4 text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                  Connect your existing PyTorch or Scikit-learn pipelines with zero vendor lock-in.
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
              <div className="rounded-2xl border border-white/[0.1] bg-[#080b12] p-6 font-mono text-xs overflow-x-auto shadow-2xl backdrop-blur-2xl">
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

# Replay instantly in RewindVerse:
# $ rvtrace view traces/run.rvtrace`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* 9. Privacy, Security & Data Control */}
        <section className="py-24 border-b border-white/[0.08] relative">
          <SectionGlow color="emerald" position="center" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-12 rounded-3xl border border-emerald-500/30 bg-[var(--surface)] backdrop-blur-xl">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Privacy-First Architecture</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  100% Client-Side Processing. <br />
                  Your Weights Never Leave Your Machine.
                </h2>
                <p className="mt-4 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                  RewindVerse executes simulations inside client Web Workers and stores projects in IndexedDB.
                  No model parameters or private training datasets are ever uploaded to cloud servers by default.
                  Zero third-party tracking scripts. Zero advertising cookies.
                </p>

                <div className="mt-6 flex flex-wrap gap-6 text-xs font-mono text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Sandboxed AST Compilation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Cryptographic Run Hashes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Local IndexedDB Persistence</span>
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    href="/security"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300"
                  >
                    <span>Read Security Architecture Specification</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 10. Final CTA Portal */}
        <section className="py-28 text-center relative overflow-hidden">
          <SectionGlow color="cyan" position="center" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="p-10 sm:p-14 rounded-3xl border border-cyan-500/30 bg-[#080b12]/90 shadow-2xl backdrop-blur-xl">
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Ready to explore the algorithms behind your models?
              </h2>
              <p className="mt-4 text-[var(--text-muted)] text-base sm:text-lg max-w-xl mx-auto">
                Open Rewind Studio now. Zero setup, zero accounts required, 100% private.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/studio"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-base bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-600 text-[#080b12] shadow-xl shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Sparkles className="w-5 h-5 fill-[#080b12]" />
                  <span>Open Rewind Studio</span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Link>
                <Link
                  href="/how-it-works"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-semibold text-base bg-[var(--surface-raised)] border border-white/[0.08] text-white hover:text-cyan-300 hover:border-cyan-500/40 transition-all"
                >
                  <FileCode className="w-5 h-5 text-cyan-400" />
                  <span>Explore How It Works</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 11. Footer */}
      <Footer />
    </div>
  );
}
