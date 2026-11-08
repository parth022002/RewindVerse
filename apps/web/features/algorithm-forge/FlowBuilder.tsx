"use client";

import React, { useState, useMemo } from "react";
import {
  Layers,
  GitBranch,
  Play,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  Cpu,
  TrendingDown,
  Sparkles,
  Zap,
} from "lucide-react";
import { ForgeNode, ForgeEdge, AllowlistedOperation } from "@rewindverse/rewindml";

export interface FlowBuilderProps {
  nodes: ForgeNode[];
  edges: ForgeEdge[];
  onNodesChange: (nodes: ForgeNode[]) => void;
  onEdgesChange: (edges: ForgeEdge[]) => void;
}

export function FlowBuilder({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
}: FlowBuilderProps) {
  const [viewMode, setViewMode] = useState<"flowchart" | "dataflow">("flowchart");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(nodes[0]?.id || null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Conceptual Flowchart Lifecycle Stages
  const FLOWCHART_STAGES = [
    { id: "s1", name: "01. Data Batch Intake", desc: "Sample mini-batch or 2D parameter coordinate pair", icon: Database, color: "text-cyan-400" },
    { id: "s2", name: "02. Forward Evaluation", desc: "Evaluate objective function f(x, y) or layer activations", icon: Cpu, color: "text-blue-400" },
    { id: "s3", name: "03. Loss Calculation", desc: "Compute scalar cost & regularization penalty", icon: TrendingDown, color: "text-amber-400" },
    { id: "s4", name: "04. Gradient Backprop", desc: "Calculate analytic gradient vector ∇f(θ_t)", icon: Zap, color: "text-violet-400" },
    { id: "s5", name: "05. Optimizer Update", desc: "Execute custom velocity & momentum update rule", icon: Sparkles, color: "text-purple-400" },
    { id: "s6", name: "06. Convergence Check", desc: "Evaluate stopping criteria (Δloss < ε or ||g|| < threshold)", icon: Layers, color: "text-pink-400" },
    { id: "s7", name: "07. Checkpoint & Trace", desc: "Stream RVTS Step record into local Replay buffer", icon: CheckCircle2, color: "text-emerald-400" },
  ];

  // DAG validation
  const isAcyclic = useMemo(() => {
    // Basic cycle check
    const visited = new Set<string>();
    const recStack = new Set<string>();
    const adj = new Map<string, string[]>();

    nodes.forEach((n) => adj.set(n.id, []));
    edges.forEach((e) => {
      const list = adj.get(e.fromNode);
      if (list) list.push(e.toNode);
    });

    function dfs(nodeId: string): boolean {
      visited.add(nodeId);
      recStack.add(nodeId);
      const neighbors = adj.get(nodeId) || [];
      for (const next of neighbors) {
        if (!visited.has(next)) {
          if (dfs(next)) return true;
        } else if (recStack.has(next)) {
          return true; // Cycle detected
        }
      }
      recStack.delete(nodeId);
      return false;
    }

    for (const n of nodes) {
      if (!visited.has(n.id)) {
        if (dfs(n.id)) return false;
      }
    }
    return true;
  }, [nodes, edges]);

  const handleAddNode = (op: AllowlistedOperation) => {
    const newId = `node_${nodes.length + 1}`;
    const prevNode = nodes[nodes.length - 1];
    const newNode: ForgeNode = {
      id: newId,
      type: "operation",
      label: op.replace(/_/g, " ").toUpperCase(),
      op,
    };
    onNodesChange([...nodes, newNode]);
    if (prevNode) {
      onEdgesChange([
        ...edges,
        {
          id: `edge_${edges.length + 1}`,
          fromNode: prevNode.id,
          fromPort: "out",
          toNode: newId,
          toPort: "in",
        },
      ]);
    }
    setSelectedNodeId(newId);
    setFeedback(`Node "${newId} (${op})" added to computational DAG.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDeleteNode = (id: string) => {
    if (nodes.length <= 1) {
      alert("At least one computational node is required.");
      return;
    }
    onNodesChange(nodes.filter((n) => n.id !== id));
    onEdgesChange(edges.filter((e) => e.fromNode !== id && e.toNode !== id));
    setSelectedNodeId(nodes.find((n) => n.id !== id)?.id || null);
  };

  return (
    <div className="space-y-6">
      {/* View Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            Visual Algorithm Builder & Flowchart
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Toggle between conceptual algorithmic control lifecycle flowcharts and executable data-flow node graphs.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-xs font-semibold">
          <button
            onClick={() => setViewMode("flowchart")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === "flowchart"
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold"
                : "text-[var(--text-muted)] hover:text-white"
            }`}
          >
            A. Conceptual Flowchart
          </button>
          <button
            onClick={() => setViewMode("dataflow")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === "dataflow"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                : "text-[var(--text-muted)] hover:text-white"
            }`}
          >
            B. Executable DAG
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* VIEW A: CONCEPTUAL ALGORITHM FLOWCHART */}
      {viewMode === "flowchart" ? (
        <div className="p-6 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              End-to-End Algorithmic Lifecycle Loop
            </span>
            <span className="text-xs font-mono text-emerald-400">Status: Deterministic Replay Enabled</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {FLOWCHART_STAGES.map((st, idx) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.id}
                  className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-purple-500/40 transition-all space-y-2 relative"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${st.color}`} />
                      <h4 className="text-xs font-bold text-white">{st.name}</h4>
                    </div>
                    {idx < FLOWCHART_STAGES.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 hidden lg:block" />
                    )}
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">{st.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* VIEW B: EXECUTABLE DATA-FLOW DAG */
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 ${
                  isAcyclic
                    ? "bg-emerald-950/60 border border-emerald-800 text-emerald-300"
                    : "bg-red-950/60 border border-red-800 text-red-300"
                }`}
              >
                {isAcyclic ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                {isAcyclic ? "DAG VALIDATED (NO CYCLES)" : "CYCLE DETECTED"}
              </span>
              <span className="text-xs font-mono text-[var(--text-muted)]">{nodes.length} Nodes · {edges.length} Edges</span>
            </div>

            {/* Quick Add Node Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-mono text-[var(--text-muted)] mr-1">Add Operation:</span>
              {["scale", "momentum_update", "clamp", "negate"].map((op) => (
                <button
                  key={op}
                  type="button"
                  onClick={() => handleAddNode(op as AllowlistedOperation)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] hover:border-cyan-500/50 text-[11px] font-mono text-cyan-300 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  {op}
                </button>
              ))}
            </div>
          </div>

          {/* Node Grid Canvas */}
          <div className="p-6 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {nodes.map((n, idx) => {
                const isSelected = selectedNodeId === n.id;
                return (
                  <div
                    key={n.id}
                    onClick={() => setSelectedNodeId(n.id)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? "bg-cyan-950/40 border-cyan-500 text-white shadow-lg shadow-cyan-500/10"
                        : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)] hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-white uppercase">{n.op}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNode(n.id);
                        }}
                        className="text-slate-500 hover:text-red-400 p-1 rounded"
                        title="Delete Node"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-1 text-[11px] font-mono text-[var(--text-muted)]">
                      <div>Node ID: <code className="text-slate-300">{n.id}</code></div>
                      <div>Type: <code className="text-cyan-300">{n.type}</code></div>
                      {n.op && <div>Operation: <code className="text-violet-300">{n.op}</code></div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
