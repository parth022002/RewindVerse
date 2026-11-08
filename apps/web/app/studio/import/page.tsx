"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  parseRvtsTrace,
  parseCsvHeadersAndPreview,
  convertCsvToRvts,
  CsvColumnMapping,
  CsvPreviewResult,
  RvtsParsedTrace,
} from "@rewindverse/rvts";
import { saveRunLocally } from "../../../lib/storage";
import {
  UploadCloud,
  FileCheck,
  AlertTriangle,
  FileText,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  RotateCcw,
  Table,
  Sliders,
  BookmarkPlus,
  Sparkles,
} from "lucide-react";

export default function ImportCenterPage() {
  const router = useRouter();

  // Mode and file state
  const [fileName, setFileName] = useState<string>("");
  const [fileType, setFileType] = useState<"rvtrace" | "csv" | null>(null);
  const [rawText, setRawText] = useState<string>("");

  // Direct RVTS parsing state
  const [rvtsResult, setRvtsResult] = useState<ReturnType<typeof parseRvtsTrace> | null>(null);

  // CSV parsing state
  const [csvPreview, setCsvPreview] = useState<CsvPreviewResult | null>(null);
  const [csvMapping, setCsvMapping] = useState<CsvColumnMapping>({});
  const [convertedTrace, setConvertedTrace] = useState<RvtsParsedTrace | null>(null);
  const [convertedJsonl, setConvertedJsonl] = useState<string>("");
  const [csvErrors, setCsvErrors] = useState<string[]>([]);

  // Feedback
  const [savedRunId, setSavedRunId] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleFile = (content: string, name: string) => {
    setFileName(name);
    setRawText(content);
    setSavedRunId(null);
    setSaveSuccess(false);

    if (name.endsWith(".csv") || content.trim().split("\n")[0].includes(",")) {
      setFileType("csv");
      setRvtsResult(null);

      const preview = parseCsvHeadersAndPreview(content);
      setCsvPreview(preview);
      setCsvMapping(preview.detectedMapping);

      // Auto convert with default detected mapping
      const { trace, jsonl, errors } = convertCsvToRvts(content, preview.detectedMapping);
      setConvertedTrace(trace);
      setConvertedJsonl(jsonl);
      setCsvErrors(errors);
    } else {
      setFileType("rvtrace");
      setCsvPreview(null);
      setConvertedTrace(null);

      const result = parseRvtsTrace(content);
      setRvtsResult(result);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      handleFile(content, file.name);
    };
    reader.readAsText(file);
  };

  const handleLoadSampleTrace = () => {
    const sampleManifest = {
      type: "manifest",
      version: "0.1.0",
      run_id: "sample_transformer_01",
      name: "Mini-Transformer Attention Descent",
      created_at: new Date().toISOString(),
      producer: { name: "RewindVerse Ingestor", version: "1.0.0" },
      model_or_objective: { name: "Cross-Entropy Loss", type: "transformer" },
      hyperparameters: { learning_rate: 0.0003, optimizer: "adamw" },
      declared_capabilities: { has_loss: true, has_parameters: true, step_unit: "step" },
    };

    const lines = [JSON.stringify(sampleManifest)];
    for (let i = 0; i < 40; i++) {
      lines.push(
        JSON.stringify({
          type: "step",
          step: i,
          metrics: { loss: 2.4 * Math.exp(-i * 0.08) + 0.15 },
          parameters: { theta: [0.8 - i * 0.015, -0.4 + i * 0.02] },
        })
      );
    }
    const sampleJsonl = lines.join("\n");
    handleFile(sampleJsonl, "sample_transformer_descent.rvtrace");
  };

  const handleLoadSampleCsv = () => {
    const sampleCsv = `epoch,train_loss,val_loss,lr,accuracy
0,2.45,2.50,0.001,0.22
1,1.98,2.10,0.001,0.38
2,1.52,1.75,0.00095,0.54
3,1.18,1.40,0.00090,0.67
4,0.92,1.15,0.00085,0.76
5,0.73,0.98,0.00080,0.82
6,0.59,0.85,0.00075,0.87
7,0.48,0.76,0.00070,0.91
8,0.40,0.71,0.00065,0.93
9,0.34,0.68,0.00060,0.94`;
    handleFile(sampleCsv, "training_metrics_log.csv");
  };

  const handleRecomputeCsv = (newMapping: CsvColumnMapping) => {
    setCsvMapping(newMapping);
    const { trace, jsonl, errors } = convertCsvToRvts(rawText, newMapping);
    setConvertedTrace(trace);
    setConvertedJsonl(jsonl);
    setCsvErrors(errors);
  };

  const handleSaveToWorkspace = async () => {
    try {
      if (fileType === "rvtrace" && rvtsResult?.trace) {
        const tr = rvtsResult.trace;
        const lastStep = tr.steps[tr.steps.length - 1];
        await saveRunLocally({
          id: tr.manifest.run_id,
          name: tr.manifest.name,
          createdAt: tr.manifest.created_at,
          objective: tr.manifest.model_or_objective?.name || "Imported Trace",
          optimizer: "External Trace",
          stepsCount: tr.steps.length,
          finalLoss: lastStep ? lastStep.metrics?.loss ?? 0 : 0,
          jsonl: rawText,
          trace: tr,
        });
        setSavedRunId(tr.manifest.run_id);
        setSaveSuccess(true);
      } else if (fileType === "csv" && convertedTrace) {
        const tr = convertedTrace;
        const lastStep = tr.steps[tr.steps.length - 1];
        await saveRunLocally({
          id: tr.manifest.run_id,
          name: tr.manifest.name,
          createdAt: tr.manifest.created_at,
          objective: "CSV Metrics Import",
          optimizer: "External Model",
          stepsCount: tr.steps.length,
          finalLoss: lastStep ? lastStep.metrics?.loss ?? 0 : 0,
          jsonl: convertedJsonl,
          trace: tr,
        });
        setSavedRunId(tr.manifest.run_id);
        setSaveSuccess(true);
      }
    } catch (err) {
      console.error("Save to workspace failed:", err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
          <UploadCloud className="w-6 h-6 text-violet-400" />
          Trace & CSV Import Center
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
          Convert external training logs (PyTorch, TensorFlow, Wandb, CSV) into standardized RVTS traces.
        </p>
      </div>

      {/* Upload Dropzone */}
      <div className="p-8 rounded-2xl bg-[var(--surface)] border-2 border-dashed border-[var(--border)] hover:border-violet-500/50 transition-all text-center flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-xl bg-violet-950/60 border border-violet-800/60 flex items-center justify-center text-violet-400 mb-4">
          <UploadCloud className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-white mb-1">
          Select or drop your <code className="text-violet-300">.rvtrace</code> or <code className="text-cyan-300">.csv</code> file
        </h3>
        <p className="text-xs text-[var(--text-muted)] max-w-md mb-6">
          Files are parsed 100% locally in your browser with strict size and memory guards. No data is sent to external servers.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <label className="cursor-pointer px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs font-semibold shadow-md hover:scale-[1.02] transition-transform">
            Browse Local File
            <input
              type="file"
              accept=".rvtrace,.ndjson,.jsonl,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={handleLoadSampleTrace}
            className="px-4 py-2 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] text-white text-xs font-semibold hover:bg-[var(--surface-overlay)] transition-colors"
          >
            Load Sample .rvtrace
          </button>

          <button
            onClick={handleLoadSampleCsv}
            className="px-4 py-2 rounded-lg bg-cyan-950/40 border border-cyan-800/60 text-cyan-300 text-xs font-semibold hover:bg-cyan-900/40 transition-colors"
          >
            Load Sample CSV
          </button>
        </div>
      </div>

      {/* --- CSV Pipeline View --- */}
      {fileType === "csv" && csvPreview && (
        <div className="space-y-5 p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                CSV Ingest Pipeline
              </span>
              <h3 className="text-base font-bold text-white">{fileName}</h3>
              <p className="text-xs text-[var(--text-muted)]">
                {csvPreview.totalLines} recorded rows detected. Map your columns below.
              </p>
            </div>

            {convertedTrace && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveToWorkspace}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
                    saveSuccess
                      ? "bg-emerald-950/80 border-emerald-500 text-emerald-300"
                      : "bg-cyan-950/60 border-cyan-800 text-cyan-300 hover:bg-cyan-900/60"
                  }`}
                >
                  <BookmarkPlus className="w-3.5 h-3.5" />
                  {saveSuccess ? "Saved to Workspace!" : "Save to Workspace"}
                </button>

                {savedRunId && (
                  <Link
                    href={`/studio/replay/${savedRunId}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold hover:shadow-cyan-500/20 shadow-sm"
                  >
                    Open in Replay <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Column Mapping Controls */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">
              Column Mapping
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-white mb-1">
                  Step / Epoch Column
                </label>
                <select
                  value={csvMapping.stepColumn || ""}
                  onChange={(e) =>
                    handleRecomputeCsv({ ...csvMapping, stepColumn: e.target.value })
                  }
                  className="w-full bg-[var(--surface-raised)] border border-[var(--border)] text-xs text-white rounded-lg px-2.5 py-1.5"
                >
                  <option value="">(Auto-increment 0, 1, 2...)</option>
                  {csvPreview.headers.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-white mb-1">
                  Loss Column <span className="text-red-400">*</span>
                </label>
                <select
                  value={csvMapping.lossColumn || ""}
                  onChange={(e) =>
                    handleRecomputeCsv({ ...csvMapping, lossColumn: e.target.value })
                  }
                  className="w-full bg-[var(--surface-raised)] border border-cyan-500/50 text-xs text-white rounded-lg px-2.5 py-1.5"
                >
                  <option value="">(Select loss column)</option>
                  {csvPreview.headers.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-white mb-1">
                  Learning Rate Column
                </label>
                <select
                  value={csvMapping.lrColumn || ""}
                  onChange={(e) =>
                    handleRecomputeCsv({ ...csvMapping, lrColumn: e.target.value })
                  }
                  className="w-full bg-[var(--surface-raised)] border border-[var(--border)] text-xs text-white rounded-lg px-2.5 py-1.5"
                >
                  <option value="">(None)</option>
                  {csvPreview.headers.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-white mb-1">
                  Validation Loss Column
                </label>
                <select
                  value={csvMapping.valLossColumn || ""}
                  onChange={(e) =>
                    handleRecomputeCsv({ ...csvMapping, valLossColumn: e.target.value })
                  }
                  className="w-full bg-[var(--surface-raised)] border border-[var(--border)] text-xs text-white rounded-lg px-2.5 py-1.5"
                >
                  <option value="">(None)</option>
                  {csvPreview.headers.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-white mb-1">
                  Accuracy Column
                </label>
                <select
                  value={csvMapping.accuracyColumn || ""}
                  onChange={(e) =>
                    handleRecomputeCsv({ ...csvMapping, accuracyColumn: e.target.value })
                  }
                  className="w-full bg-[var(--surface-raised)] border border-[var(--border)] text-xs text-white rounded-lg px-2.5 py-1.5"
                >
                  <option value="">(None)</option>
                  {csvPreview.headers.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Raw CSV Data Preview Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
              Preview Data Sample (First 5 Rows)
            </h4>
            <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-black/20">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[var(--surface-raised)] text-[var(--text-muted)] border-b border-[var(--border)]">
                  <tr>
                    {csvPreview.headers.map((h) => (
                      <th key={h} className="px-3 py-2 font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {csvPreview.rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/5">
                      {csvPreview.headers.map((h) => (
                        <td key={h} className="px-3 py-1.5 text-white">
                          {row[h]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fidelity Report for Converted CSV */}
          {convertedTrace && (
            <div className="pt-4 border-t border-[var(--border)] space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                Conversion Successful: Verified RVTS Compatibility
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="p-2.5 rounded-lg bg-black/30 border border-white/10">
                  <span className="text-[10px] text-[var(--text-muted)] block">Valid Steps</span>
                  <span className="font-bold text-white">{convertedTrace.steps.length}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/30 border border-white/10">
                  <span className="text-[10px] text-[var(--text-muted)] block">Loss Metric</span>
                  <span className="text-emerald-400">
                    {convertedTrace.capabilities.has_loss ? "Recorded" : "Missing"}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/30 border border-white/10">
                  <span className="text-[10px] text-[var(--text-muted)] block">Learning Rate</span>
                  <span className="text-cyan-400">
                    {convertedTrace.capabilities.has_learning_rate ? "Recorded" : "None"}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/30 border border-white/10">
                  <span className="text-[10px] text-[var(--text-muted)] block">Evaluation Metric</span>
                  <span className="text-purple-400">
                    {convertedTrace.capabilities.has_validation_loss ? "Val Loss" : "None"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- Native RVTS Trace Validation Results --- */}
      {fileType === "rvtrace" && rvtsResult && (
        <div className="space-y-4">
          <div
            className={`p-5 rounded-2xl border ${
              rvtsResult.trace
                ? "bg-emerald-950/20 border-emerald-800/50"
                : "bg-red-950/20 border-red-800/50"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                {rvtsResult.trace ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                )}
                <h3 className="text-sm font-bold text-white">
                  {rvtsResult.trace
                    ? `Validation Passed: ${fileName}`
                    : `Validation Failed: ${fileName}`}
                </h3>
              </div>

              {rvtsResult.trace && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveToWorkspace}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                      saveSuccess
                        ? "bg-emerald-950/80 border-emerald-500 text-emerald-300"
                        : "bg-cyan-950/60 border-cyan-800 text-cyan-300 hover:bg-cyan-900/60"
                    }`}
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    {saveSuccess ? "Saved to Workspace!" : "Save to Workspace"}
                  </button>

                  {savedRunId && (
                    <Link
                      href={`/studio/replay/${savedRunId}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/30"
                    >
                      Open in Replay Viewer <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Error List */}
            {rvtsResult.errors.length > 0 && (
              <div className="space-y-1 text-xs text-red-300 font-mono mt-2">
                {rvtsResult.errors.map((err, i) => (
                  <div key={i}>• {err}</div>
                ))}
              </div>
            )}

            {/* Import Fidelity Report */}
            {rvtsResult.trace && (
              <div className="space-y-3 mt-4 pt-4 border-t border-emerald-800/40 text-xs">
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
                  Fidelity & Capability Report
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                  <div className="p-2.5 rounded-lg bg-black/30 border border-white/10">
                    <span className="text-[10px] text-[var(--text-muted)] block">Steps</span>
                    <span className="font-bold text-white">{rvtsResult.trace.steps.length}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/30 border border-white/10">
                    <span className="text-[10px] text-[var(--text-muted)] block">Loss</span>
                    <span className="text-emerald-400">
                      {rvtsResult.trace.capabilities.has_loss ? "Recorded" : "Missing"}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/30 border border-white/10">
                    <span className="text-[10px] text-[var(--text-muted)] block">Parameters</span>
                    <span className="text-emerald-400">
                      {rvtsResult.trace.capabilities.has_parameters ? "Recorded" : "Missing"}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/30 border border-white/10">
                    <span className="text-[10px] text-[var(--text-muted)] block">Gradients</span>
                    <span className="text-cyan-400">
                      {rvtsResult.trace.capabilities.has_gradients ? "Recorded" : "None"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
