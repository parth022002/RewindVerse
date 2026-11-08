"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RotateCcw, AlertTriangle, Layers, Info, Sparkles, Play, Pause } from "lucide-react";
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
    color: 0x00f2fe,
  },
  {
    id: "layer_dense1",
    name: "Dense Hidden Block 1",
    type: "dense",
    inputShape: [1, 8],
    outputShape: [1, 14],
    paramsCount: 126,
    activation: "ReLU",
    color: 0x38bdf8,
  },
  {
    id: "layer_dense2",
    name: "Dense Hidden Block 2",
    type: "dense",
    inputShape: [1, 14],
    outputShape: [1, 10],
    paramsCount: 150,
    activation: "ReLU",
    color: 0x8b5cf6,
  },
  {
    id: "layer_out",
    name: "Classification Head",
    type: "output",
    inputShape: [1, 10],
    outputShape: [1, 2],
    paramsCount: 22,
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
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(false);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

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
    camera.position.set(0, 4, 16);
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
    controls.maxDistance = 40;
    controls.minDistance = 4;
    controls.autoRotate = isAutoRotating;
    controls.autoRotateSpeed = 0.65;
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00f2fe, 2.0);
    dirLight1.position.set(12, 18, 12);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x8b5cf6, 1.6);
    dirLight2.position.set(-12, -8, -12);
    scene.add(dirLight2);

    // 6. Build 3D Layer Blocks along the X-axis
    const layerSpacing = 3.8;
    const startX = -((layers.length - 1) * layerSpacing) / 2;

    const layerMeshes: THREE.Mesh[] = [];
    const neuronPositionsPerLayer: THREE.Vector3[][] = [];
    const neuronMeshes: THREE.Mesh[] = [];

    layers.forEach((layer, idx) => {
      const lx = startX + idx * layerSpacing;
      const numNodes = Math.min(layer.outputShape[1], 10);
      const nodePositions: THREE.Vector3[] = [];

      // Layer container block (glassmorphic prism)
      const blockHeight = Math.max(2.6, numNodes * 0.48 + 0.8);
      const blockGeo = new THREE.BoxGeometry(0.75, blockHeight, 1.3);
      const blockMat = new THREE.MeshStandardMaterial({
        color: layer.color,
        roughness: 0.15,
        metalness: 0.35,
        transparent: true,
        opacity: 0.28,
      });
      const blockMesh = new THREE.Mesh(blockGeo, blockMat);
      blockMesh.position.set(lx, 0, 0);
      scene.add(blockMesh);
      layerMeshes.push(blockMesh);

      // Neon Block outline
      const edges = new THREE.EdgesGeometry(blockGeo);
      const lineMat = new THREE.LineBasicMaterial({
        color: layer.color,
        transparent: true,
        opacity: 0.7,
      });
      const edgeLines = new THREE.LineSegments(edges, lineMat);
      edgeLines.position.set(lx, 0, 0);
      scene.add(edgeLines);

      // Neurons inside the layer block
      const neuronGeo = new THREE.SphereGeometry(0.14, 16, 16);
      const neuronMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: layer.color,
        emissiveIntensity: 0.85,
        roughness: 0.2,
      });

      for (let n = 0; n < numNodes; n++) {
        const ny = (n - (numNodes - 1) / 2) * 0.48;
        const nPos = new THREE.Vector3(lx, ny, 0);
        nodePositions.push(nPos);

        const nMesh = new THREE.Mesh(neuronGeo, neuronMat);
        nMesh.position.copy(nPos);
        scene.add(nMesh);
        neuronMeshes.push(nMesh);
      }

      neuronPositionsPerLayer.push(nodePositions);
    });

    // 7. Draw connecting synaptic lines between adjacent layers
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.18,
    });

    const synapticPairs: [THREE.Vector3, THREE.Vector3][] = [];

    for (let l = 0; l < neuronPositionsPerLayer.length - 1; l++) {
      const fromNodes = neuronPositionsPerLayer[l];
      const toNodes = neuronPositionsPerLayer[l + 1];

      const linePoints: THREE.Vector3[] = [];
      for (const fn of fromNodes) {
        for (const tn of toNodes) {
          linePoints.push(fn);
          linePoints.push(tn);
          synapticPairs.push([fn, tn]);
        }
      }

      const synGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
      const synLines = new THREE.LineSegments(synGeo, lineMat);
      scene.add(synLines);
    }

    // 8. Animated Forward Data Pulse Particles travelling along synapses
    const pulseCount = 75;
    const pulseGeo = new THREE.BufferGeometry();
    const pulsePositions = new Float32Array(pulseCount * 3);
    const pulseColors = new Float32Array(pulseCount * 3);
    const pulseOffsets: number[] = [];
    const pulsePairIndices: number[] = [];

    for (let p = 0; p < pulseCount; p++) {
      pulseOffsets.push(Math.random());
      pulsePairIndices.push(Math.floor(Math.random() * synapticPairs.length));
      pulseColors[p * 3] = 0.0;
      pulseColors[p * 3 + 1] = 0.95;
      pulseColors[p * 3 + 2] = 1.0;
    }

    pulseGeo.setAttribute("position", new THREE.BufferAttribute(pulsePositions, 3));
    pulseGeo.setAttribute("color", new THREE.BufferAttribute(pulseColors, 3));

    const pulseMat = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    const pulsePoints = new THREE.Points(pulseGeo, pulseMat);
    scene.add(pulsePoints);

    // 9. Ambient Stardust Particles
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleCols = new Float32Array(particleCount * 3);
    const pColor1 = new THREE.Color(0x00f2fe);
    const pColor2 = new THREE.Color(0x8b5cf6);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 24;
      particlePositions[i * 3 + 1] = Math.random() * 14 - 5;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 24;

      const t = Math.random();
      const c = new THREE.Color().lerpColors(pColor1, pColor2, t);
      particleCols[i * 3] = c.r;
      particleCols[i * 3 + 1] = c.g;
      particleCols[i * 3 + 2] = c.b;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleCols, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Grid Floor
    const grid = new THREE.GridHelper(22, 12, 0x00f2fe, 0x1e293b);
    grid.position.y = -3.8;
    scene.add(grid);

    // 10. Animation loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Subtle breathing float on blocks
      layerMeshes.forEach((mesh, i) => {
        mesh.position.y = Math.sin(elapsed * 1.5 + i * 0.8) * 0.08;
      });

      // Animate data pulses along synapses
      const posAttr = pulseGeo.attributes.position as THREE.BufferAttribute;
      for (let p = 0; p < pulseCount; p++) {
        const pairIdx = pulsePairIndices[p];
        const pair = synapticPairs[pairIdx];
        if (!pair) continue;

        const [startPt, endPt] = pair;
        const progress = (pulseOffsets[p] + elapsed * 0.45) % 1.0;

        const curX = startPt.x + (endPt.x - startPt.x) * progress;
        const curY = startPt.y + (endPt.y - startPt.y) * progress;
        const curZ = startPt.z + (endPt.z - startPt.z) * progress;

        posAttr.setXYZ(p, curX, curY, curZ);
      }
      posAttr.needsUpdate = true;

      // Drift background particles
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
      pulseGeo.dispose();
      pulseMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      lineMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [layers, isAutoRotating]);

  const handleResetCamera = () => {
    if (controlsRef.current && cameraRef.current) {
      cameraRef.current.position.set(0, 4, 16);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  if (!webglSupported) {
    return (
      <div className="aspect-[16/10] rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex flex-col items-center justify-center p-6 text-center space-y-3">
        <AlertTriangle className="w-8 h-8 text-amber-400" />
        <h3 className="text-sm font-bold text-white">WebGL 3D Unavailable</h3>
      </div>
    );
  }

  return (
    <div className={`relative aspect-[16/10] rounded-2xl bg-[#050814] border border-white/[0.08] overflow-hidden flex flex-col justify-between p-4 shadow-2xl backdrop-blur-xl ${className}`}>
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 3D HUD Badges */}
      <div className="relative z-10 flex items-center justify-between pointer-events-none">
        <div className="bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-mono text-cyan-300 border border-white/[0.1] flex items-center gap-2 shadow-lg">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Interactive Neural Tensor Architecture</span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
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
      </div>

      {/* Interactive Layer Selection Strip */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4">
        {layers.map((layer) => {
          const isSelected = selectedLayer.id === layer.id;
          return (
            <button
              key={layer.id}
              onClick={() => setSelectedLayer(layer)}
              className={`p-2 rounded-xl text-left border transition-all pointer-events-auto ${
                isSelected
                  ? "bg-black/80 border-cyan-400 shadow-md shadow-cyan-500/20"
                  : "bg-black/50 hover:bg-black/70 border-white/[0.08]"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-300 truncate">
                  {layer.name}
                </span>
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: `#${layer.color.toString(16).padStart(6, "0")}` }}
                />
              </div>
              <div className="text-[10px] font-mono text-[var(--text-muted)] flex justify-between">
                <span>[{layer.inputShape.join("×")}] → [{layer.outputShape.join("×")}]</span>
                <span className="text-cyan-400 font-semibold">{layer.activation}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
