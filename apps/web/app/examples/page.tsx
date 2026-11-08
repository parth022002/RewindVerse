import React from "react";
import Link from "next/link";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { PlayCircle, ArrowRight, RotateCcw, Cpu } from "lucide-react";

export default function ExamplesPage() {
  const examples = [
    {
      title: "Anisotropic Quadratic Ravine (SGD vs Momentum)",
      category: "Optimizer Benchmark",
      steps: 80,
      optimizer: "Momentum (β=0.85)",
      desc: "Demonstrates momentum's damping of cross-ravine gradient oscillations in ill-conditioned convex landscapes.",
      href: "/studio/lab?objective=quadratic&optimizer=momentum",
    },
    {
      title: "Rosenbrock Banana Valley Escape (Adam)",
      category: "Non-Convex Optimization",
      steps: 120,
      optimizer: "Adam (lr=0.05)",
      desc: "Demonstrates adaptive second-moment scaling navigating a sharp, curved parabolic valley towards (1, 1).",
      href: "/studio/lab?objective=rosenbrock&optimizer=adam",
    },
    {
      title: "Saddle Point Escape Under Stochastic Noise",
      category: "Stochastic Dynamics",
      steps: 100,
      optimizer: "SGD + Noise (σ=0.5)",
      desc: "Illustrates escaping from an unstable saddle point using injected stochastic perturbation.",
      href: "/studio/lab?objective=saddle&optimizer=sgd",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            Example Gallery
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Curated Benchmark Traces
          </h1>
          <p className="text-base text-[var(--text-muted)]">
            Explore pre-computed, verified training traces in the Replay Viewer or launch them directly in the Optimizer Lab.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {examples.map((ex) => (
            <div
              key={ex.title}
              className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-cyan-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block mb-2">
                  {ex.category}
                </span>
                <h3 className="text-base font-bold text-white mb-2">{ex.title}</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">
                  {ex.desc}
                </p>
                <div className="text-xs font-mono text-[var(--text-muted)] space-y-1">
                  <div>• Optimizer: <span className="text-white">{ex.optimizer}</span></div>
                  <div>• Steps: <span className="text-white">{ex.steps}</span></div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[var(--border)]">
                <Link
                  href={ex.href}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] text-white text-xs font-semibold hover:bg-[var(--surface-overlay)] transition-colors"
                >
                  <PlayCircle className="w-3.5 h-3.5 text-cyan-400" />
                  Launch in Lab
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

