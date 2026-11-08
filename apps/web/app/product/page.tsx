import React from "react";
import Link from "next/link";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import {
  Cpu,
  RotateCcw,
  Sparkles,
  GitCompare,
  GraduationCap,
  ShieldCheck,
  FileCode,
  ArrowRight,
} from "lucide-react";

export default function ProductPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
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
            portable trace formats and evidence-backed diagnostics.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
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
              color: "text-violet-400",
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
              title: "RVTS Specification",
              subtitle: "Open Trace Standard",
              desc: "A capability-declared, versioned JSON Lines contract. Ensures trace portability between browser and Python training pipelines.",
              icon: FileCode,
              color: "text-slate-400",
              href: "/docs",
              action: "Read Specs",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-cyan-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-center mb-6">
                    <Icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <span className="text-xs font-mono text-[var(--text-muted)] block mb-1">
                    {item.subtitle}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[var(--border)]">
                  <Link
                    href={item.href}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1.5"
                  >
                    {item.action} <ArrowRight className="w-3.5 h-3.5" />
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

