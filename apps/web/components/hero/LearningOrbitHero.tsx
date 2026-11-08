"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { LearningOrbitPoster } from "./LearningOrbitPoster";
import { RotateCcw, Play, Pause, Compass, Layers, Activity } from "lucide-react";

export function LearningOrbitHero() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentLoss, setCurrentLoss] = useState<string>("0.4120");
  const [stepNum, setStepNum] = useState<number>(24);

  // References for live control
  const isPlayingRef = useRef<boolean>(true);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Check reduced motion preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setIsReducedMotion(mediaQuery.matches);
    }
  }, []);

  useEffect(() => {
    if (isReducedMotion) return;
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

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 480;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    // Transparent background so the cosmic AmbientMeshBackground shows through seamlessly
    scene.background = new THREE.Color(0x05070e);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 14, 18);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.1;
    controls.minDistance = 8;
    controls.maxDistance = 35;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.65;
    controlsRef.current = controls;

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x00f2fe, 2.4);
    keyLight.position.set(12, 22, 16);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xa855f7, 2.0);
    fillLight.position.set(-16, 12, -12);
    scene.add(fillLight);

    // 3. Loss Landscape Geometry (Ackley Objective Manifold with Elevation Vertex Coloring)
    const gridSize = 72;
    const size = 16;
    const geometry = new THREE.PlaneGeometry(size, size, gridSize, gridSize);
    geometry.rotateX(-Math.PI / 2);

    const pos = geometry.attributes.position;
    let minY = Infinity;
    let maxY = -Infinity;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const r = Math.sqrt(x * x + z * z);
      const y =
        -3.5 * Math.exp(-0.2 * r) +
        0.8 * Math.cos(1.2 * x) * Math.cos(1.2 * z) +
        3.5;
      pos.setY(i, y);
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    geometry.computeVertexNormals();

    // Elevation vertex colors: Deep Navy -> Bright Cyan -> Electric Violet -> Magenta
    const colors: number[] = [];
    const colorBottom = new THREE.Color(0x061838);
    const colorMid = new THREE.Color(0x0284c7);
    const colorHigh = new THREE.Color(0x7c3aed);
    const colorPeak = new THREE.Color(0xec4899);

    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const norm = (y - minY) / (maxY - minY || 1);
      const c = new THREE.Color();
      if (norm < 0.38) {
        c.lerpColors(colorBottom, colorMid, norm / 0.38);
      } else if (norm < 0.72) {
        c.lerpColors(colorMid, colorHigh, (norm - 0.38) / 0.34);
      } else {
        c.lerpColors(colorHigh, colorPeak, (norm - 0.72) / 0.28);
      }
      colors.push(c.r, c.g, c.b);
    }
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const surfaceMaterial = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.32,
      metalness: 0.55,
      emissive: new THREE.Color(0x081a36),
      emissiveIntensity: 0.25,
      flatShading: false,
    });

    const mesh = new THREE.Mesh(geometry, surfaceMaterial);
    scene.add(mesh);

    // Glowing Wireframe Overlay
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const wireframeMesh = new THREE.Mesh(geometry, wireframeMat);
    wireframeMesh.position.y += 0.02;
    scene.add(wireframeMesh);

    // 4. Stardust Particles (Floating Data Points in 3D Space)
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const pColor1 = new THREE.Color(0x00f2fe);
    const pColor2 = new THREE.Color(0xa855f7);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 26;
      particlePositions[i * 3 + 1] = Math.random() * 9 - 0.5;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 26;

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
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 5. Gradient Descent Trajectory Curve & Checkpoint Spheres
    const curvePoints: THREE.Vector3[] = [];
    const numPoints = 40;
    for (let t = 0; t <= numPoints; t++) {
      const frac = t / numPoints;
      const angle = frac * Math.PI * 2.8;
      const radius = (1 - frac) * 6.5 + 0.3;
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);
      const r = Math.sqrt(x * x + z * z);
      const y =
        -3.5 * Math.exp(-0.2 * r) +
        0.8 * Math.cos(1.2 * x) * Math.cos(1.2 * z) +
        3.5 +
        0.15;
      curvePoints.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(curvePoints);
    const tubeGeo = new THREE.TubeGeometry(curve, 90, 0.08, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe });
    const trajectoryMesh = new THREE.Mesh(tubeGeo, tubeMat);
    scene.add(trajectoryMesh);

    // Static Epoch Checkpoint Beads
    const checkpointSteps = [0, 0.25, 0.55, 0.82, 1.0];
    const checkpointMeshes: THREE.Mesh[] = [];
    checkpointSteps.forEach((s, idx) => {
      const pt = curve.getPoint(s);
      const cpGeo = new THREE.SphereGeometry(0.2, 16, 16);
      const cpColor = idx === 0 ? 0xf43f5e : idx === 4 ? 0x10b981 : 0x06b6d4;
      const cpMat = new THREE.MeshBasicMaterial({ color: cpColor });
      const cpMesh = new THREE.Mesh(cpGeo, cpMat);
      cpMesh.position.copy(pt);
      scene.add(cpMesh);
      checkpointMeshes.push(cpMesh);
    });

    // Active Checkpoint Marker (Moving Runner)
    const markerGeo = new THREE.SphereGeometry(0.38, 20, 20);
    const markerMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe });
    const marker = new THREE.Mesh(markerGeo, markerMat);
    scene.add(marker);

    // Pulse Halo for Marker
    const haloGeo = new THREE.RingGeometry(0.42, 0.78, 28);
    haloGeo.rotateX(-Math.PI / 2);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    scene.add(halo);

    // 6. Animation Render Loop
    let animationId: number;
    let stepCounter = 0.55;
    let lastTelemetryUpdate = 0;

    const animate = (timestamp: number) => {
      animationId = requestAnimationFrame(animate);

      if (isPlayingRef.current) {
        controls.autoRotate = true;
        controls.update();

        // Scrub marker along curve
        stepCounter = (stepCounter + 0.0035) % 1;
        const pt = curve.getPoint(stepCounter);
        marker.position.copy(pt);
        halo.position.copy(pt);
        halo.position.y += 0.05;

        // Pulse halo
        const scale = 1 + 0.3 * Math.sin(Date.now() * 0.007);
        halo.scale.set(scale, scale, scale);

        // Slowly drift stardust particles
        particles.rotation.y += 0.0006;

        // Update telemetry at 10Hz to save CPU
        if (timestamp - lastTelemetryUpdate > 100) {
          lastTelemetryUpdate = timestamp;
          const currentStepCalc = Math.round(stepCounter * 40);
          setStepNum(currentStepCalc);
          const simulatedLoss = 0.045 + (1 - stepCounter) * (1 - stepCounter) * 2.85;
          setCurrentLoss(simulatedLoss.toFixed(4));
        }
      } else {
        controls.autoRotate = false;
        controls.update();
      }

      renderer.render(scene, camera);
    };

    animationId = requestAnimationFrame(animate);

    // 7. Resize Observer
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener("resize", handleResize);

    // 8. Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      controls.dispose();
      geometry.dispose();
      surfaceMaterial.dispose();
      wireframeMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      tubeGeo.dispose();
      tubeMat.dispose();
      markerGeo.dispose();
      markerMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      checkpointMeshes.forEach((m) => {
        m.geometry.dispose();
        if (Array.isArray(m.material)) m.material.forEach((mat) => mat.dispose());
        else m.material.dispose();
      });
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isReducedMotion]);

  const handleResetCamera = () => {
    if (controlsRef.current && cameraRef.current) {
      cameraRef.current.position.set(0, 14, 18);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  if (!webglSupported || isReducedMotion) {
    return (
      <LearningOrbitPoster
        onRetry={() => {
          setIsReducedMotion(false);
          setWebglSupported(true);
        }}
      />
    );
  }

  return (
    <div
      role="region"
      aria-label="Interactive 3D Learning Orbit and Optimization Manifold"
      className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl border border-white/[0.1] bg-[#05070e]/90 overflow-hidden shadow-2xl backdrop-blur-xl"
    >
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating HUD Controls */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/70 border border-white/[0.1] backdrop-blur-md shadow-lg">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs font-mono font-bold text-white tracking-wide">
            Learning Orbit 3D
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        {/* Play/Pause Button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/70 hover:bg-black/90 border border-white/[0.1] text-xs font-mono text-cyan-300 backdrop-blur-md transition-colors"
          title={isPlaying ? "Pause rotation & trajectory" : "Resume animation"}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isPlaying ? "Pause" : "Play"}</span>
        </button>

        {/* Reset Camera */}
        <button
          onClick={handleResetCamera}
          className="p-1.5 rounded-xl bg-black/70 hover:bg-black/90 border border-white/[0.1] text-[var(--text-muted)] hover:text-white backdrop-blur-md transition-colors"
          title="Reset camera viewpoint"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Accessible 2D Fallback Switch */}
        <button
          onClick={() => setIsReducedMotion(true)}
          className="hidden sm:inline-flex px-2.5 py-1.5 rounded-xl bg-black/70 hover:bg-black/90 border border-white/[0.1] text-[11px] font-mono text-[var(--text-muted)] hover:text-white backdrop-blur-md transition-colors"
          title="Switch to accessible 2D static poster"
        >
          2D Poster
        </button>
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-10 p-3.5 rounded-xl bg-[#080b14]/90 border border-white/[0.1] backdrop-blur-md flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-5 sm:gap-7 text-xs font-mono">
          <div>
            <span className="text-[10px] text-[var(--text-muted)] block uppercase tracking-wider">
              Manifold
            </span>
            <span className="text-white font-bold">Non-Convex Ackley</span>
          </div>
          <div>
            <span className="text-[10px] text-[var(--text-muted)] block uppercase tracking-wider">
              Trajectory
            </span>
            <span className="text-cyan-400 font-bold">Decoupled Momentum</span>
          </div>
          <div>
            <span className="text-[10px] text-[var(--text-muted)] block uppercase tracking-wider">
              Step / Epoch
            </span>
            <span className="text-violet-300 font-bold">
              {stepNum} <span className="text-[10px] text-[var(--text-muted)]">/ 40</span>
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[var(--text-muted)] block uppercase tracking-wider">
              Loss (J)
            </span>
            <span className="text-emerald-400 font-bold">{currentLoss}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Drag to rotate • Scroll to zoom</span>
        </div>
      </div>
    </div>
  );
}
