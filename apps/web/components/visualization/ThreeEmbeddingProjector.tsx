"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RotateCcw, AlertTriangle, Sparkles, Filter, Play, Pause } from "lucide-react";
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
  optimizer: 0x00f2fe, // cyan
  loss: 0xf43f5e,      // rose/magenta
  architecture: 0xa855f7, // violet
  metric: 0x10b981,    // emerald
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

    for (let iter = 0; iter < 40; iter++) {
      const next = new Array(d).fill(0);
      for (let i = 0; i < d; i++) {
        for (let j = 0; j < d; j++) {
          next[i] += cov[i][j] * vec[j];
        }
      }

      // Deflate with previous eigenvectors (Gram-Schmidt)
      for (const prev of eigenvectors) {
        let dot = 0;
        for (let k = 0; k < d; k++) dot += next[k] * prev[k];
        for (let k = 0; k < d; k++) next[k] -= dot * prev[k];
      }

      // Normalize
      let norm = 0;
      for (let k = 0; k < d; k++) norm += next[k] * next[k];
      norm = Math.sqrt(norm) || 1;
      for (let k = 0; k < d; k++) vec[k] = next[k] / norm;
    }

    // Compute Rayleigh quotient (eigenvalue)
    let lambda = 0;
    for (let i = 0; i < d; i++) {
      let rowSum = 0;
      for (let j = 0; j < d; j++) rowSum += cov[i][j] * vec[j];
      lambda += vec[i] * rowSum;
    }

    eigenvectors.push(vec);
    eigenvalues.push(Math.max(0.001, lambda));
  }

  // Total variance
  const totalVariance = eigenvalues.reduce((a, b) => a + b, 0);
  const varianceExplained = eigenvalues.map((ev) => (ev / (totalVariance || 1)) * 100);

  // 4. Project points into 3D: [x, y, z] = X * eigenvectors
  const projected = items.map((item, idx) => {
    const coords: [number, number, number] = [0, 0, 0];
    for (let comp = 0; comp < 3; comp++) {
      let val = 0;
      for (let k = 0; k < d; k++) {
        val += X[idx][k] * eigenvectors[comp][k];
      }
      coords[comp] = val * 2.8; // scaling for visualization
    }
    return { item, coords };
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
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(false);

  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

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
    scene.background = new THREE.Color(0x050814);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(11, 11, 15);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 45;
    controls.minDistance = 3;
    controls.autoRotate = isAutoRotating;
    controls.autoRotateSpeed = 0.65;
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00f2fe, 2.0);
    dirLight1.position.set(12, 18, 12);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa855f7, 1.6);
    dirLight2.position.set(-12, -8, -12);
    scene.add(dirLight2);

    // 6. Draw PCA Axis Crosshair
    const axisGroup = new THREE.Group();
    const arrowX = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 6.5, 0x00f2fe, 0.4, 0.2);
    const arrowY = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 6.5, 0xa855f7, 0.4, 0.2);
    const arrowZ = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 6.5, 0x10b981, 0.4, 0.2);
    axisGroup.add(arrowX, arrowY, arrowZ);
    scene.add(axisGroup);

    // Grid Floor
    const grid = new THREE.GridHelper(18, 10, 0x00f2fe, 0x1e293b);
    grid.position.y = -4.5;
    scene.add(grid);

    // 7. Ambient Stardust Particles
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const pColor1 = new THREE.Color(0x00f2fe);
    const pColor2 = new THREE.Color(0x8b5cf6);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 22;
      particlePositions[i * 3 + 1] = Math.random() * 14 - 5;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 22;

      const t = Math.random();
      const c = new THREE.Color().lerpColors(pColor1, pColor2, t);
      particleColors[i * 3] = c.r;
      particleColors[i * 3 + 1] = c.g;
      particleColors[i * 3 + 2] = c.b;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 8. Render Point Cloud with Halos
    const pointGroup = new THREE.Group();
    const sphereGeo = new THREE.SphereGeometry(0.3, 18, 18);
    const haloGeo = new THREE.RingGeometry(0.36, 0.58, 20);

    filteredProjected.forEach((p) => {
      const col = CATEGORY_COLORS[p.item.category] || 0xffffff;
      const isSelected = selectedItem?.id === p.item.id;

      const mat = new THREE.MeshStandardMaterial({
        color: col,
        emissive: col,
        emissiveIntensity: isSelected ? 1.0 : 0.75,
        roughness: 0.2,
      });

      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.position.set(p.coords[0], p.coords[1], p.coords[2]);
      pointGroup.add(mesh);

      // Halo for point
      const haloMat = new THREE.MeshBasicMaterial({
        color: col,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isSelected ? 0.9 : 0.4,
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.position.set(p.coords[0], p.coords[1], p.coords[2]);
      haloMesh.lookAt(camera.position);
      pointGroup.add(haloMesh);
    });
    scene.add(pointGroup);

    // 9. Distance lines to nearest neighbors if an item is selected
    let neighborLinesMesh: THREE.LineSegments | null = null;
    if (selectedItem) {
      const targetPoint = filteredProjected.find((p) => p.item.id === selectedItem.id);
      if (targetPoint) {
        const sortedNeighbors = [...filteredProjected]
          .filter((p) => p.item.id !== selectedItem.id)
          .map((p) => {
            const dx = p.coords[0] - targetPoint.coords[0];
            const dy = p.coords[1] - targetPoint.coords[1];
            const dz = p.coords[2] - targetPoint.coords[2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            return { point: p, dist };
          })
          .sort((a, b) => a.dist - b.dist)
          .slice(0, 3); // top 3 nearest semantic neighbors

        const linePoints: THREE.Vector3[] = [];
        const tVec = new THREE.Vector3(targetPoint.coords[0], targetPoint.coords[1], targetPoint.coords[2]);
        sortedNeighbors.forEach((n) => {
          linePoints.push(tVec);
          linePoints.push(new THREE.Vector3(n.point.coords[0], n.point.coords[1], n.point.coords[2]));
        });

        const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
        const lineMat = new THREE.LineBasicMaterial({
          color: 0x00f2fe,
          transparent: true,
          opacity: 0.6,
        });
        neighborLinesMesh = new THREE.LineSegments(lineGeo, lineMat);
        scene.add(neighborLinesMesh);
      }
    }

    // 10. Animation loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Subtle slow oscillation
      pointGroup.rotation.y = Math.sin(elapsed * 0.2) * 0.05;

      // Drift background stardust
      particles.rotation.y += 0.0006;

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
      particleGeo.dispose();
      particleMat.dispose();
      sphereGeo.dispose();
      haloGeo.dispose();
      if (neighborLinesMesh) {
        neighborLinesMesh.geometry.dispose();
        if (Array.isArray(neighborLinesMesh.material)) {
          neighborLinesMesh.material.forEach((m) => m.dispose());
        } else {
          neighborLinesMesh.material.dispose();
        }
      }
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [filteredProjected, selectedItem, isAutoRotating]);

  const handleResetCamera = () => {
    if (controlsRef.current && cameraRef.current) {
      cameraRef.current.position.set(11, 11, 15);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const cumulativeVariance = varianceExplained.reduce((a, b) => a + b, 0).toFixed(1);

  if (!webglSupported) {
    return (
      <div className="aspect-[16/10] rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex flex-col items-center justify-center p-6 text-center space-y-3">
        <AlertTriangle className="w-8 h-8 text-amber-400" />
        <h3 className="text-sm font-bold text-white">WebGL 3D Unavailable</h3>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 3D Canvas Container */}
      <div className="relative aspect-[16/10] rounded-2xl bg-[#050814] border border-white/[0.08] overflow-hidden flex items-center justify-center shadow-2xl backdrop-blur-xl">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Floating HUD Badges */}
        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-mono text-cyan-300 border border-white/[0.1] flex items-center gap-2 pointer-events-none shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>
            3D PCA Projector (Explained Variance: <strong className="text-white">{cumulativeVariance}%</strong>)
          </span>
        </div>

        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`backdrop-blur-md px-2.5 py-1.5 rounded-xl text-xs font-mono border transition-colors flex items-center gap-1 ${
              isAutoRotating
                ? "bg-cyan-950/80 border-cyan-500/50 text-cyan-300"
                : "bg-black/70 hover:bg-black/90 border-white/[0.1] text-[var(--text-muted)] hover:text-white"
            }`}
            title="Toggle Auto-Rotation"
          >
            {isAutoRotating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span className="hidden sm:inline">Rotate</span>
          </button>

          <button
            onClick={handleResetCamera}
            className="bg-black/70 hover:bg-black/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl text-xs font-mono text-white border border-white/[0.1] flex items-center gap-1.5 transition-colors"
            title="Reset Camera Angle"
          >
            <RotateCcw className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        <div className="absolute bottom-4 left-4 text-[10px] font-mono text-[var(--text-muted)] bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/[0.1] pointer-events-none shadow-lg">
          PC₁: {varianceExplained[0]?.toFixed(1)}% (Cyan) • PC₂: {varianceExplained[1]?.toFixed(1)}% (Violet) • PC₃: {varianceExplained[2]?.toFixed(1)}% (Emerald)
        </div>
      </div>

      {/* Filter and Category Bar */}
      <div className="p-4 rounded-xl bg-[#080b14]/90 border border-white/[0.08] flex flex-wrap items-center justify-between gap-4 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[var(--text-muted)] flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-cyan-400" /> Category:
          </span>
          {(["all", "optimizer", "loss", "architecture", "metric"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-mono capitalize transition-all ${
                selectedCategory === cat
                  ? "bg-cyan-500/20 border border-cyan-500 text-cyan-300 font-bold shadow-sm shadow-cyan-500/20"
                  : "bg-white/[0.04] border border-white/[0.08] text-[var(--text-muted)] hover:text-white"
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
            onClick={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              selectedItem?.id === item.id
                ? "bg-cyan-500/15 border-cyan-400 shadow-lg shadow-cyan-500/20"
                : "bg-black/50 border-white/[0.08] hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white truncate">{item.label}</span>
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 ml-1.5 shadow-sm"
                style={{ backgroundColor: `#${(CATEGORY_COLORS[item.category] || 0xffffff).toString(16).padStart(6, "0")}` }}
              />
            </div>
            <div className="text-[10px] font-mono text-[var(--text-muted)] mt-1">
              ({coords[0].toFixed(1)}, {coords[1].toFixed(1)}, {coords[2].toFixed(1)})
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
