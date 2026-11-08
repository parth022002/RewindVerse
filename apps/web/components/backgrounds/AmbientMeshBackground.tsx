import React from "react";

interface AmbientMeshProps {
  className?: string;
  intensity?: "subtle" | "medium" | "vibrant";
}

export function AmbientMeshBackground({ className = "", intensity = "subtle" }: AmbientMeshProps) {
  const opacityMap = {
    subtle: {
      cyan: "from-cyan-500/10 via-sky-500/5 to-transparent",
      violet: "from-violet-600/10 via-purple-500/5 to-transparent",
      blue: "from-blue-600/8 via-cyan-600/4 to-transparent",
    },
    medium: {
      cyan: "from-cyan-400/18 via-sky-500/10 to-transparent",
      violet: "from-violet-600/16 via-purple-500/8 to-transparent",
      blue: "from-blue-500/14 via-cyan-500/8 to-transparent",
    },
    vibrant: {
      cyan: "from-cyan-400/25 via-sky-500/15 to-transparent",
      violet: "from-violet-600/22 via-purple-500/12 to-transparent",
      blue: "from-blue-500/20 via-cyan-500/10 to-transparent",
    },
  };

  const selected = opacityMap[intensity];

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none -z-20 overflow-hidden select-none ${className}`}
    >
      {/* Top Center Cyan/Sky Aurora Orb */}
      <div
        className={`absolute -top-[12%] left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-gradient-to-br ${selected.cyan} rounded-full blur-[140px] motion-safe:animate-aurora-1`}
      />

      {/* Mid Left Violet Accent Orb */}
      <div
        className={`absolute top-[32%] -left-[10%] w-[600px] h-[520px] bg-gradient-to-tr ${selected.violet} rounded-full blur-[150px] motion-safe:animate-aurora-2`}
      />

      {/* Lower Right Blue/Cyan Accent Orb */}
      <div
        className={`absolute top-[58%] -right-[10%] w-[700px] h-[600px] bg-gradient-to-bl ${selected.blue} rounded-full blur-[160px] motion-safe:animate-aurora-3`}
      />
    </div>
  );
}

