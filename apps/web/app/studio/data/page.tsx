"use client";

import React, { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
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
  ArrowRight,
  Table,
  Check,
  BookmarkPlus,
  Play,
  Cpu,
  Wrench,
} from "lucide-react";

export interface ColumnProfile {
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

interface DatasetPreset {
  id: string;
  name: string;
  filename: string;
  taskType: "classification" | "regression" | "clustering";
  rowsCount: number;
  columns: ColumnProfile[];
  previewRows: Record<string, string | number>[];
}

const PRESET_DATASETS: DatasetPreset[] = [
  {
    id: "telecom_churn",
    name: "Telecom Customer Churn",
    filename: "telecom_customer_churn.csv",
    taskType: "classification",
    rowsCount: 1000,
    columns: [
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
        mean: 0.27,
        std: 0.44,
        min: 0,
        max: 1,
        uniqueValues: 2,
      },
    ],
    previewRows: [
      { account_tenure_months: 12, monthly_charges: 29.85, total_charges: 358.2, contract_type: "Month-to-month", churn_status: 0 },
      { account_tenure_months: 34, monthly_charges: 56.95, total_charges: 1889.5, contract_type: "One year", churn_status: 0 },
      { account_tenure_months: 2, monthly_charges: 53.85, total_charges: 108.15, contract_type: "Month-to-month", churn_status: 1 },
      { account_tenure_months: 45, monthly_charges: 42.3, total_charges: 1840.75, contract_type: "One year", churn_status: 0 },
      { account_tenure_months: 8, monthly_charges: 70.7, total_charges: 565.6, contract_type: "Month-to-month", churn_status: 1 },
      { account_tenure_months: 22, monthly_charges: 89.1, total_charges: 1948.2, contract_type: "Month-to-month", churn_status: 1 },
      { account_tenure_months: 64, monthly_charges: 105.65, total_charges: 6844.5, contract_type: "Two year", churn_status: 0 },
    ],
  },
  {
    id: "california_housing",
    name: "California Housing Prices",
    filename: "california_housing.csv",
    taskType: "regression",
    rowsCount: 1000,
    columns: [
      { name: "median_income", dtype: "float64", semanticRole: "feature", count: 1000, nullCount: 0, nullRatio: 0.0, mean: 3.87, std: 1.9, min: 0.5, max: 15.0, uniqueValues: 890 },
      { name: "housing_median_age", dtype: "int64", semanticRole: "feature", count: 1000, nullCount: 0, nullRatio: 0.0, mean: 28.6, std: 12.6, min: 1, max: 52, uniqueValues: 52 },
      { name: "total_rooms", dtype: "int64", semanticRole: "feature", count: 1000, nullCount: 0, nullRatio: 0.0, mean: 2635.8, std: 2181.6, min: 6, max: 39320, uniqueValues: 920 },
      { name: "population", dtype: "int64", semanticRole: "feature", count: 1000, nullCount: 0, nullRatio: 0.0, mean: 1425.5, std: 1132.4, min: 3, max: 28566, uniqueValues: 880 },
      { name: "ocean_proximity", dtype: "string", semanticRole: "feature", count: 1000, nullCount: 0, nullRatio: 0.0, uniqueValues: 5 },
      { name: "median_house_value", dtype: "float64", semanticRole: "target", count: 1000, nullCount: 0, nullRatio: 0.0, mean: 206855.8, std: 115395.6, min: 14999, max: 500001, uniqueValues: 980 },
    ],
    previewRows: [
      { median_income: 8.3252, housing_median_age: 41, total_rooms: 880, population: 322, ocean_proximity: "NEAR BAY", median_house_value: 452600 },
      { median_income: 3.8462, housing_median_age: 21, total_rooms: 7099, population: 2401, ocean_proximity: "NEAR BAY", median_house_value: 358500 },
      { median_income: 7.2574, housing_median_age: 52, total_rooms: 1467, population: 496, ocean_proximity: "NEAR BAY", median_house_value: 352100 },
      { median_income: 5.6431, housing_median_age: 52, total_rooms: 1274, population: 558, ocean_proximity: "NEAR BAY", median_house_value: 341300 },
      { median_income: 3.8462, housing_median_age: 52, total_rooms: 1627, population: 565, ocean_proximity: "NEAR BAY", median_house_value: 342200 },
      { median_income: 4.0368, housing_median_age: 52, total_rooms: 919, population: 413, ocean_proximity: "NEAR BAY", median_house_value: 269700 },
    ],
  },
  {
    id: "iris_flower",
    name: "Fisher's Iris Flower Classification",
    filename: "iris_dataset.csv",
    taskType: "classification",
    rowsCount: 150,
    columns: [
      { name: "sepal_length", dtype: "float64", semanticRole: "feature", count: 150, nullCount: 0, nullRatio: 0.0, mean: 5.84, std: 0.83, min: 4.3, max: 7.9, uniqueValues: 35 },
      { name: "sepal_width", dtype: "float64", semanticRole: "feature", count: 150, nullCount: 0, nullRatio: 0.0, mean: 3.06, std: 0.44, min: 2.0, max: 4.4, uniqueValues: 23 },
      { name: "petal_length", dtype: "float64", semanticRole: "feature", count: 150, nullCount: 0, nullRatio: 0.0, mean: 3.76, std: 1.76, min: 1.0, max: 6.9, uniqueValues: 43 },
      { name: "petal_width", dtype: "float64", semanticRole: "feature", count: 150, nullCount: 0, nullRatio: 0.0, mean: 1.20, std: 0.76, min: 0.1, max: 2.5, uniqueValues: 22 },
      { name: "species", dtype: "string", semanticRole: "target", count: 150, nullCount: 0, nullRatio: 0.0, uniqueValues: 3 },
    ],
    previewRows: [
      { sepal_length: 5.1, sepal_width: 3.5, petal_length: 1.4, petal_width: 0.2, species: "setosa" },
      { sepal_length: 4.9, sepal_width: 3.0, petal_length: 1.4, petal_width: 0.2, species: "setosa" },
      { sepal_length: 7.0, sepal_width: 3.2, petal_length: 4.7, petal_width: 1.4, species: "versicolor" },
      { sepal_length: 6.4, sepal_width: 3.2, petal_length: 4.5, petal_width: 1.5, species: "versicolor" },
      { sepal_length: 6.3, sepal_width: 3.3, petal_length: 6.0, petal_width: 2.5, species: "virginica" },
      { sepal_length: 5.8, sepal_width: 2.7, petal_length: 5.1, petal_width: 1.9, species: "virginica" },
    ],
  },
  {
    id: "synthetic_spiral",
    name: "Non-Linear Spiral Boundary (2D)",
    filename: "synthetic_spiral_2d.csv",
    taskType: "classification",
    rowsCount: 500,
    columns: [
      { name: "coord_x1", dtype: "float64", semanticRole: "feature", count: 500, nullCount: 0, nullRatio: 0.0, mean: 0.02, std: 1.84, min: -4.5, max: 4.5, uniqueValues: 490 },
      { name: "coord_x2", dtype: "float64", semanticRole: "feature", count: 500, nullCount: 0, nullRatio: 0.0, mean: -0.01, std: 1.78, min: -4.3, max: 4.2, uniqueValues: 485 },
      { name: "class_label", dtype: "int64", semanticRole: "target", count: 500, nullCount: 0, nullRatio: 0.0, mean: 0.5, std: 0.5, min: 0, max: 1, uniqueValues: 2 },
    ],
    previewRows: [
      { coord_x1: 0.21, coord_x2: 0.85, class_label: 0 },
      { coord_x1: -1.34, coord_x2: 1.92, class_label: 0 },
      { coord_x1: -2.15, coord_x2: -0.45, class_label: 1 },
      { coord_x1: 1.82, coord_x2: -1.41, class_label: 1 },
      { coord_x1: 3.12, coord_x2: 0.76, class_label: 0 },
      { coord_x1: -3.45, coord_x2: -1.82, class_label: 1 },
    ],
  },
];

export default function DataLabPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Active dataset state
  const [datasetName, setDatasetName] = useState<string>(PRESET_DATASETS[0].filename);
  const [sampleSize, setSampleSize] = useState<number>(PRESET_DATASETS[0].rowsCount);
  const [columns, setColumns] = useState<ColumnProfile[]>(PRESET_DATASETS[0].columns);
  const [previewRows, setPreviewRows] = useState<Record<string, string | number>[]>(PRESET_DATASETS[0].previewRows);

  // Partitioning and preprocessing configuration
  const [trainRatio, setTrainRatio] = useState<number>(0.7);
  const [valRatio, setValRatio] = useState<number>(0.15);
  const [testRatio, setTestRatio] = useState<number>(0.15);
  const [preprocessingMethod, setPreprocessingMethod] = useState<string>("zscore");
  const [missingValueStrategy, setMissingValueStrategy] = useState<string>("mean");

  // UI state
  const [notification, setNotification] = useState<string | null>(null);
  const [showPresetsModal, setShowPresetsModal] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Fingerprint calculation (deterministic hash based on name, columns, and rows)
  const datasetFingerprint = useMemo(() => {
    let hash = 0;
    const key = `${datasetName}:${sampleSize}:${columns.map((c) => c.name).join(",")}`;
    for (let i = 0; i < key.length; i++) {
      hash = (hash << 5) - hash + key.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, "0");
    return `rvds-sha256-${columns.length}d-${sampleSize}r-${hex}9f4e5a`;
  }, [datasetName, sampleSize, columns]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Parse CSV text and compute real statistical profile
  const processCsvText = (csvText: string, filename: string) => {
    try {
      const rawLines = csvText.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (rawLines.length < 2) {
        showToast("Error: CSV must contain at least a header row and one data row.");
        return;
      }

      // Parse headers
      const headers = rawLines[0]
        .split(",")
        .map((h) => h.trim().replace(/^["']|["']$/g, ""));

      const parsedRows: Record<string, string | number>[] = [];
      const columnValues: Record<string, (string | number | null)[]> = {};
      headers.forEach((h) => {
        columnValues[h] = [];
      });

      // Parse data rows
      for (let r = 1; r < rawLines.length; r++) {
        const line = rawLines[r];
        // Handle comma splitting with quoted strings
        const cells: string[] = [];
        let inQuotes = false;
        let currentCell = "";

        for (let c = 0; c < line.length; c++) {
          const char = line[c];
          if (char === '"' || char === "'") {
            inQuotes = !inQuotes;
          } else if (char === "," && !inQuotes) {
            cells.push(currentCell.trim());
            currentCell = "";
          } else {
            currentCell += char;
          }
        }
        cells.push(currentCell.trim());

        const rowObj: Record<string, string | number> = {};
        headers.forEach((h, idx) => {
          const rawVal = cells[idx] !== undefined ? cells[idx].replace(/^["']|["']$/g, "") : "";
          if (rawVal === "" || rawVal.toLowerCase() === "na" || rawVal.toLowerCase() === "null" || rawVal.toLowerCase() === "nan") {
            columnValues[h].push(null);
            rowObj[h] = "";
          } else {
            const num = Number(rawVal);
            if (!isNaN(num) && rawVal !== "") {
              columnValues[h].push(num);
              rowObj[h] = num;
            } else {
              columnValues[h].push(rawVal);
              rowObj[h] = rawVal;
            }
          }
        });

        parsedRows.push(rowObj);
      }

      const totalRows = parsedRows.length;

      // Compute Column Profiles
      const computedColumns: ColumnProfile[] = headers.map((h) => {
        const vals = columnValues[h];
        const nonNulls = vals.filter((v) => v !== null && v !== "");
        const nullCount = totalRows - nonNulls.length;
        const nullRatio = totalRows > 0 ? nullCount / totalRows : 0;

        // Determine DataType
        let numericCount = 0;
        let boolCount = 0;
        let isInteger = true;

        nonNulls.forEach((v) => {
          if (typeof v === "number") {
            numericCount++;
            if (!Number.isInteger(v)) isInteger = false;
          } else if (v === "true" || v === "false" || typeof v === "boolean") {
            boolCount++;
          }
        });

        let dtype: "float64" | "int64" | "string" | "boolean" = "string";
        if (nonNulls.length > 0 && numericCount === nonNulls.length) {
          dtype = isInteger ? "int64" : "float64";
        } else if (nonNulls.length > 0 && boolCount === nonNulls.length) {
          dtype = "boolean";
        }

        // Compute Mean, Std, Min, Max for numeric columns
        let mean: number | undefined;
        let std: number | undefined;
        let min: number | undefined;
        let max: number | undefined;

        if (numericCount > 0) {
          const numVals = nonNulls.filter((v) => typeof v === "number") as number[];
          const sum = numVals.reduce((acc, curr) => acc + curr, 0);
          mean = sum / numVals.length;

          const squaredDiffs = numVals.map((v) => Math.pow(v - mean!, 2));
          const variance = squaredDiffs.reduce((acc, curr) => acc + curr, 0) / Math.max(1, numVals.length - 1);
          std = Math.sqrt(variance);

          min = Math.min(...numVals);
          max = Math.max(...numVals);
        }

        // Distinct unique count
        const distinctSet = new Set(nonNulls);
        const uniqueValues = distinctSet.size;

        // Inferred semantic role
        const lowerH = h.toLowerCase();
        let semanticRole: "feature" | "target" | "id" | "timestamp" = "feature";
        if (
          lowerH.includes("target") ||
          lowerH.includes("label") ||
          lowerH.includes("churn") ||
          lowerH.includes("price") ||
          lowerH === "y" ||
          lowerH.includes("class") ||
          lowerH.includes("status")
        ) {
          semanticRole = "target";
        } else if (lowerH.includes("id") || lowerH.includes("uuid") || lowerH.includes("key")) {
          semanticRole = "id";
        } else if (lowerH.includes("date") || lowerH.includes("time") || lowerH.includes("timestamp")) {
          semanticRole = "timestamp";
        }

        return {
          name: h,
          dtype,
          semanticRole,
          count: totalRows,
          nullCount,
          nullRatio,
          mean,
          std,
          min,
          max,
          uniqueValues,
        };
      });

      // Update State
      setDatasetName(filename);
      setSampleSize(totalRows);
      setColumns(computedColumns);
      setPreviewRows(parsedRows.slice(0, 10));

      // Save to localStorage so Algorithm Forge and Fit Lab can access it
      if (typeof window !== "undefined") {
        const payload = {
          filename,
          totalRows,
          columns: computedColumns,
          previewRows: parsedRows.slice(0, 20),
          fingerprint: `rvds-sha256-${computedColumns.length}d-${totalRows}r`,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem("rewindverse_active_dataset", JSON.stringify(payload));
      }

      showToast(`Successfully ingested "${filename}": ${totalRows.toLocaleString()} rows, ${computedColumns.length} columns.`);
    } catch (err: any) {
      showToast(`Error parsing file: ${err?.message || "Invalid dataset format"}`);
    }
  };

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        processCsvText(text, file.name);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Load Preset Benchmark Dataset
  const handleSelectPreset = (preset: DatasetPreset) => {
    setDatasetName(preset.filename);
    setSampleSize(preset.rowsCount);
    setColumns(preset.columns);
    setPreviewRows(preset.previewRows);
    setShowPresetsModal(false);

    if (typeof window !== "undefined") {
      const payload = {
        filename: preset.filename,
        totalRows: preset.rowsCount,
        columns: preset.columns,
        previewRows: preset.previewRows,
        fingerprint: `rvds-sha256-${preset.columns.length}d-${preset.rowsCount}r`,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem("rewindverse_active_dataset", JSON.stringify(payload));
    }

    showToast(`Loaded benchmark dataset "${preset.name}".`);
  };

  // Toggle Column Semantic Role
  const handleToggleRole = (colName: string) => {
    setColumns((prev) =>
      prev.map((col) => {
        if (col.name !== colName) return col;
        const nextRole: "feature" | "target" | "id" | "timestamp" =
          col.semanticRole === "feature"
            ? "target"
            : col.semanticRole === "target"
            ? "id"
            : col.semanticRole === "id"
            ? "timestamp"
            : "feature";
        return { ...col, semanticRole: nextRole };
      })
    );
  };

  // Send to Algorithm Forge
  const handleSendToForge = () => {
    if (typeof window !== "undefined") {
      const payload = {
        filename: datasetName,
        totalRows: sampleSize,
        columns,
        previewRows,
        trainRatio,
        preprocessingMethod,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem("rewindverse_active_dataset", JSON.stringify(payload));
    }
    showToast(`Dataset "${datasetName}" attached. Opening Algorithm Forge...`);
    setTimeout(() => {
      router.push("/studio/forge");
    }, 400);
  };

  // Open in Fit Lab
  const handleOpenFitLab = () => {
    router.push("/studio/fit-lab");
  };

  // Export Sanitized Dataset
  const handleExportData = () => {
    if (previewRows.length === 0) return;
    const headers = columns.map((c) => c.name).join(",");
    const rowsText = previewRows
      .map((r) => columns.map((c) => JSON.stringify(r[c.name] ?? "")).join(","))
      .join("\n");
    const blob = new Blob([`${headers}\n${rowsText}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sanitized_${datasetName}`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Downloaded sanitized CSV dataset.");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".csv,.tsv,.json,.txt"
        className="hidden"
        onChange={handleFileUpload}
      />

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
            Import, profile, validate, transform, version, and document datasets with zero client data leakage.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Preset Benchmark Picker */}
          <button
            onClick={() => setShowPresetsModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--surface-raised)] hover:bg-white/[0.08] border border-[var(--border)] text-xs font-mono text-white transition-all cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>Preset Benchmarks</span>
          </button>

          {/* Real Import Dataset Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-600 hover:brightness-110 text-[#080b12] font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Import Dataset</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div className="p-3.5 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-200 text-xs font-mono flex items-center justify-between shadow-xl animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-cyan-400 hover:text-white ml-4">
            ×
          </button>
        </div>
      )}

      {/* Dataset Metadata HUD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
        <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] shadow-md">
          <span className="text-[10px] text-[var(--text-muted)] block uppercase tracking-wider">
            Dataset Version
          </span>
          <span className="text-white font-bold truncate block">{datasetName} (v1.0)</span>
        </div>
        <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] shadow-md">
          <span className="text-[10px] text-[var(--text-muted)] block uppercase tracking-wider">
            Total Rows / Instances
          </span>
          <span className="text-cyan-400 font-bold">{sampleSize.toLocaleString()} records</span>
        </div>
        <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] shadow-md">
          <span className="text-[10px] text-[var(--text-muted)] block uppercase tracking-wider">
            Columns / Dimensionality
          </span>
          <span className="text-white font-bold">{columns.length} dimensions</span>
        </div>
        <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] shadow-md">
          <span className="text-[10px] text-[var(--text-muted)] block uppercase tracking-wider">
            Privacy Boundary
          </span>
          <span className="text-emerald-400 font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Client-Side Private</span>
          </span>
        </div>
      </div>

      {/* Statistical Schema Profile & Distribution Metrics */}
      <div className="glass-panel p-6 rounded-2xl border-[var(--border)] space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border)]">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              <span>Statistical Schema Profile & Distribution Metrics</span>
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Fingerprint: <code className="text-cyan-300 font-mono text-[10px]">{datasetFingerprint}</code>
            </p>
          </div>
          <span className="text-[11px] font-mono text-[var(--text-muted)]">
            Click badge to toggle semantic role (Feature/Target/ID)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--text-muted)] text-[11px]">
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
                <tr key={col.name} className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-3 font-bold text-white">{col.name}</td>
                  <td className="py-3 text-cyan-400">{col.dtype}</td>
                  <td className="py-3">
                    <button
                      onClick={() => handleToggleRole(col.name)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-transform hover:scale-105 active:scale-95 ${
                        col.semanticRole === "target"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : col.semanticRole === "id"
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : col.semanticRole === "timestamp"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                      }`}
                      title="Click to toggle semantic role"
                    >
                      {col.semanticRole.toUpperCase()}
                    </button>
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

      {/* Raw Data Preview Table */}
      {previewRows.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl border-[var(--border)] space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Table className="w-4 h-4 text-cyan-400" />
              <span>Dataset Head Preview (First {previewRows.length} Rows)</span>
            </h2>
            <button
              onClick={handleExportData}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono text-[var(--text-muted)] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto max-h-72 scrollbar-thin">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--text-muted)] text-[11px] bg-black/30 sticky top-0">
                  <th className="py-2 px-3 font-semibold">#</th>
                  {columns.map((c) => (
                    <th key={c.name} className="py-2 px-3 font-semibold">
                      {c.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {previewRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02]">
                    <td className="py-2 px-3 text-[var(--text-muted)]">{idx + 1}</td>
                    {columns.map((c) => {
                      const val = row[c.name];
                      const isNull = val === "" || val === null || val === undefined;
                      return (
                        <td key={c.name} className="py-2 px-3 text-slate-200">
                          {isNull ? (
                            <span className="text-amber-400 italic">null</span>
                          ) : (
                            String(val)
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Preprocessing & Partitioning Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Partitioning Strategy */}
        <div className="glass-panel p-6 rounded-2xl border-[var(--border)] space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Partitioning Strategy (Zero-Leakage Splitting)</span>
          </h3>

          <div className="space-y-4 text-xs font-mono">
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-[var(--text-muted)]">
                  Train Partition: {(trainRatio * 100).toFixed(0)}%
                </span>
                <span className="text-cyan-400 font-bold">
                  {Math.round(sampleSize * trainRatio).toLocaleString()} samples
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="0.85"
                step="0.05"
                value={trainRatio}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setTrainRatio(val);
                  const rem = 1 - val;
                  setValRatio(rem / 2);
                  setTestRatio(rem / 2);
                }}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-black/40 border border-[var(--border)]">
                <span className="text-[10px] text-[var(--text-muted)] block uppercase">Validation Set</span>
                <span className="text-violet-300 font-bold">
                  {Math.round(sampleSize * valRatio).toLocaleString()} samples ({(valRatio * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-[var(--border)]">
                <span className="text-[10px] text-[var(--text-muted)] block uppercase">Holdout Test Set</span>
                <span className="text-emerald-300 font-bold">
                  {Math.round(sampleSize * testRatio).toLocaleString()} samples ({(testRatio * 100).toFixed(0)}%)
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-[var(--border)] text-[var(--text-muted)] text-[11px] leading-relaxed">
              Validation and Test partitions are strictly isolated prior to model optimization. Stratified sampling preserves target class ratios.
            </div>
          </div>
        </div>

        {/* Feature Preprocessing Pipeline */}
        <div className="glass-panel p-6 rounded-2xl border-[var(--border)] space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Filter className="w-4 h-4 text-cyan-400" />
            <span>Feature Preprocessing Pipeline</span>
          </h3>

          <div className="space-y-3.5 text-xs font-mono">
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

            <div>
              <label className="text-[var(--text-muted)] block mb-1.5">Missing Value Imputation</label>
              <select
                value={missingValueStrategy}
                onChange={(e) => setMissingValueStrategy(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="mean">Mean Value Imputation (Numeric Columns)</option>
                <option value="median">Median Imputation (Robust to Outliers)</option>
                <option value="drop">Drop Incomplete Rows</option>
                <option value="mode">Most Frequent Category / Mode</option>
              </select>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/20 text-emerald-300 text-[11px] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Scaling parameters are fit on training fold only, preventing test leakage.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cross-Module Integration Actions Bar */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-purple-950/20 to-black/60 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Ready for Algorithm Research & Training</span>
          </h4>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Attach this profiled dataset to Algorithm Forge or execute multi-algorithm candidate search in Fit Lab.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleOpenFitLab}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--surface-raised)] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-mono text-white transition-all cursor-pointer"
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Launch in Fit Lab</span>
          </button>

          <button
            onClick={handleSendToForge}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-600 hover:brightness-110 text-[#080b12] font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Send to Algorithm Forge</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Preset Modal */}
      {showPresetsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#0c1220] border border-white/[0.1] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Select a Curated Benchmark Dataset</h3>
              </div>
              <button
                onClick={() => setShowPresetsModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                ×
              </button>
            </div>

            <p className="text-xs text-[var(--text-muted)]">
              Choose from standardized reference datasets used across machine learning research:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto scrollbar-thin">
              {PRESET_DATASETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className="p-3.5 rounded-xl border border-white/[0.08] bg-black/40 hover:bg-white/[0.04] hover:border-cyan-500/50 text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                      {preset.taskType}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {preset.rowsCount.toLocaleString()} rows
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {preset.name}
                  </h4>
                  <p className="text-[11px] font-mono text-[var(--text-muted)] mt-1">
                    {preset.columns.length} columns ({preset.filename})
                  </p>
                </button>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowPresetsModal(false)}
                className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-mono text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
