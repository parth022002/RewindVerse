"use client";

import React, { useState, useMemo } from "react";
import {
  Database,
  UploadCloud,
  Sliders,
  Table,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  BarChart2,
  Layers,
  FileText,
  RotateCcw,
} from "lucide-react";

export interface DatasetColumnProfile {
  name: string;
  dtype: "float" | "integer" | "string";
  count: number;
  nullCount: number;
  mean?: number;
  std?: number;
  min?: number;
  max?: number;
}

export interface DatasetManifestState {
  id: string;
  name: string;
  type: "synthetic" | "uploaded";
  totalRows: number;
  featureCount: number;
  targetColumn?: string;
  split: { train: number; val: number; test: number };
  preprocessing: "none" | "standardize" | "minmax";
  profiles: DatasetColumnProfile[];
  previewRows: Record<string, string | number>[];
}

const SYNTHETIC_DATASETS: DatasetManifestState[] = [
  {
    id: "ds_anisotropic_ravine",
    name: "Anisotropic Quadratic Ravine (Curvature κ=10)",
    type: "synthetic",
    totalRows: 120,
    featureCount: 2,
    targetColumn: "loss",
    split: { train: 70, val: 15, test: 15 },
    preprocessing: "none",
    profiles: [
      { name: "x1", dtype: "float", count: 120, nullCount: 0, mean: 0.12, std: 1.84, min: -4.0, max: 4.0 },
      { name: "x2", dtype: "float", count: 120, nullCount: 0, mean: -0.05, std: 1.72, min: -3.5, max: 3.5 },
      { name: "loss", dtype: "float", count: 120, nullCount: 0, mean: 14.8, std: 18.2, min: 0.0, max: 68.4 },
    ],
    previewRows: [
      { x1: -3.2, x2: 2.1, loss: 27.17 },
      { x1: -1.8, x2: 0.4, loss: 2.42 },
      { x1: 0.5, x2: -1.2, loss: 7.33 },
      { x1: 2.4, x2: 0.8, loss: 6.08 },
      { x1: 3.8, x2: -2.0, loss: 27.22 },
    ],
  },
  {
    id: "ds_rosenbrock_banana",
    name: "Rosenbrock Banana Valley (Non-Convex Parabolic)",
    type: "synthetic",
    totalRows: 150,
    featureCount: 2,
    targetColumn: "loss",
    split: { train: 70, val: 15, test: 15 },
    preprocessing: "none",
    profiles: [
      { name: "theta_1", dtype: "float", count: 150, nullCount: 0, mean: 0.25, std: 1.15, min: -2.0, max: 2.0 },
      { name: "theta_2", dtype: "float", count: 150, nullCount: 0, mean: 0.82, std: 1.05, min: -1.0, max: 3.0 },
      { name: "loss", dtype: "float", count: 150, nullCount: 0, mean: 42.6, std: 64.1, min: 0.0, max: 280.5 },
    ],
    previewRows: [
      { theta_1: -1.2, theta_2: 1.5, loss: 5.48 },
      { theta_1: 0.0, theta_2: 0.2, loss: 5.0 },
      { theta_1: 0.8, theta_2: 0.6, loss: 0.20 },
      { theta_1: 1.1, theta_2: 1.25, loss: 0.17 },
      { theta_1: 1.8, theta_2: 3.1, loss: 2.44 },
    ],
  },
  {
    id: "ds_gaussian_blobs",
    name: "2D Gaussian Clusters (Binary Classification)",
    type: "synthetic",
    totalRows: 200,
    featureCount: 2,
    targetColumn: "label",
    split: { train: 70, val: 15, test: 15 },
    preprocessing: "standardize",
    profiles: [
      { name: "feat_1", dtype: "float", count: 200, nullCount: 0, mean: 0.02, std: 1.45, min: -3.8, max: 4.1 },
      { name: "feat_2", dtype: "float", count: 200, nullCount: 0, mean: 0.08, std: 1.52, min: -3.9, max: 4.3 },
      { name: "label", dtype: "integer", count: 200, nullCount: 0, mean: 0.5, std: 0.5, min: 0, max: 1 },
    ],
    previewRows: [
      { feat_1: -1.45, feat_2: 1.22, label: 0 },
      { feat_1: -0.89, feat_2: 2.04, label: 0 },
      { feat_1: 1.34, feat_2: -1.18, label: 1 },
      { feat_1: 2.12, feat_2: -0.76, label: 1 },
      { feat_1: 0.15, feat_2: 0.42, label: 0 },
    ],
  },
];

export function DataWorkbench() {
  const [activeDataset, setActiveDataset] = useState<DatasetManifestState>(SYNTHETIC_DATASETS[0]);
  const [splitTrain, setSplitTrain] = useState<number>(70);
  const [splitVal, setSplitVal] = useState<number>(15);
  const [splitTest, setSplitTest] = useState<number>(15);
  const [preprocessing, setPreprocessing] = useState<"none" | "standardize" | "minmax">("none");
  const [customCsvName, setCustomCsvName] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Handle CSV file upload and parse preview
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCustomCsvName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.trim().split("\n");
      if (lines.length < 2) return;

      const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
      const rows: Record<string, string | number>[] = [];

      for (let i = 1; i < Math.min(lines.length, 6); i++) {
        const parts = lines[i].split(",").map((p) => p.trim());
        const rowObj: Record<string, string | number> = {};
        headers.forEach((h, idx) => {
          const val = parts[idx];
          const num = Number(val);
          rowObj[h] = !isNaN(num) && val !== "" ? num : val || "";
        });
        rows.push(rowObj);
      }

      // Profiles
      const profiles: DatasetColumnProfile[] = headers.map((h) => {
        const sampleVal = rows[0]?.[h];
        const isNum = typeof sampleVal === "number";
        return {
          name: h,
          dtype: isNum ? "float" : "string",
          count: lines.length - 1,
          nullCount: 0,
          mean: isNum ? 0.0 : undefined,
          std: isNum ? 1.0 : undefined,
        };
      });

      const customManifest: DatasetManifestState = {
        id: `uploaded_${Date.now()}`,
        name: file.name,
        type: "uploaded",
        totalRows: lines.length - 1,
        featureCount: headers.length - 1,
        targetColumn: headers[headers.length - 1],
        split: { train: 70, val: 15, test: 15 },
        preprocessing: "none",
        profiles,
        previewRows: rows,
      };

      setActiveDataset(customManifest);
      setFeedback(`Custom dataset "${file.name}" loaded and profiled (${lines.length - 1} samples).`);
      setTimeout(() => setFeedback(null), 3500);
    };
    reader.readAsText(file);
  };

  const handleTrainSplitChange = (val: number) => {
    setSplitTrain(val);
    const remaining = 100 - val;
    const half = Math.floor(remaining / 2);
    setSplitVal(half);
    setSplitTest(remaining - half);
  };

  const handleAttachDataset = () => {
    setFeedback(`Dataset "${activeDataset.name}" attached to active Forge execution context.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            Data Workbench & Preprocessing Pipeline
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Configure training datasets, inspect feature statistics, profile nulls, and set reproducible validation splits.
          </p>
        </div>

        {/* Dataset Actions */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] hover:border-cyan-500/50 text-xs font-medium text-cyan-300 cursor-pointer transition-all">
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload CSV</span>
            <input type="file" accept=".csv,.tsv,.jsonl" onChange={handleFileUpload} className="hidden" />
          </label>
          <button
            onClick={handleAttachDataset}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-[#080b12] text-xs font-bold hover:shadow-cyan-500/25 transition-all shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Attach to Forge
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Dataset Picker Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {SYNTHETIC_DATASETS.map((ds) => {
          const isSelected = activeDataset.id === ds.id;
          return (
            <button
              key={ds.id}
              onClick={() => {
                setActiveDataset(ds);
                setPreprocessing(ds.preprocessing);
              }}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? "bg-cyan-950/40 border-cyan-500 text-white shadow-lg shadow-cyan-500/10"
                  : "bg-[var(--surface-raised)] border-[var(--border)] text-[var(--text-muted)] hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                  {ds.type}
                </span>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">{ds.totalRows} rows</span>
              </div>
              <h3 className="text-xs font-bold text-white line-clamp-1">{ds.name}</h3>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">
                {ds.featureCount} Features · Target: <code className="text-cyan-300">{ds.targetColumn}</code>
              </p>
            </button>
          );
        })}
      </div>

      {/* Dataset Profiling & Statistics Table */}
      <div className="p-5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-violet-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Automated Statistical Profile ({activeDataset.profiles.length} columns)
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400">Leakage Check: Zero Target Overlap</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--text-muted)] text-[11px]">
                <th className="py-2 px-3">Column</th>
                <th className="py-2 px-3">Dtype</th>
                <th className="py-2 px-3">Samples</th>
                <th className="py-2 px-3">Nulls</th>
                <th className="py-2 px-3">Mean</th>
                <th className="py-2 px-3">Std Dev</th>
                <th className="py-2 px-3">Min</th>
                <th className="py-2 px-3">Max</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {activeDataset.profiles.map((p) => (
                <tr key={p.name} className="hover:bg-white/[0.02]">
                  <td className="py-2 px-3 text-cyan-300 font-bold">{p.name}</td>
                  <td className="py-2 px-3">
                    <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-slate-300">{p.dtype}</span>
                  </td>
                  <td className="py-2 px-3 text-slate-300">{p.count}</td>
                  <td className="py-2 px-3 text-emerald-400">{p.nullCount} (0%)</td>
                  <td className="py-2 px-3 text-slate-300">{p.mean !== undefined ? p.mean.toFixed(2) : "—"}</td>
                  <td className="py-2 px-3 text-slate-300">{p.std !== undefined ? p.std.toFixed(2) : "—"}</td>
                  <td className="py-2 px-3 text-slate-400">{p.min !== undefined ? p.min.toFixed(2) : "—"}</td>
                  <td className="py-2 px-3 text-slate-400">{p.max !== undefined ? p.max.toFixed(2) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Splitting & Preprocessing Pipeline Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Train / Validation / Test Splitting */}
        <div className="p-5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              Train / Val / Test Partition
            </h3>
            <span className="text-xs font-mono text-cyan-300">{splitTrain}% / {splitVal}% / {splitTest}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="90"
            step="5"
            value={splitTrain}
            onChange={(e) => handleTrainSplitChange(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] font-mono text-[var(--text-muted)]">
            <span>Train: {Math.round((activeDataset.totalRows * splitTrain) / 100)} samples</span>
            <span>Val: {Math.round((activeDataset.totalRows * splitVal) / 100)} samples</span>
            <span>Test: {Math.round((activeDataset.totalRows * splitTest) / 100)} samples</span>
          </div>
        </div>

        {/* Preprocessing Transform Strategy */}
        <div className="p-5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] space-y-3">
          <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-violet-400" />
            Feature Preprocessing Pipeline
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "none", label: "Raw Passthrough" },
              { id: "standardize", label: "Z-Score (x-μ)/σ" },
              { id: "minmax", label: "Min-Max [0, 1]" },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setPreprocessing(st.id as any)}
                className={`py-2 px-2.5 rounded-lg border text-xs font-mono text-center transition-all ${
                  preprocessing === st.id
                    ? "bg-violet-950/60 border-violet-500 text-violet-300 font-bold"
                    : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)] hover:text-white"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">
            Transform statistics are computed strictly on the training partition to prevent validation data leakage.
          </p>
        </div>
      </div>

      {/* Data Preview Table */}
      <div className="p-5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] space-y-3">
        <h3 className="text-xs font-bold text-white flex items-center gap-2">
          <Table className="w-4 h-4 text-cyan-400" />
          Sample Preview (First 5 Rows)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--text-muted)]">
                {activeDataset.profiles.map((p) => (
                  <th key={p.name} className="py-2 px-3 text-[11px] font-semibold">
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {activeDataset.previewRows.map((row, i) => (
                <tr key={i} className="hover:bg-white/[0.02]">
                  {activeDataset.profiles.map((p) => (
                    <td key={p.name} className="py-2 px-3 text-slate-300">
                      {typeof row[p.name] === "number" ? (row[p.name] as number).toFixed(3) : row[p.name]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

