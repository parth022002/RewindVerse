"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RotateCcw, AlertTriangle, Layers, Info, Sparkles } from "lucide-react";
import { ProvenanceBadge } from "./ProvenanceBadge";

export interface NetworkLayerSpec {
  id: string;
  name: string;
  type: "input" | "dense" | "activation" | "output";
  inputShape: number[];
  outputShape: number[];
  paramsCount: number;
  activation: string;
  color: number;
}

const DEFAULT_NETWORK_LAYERS: NetworkLayerSpec[] = [
  {
    id: "layer_in",
    name: "Input Layer",
    type: "input",
    inputShape: [1, 8],
    outputShape: [1, 8],
    paramsCount: 0,
    activation: "Identity",
    color: 0x00d2ff,
  },
  {
    id: "layer_dense1",
    name: "Dense Hidden Block 1",
    type: "dense",
    inputShape: [1, 8],
    outputShape: [1, 16],
    paramsCount: 144, // 8 * 16 + 16
    activation: "ReLU",
    color: 0x3b82f6,
  },
  {
    id: "layer_dense2",
    name: "Dense Hidden Block 2",
    type: "dense",
    inputShape: [1, 16],
    outputShape: [1, 12],
    paramsCount: 204, // 16 * 12 + 12
    activation: "ReLU",
    color: 0x8b5cf6,
  },
  {
    id: "layer_out",
    name: "Classification Head",
    type: "output",
    inputShape: [1, 12],
    outputShape: [1, 2],
    paramsCount: 26, // 12 * 2 + 2
    activation: "Softmax",
    color: 0xec4899,
  },
];

interface ThreeNetworkGraphViewerProps {
  layers?: NetworkLayerSpec[];
  className?: string;
}

export function ThreeNetworkGraphViewer({
  layers = DEFAULT_NETWORK_LAYERS,
  className = "",
}: ThreeNetworkGraphViewerProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [selectedLayer, setSelectedLayer] = useState<NetworkLayerSpec>(layers[1]);
  const controlsRef = useRef<OrbitControls | null>(null);

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
    camera.position.set(0, 4, 16);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 35;
    controls.minDistance = 4;
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00d2ff, 1.2);
    dirLight.position.set(10, 15, 10);
    scene.add(dirLight);

    // 6. Build 3D Layer Blocks along the X-axis
    const layerSpacing = 3.6;
    const startX = -((layers.length - 1) * layerSpacing) / 2;

    const layerMeshes: THREE.Mesh[] = [];
    const neuronPositionsPerLayer: THREE.Vector3[][] = [];

    layers.forEach((layer, idx) => {
      const lx = startX + idx * layerSpacing;
      const numNodes = Math.min(layer.outputShape[1], 10);
      const nodePositions: THREE.Vector3[] = [];

      // Layer container block (glassmorphic prism)
      const blockHeight = Math.max(2.5, numNodes * 0.45 + 0.8);
      const blockGeo = new THREE.BoxGeometry(0.7, blockHeight, 1.2);
      const blockMat = new THREE.MeshStandardMaterial({
        color: layer.color,
        roughness: 0.2,
        metalness: 0.1,
        transparent: true,
        opacity: 0.25,
        wireframe: false,
      });
      const blockMesh = new THREE.Mesh(blockGeo, blockMat);
      blockMesh.position.set(lx, 0, 0);
      scene.add(blockMesh);
      layerMeshes.push(blockMesh);

      // Block outline
      const edges = new THREE.EdgesGeometry(blockGeo);
      const lineMat = new THREE.LineBasicMaterial({ color: layer.color, transparent: true, opacity: 0.6 });
      const edgeLines = new THREE.LineSegments(edges, lineMat);
      edgeLines.position.set(lx, 0, 0);
      scene.add(edgeLines);

      // Neurons inside the layer block
      const neuronGeo = new THREE.SphereGeometry(0.12, 12, 12);
      const neuronMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: layer.color,
        emissiveIntensity: 0.8,
      });

      for (let n = 0; n < numNodes; n++) {
        const ny = (n - (numNodes - 1) / 2) * 0.45;
        const nPos = new THREE.Vector3(lx, ny, 0);
        nodePositions.push(nPos);

        const nMesh = new THREE.Mesh(neuronGeo, neuronMat);
        nMesh.position.copy(nPos);
        scene.add(nMesh);
      }

      neuronPositionsPerLayer.push(nodePositions);
    });

    // 7. Draw connecting synaptic lines between adjacent layers
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x00d2ff,
      transparent: true,
      opacity: 0.15,
    });

    for (let l = 0; l < neuronPositionsPerLayer.length - 1; l++) {
      const fromNodes = neuronPositionsPerLayer[l];
      const toNodes = neuronPositionsPerLayer[l + 1];

      const linePoints: THREE.Vector3[] = [];
      for (const fn of fromNodes) {
        for (const tn of toNodes) {
          linePoints.push(fn);
          linePoints.push(tn);
        }
      }

      const synGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
      const synLines = new THREE.LineSegments(synGeo, lineMat);
      scene.add(synLines);
    }

    // Grid Floor
    const grid = new THREE.GridHelper(20, 10, 0x00d2ff, 0x1e293b);
    grid.position.y = -3.5;
    scene.add(grid);

    // 8. Animation loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Subtle breathing float on blocks
      layerMeshes.forEach((mesh, i) => {
        mesh.position.y = Math.sin(elapsed * 1.5 + i * 0.8) * 0.08;
      });

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
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [layers]);

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const totalParams = layers.reduce((acc, l) => acc + l.paramsCount, 0);

  if (!webglSupported) {
    return (
      <div className="aspect-[16/10] rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex flex-col items-center justify-center p-6 text-center space-y-3">
        <AlertTriangle className="w-8 h-8 text-amber-400" />
        <h3 className="text-sm font-bold text-white">WebGL 3D Unavailable</h3>
        <p className="text-xs text-[var(--text-muted)] max-w-sm">
          WebGL hardware acceleration is disabled. Please view the tabular layer architecture details below.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 3D Scene Container */}
      <div className="relative aspect-[16/10] rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden flex items-center justify-center shadow-xl">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Floating HUD Badges */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-mono text-cyan-400 border border-white/10 flex items-center gap-2 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>3D Neural Architecture Graph ({layers.length} Layers · {totalParams.toLocaleString()} Params)</span>
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
          Orbit: Drag • Zoom: Scroll • Select a layer card below to inspect tensor specifications
        </div>
      </div>

      {/* Interactive Layer Inspector Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {layers.map((layer) => (
          <button
            key={layer.id}
            onClick={() => setSelectedLayer(layer)}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedLayer.id === layer.id
                ? "bg-cyan-500/10 border-cyan-500/60 shadow-sm"
                : "bg-[var(--surface)] border-[var(--border)] hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-white truncate">{layer.name}</span>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: `#${layer.color.toString(16).padStart(6, "0")}` }} />
            </div>
            <div className="text-[10px] font-mono text-[var(--text-muted)] space-y-0.5">
              <div>Output: [{layer.outputShape.join(", ")}]</div>
              <div>Params: {layer.paramsCount}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Selected Layer Specification Panel */}
      {selectedLayer && (
        <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="space-y-1">
            <span className="text-white font-bold text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              {selectedLayer.name} ({selectedLayer.type.toUpperCase()})
            </span>
            <div className="text-[var(--text-muted)]">
              Input Shape: [{selectedLayer.inputShape.join(", ")}] → Output Shape: [{selectedLayer.outputShape.join(", ")}]
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div>
              <span className="text-[var(--text-muted)] block text-[10px]">Activation Function</span>
              <span className="text-cyan-300 font-bold">{selectedLayer.activation}</span>
            </div>
            <div>
              <span className="text-[var(--text-muted)] block text-[10px]">Trainable Parameters</span>
              <span className="text-white font-bold">{selectedLayer.paramsCount.toLocaleString()}</span>
            </div>
            <ProvenanceBadge type="derived" />
          </div>
        </div>
      )}
    </div>
  );
}
