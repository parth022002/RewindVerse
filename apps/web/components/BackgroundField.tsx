"use client";

import React, { useId } from "react";

export function BackgroundField() {
  const gridId = useId();
  const gradId = useId();

  // Deterministic star constellation coordinates
  const stars = [
    { x: "12%", y: "18%", size: 2, delay: "0s", duration: "3.5s" },
    { x: "28%", y: "34%", size: 2.5, delay: "1.2s", duration: "4.8s" },
    { x: "42%", y: "12%", size: 1.5, delay: "2.4s", duration: "3.2s" },
    { x: "65%", y: "22%", size: 2, delay: "0.8s", duration: "5.1s" },
    { x: "78%", y: "38%", size: 3, delay: "1.9s", duration: "4.2s" },
    { x: "88%", y: "15%", size: 1.5, delay: "3.1s", duration: "3.8s" },
    { x: "18%", y: "65%", size: 2.5, delay: "0.5s", duration: "4.5s" },
    { x: "32%", y: "82%", size: 1.5, delay: "2.1s", duration: "3.9s" },
    { x: "55%", y: "72%", size: 2, delay: "1.5s", duration: "4.7s" },
    { x: "72%", y: "85%", size: 2.5, delay: "2.8s", duration: "5.3s" },
    { x: "92%", y: "68%", size: 2, delay: "0.2s", duration: "3.6s" },
  ];

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-20 overflow-hidden select-none"
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: -20, overflow: "hidden" }}
    >
      {/* Layer 1: Multi-Tone Celestial Aurora Light Orbs */}
      <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-br from-cyan-400/18 via-sky-500/10 to-transparent rounded-full blur-[130px] animate-aurora-1" />
      <div className="absolute top-[35%] -left-[12%] w-[650px] h-[550px] bg-gradient-to-tr from-violet-600/15 via-purple-500/10 to-transparent rounded-full blur-[140px] animate-aurora-2" />
      <div className="absolute top-[60%] -right-[12%] w-[750px] h-[650px] bg-gradient-to-bl from-cyan-500/12 via-fuchsia-600/10 to-transparent rounded-full blur-[150px] animate-aurora-3" />
      <div className="absolute bottom-[5%] left-[20%] w-[500px] h-[400px] bg-emerald-500/8 rounded-full blur-[120px] opacity-70" />

      {/* Layer 2: Subtle Coordinate Graph Grid with Radial Edge Falloff */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.045] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_80%)]"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id={gridId}
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 48 0 L 0 0 0 48"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.75"
              className="text-white"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${gridId})`} />
      </svg>

      {/* Layer 3: Flowing Animated Loss Trajectory Signal */}
      <svg
        className="absolute inset-0 w-full h-full opacity-35 [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_85%)]"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M -120 280 C 280 140, 520 460, 840 280 C 1140 120, 1320 420, 1620 340"
          stroke={`url(#${gradId})`}
          strokeWidth="1.8"
          strokeDasharray="6 8"
          className="animate-trajectory-flow"
        />

        {/* Secondary Harmonic Trajectory Path */}
        <path
          d="M -80 420 C 320 540, 680 220, 980 440 C 1220 580, 1420 320, 1580 410"
          stroke={`url(#${gradId})`}
          strokeWidth="1.2"
          strokeDasharray="4 6"
          strokeOpacity="0.4"
          className="animate-trajectory-flow"
        />

        {/* Checkpoint Nodes along the path */}
        <circle cx="340" cy="190" r="4" fill="#00f2fe" className="animate-pulse-star" />
        <circle cx="840" cy="280" r="5" fill="#8b5cf6" className="animate-pulse-star" style={{ animationDelay: "1.5s" }} />
        <circle cx="1210" cy="230" r="3.5" fill="#38bdf8" className="animate-pulse-star" style={{ animationDelay: "2.8s" }} />

        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.1" />
            <stop offset="30%" stopColor="#00f2fe" stopOpacity="0.85" />
            <stop offset="65%" stopColor="#8b5cf6" stopOpacity="0.9" />
            <stop offset="90%" stopColor="#ec4899" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>

      {/* Layer 4: Ambient Star / Constellation Nodes */}
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white shadow-sm shadow-cyan-400 animate-pulse-star"
          style={{
            left: star.x,
            top: star.y,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}
    </div>
  );
}
