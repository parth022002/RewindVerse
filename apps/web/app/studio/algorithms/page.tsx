"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ALGORITHM_CATALOG,
  AlgorithmCategory,
  AlgorithmEntry,
  AlgorithmProvenance,
} from "@rewindverse/rewindml";
import {
  Search,
  CheckCircle2,
  Cpu,
  Layers,
  Wrench,
  BookOpen,
  X,
  ExternalLink,
  Sliders,
  Shield,
  Activity,
  ArrowRight,
} from "lucide-react";

const CATEGORIES: (AlgorithmCategory | "All")[] = [
  "All",
  "Optimization",
  "Supervised ML",
  "Unsupervised ML",
  "Deep Learning",
  "Reinforcement Learning",
];

export default function AlgorithmCatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState<AlgorithmCategory | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvenance, setSelectedProvenance] = useState<string>("All");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmEntry | null>(null);

  const filteredAlgorithms = useMemo(() => {
    return ALGORITHM_CATALOG.filter((algo) => {
      const matchesCategory =
        selectedCategory === "All" || algo.category === selectedCategory;
      const matchesQuery =
        searchQuery === "" ||
        algo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        algo.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        algo.tagline.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProvenance =
        selectedProvenance === "All" || algo.provenance === selectedProvenance;

      return matchesCategory && matchesQuery && matchesProvenance;
    });
  }, [selectedCategory, searchQuery, selectedProvenance]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold tracking-wider uppercase mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Master Registry</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Algorithm Catalogue</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1 max-w-2xl">
            Explore verified mathematical foundations, optimization algorithms, classical ML models,
            and neural components. Every entry declares explicit mathematical definitions, RVTS trace signals,
            and execution provenance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/studio/forge"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-sm hover:brightness-110 transition-all shadow-lg shadow-cyan-500/20"
          >
            <Wrench className="w-4 h-4" />
            <span>Open Algorithm Forge</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4 bg-[var(--surface)] p-5 rounded-xl border border-[var(--border)]">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search by name, slug, or math concept..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--surface-raised)] border border-[var(--border)] rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-cyan-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Provenance Filter */}
          <div className="flex items-center gap-2 self-start md:self-auto text-xs text-[var(--text-muted)]">
            <span>Provenance:</span>
            <select
              value={selectedProvenance}
              onChange={(e) => setSelectedProvenance(e.target.value)}
              className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-md px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Sources</option>
              <option value="native">Native RewindML</option>
              <option value="adapter">External Adapter</option>
              <option value="declarative-custom">Declarative Custom</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--border)]/50">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "bg-[var(--surface-raised)] text-[var(--text-muted)] hover:text-white border border-transparent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Algorithms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlgorithms.map((algo) => {
          const isNative = algo.provenance === "native";
          return (
            <div
              key={algo.id}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 flex flex-col justify-between hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/5 transition-all group"
            >
              <div>
                {/* Header Pills */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--surface-raised)] text-[var(--text-muted)] border border-[var(--border)]">
                    {algo.id}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${
                        algo.priority === "P0"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                      }`}
                    >
                      {algo.priority}
                    </span>
                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${
                        isNative
                          ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                      }`}
                    >
                      {algo.provenance}
                    </span>
                  </div>
                </div>

                {/* Name & Tagline */}
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {algo.name}
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">
                  {algo.tagline}
                </p>

                {/* Math Equation Snippet */}
                <div className="my-4 p-3 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] font-mono text-xs text-cyan-300/90 overflow-x-auto select-all">
                  {algo.mathEquation}
                </div>

                {/* Hyperparameters Snippet */}
                <div className="space-y-1 mb-4">
                  <div className="text-[11px] uppercase font-semibold text-[var(--text-muted)] flex items-center gap-1">
                    <Sliders className="w-3 h-3" />
                    <span>Parameters</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {algo.hyperparameters.map((p) => (
                      <span
                        key={p.name}
                        className="text-[11px] font-mono bg-black/40 text-slate-300 px-2 py-0.5 rounded border border-[var(--border)]/60"
                      >
                        {p.name}={String(p.defaultVal)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedAlgorithm(algo)}
                  className="text-xs text-[var(--text-muted)] hover:text-white flex items-center gap-1 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Inspect Spec</span>
                </button>

                <div className="flex items-center gap-2">
                  {algo.demoRoute && (
                    <Link
                      href={algo.demoRoute}
                      className="text-xs bg-[var(--surface-raised)] hover:bg-cyan-500/20 text-cyan-400 border border-[var(--border)] hover:border-cyan-500/30 px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                    >
                      <Cpu className="w-3 h-3" />
                      <span>Lab</span>
                    </Link>
                  )}
                  {algo.forkable && (
                    <Link
                      href={`/studio/forge?fork=${encodeURIComponent(algo.id)}`}
                      className="text-xs bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2.5 py-1.5 rounded-lg flex items-center gap-1 font-medium transition-all"
                    >
                      <Wrench className="w-3 h-3" />
                      <span>Fork</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAlgorithms.length === 0 && (
        <div className="text-center py-16 bg-[var(--surface)] border border-[var(--border)] rounded-xl">
          <BookOpen className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-semibold text-white">No algorithms match your search</h3>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Try adjusting your category filter, provenance selector, or search term.
          </p>
        </div>
      )}

      {/* Modal Detail Drawer */}
      {selectedAlgorithm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[var(--border)] pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded">
                    {selectedAlgorithm.id}
                  </span>
                  <span className="text-xs uppercase font-semibold text-[var(--text-muted)]">
                    {selectedAlgorithm.category}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white">{selectedAlgorithm.name}</h2>
                <p className="text-sm text-[var(--text-muted)] mt-1">{selectedAlgorithm.tagline}</p>
              </div>
              <button
                onClick={() => setSelectedAlgorithm(null)}
                className="text-[var(--text-muted)] hover:text-white p-1 rounded-lg hover:bg-[var(--surface-raised)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Math Formula Card */}
            <div className="space-y-2">
              <h4 className="text-xs uppercase font-semibold text-[var(--text-muted)]">
                Mathematical Definition & Update Rule
              </h4>
              <div className="p-4 rounded-xl bg-black/60 border border-cyan-500/20 font-mono text-cyan-300 text-sm overflow-x-auto select-all">
                {selectedAlgorithm.mathEquation}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs uppercase font-semibold text-[var(--text-muted)]">
                Description & Mechanism
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {selectedAlgorithm.description}
              </p>
            </div>

            {/* Learning Objectives */}
            <div className="space-y-2">
              <h4 className="text-xs uppercase font-semibold text-[var(--text-muted)]">
                Core Learning Objectives
              </h4>
              <ul className="space-y-1.5 text-sm text-slate-300">
                {selectedAlgorithm.learningObjectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Assumptions */}
            <div className="space-y-2">
              <h4 className="text-xs uppercase font-semibold text-[var(--text-muted)]">
                Assumptions & Constraints
              </h4>
              <ul className="space-y-1.5 text-sm text-slate-400">
                {selectedAlgorithm.assumptions.map((assump, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-cyan-500 font-bold">•</span>
                    <span>{assump}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trace Capabilities */}
            <div className="space-y-2">
              <h4 className="text-xs uppercase font-semibold text-[var(--text-muted)]">
                Declared RVTS Trace Signals
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedAlgorithm.traceCapabilities.map((cap) => (
                  <span
                    key={cap}
                    className="text-xs font-mono bg-[var(--surface-raised)] border border-[var(--border)] px-2.5 py-1 rounded-md text-emerald-400"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-[var(--border)] flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedAlgorithm(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--text-muted)] hover:text-white"
              >
                Close
              </button>
              {selectedAlgorithm.demoRoute && (
                <Link
                  href={selectedAlgorithm.demoRoute}
                  className="px-4 py-2 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] hover:border-cyan-500/30 text-cyan-400 text-sm font-medium flex items-center gap-2"
                >
                  <Cpu className="w-4 h-4" />
                  <span>Open in Lab</span>
                </Link>
              )}
              {selectedAlgorithm.forkable && (
                <Link
                  href={`/studio/forge?fork=${encodeURIComponent(selectedAlgorithm.id)}`}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:brightness-110"
                >
                  <Wrench className="w-4 h-4" />
                  <span>Fork in Forge</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
