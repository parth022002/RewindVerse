"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Compass,
  Search,
  Filter,
  ArrowRight,
  BookOpen,
  Wrench,
  Layers,
  Sparkles,
  Zap,
  Code2,
  Cpu,
  TrendingDown,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { AmbientMeshBackground, SignalGridBackground, SectionGlow } from "../../components/backgrounds";

interface Category {
  id: string;
  label: string;
  count: number;
}

const CATEGORIES: Category[] = [
  { id: "all", label: "All Algorithms", count: 48 },
  { id: "optimization", label: "Mathematical Optimization", count: 14 },
  { id: "deep-learning", label: "Deep Learning & Neural", count: 12 },
  { id: "classical-ml", label: "Classical ML & Ensembles", count: 11 },
  { id: "statistics", label: "Statistics & Estimation", count: 7 },
  { id: "simulation", label: "Physical & Agent Simulation", count: 4 },
];

interface AlgoCard {
  id: string;
  name: string;
  category: string;
  description: string;
  taskType: string;
  provenance: "Native" | "Adapter" | "Imported";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  visualModes: string[];
  href: string;
}

const FEATURED_ALGORITHMS: AlgoCard[] = [
  {
    id: "adamw",
    name: "AdamW Optimizer",
    category: "optimization",
    description: "Adaptive moment estimation with decoupled weight decay for non-convex neural landscapes.",
    taskType: "Gradient Descent",
    provenance: "Native",
    difficulty: "Intermediate",
    visualModes: ["2D Contour", "3D Loss Surface", "Phase Plane"],
    href: "/studio/algorithms?select=adamw",
  },
  {
    id: "rosenbrock-bfgs",
    name: "L-BFGS Quasi-Newton",
    category: "optimization",
    description: "Limited-memory Broyden–Fletcher–Goldfarb–Shanno curvature approximation for second-order convergence.",
    taskType: "Curvature Optimization",
    provenance: "Native",
    difficulty: "Advanced",
    visualModes: ["Hessian Eigenvalues", "3D Landscape"],
    href: "/studio/algorithms?select=lbfgs",
  },
  {
    id: "transformer-attention",
    name: "Scaled Dot-Product Attention",
    category: "deep-learning",
    description: "Multi-head attention routing mechanism computing query-key affinity matrices and token value projections.",
    taskType: "Sequence Modeling",
    provenance: "Native",
    difficulty: "Advanced",
    visualModes: ["Attention Head Heatmap", "Token Trajectory"],
    href: "/studio/algorithms?select=attention",
  },
  {
    id: "random-forest",
    name: "Random Forest Classifier",
    category: "classical-ml",
    description: "Bootstrap aggregating of decorrelated decision trees with Gini impurity split optimization.",
    taskType: "Tabular Classification",
    provenance: "Adapter",
    difficulty: "Beginner",
    visualModes: ["Decision Boundary", "Feature Importance"],
    href: "/studio/algorithms?select=rf",
  },
  {
    id: "kalman-filter",
    name: "Extended Kalman Filter",
    category: "statistics",
    description: "Recursive state estimation under Gaussian sensor noise and nonlinear dynamic transformations.",
    taskType: "State Estimation",
    provenance: "Native",
    difficulty: "Intermediate",
    visualModes: ["Uncertainty Ellipse", "Time Series Trace"],
    href: "/studio/algorithms?select=ekf",
  },
  {
    id: "mcmc-metropolis",
    name: "Metropolis-Hastings MCMC",
    category: "statistics",
    description: "Markov Chain Monte Carlo sampling algorithm for drawing from arbitrary unnormalized posterior densities.",
    taskType: "Posterior Sampling",
    provenance: "Native",
    difficulty: "Advanced",
    visualModes: ["Posterior Density", "Chain Autocorrelation"],
    href: "/studio/algorithms?select=mcmc",
  },
];

export default function ExplorePage() {
  const [selectedCat, setSelectedCat] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = FEATURED_ALGORITHMS.filter((a) => {
    const matchesCat = selectedCat === "all" || a.category === selectedCat;
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.taskType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="relative min-h-screen text-[var(--text)] pb-24">
      <AmbientMeshBackground intensity="medium" />
      <SignalGridBackground opacity={0.035} />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-xs font-semibold text-cyan-400 mb-6">
          <Compass className="w-4 h-4 text-cyan-400" />
          <span>Unified Discovery & Exploration Hub</span>
        </div>

        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
            Explore Algorithms, Visuals & Provenance
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
            Browse mathematical optimization, neural architectures, statistical filters, and ensemble methods.
            Inspect mathematical foundations, test datasets, and launch interactive replay visualizers.
          </p>
        </div>

        {/* Search & Exploration Channels */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/studio/algorithms"
            className="group p-5 rounded-2xl border border-white/[0.08] bg-[var(--surface)] hover:border-cyan-500/40 hover:bg-[var(--surface-raised)] transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-white text-base mb-1">Algorithm Catalogue</h3>
            <p className="text-xs text-[var(--text-muted)]">
              Complete index of 48+ supported algorithms with mathematical specs and complexity profiles.
            </p>
          </Link>

          <Link
            href="/visualizations"
            className="group p-5 rounded-2xl border border-white/[0.08] bg-[var(--surface)] hover:border-violet-500/40 hover:bg-[var(--surface-raised)] transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400">
                <Layers className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-white text-base mb-1">2D & 3D Visual Gallery</h3>
            <p className="text-xs text-[var(--text-muted)]">
              Explore interactive loss landscapes, contour slices, trajectory scrubbers, and vector fields.
            </p>
          </Link>

          <Link
            href="/studio/forge"
            className="group p-5 rounded-2xl border border-white/[0.08] bg-[var(--surface)] hover:border-blue-500/40 hover:bg-[var(--surface-raised)] transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                <Wrench className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-white text-base mb-1">Algorithm Forge</h3>
            <p className="text-xs text-[var(--text-muted)]">
              Author and compile custom optimization logic using visual graphs or secure AST sandboxing.
            </p>
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCat === cat.id
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                    : "bg-[var(--surface)] border border-white/[0.08] text-[var(--text-muted)] hover:text-white"
                }`}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search methods, tasks, or formulas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[var(--surface)] border border-white/[0.08] text-xs text-white placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* Algorithm Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((algo) => (
            <div
              key={algo.id}
              className="relative p-6 rounded-2xl border border-white/[0.08] bg-[var(--surface)] hover:border-cyan-500/30 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/[0.06] text-cyan-300">
                    {algo.taskType}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-[var(--text-muted)] font-mono">{algo.provenance}</span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        algo.difficulty === "Beginner"
                          ? "bg-emerald-400"
                          : algo.difficulty === "Intermediate"
                          ? "bg-amber-400"
                          : "bg-purple-400"
                      }`}
                    />
                  </div>
                </div>

                <h3 className="font-bold text-lg text-white group-hover:text-cyan-300 transition-colors mb-2">
                  {algo.name}
                </h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">
                  {algo.description}
                </p>

                {/* Visual modes */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {algo.visualModes.map((vm) => (
                    <span
                      key={vm}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.04] text-slate-300 border border-white/[0.04]"
                    >
                      {vm}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[11px] text-[var(--text-muted)]">Verified Reproducibility</span>
                <Link
                  href={algo.href}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <span>Open in Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

