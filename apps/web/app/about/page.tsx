"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  Compass,
  Cpu,
  Layers,
  Heart,
  Globe,
  Award,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] selection:bg-cyan-500 selection:text-black">
      <Navbar />

      <main className="flex-1">
        {/* Header Hero */}
        <section className="relative pt-16 pb-12 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-950/40 text-violet-300 text-xs font-medium mb-5 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Mission & Engineering Philosophy</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Every Model Has a Story. <br />
              <span className="brand-gradient-text">We Make It Inspectable.</span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
              Machine learning shouldn&apos;t be a black box where models either mysteriously converge or silently fail. RewindVerse turns training runs into interactive, deterministic stories you can replay and truly understand.
            </p>
          </div>
        </section>

        {/* Editorial Story Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-16">
          <div className="p-8 sm:p-10 rounded-3xl glass-panel space-y-6 text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Why We Built RewindVerse
            </h2>

            <p>
              Modern deep learning training runs emit millions of numerical updates, but practitioners are usually left staring at flat loss curves that report <em className="text-white">what</em> happened without revealing <em className="text-cyan-300">why</em>. When a model diverges or gets stuck on an anisotropic plateau, standard dashboards cannot show the geometry of the optimization path.
            </p>

            <p>
              We founded RewindVerse on a simple conviction: <strong>if you can replay a model&apos;s learning trajectory step-by-step in 2D and 3D, training failures transform into intuitive discoveries.</strong>
            </p>

            <p>
              By combining strict numerical honesty, local-first in-browser privacy, and hardware-accelerated 60 FPS scrubbers, RewindVerse bridges the gap between academic theory and practical ML debugging.
            </p>
          </div>
        </section>

        {/* 4 Guiding Principles */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">
              Core Principles
            </h3>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">
              The Rules We Build By
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                num: "01",
                title: "One Source of Truth. Multiple Faithful Views.",
                desc: "The recorded training trace is immutable. 2D contours, 3D meshes, and loss trajectories are all deterministic representations of that exact data. The user chooses how to inspect it.",
              },
              {
                num: "02",
                title: "Zero-Hallucination Visualization Policy",
                desc: "We never invent landscape geometry or fabricate unmeasured gradient tensors. 3D surfaces are rendered only where data or analytical definitions genuinely support it, with explicit provenance disclosures.",
              },
              {
                num: "03",
                title: "Offline Local-First Privacy",
                desc: "Research data and model weights belong to you. RewindML simulation, trace parsing, and diagnostic algorithms run 100% in your browser without requiring external server compute.",
              },
              {
                num: "04",
                title: "Explainability Over Black-Box Claims",
                desc: "Diagnostics cite exact step ranges and numerical evidence (variance, slope, norm thresholds) rather than vague AI labels. Every finding includes clear, actionable remediation steps.",
              },
            ].map((principle) => (
              <div
                key={principle.num}
                className="p-7 rounded-3xl glass-panel glass-card-interactive flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-mono font-bold text-cyan-400 mb-2 block">
                    PRINCIPLE {principle.num}
                  </span>
                  <h4 className="text-lg font-bold text-white mb-2">
                    {principle.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                    {principle.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center pb-20">
          <div className="p-8 sm:p-12 rounded-3xl glass-panel text-center">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Explore your first model story.
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-lg mx-auto mb-6">
              Step through our interactive 3D challenges or replay an existing training run today.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/studio"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white shadow-lg shadow-cyan-500/25 hover:scale-[1.02] transition-transform"
              >
                <Sparkles className="w-4 h-4" />
                Launch Rewind Studio
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

