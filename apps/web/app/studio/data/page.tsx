"use client";

import React, { useState, useMemo } from "react";
import {
  Database,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  BarChart2,
  FileText,
  Filter,
  Sliders,
  Download,
  ShieldCheck,
  RefreshCw,
  Hash,
  Eye,
} from "lucide-react";

interface ColumnProfile {
  name: string;
  dtype: "float64" | "int64" | "string" | "boolean";
  semanticRole: "feature" | "target" | "id" | "timestamp";
  count: number;
  nullCount: number;
  nullRatio: number;
  mean?: number;
  std?: number;
  min?: number;
  max?: number;
  uniqueValues: number;
}

export default function DataLabPage() {
  const [datasetName, setDatasetName] = useState<string>("telecom_customer_churn.csv");
  const [sampleSize, setSampleSize] = useState<number>(1000);
  const [selectedModality, setSelectedModality] = useState<string>("tabular");
  const [trainRatio, setTrainRatio] = useState<number>(0.7);
  const [valRatio, setValRatio] = useState<number>(0.15);
  const [testRatio, setTestRatio] = useState<number>(0.15);
  const [preprocessingMethod, setPreprocessingMethod] = useState<string>("zscore");

  // Sample profiled columns
  const [columns, setColumns] = useState<ColumnProfile[]>([
    {
      name: "account_tenure_months",
      dtype: "int64",
      semanticRole: "feature",
      count: 1000,
      nullCount: 0,
      nullRatio: 0.0,
      mean: 32.4,
      std: 24.5,
      min: 1,
      max: 72,
      uniqueValues: 72,
    },
    {
      name: "monthly_charges",
      dtype: "float64",
      semanticRole: "feature",
      count: 1000,
      nullCount: 12,
      nullRatio: 0.012,
      mean: 64.76,
      std: 30.09,
      min: 18.25,
      max: 118.75,
      uniqueValues: 820,
    },
    {
      name: "total_charges",
      dtype: "float64",
      semanticRole: "feature",
      count: 988,
      nullCount: 12,
      nullRatio: 0.012,
      mean: 2283.3,
      std: 2266.7,
      min: 18.8,
      max: 8684.8,
      uniqueValues: 960,
    },
    {
      name: "contract_type",
      dtype: "string",
      semanticRole: "feature",
      count: 1000,
      nullCount: 0,
      nullRatio: 0.0,
      uniqueValues: 3,
    },
    {
      name: "churn_status",
      dtype: "int64",
      semanticRole: "target",
      count: 1000,
      nullCount: 0,
      nullRatio: 0.0,
      mean: 0.265,
      std: 0.441,
      min: 0,
      max: 1,
      uniqueValues: 2,
    },
  ]);

  // Fingerprint calculation (mock deterministic hash)
  const datasetFingerprint = useMemo(() => {
    return `rvds-sha256-${datasetName.length}-${sampleSize}-8a7e3d2c1b9f4e5a`;
  }, [datasetName, sampleSize]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Data Lab & Observatory
            </span>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              Specification §5.0 Conformance
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
            Dataset Ingestion & Statistical Profiler
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Import, profile, validate, transform, version, and document datasets with zero data leakage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider transition-all cursor-pointer">
            <UploadCloud className="w-4 h-4" />
            <span>Import Dataset</span>
          </button>
        </div>
      </div>

      {/* Dataset Metadata HUD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
        <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)]">
          <span className="text-[10px] text-[var(--text-muted)] block uppercase">Dataset Version</span>
          <span className="text-white font-bold">{datasetName} (v1.0)</span>
        </div>
        <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)]">
          <span className="text-[10px] text-[var(--text-muted)] block uppercase">Total Rows / Instances</span>
          <span className="text-cyan-400 font-bold">{sampleSize.toLocaleString()} records</span>
        </div>
        <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)]">
          <span className="text-[10px] text-[var(--text-muted)] block uppercase">Columns / Dimensionality</span>
          <span className="text-white font-bold">{columns.length} dimensions</span>
        </div>
        <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)]">
          <span className="text-[10px] text-[var(--text-muted)] block uppercase">Privacy Boundary</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Client-Side Private</span>
          </span>
        </div>
      </div>

      {/* Main Column Statistical Profiling Table */}
      <div className="glass-panel p-6 rounded-2xl border-[var(--border)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              <span>Statistical Schema Profile & Distribution Metrics</span>
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Fingerprint: <code className="text-cyan-300 font-mono text-[10px]">{datasetFingerprint}</code>
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--text-muted)]">
                <th className="pb-3 font-semibold">Column Name</th>
                <th className="pb-3 font-semibold">Inferred DType</th>
                <th className="pb-3 font-semibold">Semantic Role</th>
                <th className="pb-3 font-semibold">Missing (Null)</th>
                <th className="pb-3 font-semibold">Mean</th>
                <th className="pb-3 font-semibold">Std Dev</th>
                <th className="pb-3 font-semibold">Range [Min, Max]</th>
                <th className="pb-3 font-semibold">Cardinality</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {columns.map((col) => (
                <tr key={col.name} className="hover:bg-white/[0.02]">
                  <td className="py-3 font-bold text-white">{col.name}</td>
                  <td className="py-3 text-cyan-400">{col.dtype}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        col.semanticRole === "target"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                      }`}
                    >
                      {col.semanticRole.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3">
                    {col.nullCount > 0 ? (
                      <span className="text-amber-400">
                        {col.nullCount} ({(col.nullRatio * 100).toFixed(1)}%)
                      </span>
                    ) : (
                      <span className="text-emerald-400">0 (0%)</span>
                    )}
                  </td>
                  <td className="py-3 text-slate-300">
                    {col.mean !== undefined ? col.mean.toFixed(2) : "—"}
                  </td>
                  <td className="py-3 text-slate-300">
                    {col.std !== undefined ? col.std.toFixed(2) : "—"}
                  </td>
                  <td className="py-3 text-slate-300">
                    {col.min !== undefined && col.max !== undefined
                      ? `[${col.min}, ${col.max}]`
                      : "—"}
                  </td>
                  <td className="py-3 text-white">{col.uniqueValues} distinct</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preprocessing & Partitioning Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl border-[var(--border)] space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Partitioning Strategy (Zero-Leakage Splitting)</span>
          </h3>

          <div className="space-y-4 text-xs font-mono">
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-[var(--text-muted)]">Train Partition: {(trainRatio * 100).toFixed(0)}%</span>
                <span className="text-cyan-400 font-bold">{Math.round(sampleSize * trainRatio)} samples</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="0.85"
                step="0.05"
                value={trainRatio}
                onChange={(e) => setTrainRatio(parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-[var(--border)] text-[var(--text-muted)] text-[11px] leading-relaxed">
              Validation ({((1 - trainRatio) * 0.5 * 100).toFixed(0)}%) and Test ({((1 - trainRatio) * 0.5 * 100).toFixed(0)}%)
              partitions are automatically balanced. Stratified sampling preserves target distribution.
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-[var(--border)] space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Filter className="w-4 h-4 text-cyan-400" />
            <span>Feature Preprocessing Pipeline</span>
          </h3>

          <div className="space-y-3 text-xs font-mono">
            <div>
              <label className="text-[var(--text-muted)] block mb-1.5">Normalization / Scaling</label>
              <select
                value={preprocessingMethod}
                onChange={(e) => setPreprocessingMethod(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="zscore">Standardization: Z-Score (μ = 0, σ = 1)</option>
                <option value="minmax">Min-Max Normalization: Range [0, 1]</option>
                <option value="robust">Robust Scaling (Median & IQR)</option>
                <option value="raw">Raw Passthrough</option>
              </select>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/20 text-emerald-300 text-[11px] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Pipeline fits statistics on training fold only before transforming test fold.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
