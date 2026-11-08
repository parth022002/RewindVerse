import React from "react";

interface SectionGlowProps {
  className?: string;
  color?: "cyan" | "violet" | "blue" | "emerald";
  position?: "top" | "center" | "bottom" | "left" | "right";
}

export function SectionGlow({
  className = "",
  color = "cyan",
  position = "center",
}: SectionGlowProps) {
  const colorMap = {
    cyan: "from-cyan-500/15 via-sky-500/8 to-transparent",
    violet: "from-violet-600/15 via-purple-500/6 to-transparent",
    blue: "from-blue-600/15 via-indigo-500/6 to-transparent",
    emerald: "from-emerald-500/12 via-teal-500/5 to-transparent",
  };

  const posMap = {
    top: "-top-24 left-1/2 -translate-x-1/2",
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    bottom: "-bottom-24 left-1/2 -translate-x-1/2",
    left: "top-1/2 -left-24 -translate-y-1/2",
    right: "top-1/2 -right-24 -translate-y-1/2",
  };

  return (
    <div
      aria-hidden="true"
      className={`absolute pointer-events-none -z-10 select-none overflow-hidden ${className}`}
    >
      <div
        className={`w-[600px] h-[350px] bg-gradient-to-r ${colorMap[color]} rounded-full blur-[120px] ${posMap[position]}`}
      />
    </div>
  );
}

