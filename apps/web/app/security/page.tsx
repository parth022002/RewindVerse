"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import {
  ShieldCheck,
  Lock,
  Database,
  FileCheck,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Cpu,
  ServerOff,
  KeyRound,
  EyeOff,
} from "lucide-react";

const SECURITY_PILLARS = [
  {
    icon: ServerOff,
    title: "100% Client-Side Sandbox",
    subtitle: "Zero Server Computation",
    desc: "RewindML simulations, 2D/3D surface evaluations, PCA calculations, and diagnostic heuristics execute entirely inside browser Web Workers. Your model weights and hyperparameters never touch an external server.",
    badges: ["Web Workers", "IndexedDB", "Zero Cloud Compute"],
  },
  {
    icon: EyeOff,
    title: "Zero Telemetry & Tracking",
    subtitle: "No Tracking Cookies",
    desc: "RewindVerse collects zero telemetry on your training experiments. We do not inspect trace contents, parameter tensors, dataset rows, or user tokens. Your research remains completely confidential.",
    badges: ["No Third-Party Cookies", "No Weight Transmission", "No Training Data Ingestion"],
  },
  {
    icon: FileCheck,
    title: "Formula Injection Sanitization",
    subtitle: "Spreadsheet CSV Protection",
    desc: "Imported CSV files are subjected to strict formula sanitization. Any cell beginning with '=', '@', '+', or '-' is safely escaped before ingestion to neutralize DDE (Dynamic Data Exchange) exploits in Excel or Google Sheets.",
    badges: ["RFC 4180 Compliant", "Formula Stripping", "DoS Line Limits"],
  },
  {
    icon: KeyRound,
    title: "Cryptographic Share Links",
    subtitle: "Explicit Read-Only Sharing",
    desc: "Traces remain strictly local until you click 'Share Run'. Cloud sharing generates a cryptographically random UUID token with read-only view permissions and watermark enforcement.",
    badges: ["Tokenized ACLs", "Read-Only Enforced", "Watermarked Views"],
  },
];

export default function SecurityPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] selection:bg-cyan-500 selection:text-black">
      <Navbar />

      <main className="flex-1">
        {/* Header Hero */}
        <section className="relative pt-16 pb-12 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 text-xs font-medium mb-5 backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Trust, Privacy & Architecture Standard</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Privacy by Architecture. <br />
              <span className="brand-gradient-text">Local-First ML Intelligence.</span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
              RewindVerse is engineered from the ground up so that your research, weights, and training telemetry stay exclusively on your hardware.
            </p>
          </div>
        </section>

        {/* 4 Pillars Grid */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SECURITY_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="p-8 rounded-3xl glass-panel glass-card-interactive flex flex-col justify-between shadow-xl"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400 mb-5">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold block mb-1">
                      {pillar.subtitle}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/5 flex flex-wrap gap-2">
                    {pillar.badges.map((b) => (
                      <span
                        key={b}
                        className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-white/5 border border-white/10 text-slate-300"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Threat Model Breakdown Table */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="p-8 rounded-3xl glass-panel shadow-2xl space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 block mb-1">
                Engineering Specification
              </span>
              <h2 className="text-2xl font-bold text-white">
                Threat Mitigation Matrix
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/10 text-[var(--text-muted)] uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Threat Vector</th>
                    <th className="pb-3 font-semibold">Potential Impact</th>
                    <th className="pb-3 font-semibold">RewindVerse Mitigation</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  <tr>
                    <td className="py-3.5 font-bold text-white">Model Weight Leakage</td>
                    <td className="py-3.5 text-slate-400">Proprietary model extraction</td>
                    <td className="py-3.5 text-emerald-300">All compute is local in-browser; no weights ever upload</td>
                    <td className="py-3.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /></td>
                  </tr>
                  <tr>
                    <td className="py-3.5 font-bold text-white">Formula Injection (CSV)</td>
                    <td className="py-3.5 text-slate-400">DDE code execution in spreadsheets</td>
                    <td className="py-3.5 text-emerald-300">Prefixed with apostrophe / stripped on parser ingress</td>
                    <td className="py-3.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /></td>
                  </tr>
                  <tr>
                    <td className="py-3.5 font-bold text-white">DoS File Bomb</td>
                    <td className="py-3.5 text-slate-400">Browser memory exhaustion crash</td>
                    <td className="py-3.5 text-emerald-300">Strict line limit (50,000 steps) & 100MB byte size limit</td>
                    <td className="py-3.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /></td>
                  </tr>
                  <tr>
                    <td className="py-3.5 font-bold text-white">Shared Trace Tampering</td>
                    <td className="py-3.5 text-slate-400">Unauthorized write access</td>
                    <td className="py-3.5 text-emerald-300">Public share tokens are strictly read-only and immutable</td>
                    <td className="py-3.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center pb-20">
          <div className="p-8 sm:p-12 rounded-3xl glass-panel text-center">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Inspect models with total peace of mind.
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-lg mx-auto mb-6">
              Launch Rewind Studio offline today or read the complete security standard specification.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/studio"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-transform"
              >
                <Sparkles className="w-4 h-4" />
                Open Rewind Studio
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
              >
                Explore System Architecture →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

