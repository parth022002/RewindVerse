"use client";

import React from "react";
import { ProvenanceType } from "../../lib/visualization/types";
import { ShieldCheck, Activity, Compass, Filter, Sparkles } from "lucide-react";

interface ProvenanceBadgeProps {
  type: ProvenanceType;
  details?: string;
}

export function ProvenanceBadge({ type, details }: ProvenanceBadgeProps) {
  switch (type) {
    case "recorded":
      return (
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-950/60 border border-emerald-800 text-emerald-400"
          title={details || "Directly recorded in RVTS trace records without alteration."}
        >
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          Recorded
        </span>
      );
    case "derived":
      return (
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-cyan-950/60 border border-cyan-800 text-cyan-300"
          title={details || "Calculated deterministically from recorded trace values."}
        >
          <Activity className="w-3 h-3 text-cyan-400" />
          Derived
        </span>
      );
    case "projected":
      return (
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-violet-950/60 border border-violet-800 text-violet-300"
          title={details || "Geometric projection of higher-dimensional parameter space."}
        >
          <Compass className="w-3 h-3 text-violet-400" />
          Projected
        </span>
      );
    case "sampled":
      return (
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-950/60 border border-amber-800 text-amber-300"
          title={details || "Uniformly or quantile-sampled subset of recorded trace records."}
        >
          <Filter className="w-3 h-3 text-amber-400" />
          Sampled
        </span>
      );
    case "illustrative":
    default:
      return (
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-800 border border-slate-700 text-slate-300"
          title={details || "Illustrative conceptual geometry; does not represent recorded model state."}
        >
          <Sparkles className="w-3 h-3 text-slate-400" />
          Illustrative
        </span>
      );
  }
}

