"use client";

import React from "react";

export function BackgroundField() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-20 overflow-hidden select-none"
    >
      {/* Layer 1 & 2: Radial Gradient Mesh Lights */}
      <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-cyan-500/10 via-blue-600/5 to-transparent rounded-full blur-3xl opacity-80" />
      <div className="absolute top-[45%] -left-[15%] w-[600px] h-[500px] bg-violet-600/8 rounded-full blur-3xl opacity-60" />
      <div className="absolute top-[65%] -right-[15%] w-[700px] h-[600px] bg-cyan-600/6 rounded-full blur-3xl opacity-50" />

      {/* Layer 3: Coordinate Field / Fine SVG Grid with Radial Edge Fade */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.035] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="bg-grid-pattern"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.8"
              className="text-white"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg-grid-pattern)" />
      </svg>

      {/* Layer 4: Mathematical Trajectory Signal Path with Checkpoint Nodes */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M -100 250 C 300 150, 500 480, 850 320 C 1150 180, 1300 450, 1600 380"
          stroke="url(#trajectory-grad)"
          strokeWidth="1.5"
          strokeDasharray="4 6"
        />
        {/* Checkpoint Nodes along the path */}
        <circle cx="360" cy="200" r="3.5" fill="#00d2ff" className="animate-pulse" />
        <circle cx="850" cy="320" r="4.5" fill="#a855f7" />
        <circle cx="1200" cy="270" r="3" fill="#3b82f6" />

        <defs>
          <linearGradient id="trajectory-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00d2ff" stopOpacity="0.1" />
            <stop offset="35%" stopColor="#00d2ff" stopOpacity="0.7" />
            <stop offset="70%" stopColor="#a855f7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

