"use client";

import React from "react";
import { Layers, Activity, Sparkles, CheckCircle2 } from "lucide-react";

interface PosterProps {
  className?: string;
  onRetry?: () => void;
}

export function LearningOrbitPoster({ className = "", onRetry }: PosterProps) {
  return (
    <div
      role="region"
      aria-label="Algorithm Loss Landscape & Trajectory Diagram"
      className={`relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl border border-white/[0.08] bg-[#06080e] overflow-hidden flex flex-col justify-between p-6 ${className}`}
    >
      {/* Background SVG Loss Topology Contour Diagram */}
      <svg
        className="absolute inset-0 w-full h-full opacity-40 select-none pointer-events-none"
        viewBox="0 0 800 450"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="contourGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
            <stop offset="60%" stopColor="#8b5cf6" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#080b12" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="orbitGrad" x1="10%" y1="20%" x2="90%" y2="80%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>

        <rect width="800" height="450" fill="url(#contourGlow)" />

        {/* Concentric Loss Iso-contours */}
        <ellipse cx="400" cy="225" rx="340" ry="170" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.15" />
        <ellipse cx="400" cy="225" rx="270" ry="135" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.2" />
        <ellipse cx="400" cy="225" rx="200" ry="100" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.3" />
        <ellipse cx="400" cy="225" rx="130" ry="65" stroke="#06b6d4" strokeWidth="1.2" strokeOpacity="0.45" />
        <ellipse cx="400" cy="225" rx="60" ry="30" stroke="#06b6d4" strokeWidth="1.5" strokeOpacity="0.65" />

        {/* Curvature Coordinate Grid Lines */}
        <path d="M 60 225 C 200 120, 600 120, 740 225" stroke="#8b5cf6" strokeWidth="0.75" strokeOpacity="0.2" strokeDasharray="3 3" />
        <path d="M 60 225 C 200 330, 600 330, 740 225" stroke="#8b5cf6" strokeWidth="0.75" strokeOpacity="0.2" strokeDasharray="3 3" />
        <path d="M 400 55 C 320 150, 320 300, 400 395" stroke="#8b5cf6" strokeWidth="0.75" strokeOpacity="0.2" strokeDasharray="3 3" />
        <path d="M 400 55 C 480 150, 480 300, 400 395" stroke="#8b5cf6" strokeWidth="0.75" strokeOpacity="0.2" strokeDasharray="3 3" />

        {/* Gradient Trajectory Curve */}
        <path
          d="M 120 110 C 210 180, 260 290, 340 260 C 390 240, 395 230, 400 225"
          stroke="url(#orbitGrad)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Orbit Checkpoint Nodes */}
        <circle cx="120" cy="110" r="5" fill="#06b6d4" />
        <circle cx="210" cy="180" r="4.5" fill="#0ea5e9" />
        <circle cx="260" cy="290" r="4.5" fill="#3b82f6" />
        <circle cx="340" cy="260" r="4.5" fill="#8b5cf6" />
        {/* Converged Optimum Node */}
        <circle cx="400" cy="225" r="7" fill="#06b6d4" />
        <circle cx="400" cy="225" r="12" stroke="#06b6d4" strokeWidth="1.5" strokeOpacity="0.6" />
      </svg>

      {/* Top Overlay Badge */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-black/60 border border-white/[0.08] backdrop-blur-md">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs font-mono font-bold text-white">Loss Topology: Ackley Manifold</span>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Convergence Verified</span>
        </div>
      </div>

      {/* Bottom Telemetry Card */}
      <div className="relative z-10 p-3.5 rounded-xl bg-[#080b12]/85 border border-white/[0.08] backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6 text-xs font-mono">
          <div>
            <span className="text-[10px] text-[var(--text-muted)] block uppercase tracking-wider">Initial Loss</span>
            <span className="text-rose-400 font-bold">12.842</span>
          </div>
          <div>
            <span className="text-[10px] text-[var(--text-muted)] block uppercase tracking-wider">Epochs</span>
            <span className="text-white font-bold">50 Steps</span>
          </div>
          <div>
            <span className="text-[10px] text-[var(--text-muted)] block uppercase tracking-wider">Min Loss</span>
            <span className="text-cyan-400 font-bold">0.00018</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-[10px] text-[var(--text-muted)] block uppercase tracking-wider">Optimizer</span>
            <span className="text-violet-400 font-bold">AdamW (Decoupled)</span>
          </div>
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/[0.08] hover:bg-white/[0.14] text-white transition-colors"
          >
            Launch Interactive 3D
          </button>
        )}
      </div>
    </div>
  );
}

