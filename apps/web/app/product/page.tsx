import React from "react";
import Link from "next/link";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { AmbientMeshBackground, SignalGridBackground } from "../../components/backgrounds";
import {
  Cpu,
  RotateCcw,
  Sparkles,
  GitCompare,
  GraduationCap,
  ShieldCheck,
  FileCode,
  ArrowRight,
  Wrench,
  BookOpen,
} from "lucide-react";

export default function ProductPage() {
  const modules = [
    {
      title: "Algorithm Forge",
      subtitle: "Custom Algorithm Studio",
      desc: "Declarative algorithm builder supporting visual node pipelines, algebraic formula DSL, fork workflows, and safe sandboxed execution.",
      icon: Wrench,
      color: "text-violet-400",
      href: "/studio/forge",
      action: "Launch Forge",
      featured: true,
    },
    {
      title: "Algorithm Catalogue",
      subtitle: "Master ML Registry",
      desc: "Verified mathematical formulas, assumptions, RVTS trace signals, and execution provenance standards across classical and deep learning.",
      icon: BookOpen,
      color: "text-purple-400",
      href: "/studio/algorithms",
      action: "Explore Catalogue",
      featured: true,
    },
    {
      title: "RewindML",
      subtitle: "Training & Computation Core",
      desc: "Pure off-thread mathematical execution engine. Supports 2D landscapes, linear models, and neural nets with zero UI lag.",
      icon: Cpu,
      color: "text-cyan-400",
      href: "/studio/lab",
      action: "Explore Lab",
    },
    {
      title: "Rewind Replay",
      subtitle: "Deterministic Trace Viewer",
      desc: "Frame-accurate scrubbing through training histories. Synchronizes metrics, parameters, and gradient norms across iterations.",
      icon: RotateCcw,
      color: "text-blue-400",
      href: "/studio/replay/sample",
      action: "Explore Replay",
    },
    {
      title: "Rewind Insights",
      subtitle: "Evidence-Backed Diagnostics",
      desc: "Rule out guesswork with heuristic detectors that pinpoint loss plateaus, numerical divergence, and gradient explosion with exact step ranges.",
      icon: Sparkles,
      color: "text-cyan-300",
      href: "/studio/insights",
      action: "View Diagnostics",
    },
    {
      title: "Rewind Compare",
      subtitle: "Experiment Comparison",
      desc: "Align compatible runs side-by-side. Inspect hyperparameter deltas and metric overlays without false unit equivalences.",
      icon: GitCompare,
      color: "text-emerald-400",
      href: "/studio/compare",
      action: "Compare Runs",
    },
    {
      title: "Rewind Academy",
      subtitle: "Interactive Guided Learning",
      desc: "Master optimization dynamics through predict-before-run challenges. Formulate hypotheses and test them against real computation.",
      icon: GraduationCap,
      color: "text-amber-400",
      href: "/studio/academy",
      action: "Enter Academy",
    },
    {
      title: "System Architecture",
      subtitle: "Open Replay Pipeline",
      desc: "A capability-declared, versioned trace contract ensuring replay fidelity between browser computation and Python training runs.",
      icon: FileCode,
      color: "text-slate-400",
      href: "/how-it-works",
      action: "Learn How It Works",
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col bg-[var(--background)] text-[var(--text)]">
      <AmbientMeshBackground intensity="medium" />
      <SignalGridBackground opacity={0.035} />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            Platform Architecture
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Designed for Machine Learning Understanding
          </h1>
          <p className="text-base text-[var(--text-muted)]">
            Explore the complete RewindVerse ecosystem. From browser Web Worker simulation to
            safe algorithm customization, portable trace formats, and evidence-backed diagnostics.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {modules.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`p-7 rounded-2xl glass-panel glass-card-interactive flex flex-col justify-between ${
                  item.featured ? "border-cyan-500/40 shadow-lg shadow-cyan-500/5" : ""
                }`}
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-center mb-5">
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <span className="text-[11px] font-mono text-[var(--text-muted)] block mb-1">
                    {item.subtitle}
                  </span>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-[var(--border)]">
                  <Link
                    href={item.href}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1.5 group"
                  >
                    <span>{item.action}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
