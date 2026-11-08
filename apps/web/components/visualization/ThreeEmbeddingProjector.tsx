"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RotateCcw, AlertTriangle, Sparkles, Filter, Info } from "lucide-react";
import { ProvenanceBadge } from "./ProvenanceBadge";

export interface EmbeddingItem {
  id: string;
  label: string;
  category: "optimizer" | "loss" | "architecture" | "metric";
  vector: number[]; // high-dimensional vector (e.g. 8D)
}

// Built-in synthetic high-dimensional semantic vectors
const DEFAULT_EMBEDDINGS: EmbeddingItem[] = [
  // Optimizers
  { id: "e1", label: "SGD (Standard)", category: "optimizer", vector: [1.2, 0.8, -0.4, 0.2, 0.9, -0.1, 0.3, 0.5] },
  { id: "e2", label: "SGD + Momentum", category: "optimizer", vector: [1.4, 0.9, -0.3, 0.4, 1.1, -0.2, 0.4, 0.6] },
  { id: "e3", label: "Nesterov Accelerated", category: "optimizer", vector: [1.5, 1.0, -0.2, 0.5, 1.2, -0.1, 0.3, 0.7] },
  { id: "e4", label: "Adam", category: "optimizer", vector: [1.8, 1.4, -0.1, 0.9, 1.5, 0.2, 0.7, 0.9] },
  { id: "e5", label: "AdamW", category: "optimizer", vector: [1.9, 1.5, -0.1, 0.9, 1.6, 0.3, 0.8, 0.9] },
  { id: "e6", label: "RMSprop", category: "optimizer", vector: [1.6, 1.2, -0.2, 0.7, 1.3, 0.1, 0.6, 0.8] },

  // Loss Functions
  { id: "e7", label: "MSE Loss", category: "loss", vector: [-1.1, 1.4, 1.2, -0.5, 0.2, 0.9, -0.4, 0.1] },
  { id: "e8", label: "MAE (L1) Loss", category: "loss", vector: [-1.0, 1.2, 1.4, -0.6, 0.1, 0.8, -0.5, 0.0] },
  { id: "e9", label: "Cross-Entropy", category: "loss", vector: [-1.4, 1.7, 0.9, -0.3, 0.3, 1.1, -0.3, 0.3] },
  { id: "e10", label: "Binary Cross-Entropy", category: "loss", vector: [-1.3, 1.6, 0.8, -0.4, 0.2, 1.0, -0.4, 0.2] },
  { id: "e11", label: "Huber Loss", category: "loss", vector: [-0.9, 1.3, 1.3, -0.5, 0.2, 0.8, -0.4, 0.1] },

  // Architectures
  { id: "e12", label: "Linear Perceptron", category: "architecture", vector: [0.2, -1.2, 1.5, 1.1, -0.8, 0.2, 1.4, -0.6] },
  { id: "e13", label: "Multi-Layer Perceptron", category: "architecture", vector: [0.5, -1.4, 1.6, 1.3, -0.7, 0.4, 1.5, -0.5] },
  { id: "e14", label: "ResNet Residual Block", category: "architecture", vector: [0.8, -1.6, 1.8, 1.5, -0.5, 0.6, 1.8, -0.3] },
  { id: "e15", label: "Transformer Self-Attention", category: "architecture", vector: [1.1, -1.9, 1.9, 1.8, -0.3, 0.9, 2.1, -0.1] },

  // Metrics
  { id: "e16", label: "Validation Accuracy", category: "metric", vector: [-0.4, -0.5, -1.5, -1.2, 1.2, -1.1, -0.8, 1.4] },
  { id: "e17", label: "AUROC", category: "metric", vector: [-0.5, -0.6, -1.4, -1.3, 1.1, -1.0, -0.7, 1.3] },
  { id: "e18", label: "F1 Score", category: "metric", vector: [-0.3, -0.4, -1.3, -1.1, 1.3, -1.2, -0.9, 1.5] },
  { id: "e19", label: "Gradient Norm", category: "metric", vector: [0.6, 0.2, -0.9, -0.7, 0.9, -0.5, 0.1, 0.8] },
];

const CATEGORY_COLORS = {
  optimizer: 0x00d2ff, // cyan
  loss: 0xef4444, // red/rose
  architecture: 0xa855f7, // violet
  metric: 0x10b981, // emerald
};

/**
 * Deterministic Power Iteration PCA to compute top 3 Principal Components
 */
function computePca3D(items: EmbeddingItem[]) {
  const n = items.length;
  if (n === 0) return { projected: [], varianceExplained: [0, 0, 0] };
  const d = items[0].vector.length;

  // 1. Center the data
  const mean = new Array(d).fill(0);
  for (const it of items) {
    for (let j = 0; j < d; j++) mean[j] += it.vector[j];
  }
  for (let j = 0; j < d; j++) mean[j] /= n;

  const X: number[][] = items.map((it) => it.vector.map((val, j) => val - mean[j]));

  // 2. Compute Covariance Matrix: (X^T * X) / (n - 1)
  const cov: number[][] = Array.from({ length: d }, () => new Array(d).fill(0));
  for (let i = 0; i < d; i++) {
    for (let j = 0; j < d; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        sum += X[k][i] * X[k][j];
      }
      cov[i][j] = sum / (n - 1 || 1);
    }
  }

  // 3. Power iteration to find top 3 orthogonal eigenvectors
  const eigenvectors: number[][] = [];
  const eigenvalues: number[] = [];

  for (let comp = 0; comp < 3; comp++) {
    let vec: number[] = new Array(d).fill(0).map((_, idx) => (idx === comp ? 1.0 : 0.1));

    // Power iterations
    for (let iter = 0; iter < 40; iter++) {
      // Multiply: cov * vec
      const next = new Array(d).fill(0);
      for (let i = 0; i < d; i++) {
        for (let j = 0; j < d; j++) {
          next[i] += cov[i][j] * vec[j];
        }
      }

      // Deflate with previous eigenvectors (Gram-Schmidt)
      for (const prev of eigenvectors) {
        let dot = 0;
        for (let j = 0; j < d; j++) dot += next[j] * prev[j];
        for (let j = 0; j < d; j++) next[j] -= dot * prev[j];
      }

      // Normalize
      let norm = Math.hypot(...next);
      if (norm < 1e-9) norm = 1e-9;
      vec = next.map((v) => v / norm);
    }

    // Compute Rayleigh quotient eigenvalue
    let rayleigh = 0;
    for (let i = 0; i < d; i++) {
      let sum = 0;
      for (let j = 0; j < d; j++) sum += cov[i][j] * vec[j];
      rayleigh += vec[i] * sum;
    }

    eigenvectors.push(vec);
    eigenvalues.push(Math.max(0, rayleigh));
  }

  // Total variance (trace of covariance)
  let totalVar = 0;
  for (let i = 0; i < d; i++) totalVar += cov[i][i];
  if (totalVar <= 0) totalVar = 1;

  const varianceExplained = eigenvalues.map((ev) => (ev / totalVar) * 100);

  // 4. Project data onto the top 3 eigenvectors
  const projected = items.map((it, idx) => {
    const centered = X[idx];
    const pc1 = centered.reduce((sum, val, j) => sum + val * eigenvectors[0][j], 0) * 3.5;
    const pc2 = centered.reduce((sum, val, j) => sum + val * eigenvectors[1][j], 0) * 3.5;
    const pc3 = centered.reduce((sum, val, j) => sum + val * eigenvectors[2][j], 0) * 3.5;

    return {
      item: it,
      coords: [pc1, pc2, pc3] as [number, number, number],
    };
  });

  return { projected, varianceExplained };
}

interface ThreeEmbeddingProjectorProps {
  items?: EmbeddingItem[];
  className?: string;
}

export function ThreeEmbeddingProjector({
  items = DEFAULT_EMBEDDINGS,
  className = "",
}: ThreeEmbeddingProjectorProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<EmbeddingItem | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const { projected, varianceExplained } = useMemo(() => computePca3D(items), [items]);

  const filteredProjected = useMemo(() => {
    if (selectedCategory === "all") return projected;
    return projected.filter((p) => p.item.category === selectedCategory);
  }, [projected, selectedCategory]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect WebGL
    try {
      const testCanvas = document.createElement("canvas");
      const gl = testCanvas.getContext("webgl2") || testCanvas.getContext("webgl");
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 400;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060913);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(10, 10, 14);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 40;
    controls.minDistance = 3;
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00d2ff, 1.2);
    dirLight.position.set(10, 15, 10);
    scene.add(dirLight);

    // 6. Draw PCA Axis Crosshair
    const axisGroup = new THREE.Group();
    const arrowX = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 6, 0x00d2ff, 0.4, 0.2);
    const arrowY = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 6, 0xa855f7, 0.4, 0.2);
    const arrowZ = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 6, 0x10b981, 0.4, 0.2);
    axisGroup.add(arrowX, arrowY, arrowZ);
    scene.add(axisGroup);

    // Grid Floor
    const grid = new THREE.GridHelper(16, 8, 0x1e293b, 0x0f172a);
    grid.position.y = -4;
    scene.add(grid);

    // 7. Render Point Cloud
    const pointGroup = new THREE.Group();
    const sphereGeo = new THREE.SphereGeometry(0.28, 16, 16);

    filteredProjected.forEach((p) => {
      const col = CATEGORY_COLORS[p.item.category] || 0xffffff;
      const mat = new THREE.MeshStandardMaterial({
        color: col,
        emissive: col,
        emissiveIntensity: 0.7,
        roughness: 0.2,
      });

      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.position.set(p.coords[0], p.coords[1], p.coords[2]);
      pointGroup.add(mesh);
    });
    scene.add(pointGroup);

    // 8. Animation loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Subtle slow orbit on axes
      pointGroup.rotation.y = Math.sin(elapsed * 0.2) * 0.05;

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      renderer.dispose();
      sphereGeo.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [filteredProjected]);

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const cumulativeVariance = varianceExplained.reduce((a, b) => a + b, 0).toFixed(1);

  if (!webglSupported) {
    return (
      <div className="aspect-[16/10] rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex flex-col items-center justify-center p-6 text-center space-y-3">
        <AlertTriangle className="w-8 h-8 text-amber-400" />
        <h3 className="text-sm font-bold text-white">WebGL 3D Unavailable</h3>
        <p className="text-xs text-[var(--text-muted)] max-w-sm">
          WebGL hardware acceleration is disabled. Please view the embedding table below.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 3D Canvas Container */}
      <div className="relative aspect-[16/10] rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden flex items-center justify-center shadow-xl">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Floating HUD Badges */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-mono text-cyan-400 border border-white/10 flex items-center gap-2 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>
            3D PCA Projector (Explained Variance: <strong>{cumulativeVariance}%</strong>)
          </span>
        </div>

        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={handleResetCamera}
            className="bg-black/60 hover:bg-black/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg text-xs font-mono text-white border border-white/10 flex items-center gap-1.5 transition-colors"
            title="Reset Camera Angle"
          >
            <RotateCcw className="w-3 h-3 text-cyan-400" />
            Reset Camera
          </button>
        </div>

        <div className="absolute bottom-4 left-4 text-[10px] font-mono text-[var(--text-muted)] bg-black/50 backdrop-blur-sm px-2 py-1 rounded border border-white/5 pointer-events-none">
          PC₁: {varianceExplained[0]?.toFixed(1)}% (Cyan) • PC₂: {varianceExplained[1]?.toFixed(1)}% (Violet) • PC₃: {varianceExplained[2]?.toFixed(1)}% (Emerald)
        </div>
      </div>

      {/* Filter and Provenance Bar */}
      <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[var(--text-muted)] flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {(["all", "optimizer", "loss", "architecture", "metric"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-mono capitalize transition-all ${
                selectedCategory === cat
                  ? "bg-cyan-500/20 border border-cyan-500 text-cyan-300 font-bold"
                  : "bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-muted)] hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ProvenanceBadge type="projected" />
        </div>
      </div>

      {/* Interactive Item List Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {filteredProjected.map(({ item, coords }) => (
          <button
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              selectedItem?.id === item.id
                ? "bg-cyan-500/10 border-cyan-500/60"
                : "bg-[var(--surface)] border-[var(--border)] hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white truncate">{item.label}</span>
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: `#${(CATEGORY_COLORS[item.category] || 0xffffff).toString(16).padStart(6, "0")}`,
                }}
              />
            </div>
            <div className="text-[10px] font-mono text-[var(--text-muted)] mt-1">
              [{coords[0].toFixed(1)}, {coords[1].toFixed(1)}, {coords[2].toFixed(1)}]
            </div>
          </button>
        ))}
      </div>

      {/* Selected Item Inspector */}
      {selectedItem && (
        <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div>
            <span className="text-white font-bold block">{selectedItem.label}</span>
            <span className="text-[var(--text-muted)] text-[11px]">
              Category: {selectedItem.category.toUpperCase()} • Dimension: {selectedItem.vector.length}D
            </span>
          </div>
          <div className="text-[var(--text-muted)] max-w-sm truncate">
            Vector: [{selectedItem.vector.map((v) => v.toFixed(2)).join(", ")}]
          </div>
        </div>
      )}
    </div>
  );
}
