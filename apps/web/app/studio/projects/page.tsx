"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FolderKanban,
  Plus,
  Search,
  Clock,
  Sparkles,
  ArrowRight,
  Database,
  Cpu,
  Layers,
  MoreVertical,
  CheckCircle2,
  Trash2,
  Share2,
} from "lucide-react";

interface ProjectItem {
  id: string;
  name: string;
  description: string;
  updatedAt: string;
  datasetName: string;
  algorithmCount: number;
  runCount: number;
  status: "Completed" | "In-Progress" | "Archived";
  primaryMetric: string;
}

const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: "proj-neural-quadratic",
    name: "Nonlinear Saddle Surface Optimization",
    description: "Benchmark comparison of SGD, Momentum, AdamW, and L-BFGS over Beale and Rosenbrock test landscapes.",
    updatedAt: "10 mins ago",
    datasetName: "Synthetic 2D Manifolds",
    algorithmCount: 4,
    runCount: 24,
    status: "Completed",
    primaryMetric: "Final Loss: 0.00014 (L-BFGS)",
  },
  {
    id: "proj-trust-calibration",
    name: "Medical Image Uncertainty Calibration",
    description: "Evaluating temperature scaling vs isotonic regression on corrupted test distributions with OOD detection.",
    updatedAt: "2 hours ago",
    datasetName: "CheXpert Subsample (N=5,000)",
    algorithmCount: 3,
    runCount: 12,
    status: "In-Progress",
    primaryMetric: "ECE: 0.038 (-42% error)",
  },
  {
    id: "proj-transformer-routing",
    name: "Sparse Attention Routing Benchmarks",
    description: "Profiling attention matrix sparsity, memory consumption, and FLOPS utilization across 8 sequence lengths.",
    updatedAt: "1 day ago",
    datasetName: "Wikitext-103 Chunked",
    algorithmCount: 2,
    runCount: 8,
    status: "Completed",
    primaryMetric: "Throughput: 1,420 tokens/sec",
  },
  {
    id: "proj-kalman-odometry",
    name: "Autonomous Vehicle Pose Estimation",
    description: "Extended Kalman Filter state estimation with asynchronous IMU and wheel encoder sensor fusion.",
    updatedAt: "3 days ago",
    datasetName: "KITTI Odometry Sequence 05",
    algorithmCount: 2,
    runCount: 6,
    status: "Archived",
    primaryMetric: "RMSE Drift: 0.12m / 100m",
  },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.datasetName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProject = () => {
    if (!newTitle.trim()) return;
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: newTitle.trim(),
      description: newDesc.trim() || "No description provided.",
      updatedAt: "Just now",
      datasetName: "Default Synthetic",
      algorithmCount: 1,
      runCount: 0,
      status: "In-Progress",
      primaryMetric: "Not evaluated yet",
    };
    setProjects([newProj, ...projects]);
    setNewTitle("");
    setNewDesc("");
    setShowNewModal(false);
  };

  const handleDelete = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
            <FolderKanban className="w-4 h-4" />
            <span>Workspace Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Research Projects</h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Organize datasets, algorithm configurations, execution runs, and reproducible reports in one place.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search projects by name, dataset, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[var(--surface)] border border-white/[0.08] text-xs text-white placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
          <span>Active Projects:</span>
          <span className="font-mono font-bold text-white">{projects.length}</span>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((proj) => (
          <div
            key={proj.id}
            className="p-6 rounded-2xl border border-white/[0.08] bg-[var(--surface)] hover:border-cyan-500/30 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${proj.status === "Completed"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : proj.status === "In-Progress"
                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                        : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                    }`}
                >
                  {proj.status}
                </span>

                <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{proj.updatedAt}</span>
                  <button
                    onClick={() => handleDelete(proj.id)}
                    aria-label="Delete project"
                    className="p-1 text-[var(--text-muted)] hover:text-rose-400 transition-colors ml-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-1.5">
                {proj.name}
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">
                {proj.description}
              </p>

              {/* Meta stats */}
              <div className="grid grid-cols-3 gap-2 py-3 px-3.5 rounded-xl bg-[var(--surface-raised)] border border-white/[0.04] mb-4 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] block">Dataset</span>
                  <span className="text-white truncate block">{proj.datasetName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] block">Algos</span>
                  <span className="text-cyan-400 font-bold">{proj.algorithmCount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] block">Runs</span>
                  <span className="text-violet-400 font-bold">{proj.runCount}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-[11px] text-emerald-400 font-mono truncate max-w-[200px]">
                {proj.primaryMetric}
              </span>
              <Link
                href="/studio/experiments"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <span>Open Project</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* New Project Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl border border-white/[0.1] bg-[#0e1422] shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Create New Research Project</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Robust Optimization on CIFAR-100"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--surface)] border border-white/[0.08] text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Outline the hypothesis, baseline algorithms, and evaluation metrics..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--surface)] border border-white/[0.08] text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

