"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RotateCcw, AlertTriangle, Sparkles } from "lucide-react";

interface ClassificationDataPoint {
  x: number;
  y: number;
  label: number;
}

interface ThreeDecisionSurfaceViewerProps {
  weights: [number, number];
  bias: number;
  dataPoints: ClassificationDataPoint[];
  epoch: number;
  loss: number;
  accuracy: number;
  className?: string;
}

export function ThreeDecisionSurfaceViewer({
  weights,
  bias,
  dataPoints,
  epoch,
  loss,
  accuracy,
  className = "",
}: ThreeDecisionSurfaceViewerProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
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
    camera.position.set(10, 11, 14);

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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00d2ff, 1.2);
    dirLight1.position.set(10, 20, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa855f7, 0.8);
    dirLight2.position.set(-10, -5, -10);
    scene.add(dirLight2);

    // 6. Generate 3D Sigmoid Probability Surface Mesh: z = σ(w₁·x + w₂·y + b)
    const xMin = -4;
    const xMax = 4;
    const yMin = -4;
    const yMax = 4;
    const segments = 45;
    const surfaceScaleY = 5.0; // Height corresponding to P = 1

    const geometry = new THREE.PlaneGeometry(xMax - xMin, yMax - yMin, segments, segments);
    geometry.rotateX(-Math.PI / 2); // Lay flat on X-Z plane

    const pos = geometry.attributes.position;
    const colors: number[] = [];

    const sigmoid = (z: number) => 1 / (1 + Math.exp(-Math.max(-15, Math.min(15, z))));

    const [w1, w2] = weights;
    for (let i = 0; i < pos.count; i++) {
      const u = pos.getX(i); // x1
      const v = pos.getZ(i); // x2

      const zVal = w1 * u + w2 * v + bias;
      const prob = sigmoid(zVal); // in [0, 1]

      const heightY = prob * surfaceScaleY;
      pos.setY(i, heightY);

      // Color mapping: Cyan at P=0, Violet at P=1
      const color = new THREE.Color().setHSL(0.55 - prob * 0.35, 0.85, 0.45);
      colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();

    const surfaceMaterial = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.35,
      metalness: 0.1,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.82,
    });

    const surfaceMesh = new THREE.Mesh(geometry, surfaceMaterial);
    scene.add(surfaceMesh);

    // Subtle wireframe
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x00d2ff,
      wireframe: true,
      transparent: true,
      opacity: 0.1,
    });
    const wireframeMesh = new THREE.Mesh(geometry, wireframeMat);
    scene.add(wireframeMesh);

    // 7. Decision Threshold Plane at P = 0.5 (Y = surfaceScaleY * 0.5)
    const thresholdGeo = new THREE.PlaneGeometry(xMax - xMin, yMax - yMin);
    thresholdGeo.rotateX(-Math.PI / 2);
    const thresholdMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
    });
    const thresholdMesh = new THREE.Mesh(thresholdGeo, thresholdMat);
    thresholdMesh.position.y = surfaceScaleY * 0.5;
    scene.add(thresholdMesh);

    // Grid floors
    const bottomGrid = new THREE.GridHelper(xMax - xMin, 8, 0x00d2ff, 0x1e293b);
    bottomGrid.position.y = 0;
    scene.add(bottomGrid);

    // 8. Data Points in 3D: Label 0 at Y = 0 (cyan), Label 1 at Y = surfaceScaleY (violet)
    const sphereGroup = new THREE.Group();
    const sphereGeo = new THREE.SphereGeometry(0.18, 12, 12);
    const label0Mat = new THREE.MeshStandardMaterial({
      color: 0x00d2ff,
      emissive: 0x00d2ff,
      emissiveIntensity: 0.6,
    });
    const label1Mat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0xa855f7,
      emissiveIntensity: 0.6,
    });

    for (const pt of dataPoints) {
      const mesh = new THREE.Mesh(sphereGeo, pt.label === 0 ? label0Mat : label1Mat);
      // Actual predicted height vs target height
      const ptTargetY = pt.label === 0 ? 0.05 : surfaceScaleY + 0.05;
      mesh.position.set(pt.x, ptTargetY, pt.y);
      sphereGroup.add(mesh);
    }
    scene.add(sphereGroup);

    // 9. Animation loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      geometry.dispose();
      surfaceMaterial.dispose();
      wireframeMat.dispose();
      thresholdGeo.dispose();
      thresholdMat.dispose();
      sphereGeo.dispose();
      label0Mat.dispose();
      label1Mat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [weights, bias, dataPoints]);

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  if (!webglSupported) {
    return (
      <div className="aspect-[16/10] rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex flex-col items-center justify-center p-6 text-center space-y-3">
        <AlertTriangle className="w-8 h-8 text-amber-400" />
        <h3 className="text-sm font-bold text-white">WebGL 3D Unavailable</h3>
        <p className="text-xs text-[var(--text-muted)] max-w-sm">
          Your browser or device does not currently have WebGL hardware acceleration enabled.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`relative aspect-[16/10] rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden flex items-center justify-center shadow-xl ${className}`}
    >
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating HUD Badges */}
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-mono text-cyan-400 border border-white/10 flex items-center gap-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span>
          3D Sigmoid Probability Manifold: <code className="text-white">P(y=1) = σ(w·x + b)</code>
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
        Threshold Plane: P=0.5 • Cyan Spheres: Class 0 • Violet Spheres: Class 1
      </div>

      <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-mono text-white border border-white/10 pointer-events-none">
        Epoch {epoch} • Accuracy {(accuracy * 100).toFixed(1)}% • Loss {loss.toFixed(4)}
      </div>
    </div>
  );
}
