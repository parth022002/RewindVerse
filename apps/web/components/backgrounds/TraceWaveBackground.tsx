"use client";

import React, { useId } from "react";

interface TraceWaveProps {
  className?: string;
  opacity?: number;
}

export function TraceWaveBackground({ className = "", opacity = 0.35 }: TraceWaveProps) {
  const gradId = useId();

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none -z-10 overflow-hidden select-none ${className}`}
    >
      <svg
        className="w-full h-full [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_85%)]"
        style={{ opacity }}
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.05" />
            <stop offset="25%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#8b5cf6" stopOpacity="0.85" />
            <stop offset="85%" stopColor="#3b82f6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Primary Trajectory Wave */}
        <path
          d="M -120 280 C 280 140, 520 460, 840 280 C 1140 120, 1320 420, 1620 340"
          stroke={`url(#${gradId})`}
          strokeWidth="1.8"
          strokeDasharray="6 8"
          className="motion-safe:animate-trajectory-flow"
        />

        {/* Secondary Harmonic Wave */}
        <path
          d="M -80 420 C 320 540, 680 220, 980 440 C 1220 580, 1420 320, 1580 410"
          stroke={`url(#${gradId})`}
          strokeWidth="1.2"
          strokeDasharray="4 6"
          strokeOpacity="0.4"
          className="motion-safe:animate-trajectory-flow"
        />

        {/* Checkpoint Nodes along the primary wave */}
        <circle cx="340" cy="190" r="4" fill="#06b6d4" className="motion-safe:animate-pulse-star" />
        <circle
          cx="840"
          cy="280"
          r="5"
          fill="#8b5cf6"
          className="motion-safe:animate-pulse-star"
          style={{ animationDelay: "1.5s" }}
        />
        <circle
          cx="1210"
          cy="230"
          r="3.5"
          fill="#3b82f6"
          className="motion-safe:animate-pulse-star"
          style={{ animationDelay: "2.8s" }}
        />
      </svg>
    </div>
  );
}

