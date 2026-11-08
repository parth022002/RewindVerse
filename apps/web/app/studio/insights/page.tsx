"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { runOptimizationSimulation } from "@rewindverse/rewindml";
import { analyzeTraceDiagnostics } from "@rewindverse/diagnostics";
import { AttentionMatrixInspector } from "../../../components/visualization/AttentionMatrixInspector";
import { CnnFeatureMapExplorer } from "../../../components/visualization/CnnFeatureMapExplorer";
import { Sparkles, AlertCircle, Info, CheckCircle2, ArrowRight, Activity, Eye, Grid, Download, FileText } from "lucide-react";

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState<"diagnostics" | "attention" | "cnn">("diagnostics");

  const simulation = useMemo(() => {
    return runOptimizationSimulation({
      objective: "quadratic",
      optimizer: { type: "sgd", learningRate: 0.19 },
      initialPoint: [-4, 4],
      maxSteps: 60,
      seed: 42,
    });
  }, []);

  const report = useMemo(() => {
    return analyzeTraceDiagnostics(simulation.trace);
  }, [simulation]);

  const handleExportReport = () => {
    const md = [
      `# RewindVerse Training Intelligence Report`,
      ``,
      `**Run ID:** \`${report.runId}\`  `,
      `**Generated At:** ${report.generatedAt}  `,
      `**Total Diagnostic Findings:** ${report.totalFindings}  `,
      `**Provenance:** Derived by Deterministic Heuristic Detectors (v1.0.0)  `,
      ``,
      `---`,
      ``,
      `## Executive Summary`,
      ``,
      report.findings.length === 0
        ? `No anomalous training behaviors were detected. Optimization proceeded within standard stability envelopes.`
        : `Detected ${report.totalFindings} notable behavioral patterns during training inspection:`,
      ``,
      ...report.findings.flatMap((f, idx) => [
        `### ${idx + 1}. ${f.title} (${f.severity.toUpperCase()})`,
        `- **Category:** \`${f.category}\``,
        `- **Detector:** ${f.detectorName} (v${f.detectorVersion})`,
        `- **Active Steps:** Steps ${f.stepRange[0]} to ${f.stepRange[1]}`,
        `- **Summary:** ${f.summary}`,
        `- **Observed Evidence:** \`${f.evidenceExplanation}\``,
        `- **Signals Used:** ${f.signalsUsed.map((s) => `\`${s}\``).join(", ")}`,
        `- **Actionable Recommendations:**`,
        ...f.recommendations.map((r) => `  - ${r}`),
        ``,
      ]),
      `---`,
      ``,
      `## Assurance & Provenance Disclosures`,
      `- **Zero Hallucination:** Findings are computed deterministically from recorded metrics without LLM inference.`,
      `- **Data Boundaries:** Traces remain 100% client-side unless explicitly shared via encrypted cloud link.`,
      `- **Conformance:** RewindVerse Trace Specification (RVTS v0.1.0).`,
    ].join("\n");

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rewindverse-intelligence-report-${report.runId || "active"}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-violet-400" />
            Rewind Insights Diagnostic Center
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Evidence-backed heuristic diagnostics and internal model representation inspection.
          </p>
        </div>

        {/* View Tabs & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
            <button
              onClick={() => setActiveTab("diagnostics")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "diagnostics"
                  ? "bg-violet-500/20 border border-violet-500/50 text-violet-300"
                  : "text-[var(--text-muted)] hover:text-white"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              Heuristics
            </button>
            <button
              onClick={() => setActiveTab("attention")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "attention"
                  ? "bg-cyan-500/20 border border-cyan-500/50 text-cyan-300"
                  : "text-[var(--text-muted)] hover:text-white"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Attention Matrix
            </button>
            <button
              onClick={() => setActiveTab("cnn")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "cnn"
                  ? "bg-purple-500/20 border border-purple-500/50 text-purple-300"
                  : "text-[var(--text-muted)] hover:text-white"
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              CNN Feature Maps
            </button>
          </div>

          <button
            onClick={handleExportReport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] hover:border-violet-500/50 text-xs font-medium text-white transition-all shadow-sm"
            title="Download complete Training Intelligence Report (.md)"
          >
            <Download className="w-3.5 h-3.5 text-violet-400" />
            Export Report
          </button>
        </div>
      </div>

      {activeTab === "attention" ? (
        <AttentionMatrixInspector />
      ) : activeTab === "cnn" ? (
        <CnnFeatureMapExplorer />
      ) : (
        <div className="space-y-4">
          {report.findings.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No Diagnostic Anomalies</h3>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Optimization converged smoothly without oscillation or plateauing.
              </p>
            </div>
          ) : (
            report.findings.map((finding) => (
              <div
                key={finding.id}
                className="p-6 rounded-2xl glass-panel glass-card-interactive hover:border-violet-500/50 space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800 text-[10px] font-mono text-amber-300 uppercase">
                        {finding.category}
                      </span>
                      <span className="text-xs text-[var(--text-muted)] font-mono">
                        Detector: {finding.detectorName} v{finding.detectorVersion}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white">{finding.title}</h3>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-violet-950/60 border border-violet-800 text-xs font-mono text-violet-300 shrink-0">
                    Steps {finding.stepRange[0]}–{finding.stepRange[1]}
                  </span>
                </div>

                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  {finding.summary}
                </p>

                {/* Exact Evidence Citation Box */}
                <div className="p-3.5 rounded-xl bg-[var(--background)] border border-[var(--border)] font-mono text-xs text-cyan-300">
                  <span className="text-[10px] uppercase text-[var(--text-muted)] block mb-1">
                    Recorded Evidence
                  </span>
                  {finding.evidenceExplanation}
                </div>

                {/* Actionable Recommendations */}
                <div>
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">
                    Actionable Recommendations:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[var(--text-muted)]">
                    {finding.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-cyan-400 mt-0.5">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

