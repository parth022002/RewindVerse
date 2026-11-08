"use client";

import React, { useId } from "react";

interface SignalGridProps {
  className?: string;
  cellSize?: number;
  opacity?: number;
}

export function SignalGridBackground({
  className = "",
  cellSize = 48,
  opacity = 0.04,
}: SignalGridProps) {
  const gridId = useId();

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none -z-10 overflow-hidden select-none ${className}`}
    >
      <svg
        className="w-full h-full [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)]"
        style={{ opacity }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id={gridId}
            width={cellSize}
            height={cellSize}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.75"
              className="text-slate-400 dark:text-slate-200"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${gridId})`} />
      </svg>
    </div>
  );
}

