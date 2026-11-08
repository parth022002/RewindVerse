"use client";

import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { ProvenanceBadge } from "../../components/visualization/ProvenanceBadge";
import {
  Sparkles,
  Layers,
  Box,
  Compass,
  Eye,
  Grid,
  Network,
  Target,
  ArrowRight,
  RotateCcw,
  Sliders,
  CheckCircle2,
} from "lucide-react";

// Dynamic client loads for 3D components
const ThreeSurfaceViewer = dynamic(
  () =>
    import("../../components/visualization/ThreeSurfaceViewer").then(
      (m) => m.ThreeSurfaceViewer
    ),
  { ssr: false }
);

const ThreeDecisionSurfaceViewer = dynamic(
  () =>
    import("../../components/visualization/ThreeDecisionSurfaceViewer").then(
      (m) => m.ThreeDecisionSurfaceViewer
    ),
  { ssr: false }
);

const ThreeNetworkGraphViewer = dynamic(
  () =>
    import("../../components/visualization/ThreeNetworkGraphViewer").then(
      (m) => m.ThreeNetworkGraphViewer
    ),
  { ssr: false }
);

const ThreeEmbeddingProjector = dynamic(
  () =>
    import("../../components/visualization/ThreeEmbeddingProjector").then(
      (m) => m.ThreeEmbeddingProjector
    ),
  { ssr: false }
);

const AttentionMatrixInspector = dynamic(
  () =>
    import("../../components/visualization/AttentionMatrixInspector").then(
      (m) => m.AttentionMatrixInspector
    ),
  { ssr: false }
);

const CnnFeatureMapExplorer = dynamic(
  () =>
    import("../../components/visualization/CnnFeatureMapExplorer").then(
      (m) => m.CnnFeatureMapExplorer
    ),
  { ssr: false }
);

type VisualizerKey =
  | "loss_surface"
  | "decision_surface"
  | "network_graph"
  | "embedding_projector"
  | "attention_matrix"
  | "cnn_features";

interface VisualizerSpec {
  id: VisualizerKey;
  name: string;
  category: "3D Manifold" | "Neural Internals" | "Representation Space";
  provenance: "recorded" | "derived" | "projected" | "sampled" | "illustrative";
  desc: string;
  math: string;
  studioHref: string;
}

const VISUALIZERS: VisualizerSpec[] = [
  {
    id: "loss_surface",
    name: "3D Loss Landscapes & Trajectories",
    category: "3D Manifold",
    provenance: "derived",
    desc: "Analytical height-mapped WebGL meshes evaluating continuous parameter spaces with synchronized optimizer trajectory splines.",
    math: "z = f(θ₁, θ₂) · Quadratic, Rosenbrock & Saddle objectives",
    studioHref: "/studio/lab",
  },
  {
    id: "decision_surface",
    name: "Binary Classifier Decision Surface",
    category: "3D Manifold",
    provenance: "derived",
    desc: "Continuous Sigmoid probability manifold P(y=1)=σ(w·x + b) with floating class markers and translucent 0.5 decision slice.",
    math: "P(y=1) = 1 / (1 + e^{-(w₁x₁ + w₂x₂ + b)})",
    studioHref: "/studio/lab",
  },
  {
    id: "network_graph",
    name: "3D Neural Architecture Inspector",
    category: "Neural Internals",
    provenance: "illustrative",
    desc: "Glassmorphic 3D layer prisms displaying tensor shapes, parameter counts, and pulsating synaptic splines.",
    math: "h^{(l)} = σ(W^{(l)} h^{(l-1)} + b^{(l)})",
    studioHref: "/studio/replay/sample",
  },
  {
    id: "embedding_projector",
    name: "3D PCA Embedding Projector",
    category: "Representation Space",
    provenance: "projected",
    desc: "High-dimensional vector representations reduced to top 3 principal components via deterministic Power Iteration PCA.",
    math: "C = (1/n) X^T X · X_{proj} = X V_k",
    studioHref: "/studio/embeddings",
  },
  {
    id: "attention_matrix",
    name: "Multi-Head Attention Heatmap",
    category: "Neural Internals",
    provenance: "recorded",
    desc: "Interactive Query-Key alignment matrix with explicit Jain & Wallace / Wiegreffe & Pinter non-causality disclosure.",
    math: "Attention(Q, K, V) = softmax(Q K^T / √d_k) V",
    studioHref: "/studio/insights",
  },
  {
    id: "cnn_features",
    name: "CNN Feature Map & Filter Explorer",
    category: "Neural Internals",
    provenance: "derived",
    desc: "3x3 spatial convolutional kernel weights (Sobel, Laplacian) and activation slices showing feature hierarchy.",
    math: "A_{i,j} = ReLU(∑ K_{m,n} X_{i+m, j+n} + b)",
    studioHref: "/studio/insights",
  },
];

export default function VisualizationsPage() {
  const [activeKey, setActiveKey] = useState<VisualizerKey>("loss_surface");
  const activeSpec = VISUALIZERS.find((v) => v.id === activeKey) || VISUALIZERS[0];

  // Dummy 3D loss trajectory for demo
  const sampleTrajectory = [
    { step: 0, x: -3.5, y: 3.0, loss: 48.0 },
    { step: 10, x: -2.0, y: 1.5, loss: 16.0 },
    { step: 20, x: -0.8, y: 0.6, loss: 4.5 },
    { step: 30, x: -0.2, y: 0.1, loss: 0.8 },
    { step: 40, x: 0.0, y: 0.0, loss: 0.02 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] selection:bg-cyan-500 selection:text-black">
      <Navbar />

      <main className="flex-1">
        {/* Header Hero */}
        <section className="relative pt-16 pb-12 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-medium mb-5 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Scientific Representation Suite</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Honest Visualizations. <br />
              <span className="brand-gradient-text">2D Precision & 3D Depth.</span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
              Explore the complete visual catalog. Every 3D scene is backed by a defined mathematical quantity, an explicit data source, and strict provenance labeling.
            </p>
          </div>
        </section>

        {/* Visualizer Catalog Grid Tabs */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 p-2 rounded-2xl glass-panel">
            {VISUALIZERS.map((v) => (
              <button
                key={v.id}
                onClick={() => setActiveKey(v.id)}
                className={`p-3 rounded-xl text-left transition-all flex flex-col justify-between ${
                  activeKey === v.id
                    ? "bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-violet-500/20 border border-cyan-500/50 shadow-md"
                    : "hover:bg-white/5 border border-transparent text-[var(--text-muted)] hover:text-white"
                }`}
              >
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 block mb-1 uppercase tracking-wider">
                    {v.category}
                  </span>
                  <span className="text-xs font-bold text-white leading-tight block">
                    {v.name}
                  </span>
                </div>
                <div className="mt-2.5">
                  <ProvenanceBadge type={v.provenance} />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Active Visualizer Interactive Viewport */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="p-6 sm:p-8 rounded-3xl glass-panel shadow-2xl space-y-6">
            {/* Viewport Info Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <ProvenanceBadge type={activeSpec.provenance} />
                  <span className="text-xs text-[var(--text-muted)] font-mono">
                    Category: {activeSpec.category}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {activeSpec.name}
                </h2>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 max-w-2xl">
                  {activeSpec.desc}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={activeSpec.studioHref}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md hover:scale-[1.02] transition-transform"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Open in Studio
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Live Interactive Scene */}
            <div className="rounded-2xl border border-white/10 bg-black/50 overflow-hidden min-h-[450px] flex items-center justify-center p-2">
              {activeKey === "loss_surface" && (
                <div className="w-full h-full min-h-[440px]">
                  <ThreeSurfaceViewer
                    objectiveType="quadratic"
                    trajectory={sampleTrajectory}
                    currentStepIndex={2}
                    className="w-full h-full min-h-[440px]"
                  />
                </div>
              )}

              {activeKey === "decision_surface" && (
                <div className="w-full h-full min-h-[440px]">
                  <ThreeDecisionSurfaceViewer
                    weights={[1.2, -0.9]}
                    bias={0.1}
                    dataPoints={[
                      { x: -1.5, y: -1.2, label: 0 },
                      { x: -0.8, y: -0.5, label: 0 },
                      { x: -0.2, y: -1.0, label: 0 },
                      { x: 1.2, y: 1.5, label: 1 },
                      { x: 0.9, y: 0.8, label: 1 },
                      { x: 1.8, y: 1.1, label: 1 },
                    ]}
                    epoch={25}
                    loss={0.142}
                    accuracy={0.96}
                  />
                </div>
              )}

              {activeKey === "network_graph" && (
                <div className="w-full h-full min-h-[440px]">
                  <ThreeNetworkGraphViewer
                    layers={[
                      {
                        id: "layer_in",
                        name: "Input Features",
                        type: "input",
                        inputShape: [1, 4],
                        outputShape: [1, 4],
                        paramsCount: 0,
                        activation: "Identity",
                        color: 0x00d2ff,
                      },
                      {
                        id: "layer_dense1",
                        name: "Dense Hidden Block 1",
                        type: "dense",
                        inputShape: [1, 4],
                        outputShape: [1, 8],
                        paramsCount: 40,
                        activation: "ReLU",
                        color: 0x3b82f6,
                      },
                      {
                        id: "layer_dense2",
                        name: "Dense Hidden Block 2",
                        type: "dense",
                        inputShape: [1, 8],
                        outputShape: [1, 6],
                        paramsCount: 54,
                        activation: "ReLU",
                        color: 0x8b5cf6,
                      },
                      {
                        id: "layer_out",
                        name: "Classification Head",
                        type: "output",
                        inputShape: [1, 6],
                        outputShape: [1, 2],
                        paramsCount: 14,
                        activation: "Softmax",
                        color: 0xec4899,
                      },
                    ]}
                  />
                </div>
              )}

              {activeKey === "embedding_projector" && (
                <div className="w-full h-full min-h-[440px]">
                  <ThreeEmbeddingProjector />
                </div>
              )}

              {activeKey === "attention_matrix" && (
                <div className="w-full p-4">
                  <AttentionMatrixInspector />
                </div>
              )}

              {activeKey === "cnn_features" && (
                <div className="w-full p-4">
                  <CnnFeatureMapExplorer />
                </div>
              )}
            </div>

            {/* Formula & Scientific Disclosure */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-black/40 border border-white/5 text-xs text-[var(--text-muted)] font-mono">
              <span className="text-cyan-300">
                Formula: {activeSpec.math}
              </span>
              <span>Hardware: WebGL 2 Acceleration with WebGPU Detection</span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
