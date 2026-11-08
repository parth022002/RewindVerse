import React from "react";
import Link from "next/link";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { FileCode, Terminal, BookOpen, ShieldCheck, ArrowRight } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-800/50 text-cyan-300 text-xs font-mono">
            RVTS v0.1.0 · Official Specification
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            RewindVerse Technical Documentation
          </h1>
          <p className="text-base text-[var(--text-muted)] max-w-2xl">
            Complete guide to the RewindVerse Training Trace Specification (RVTS),
            browser execution engine, and Python recorder integrations.
          </p>
        </div>

        {/* RVTS Schema Specification Section */}
        <section className="p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-6">
          <div className="flex items-center gap-3">
            <FileCode className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">RVTS JSON Lines Structure</h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
            An RVTS trace (<code className="text-cyan-300">.rvtrace</code>) is a sequence of newline-delimited JSON objects.
            The first record is guaranteed to be a <strong className="text-white">Manifest</strong> record declaring metadata,
            framework origin, model/objective identity, and declared capabilities. Subsequent records include <strong className="text-white">Step</strong>, <strong className="text-white">Event</strong>, and an optional <strong className="text-white">Footer</strong>.
          </p>

          <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] font-mono text-xs overflow-x-auto text-slate-300">
            <pre>{`// Line 1: Manifest
{"type":"manifest","version":"0.1.0","run_id":"run_01","producer":{"name":"rewindml","version":"1.0"},"model_or_objective":{"name":"Quadratic","type":"2d_loss_landscape"},"declared_capabilities":{"has_loss":true,"has_parameters":true}}

// Lines 2+: Steps
{"type":"step","step":0,"metrics":{"loss":5.21,"gradient_norm":8.4},"parameters":{"theta":[-4.0,4.0]}}
{"type":"step","step":1,"metrics":{"loss":3.82,"gradient_norm":5.1},"parameters":{"theta":[-3.2,2.8]}}

// Optional: Events & Footer
{"type":"event","step":25,"event_type":"plateau","severity":"info","message":"Loss relative change < 1e-4"}
{"type":"footer","total_steps":50,"status":"completed"}`}</pre>
          </div>
        </section>

        {/* Engineering Specifications Grid */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            Engineering Specifications & Governance Standards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">Core Product</span>
              <h3 className="text-sm font-bold text-white">Product Requirements Document (PRD v4.1)</h3>
              <p className="text-xs text-[var(--text-muted)]">
                Defines platform modules (RewindML, Replay, Insights, Compare, Academy), local-first storage, and zero-hallucination replay.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
              <span className="text-[10px] font-mono text-violet-400 uppercase tracking-wider block">Architecture</span>
              <h3 className="text-sm font-bold text-white">Technical Stack Standard (v2.0)</h3>
              <p className="text-xs text-[var(--text-muted)]">
                Next.js 15 App Router, React 19, Tailwind CSS 4, Three.js WebGL 2, Neon PostgreSQL, Drizzle ORM, and Python SDK.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">Security & Privacy</span>
              <h3 className="text-sm font-bold text-white">Security Architecture & Implementation Standard</h3>
              <p className="text-xs text-[var(--text-muted)]">
                Strict Content Security Policy, isolated Web Workers, spreadsheet formula injection sanitization, and DoS limits.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider block">Graphics & Vis</span>
              <h3 className="text-sm font-bold text-white">2D/3D Visualization Product & Optimization Standard</h3>
              <p className="text-xs text-[var(--text-muted)]">
                &ldquo;One source of truth, multiple faithful views.&rdquo; 2D/3D/Auto view parity, provenance badges, and complete visualization catalogue.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block">Graphics Engine</span>
              <h3 className="text-sm font-bold text-white">3D Visualization & Pending Development Plan</h3>
              <p className="text-xs text-[var(--text-muted)]">
                Three.js WebGL 2 stack, analytical surface sampling, optimizer path tracking, and OrbitControls navigation.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
              <span className="text-[10px] font-mono text-pink-400 uppercase tracking-wider block">Design System</span>
              <h3 className="text-sm font-bold text-white">Website Design & Engineering Standards</h3>
              <p className="text-xs text-[var(--text-muted)]">
                OKLCH color tokens, 4px baseline grid, keyboard-first accessibility (WCAG 2.2 AA), and brand lockup hierarchy.
              </p>
            </div>
          </div>
        </section>

        {/* Python SDK & CLI Section */}
        <section className="p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-6">
          <div className="flex items-center gap-3">
            <Terminal className="w-6 h-6 text-violet-400" />
            <h2 className="text-xl font-bold text-white">Python CLI Tools</h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
            The <code className="text-violet-300">rvtrace</code> CLI provides fast local validation, inspection, and browser preview without dependencies on external services:
          </p>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)]">
              <span className="text-cyan-400 font-bold block mb-1">$ rvtrace validate traces/run.rvtrace</span>
              <span className="text-[var(--text-muted)]">Verifies JSON schema Draft 2020-12 compliance and semantic step monotonicity.</span>
            </div>
            <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)]">
              <span className="text-cyan-400 font-bold block mb-1">$ rvtrace inspect traces/run.rvtrace</span>
              <span className="text-[var(--text-muted)]">Prints manifest summary, total steps, recorded series, and capability flags.</span>
            </div>
            <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)]">
              <span className="text-cyan-400 font-bold block mb-1">$ rvtrace view traces/run.rvtrace</span>
              <span className="text-[var(--text-muted)]">Launches the local browser replay viewer immediately.</span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

