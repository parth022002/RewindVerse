"use client";

import React, { useEffect, useState, useId } from "react";

interface AmbientMeshProps {
  className?: string;
  intensity?: "subtle" | "medium" | "vibrant";
  showGrid?: boolean;
  showTrajectory?: boolean;
  showStars?: boolean;
}

// Deterministic constellation stars coordinates
const CONSTELLATION_STARS = [
  { x: "8%", y: "14%", size: 2, delay: "0s", duration: "3.2s" },
  { x: "22%", y: "28%", size: 2.5, delay: "1.1s", duration: "4.5s" },
  { x: "38%", y: "10%", size: 1.5, delay: "2.3s", duration: "3.6s" },
  { x: "52%", y: "18%", size: 2, delay: "0.5s", duration: "4.8s" },
  { x: "68%", y: "24%", size: 3, delay: "1.7s", duration: "4.1s" },
  { x: "84%", y: "12%", size: 2, delay: "2.9s", duration: "3.9s" },
  { x: "94%", y: "22%", size: 1.5, delay: "0.2s", duration: "5.1s" },
  { x: "14%", y: "62%", size: 2.5, delay: "0.8s", duration: "4.2s" },
  { x: "28%", y: "78%", size: 1.5, delay: "2.4s", duration: "3.7s" },
  { x: "44%", y: "68%", size: 2, delay: "1.3s", duration: "4.9s" },
  { x: "62%", y: "82%", size: 2.5, delay: "2.6s", duration: "5.2s" },
  { x: "78%", y: "65%", size: 2, delay: "0.4s", duration: "3.8s" },
  { x: "90%", y: "76%", size: 2.5, delay: "1.9s", duration: "4.4s" },
  { x: "48%", y: "44%", size: 1.5, delay: "3.1s", duration: "3.5s" },
  { x: "82%", y: "42%", size: 2, delay: "1.5s", duration: "4.6s" },
  { x: "12%", y: "40%", size: 2, delay: "2.2s", duration: "4.0s" },
];

export function AmbientMeshBackground({
  className = "",
  intensity = "vibrant",
  showGrid = true,
  showTrajectory = true,
  showStars = true,
}: AmbientMeshProps) {
  const gridId = useId();
  const gradId = useId();
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    let frameId: number;
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, []);

  const opacityMap = {
    subtle: {
      cyan: "from-cyan-400/14 via-sky-500/8 to-transparent",
      violet: "from-violet-600/12 via-purple-500/6 to-transparent",
      blue: "from-blue-600/10 via-cyan-600/5 to-transparent",
      emerald: "from-emerald-500/8 to-transparent",
    },
    medium: {
      cyan: "from-cyan-400/22 via-sky-500/12 to-transparent",
      violet: "from-violet-600/18 via-purple-500/10 to-transparent",
      blue: "from-blue-500/16 via-cyan-500/10 to-transparent",
      emerald: "from-emerald-500/12 to-transparent",
    },
    vibrant: {
      cyan: "from-cyan-400/28 via-sky-500/16 to-transparent",
      violet: "from-violet-600/24 via-purple-500/14 to-transparent",
      blue: "from-blue-500/22 via-cyan-500/12 to-transparent",
      emerald: "from-emerald-500/15 to-transparent",
    },
  };

  const selected = opacityMap[intensity];

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none -z-20 overflow-hidden select-none bg-[#05070e] ${className}`}
    >
      {/* 1. Interactive Cursor Glow / Luminous Spotlight */}
      {mousePos.x > -500 && (
        <div
          className="absolute w-[650px] h-[650px] rounded-full blur-[140px] transition-transform duration-75 ease-out opacity-60"
          style={{
            transform: `translate3d(${mousePos.x - 325}px, ${mousePos.y - 325}px, 0)`,
            background: "radial-gradient(circle, rgba(0, 242, 254, 0.16) 0%, rgba(139, 92, 246, 0.08) 50%, transparent 75%)",
          }}
        />
      )}

      {/* 2. Floating Atmospheric Aurora Orbs */}
      {/* Top Center Cyan/Sky Aurora Orb */}
      <div
        className={`absolute -top-[15%] left-1/2 -translate-x-1/2 w-[950px] h-[550px] bg-gradient-to-br ${selected.cyan} rounded-full blur-[140px] animate-aurora-1`}
      />

      {/* Mid Left Violet/Purple Accent Orb */}
      <div
        className={`absolute top-[30%] -left-[12%] w-[700px] h-[580px] bg-gradient-to-tr ${selected.violet} rounded-full blur-[150px] animate-aurora-2`}
      />

      {/* Lower Right Electric Blue/Cyan Accent Orb */}
      <div
        className={`absolute top-[55%] -right-[12%] w-[800px] h-[650px] bg-gradient-to-bl ${selected.blue} rounded-full blur-[160px] animate-aurora-3`}
      />

      {/* Subtle Lower Left Emerald Glow Orb */}
      <div
        className={`absolute -bottom-[10%] left-[15%] w-[600px] h-[450px] bg-gradient-to-tr ${selected.emerald} rounded-full blur-[140px] opacity-70`}
      />

      {/* 3. High-Precision Coordinate Grid with Center Illumination */}
      {showGrid && (
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.06] [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_85%)]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id={gridId}
              width="56"
              height="56"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 56 0 L 0 0 0 56"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.8"
                className="text-cyan-300"
              />
              {/* Grid intersection point */}
              <circle cx="0" cy="0" r="1.2" fill="#00f2fe" opacity="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${gridId})`} />
        </svg>
      )}

      {/* 4. Flowing Mathematical Loss Trajectory Curves */}
      {showTrajectory && (
        <svg
          className="absolute inset-0 w-full h-full opacity-45 [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_90%)]"
          viewBox="0 0 1440 900"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.05" />
              <stop offset="25%" stopColor="#00f2fe" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#8b5cf6" stopOpacity="0.95" />
              <stop offset="85%" stopColor="#ec4899" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Primary Trajectory Spline */}
          <path
            d="M -120 280 C 260 140, 520 460, 840 260 C 1140 100, 1340 420, 1620 320"
            stroke={`url(#${gradId})`}
            strokeWidth="2"
            strokeDasharray="8 10"
            className="animate-trajectory-flow"
          />

          {/* Secondary Harmonic Wave */}
          <path
            d="M -80 440 C 320 560, 680 200, 980 420 C 1220 560, 1420 300, 1580 390"
            stroke={`url(#${gradId})`}
            strokeWidth="1.4"
            strokeDasharray="5 8"
            strokeOpacity="0.5"
            className="animate-trajectory-flow"
          />

          {/* Checkpoint Nodes along the flow */}
          <circle cx="320" cy="180" r="4.5" fill="#00f2fe" className="animate-star-twinkle" />
          <circle
            cx="840"
            cy="260"
            r="5.5"
            fill="#8b5cf6"
            className="animate-star-twinkle"
            style={{ animationDelay: "1.4s" }}
          />
          <circle
            cx="1200"
            cy="210"
            r="4"
            fill="#38bdf8"
            className="animate-star-twinkle"
            style={{ animationDelay: "2.6s" }}
          />
        </svg>
      )}

      {/* 5. Twinkling Algorithmic Constellation Starfield */}
      {showStars &&
        CONSTELLATION_STARS.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-200 shadow-sm shadow-cyan-400 animate-star-twinkle"
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
