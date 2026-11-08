"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { runOptimizationSimulation } from "@rewindverse/rewindml";
import { ProvenanceBadge } from "../../../components/visualization/ProvenanceBadge";
import {
  GraduationCap,
  HelpCircle,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  BookOpen,
  ArrowRight,
  TrendingDown,
  Compass,
} from "lucide-react";

const ThreeSurfaceViewer = dynamic(
  () =>
    import("../../../components/visualization/ThreeSurfaceViewer").then(
      (m) => m.ThreeSurfaceViewer
    ),
  { ssr: false }
);

export default function AcademyPage() {
  // Lesson 1 state
  const [selectedPrediction1, setSelectedPrediction1] = useState<string | null>(null);
  const [isRevealed1, setIsRevealed1] = useState<boolean>(false);
  const [lesson1Step, setLesson1Step] = useState<number>(0);
  const [isPlaying1, setIsPlaying1] = useState<boolean>(false);

  // Lesson 2 state
  const [selectedPrediction2, setSelectedPrediction2] = useState<string | null>(null);
  const [isRevealed2, setIsRevealed2] = useState<boolean>(false);
  const [lesson2Step, setLesson2Step] = useState<number>(0);
  const [isPlaying2, setIsPlaying2] = useState<boolean>(false);

  // Simulation for Lesson 1: SGD with high learning rate (oscillates) vs Momentum (smooth)
  const lesson1Sim = useMemo(() => {
    const oscSgd = runOptimizationSimulation({
      objective: "quadratic",
      optimizer: { type: "sgd", learningRate: 0.22 },
      initialPoint: [-3.5, 3.0],
      maxSteps: 45,
      seed: 42,
    });

    const smoothMom = runOptimizationSimulation({
      objective: "quadratic",
      optimizer: { type: "momentum", learningRate: 0.08, momentum: 0.85 },
      initialPoint: [-3.5, 3.0],
      maxSteps: 45,
      seed: 42,
    });

    return {
      sgdTrajectory: oscSgd.stepResults.map((s, idx) => ({
        step: idx,
        x: s.x,
        y: s.y,
        loss: s.loss,
      })),
      momTrajectory: smoothMom.stepResults.map((s, idx) => ({
        step: idx,
        x: s.x,
        y: s.y,
        loss: s.loss,
      })),
      maxSteps: Math.max(oscSgd.stepResults.length, smoothMom.stepResults.length),
    };
  }, []);

  // Simulation for Lesson 2: Saddle Point Trapping (Vanilla SGD vs Adam)
  const lesson2Sim = useMemo(() => {
    const trappedSgd = runOptimizationSimulation({
      objective: "saddle",
      optimizer: { type: "sgd", learningRate: 0.05 },
      initialPoint: [0.01, 1.5],
      maxSteps: 45,
      seed: 42,
    });

    const escapingAdam = runOptimizationSimulation({
      objective: "saddle",
      optimizer: { type: "adam", learningRate: 0.1, beta1: 0.9, beta2: 0.999, epsilon: 1e-8 },
      initialPoint: [0.01, 1.5],
      maxSteps: 45,
      seed: 42,
    });

    return {
      sgdTrajectory: trappedSgd.stepResults.map((s, idx) => ({
        step: idx,
        x: s.x,
        y: s.y,
        loss: s.loss,
      })),
      adamTrajectory: escapingAdam.stepResults.map((s, idx) => ({
        step: idx,
        x: s.x,
        y: s.y,
        loss: s.loss,
      })),
      maxSteps: Math.max(trappedSgd.stepResults.length, escapingAdam.stepResults.length),
    };
  }, []);

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
          <GraduationCap className="w-6 h-6 text-amber-400" />
          Rewind Academy
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
          Predict-before-run interactive 3D challenges and rigorous optimization physics lessons.
        </p>
      </div>

      {/* Lesson 1: The Anisotropic Ravine Dilemma */}
      <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-6 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block">
            Challenge 1 · Curvature Anisotropy
          </span>
          <ProvenanceBadge type="recorded" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">The Anisotropic Ravine Dilemma</h2>
          <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
            Consider the 2D Quadratic Bowl <code className="text-cyan-300">f(x, y) = 0.5 * (x² + 10y²)</code>.
            Because the curvature along the y-axis is 10 times steeper than along the x-axis (condition number $\kappa = 10$),
            gradients point almost entirely perpendicular to the optimal valley floor.
          </p>
        </div>

        {/* Prediction Challenge Prompt */}
        <div className="p-5 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            Predict Before Running:
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            If you increase the learning rate from <code className="text-white">0.05</code> to{" "}
            <code className="text-white">0.22</code> using vanilla SGD without momentum:
          </p>

          <div className="space-y-2">
            {[
              {
                id: "faster",
                label: "A. It will reach the global minimum faster due to larger step sizes.",
              },
              {
                id: "oscillate",
                label: "B. It will oscillate wildly between the steep ravine walls and fail to descend smoothly.",
              },
              {
                id: "same",
                label: "C. The trajectory path will remain identical, just taking fewer steps.",
              },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  setSelectedPrediction1(option.id);
                  setIsRevealed1(true);
                }}
                className={`w-full text-left p-3 rounded-lg text-xs font-medium border transition-all ${
                  selectedPrediction1 === option.id
                    ? "bg-cyan-500/20 border-cyan-500 text-white"
                    : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)] hover:text-white"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Verified Outcome & 3D Interactive Surface */}
        {isRevealed1 && (
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-cyan-950/40 border border-cyan-800/60 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Verified Scientific Outcome
              </div>
              <p className="text-cyan-100/90 leading-relaxed">
                <strong>Correct Answer: B.</strong> The Lipschitz constant is dominated by the steep y-curvature
                (&lambda;_max = 10). Any learning rate &eta; &gt; 2 / 10 = 0.20 causes gradient descent updates to overshoot the valley axis,
                amplifying oscillation rather than advancing down the gentle x-slope.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/studio/lab?objective=quadratic&optimizer=sgd&lr=0.22"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-black" />
                  Open in Optimizer Lab
                </Link>
                <span className="text-[11px] text-cyan-300/80">
                  Cyan Path: SGD $\eta=0.22$ (oscillates) • Violet Path: Momentum $\beta=0.85$ (smooth)
                </span>
              </div>
            </div>

            {/* 3D Interactive Ravine Viewer */}
            <div className="space-y-2">
              <ThreeSurfaceViewer
                objectiveType="quadratic"
                trajectory={lesson1Sim.sgdTrajectory}
                secondaryTrajectory={lesson1Sim.momTrajectory}
                currentStepIndex={lesson1Step}
              />

              <div className="p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setLesson1Step((prev) => Math.min(lesson1Sim.maxSteps - 1, prev + 1));
                    }}
                    className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition-colors"
                  >
                    Step +1
                  </button>
                  <button
                    onClick={() => setLesson1Step(0)}
                    className="p-1 rounded bg-white/10 hover:bg-white/20 text-[var(--text-muted)] hover:text-white"
                    title="Reset"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <input
                  type="range"
                  min={0}
                  max={lesson1Sim.maxSteps - 1}
                  value={lesson1Step}
                  onChange={(e) => setLesson1Step(Number(e.target.value))}
                  className="w-1/2 accent-cyan-400 cursor-pointer h-1.5 bg-white/10 rounded"
                />

                <span className="text-xs font-mono text-[var(--text-muted)]">
                  Step {lesson1Step} / {lesson1Sim.maxSteps - 1}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lesson 2: Saddle Point Escapes */}
      <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-6 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-purple-400 uppercase tracking-wider block">
            Challenge 2 · Non-Convex Geometries
          </span>
          <ProvenanceBadge type="recorded" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">The Saddle Point Stalling Trap</h2>
          <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
            Consider the hyperbolic saddle surface <code className="text-purple-300">f(x, y) = x² - y²</code>.
            At the origin $(0, 0)$, the gradient is exactly zero ($\nabla f = [0, 0]$), but the Hessian eigenvalues are $+2$ and $-2$.
          </p>
        </div>

        {/* Prediction Challenge Prompt */}
        <div className="p-5 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-purple-400" />
            Predict Before Running:
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            If an optimizer starts on the ridge at <code className="text-white">(0.01, 1.5)</code> with vanilla SGD:
          </p>

          <div className="space-y-2">
            {[
              {
                id: "stall",
                label: "A. It descends slowly and can get trapped near the flat ridge where gradient norm approaches zero.",
              },
              {
                id: "reverse",
                label: "B. It immediately turns around and climbs upward into the peak.",
              },
              {
                id: "teleport",
                label: "C. It skips the saddle entirely without any parameter update.",
              },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  setSelectedPrediction2(option.id);
                  setIsRevealed2(true);
                }}
                className={`w-full text-left p-3 rounded-lg text-xs font-medium border transition-all ${
                  selectedPrediction2 === option.id
                    ? "bg-purple-500/20 border-purple-500 text-white"
                    : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)] hover:text-white"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Verified Outcome & 3D Interactive Saddle */}
        {isRevealed2 && (
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-purple-950/40 border border-purple-800/60 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Verified Scientific Outcome
              </div>
              <p className="text-purple-100/90 leading-relaxed">
                <strong>Correct Answer: A.</strong> Near the saddle ridge, &part;f/&part;x &approx; 0.
                Vanilla SGD takes tiny steps because gradient magnitude collapses. Adaptive optimizers like Adam scale updates by second moments (1/&radic;v_t), allowing them to rapidly escape saddle plateaus!
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/studio/lab?objective=saddle&optimizer=adam&lr=0.1"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-purple-500 text-white font-bold text-xs hover:bg-purple-400 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  Open in Optimizer Lab
                </Link>
                <span className="text-[11px] text-purple-300/80">
                  Cyan Path: SGD (stalls) • Violet Path: Adam (escapes)
                </span>
              </div>
            </div>

            {/* 3D Interactive Saddle Viewer */}
            <div className="space-y-2">
              <ThreeSurfaceViewer
                objectiveType="saddle"
                trajectory={lesson2Sim.sgdTrajectory}
                secondaryTrajectory={lesson2Sim.adamTrajectory}
                currentStepIndex={lesson2Step}
              />

              <div className="p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setLesson2Step((prev) => Math.min(lesson2Sim.maxSteps - 1, prev + 1));
                    }}
                    className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition-colors"
                  >
                    Step +1
                  </button>
                  <button
                    onClick={() => setLesson2Step(0)}
                    className="p-1 rounded bg-white/10 hover:bg-white/20 text-[var(--text-muted)] hover:text-white"
                    title="Reset"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <input
                  type="range"
                  min={0}
                  max={lesson2Sim.maxSteps - 1}
                  value={lesson2Step}
                  onChange={(e) => setLesson2Step(Number(e.target.value))}
                  className="w-1/2 accent-purple-400 cursor-pointer h-1.5 bg-white/10 rounded"
                />

                <span className="text-xs font-mono text-[var(--text-muted)]">
                  Step {lesson2Step} / {lesson2Sim.maxSteps - 1}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
