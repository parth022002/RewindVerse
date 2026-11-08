"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RotateCcw, AlertTriangle, Sparkles, Play, Pause, Layers } from "lucide-react";

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
    camera.position.set(11, 12, 15);
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
    controls.autoRotateSpeed = 0.75;
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00f2fe, 2.2);
    dirLight1.position.set(12, 20, 12);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xf43f5e, 1.8);
    dirLight2.position.set(-12, -8, -12);
    scene.add(dirLight2);

    // 6. Generate 3D Sigmoid Probability Surface Mesh: z = σ(w₁·x + w₂·y + b)
    const xMin = -4;
    const xMax = 4;
    const yMin = -4;
    const yMax = 4;
    const segments = 56;
    const surfaceScaleY = 5.2; // Height corresponding to P = 1

    const geometry = new THREE.PlaneGeometry(xMax - xMin, yMax - yMin, segments, segments);
    geometry.rotateX(-Math.PI / 2); // Lay flat on X-Z plane

    const pos = geometry.attributes.position;
    const colors: number[] = [];

    const sigmoid = (z: number) => 1 / (1 + Math.exp(-Math.max(-15, Math.min(15, z))));
    const [w1, w2] = weights;

    const colorClass0 = new THREE.Color(0x00f2fe); // Cyan
    const colorMid = new THREE.Color(0x8b5cf6);    // Violet threshold
    const colorClass1 = new THREE.Color(0xf43f5e); // Rose / Magenta

    for (let i = 0; i < pos.count; i++) {
      const u = pos.getX(i); // x1
      const v = pos.getZ(i); // x2

      const zVal = w1 * u + w2 * v + bias;
      const prob = sigmoid(zVal); // in [0, 1]

      const heightY = prob * surfaceScaleY;
      pos.setY(i, heightY);

      // Color mapping: Cyan at P=0, Violet at P=0.5, Rose at P=1
      const c = new THREE.Color();
      if (prob < 0.5) {
        c.lerpColors(colorClass0, colorMid, prob * 2);
      } else {
        c.lerpColors(colorMid, colorClass1, (prob - 0.5) * 2);
      }
      colors.push(c.r, c.g, c.b);
    }

    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();

    const surfaceMaterial = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.3,
      metalness: 0.35,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.82,
      emissive: new THREE.Color(0x061528),
      emissiveIntensity: 0.2,
    });

    const surfaceMesh = new THREE.Mesh(geometry, surfaceMaterial);
    scene.add(surfaceMesh);

    // Glowing Wireframe
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.14,
    });
    const wireframeMesh = new THREE.Mesh(geometry, wireframeMat);
    wireframeMesh.position.y += 0.02;
    scene.add(wireframeMesh);

    // 7. Decision Threshold Plane at P = 0.5 (Y = surfaceScaleY * 0.5)
    const thresholdGeo = new THREE.PlaneGeometry(xMax - xMin, yMax - yMin);
    thresholdGeo.rotateX(-Math.PI / 2);
    const thresholdMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.14,
      side: THREE.DoubleSide,
    });
    const thresholdMesh = new THREE.Mesh(thresholdGeo, thresholdMat);
    thresholdMesh.position.y = surfaceScaleY * 0.5;
    scene.add(thresholdMesh);

    // 8. 3D Decision Boundary Line at P = 0.5 (where w1*x + w2*z + b = 0)
    // Find intersections with domain bounding box
    const linePts: THREE.Vector3[] = [];
    if (Math.abs(w2) > 0.001) {
      const zAtXmin = -(w1 * xMin + bias) / w2;
      const zAtXmax = -(w1 * xMax + bias) / w2;
      linePts.push(new THREE.Vector3(xMin, surfaceScaleY * 0.5 + 0.04, Math.max(yMin, Math.min(yMax, zAtXmin))));
      linePts.push(new THREE.Vector3(xMax, surfaceScaleY * 0.5 + 0.04, Math.max(yMin, Math.min(yMax, zAtXmax))));
    } else if (Math.abs(w1) > 0.001) {
      const xAtZ = -bias / w1;
      linePts.push(new THREE.Vector3(xAtZ, surfaceScaleY * 0.5 + 0.04, yMin));
      linePts.push(new THREE.Vector3(xAtZ, surfaceScaleY * 0.5 + 0.04, yMax));
    }

    let decisionLineMesh: THREE.Mesh | null = null;
    if (linePts.length === 2 && linePts[0].distanceTo(linePts[1]) > 0.1) {
      const curve = new THREE.LineCurve3(linePts[0], linePts[1]);
      const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.07, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        emissive: 0xfacc15,
        emissiveIntensity: 0.9,
      });
      decisionLineMesh = new THREE.Mesh(tubeGeo, tubeMat);
      scene.add(decisionLineMesh);
    }

    // Grid Floor
    const bottomGrid = new THREE.GridHelper(xMax - xMin, 10, 0x00f2fe, 0x1e293b);
    bottomGrid.position.y = -0.05;
    scene.add(bottomGrid);

    // 9. Ambient Stardust Particles
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const pColor1 = new THREE.Color(0x00f2fe);
    const pColor2 = new THREE.Color(0xf43f5e);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 18;
      particlePositions[i * 3 + 1] = Math.random() * 10 - 1;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 18;

      const t = Math.random();
      const c = new THREE.Color().lerpColors(pColor1, pColor2, t);
      particleColors[i * 3] = c.r;
      particleColors[i * 3 + 1] = c.g;
      particleColors[i * 3 + 2] = c.b;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 10. Data Points & Vertical Probability Margin Stems
    const sphereGroup = new THREE.Group();
    const sphereGeo = new THREE.SphereGeometry(0.2, 16, 16);

    const label0Mat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      emissive: 0x00f2fe,
      emissiveIntensity: 0.8,
    });
    const label1Mat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xf43f5e,
      emissiveIntensity: 0.8,
    });

    const stemMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
    });

    for (const pt of dataPoints) {
      const predProb = sigmoid(w1 * pt.x + w2 * pt.y + bias);
      const predHeightY = predProb * surfaceScaleY;
      const targetHeightY = pt.label === 0 ? 0.1 : surfaceScaleY + 0.1;

      // Point sphere
      const mesh = new THREE.Mesh(sphereGeo, pt.label === 0 ? label0Mat : label1Mat);
      mesh.position.set(pt.x, targetHeightY, pt.y);
      sphereGroup.add(mesh);

      // Vertical stem connecting point to its probability position on surface
      const stemGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(pt.x, targetHeightY, pt.y),
        new THREE.Vector3(pt.x, predHeightY, pt.y),
      ]);
      const stemLine = new THREE.Line(stemGeo, stemMat);
      sphereGroup.add(stemLine);
    }
    scene.add(sphereGroup);

    // 11. Animation loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();
      particles.rotation.y += 0.0006;
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
      stemMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      if (decisionLineMesh) {
        decisionLineMesh.geometry.dispose();
        if (Array.isArray(decisionLineMesh.material)) {
          decisionLineMesh.material.forEach((m) => m.dispose());
        } else {
          decisionLineMesh.material.dispose();
        }
      }
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [weights, bias, dataPoints, isAutoRotating]);

  const handleResetCamera = () => {
    if (controlsRef.current && cameraRef.current) {
      cameraRef.current.position.set(11, 12, 15);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  if (!webglSupported) {
    return (
      <div className="aspect-[16/10] rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex flex-col items-center justify-center p-6 text-center space-y-3">
        <AlertTriangle className="w-8 h-8 text-amber-400" />
        <h3 className="text-sm font-bold text-white">WebGL 3D Unavailable</h3>
        <p className="text-xs text-[var(--text-muted)] max-w-sm">
          WebGL acceleration is disabled on your device.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`relative aspect-[16/10] rounded-2xl bg-[#050814] border border-white/[0.08] overflow-hidden flex items-center justify-center shadow-2xl backdrop-blur-xl ${className}`}
    >
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Header Badges */}
      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-mono text-cyan-300 border border-white/[0.1] flex items-center gap-2 pointer-events-none shadow-lg">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        <span>3D Sigmoid Probability Manifold: P(y=1|x)</span>
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-1.5">
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

      {/* Bottom Telemetry HUD */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-4 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/[0.1] text-xs font-mono text-[var(--text-muted)] shadow-lg">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Epoch</span>
            <span className="text-white font-bold">{epoch}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Loss</span>
            <span className="text-rose-400 font-bold">{loss.toFixed(4)}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Accuracy</span>
            <span className="text-emerald-400 font-bold">{(accuracy * 100).toFixed(1)}%</span>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/[0.1] text-xs font-mono text-[var(--text-muted)] shadow-lg">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span className="text-slate-300">Class 0</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-slate-300">Class 1</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-amber-400" />
            <span className="text-amber-300">Boundary (P=0.5)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
