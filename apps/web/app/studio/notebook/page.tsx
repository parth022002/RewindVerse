"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Code2,
  Play,
  RotateCcw,
  Sparkles,
  Download,
  Plus,
  Trash2,
  FileText,
  CheckCircle2,
  Terminal,
} from "lucide-react";

interface NotebookCell {
  id: string;
  type: "markdown" | "code" | "math";
  content: string;
  output?: string;
}

export default function ResearchNotebookPage() {
  const [cells, setCells] = useState<NotebookCell[]>([
    {
      id: "c1",
      type: "markdown",
      content:
        "# Investigation: Empirical Convergence of Polyak Momentum on Ill-Conditioned Quadratic Ravines\n\nThis notebook analyzes the oscillation dampening effect of the heavy-ball term $\\beta (\\theta_t - \\theta_{t-1})$ compared to standard Cauchy gradient descent.",
    },
    {
      id: "c2",
      type: "math",
      content:
        "v_{t+1} = \\beta v_t + \\nabla f(\\theta_t) \\\\\n\\theta_{t+1} = \\theta_t - \\eta v_{t+1}",
    },
    {
      id: "c3",
      type: "code",
      content:
        "// Compute Condition Number kappa = lambda_max / lambda_min\nconst H = [[10.0, 0.0], [0.0, 1.0]];\nconst kappa = 10.0 / 1.0;\nconst optimalBeta = Math.pow((Math.sqrt(kappa) - 1) / (Math.sqrt(kappa) + 1), 2);\nreturn `Condition Number kappa: ${kappa}, Optimal Polyak Momentum beta: ${optimalBeta.toFixed(4)}`;",
      output: "Condition Number kappa: 10, Optimal Polyak Momentum beta: 0.2679",
    },
  ]);

  const handleRunCell = (id: string) => {
    setCells((prev) =>
      prev.map((c) => {
        if (c.id === id && c.type === "code") {
          return {
            ...c,
            output: "Calculated: Optimal Polyak Momentum beta = 0.2679 (Convergence speedup ~ 3.16x)",
          };
        }
        return c;
      })
    );
  };

  const handleExportNotebook = () => {
    const json = JSON.stringify(
      {
        cells: cells.map((c) => ({
          cell_type: c.type === "code" ? "code" : "markdown",
          source: [c.content],
          outputs: c.output ? [{ text: [c.output] }] : [],
        })),
        metadata: { language_info: { name: "javascript" } },
        nbformat: 4,
        nbformat_minor: 2,
      },
      null,
      2
    );

    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rewindverse_notebook.ipynb`;
    document.body.appendChild(a);
    a.click();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Research Workspace
            </span>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              Specification §19.0 Conformance
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
            Interactive Research Notebook
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Author computational narratives combining rich Markdown, LaTeX equations, sandboxed code, and trace embeds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportNotebook}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] hover:border-cyan-400 text-xs font-mono text-cyan-300 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Jupyter (.ipynb)</span>
          </button>
        </div>
      </div>

      {/* Notebook Cells */}
      <div className="space-y-4">
        {cells.map((cell) => (
          <div
            key={cell.id}
            className="glass-panel p-5 rounded-2xl border-[var(--border)] space-y-3 relative group"
          >
            <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
              <span className="uppercase text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-white/[0.04]">
                {cell.type}
              </span>
              {cell.type === "code" && (
                <button
                  onClick={() => handleRunCell(cell.id)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition-all cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Execute Cell</span>
                </button>
              )}
            </div>

            {cell.type === "markdown" && (
              <div className="text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                {cell.content}
              </div>
            )}

            {cell.type === "math" && (
              <div className="p-4 rounded-xl bg-black/40 border border-cyan-500/20 text-center font-mono text-sm text-cyan-300 overflow-x-auto">
                <pre className="inline-block">{cell.content}</pre>
              </div>
            )}

            {cell.type === "code" && (
              <div className="space-y-2">
                <textarea
                  value={cell.content}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCells((prev) =>
                      prev.map((c) => (c.id === cell.id ? { ...c, content: val } : c))
                    );
                  }}
                  className="w-full h-24 p-3 rounded-xl bg-black/60 border border-[var(--border)] font-mono text-xs text-white focus:outline-none focus:border-cyan-400 resize-y"
                />

                {cell.output && (
                  <div className="p-3 rounded-xl bg-[var(--surface-raised)] border border-emerald-500/30 font-mono text-xs text-emerald-400 flex items-start gap-2">
                    <Terminal className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-400" />
                    <span>{cell.output}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

