"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { LearningOrbitPoster } from "./LearningOrbitPoster";
import { RotateCcw, Eye, Play, Pause, Compass, Layers } from "lucide-react";

export function LearningOrbitHero() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(24);
  const [activeTier, setActiveTier] = useState<"high" | "balanced" | "static">("high");

  // Check reduced motion preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setIsReducedMotion(mediaQuery.matches);
      if (mediaQuery.matches) {
        setActiveTier("static");
      }
    }
  }, []);

  useEffect(() => {
    if (isReducedMotion) return;
    const container = mountRef.current;
    if (!container) return;

    // Detect WebGL
    let gl: WebGLRenderingContext | null = null;
    try {
      const testCanvas = document.createElement("canvas");
      gl = (testCanvas.getContext("webgl2") || testCanvas.getContext("webgl")) as WebGLRenderingContext | null;
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
    scene.background = new THREE.Color(0x06080e);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 14, 18);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.1;
    controls.minDistance = 8;
    controls.maxDistance = 35;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x06b6d4, 2.2);
    keyLight.position.set(10, 20, 15);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x8b5cf6, 1.8);
    fillLight.position.set(-15, 10, -10);
    scene.add(fillLight);

    // 3. Loss Landscape Geometry (Ackley Objective Manifold)
    const gridSize = 64;
    const size = 16;
    const geometry = new THREE.PlaneGeometry(size, size, gridSize, gridSize);
    geometry.rotateX(-Math.PI / 2);

    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const r = Math.sqrt(x * x + z * z);
      // Ackley formulation scaled for visualization
      const y =
        -3.5 * Math.exp(-0.2 * r) +
        0.8 * Math.cos(1.2 * x) * Math.cos(1.2 * z) +
        3.5;
      pos.setY(i, y);
    }
    geometry.computeVertexNormals();

    const surfaceMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a1428,
      roughness: 0.35,
      metalness: 0.65,
      wireframe: false,
      flatShading: false,
    });

    const mesh = new THREE.Mesh(geometry, surfaceMaterial);
    scene.add(mesh);

    // Wireframe overlay
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x1e3a5f,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const wireframeMesh = new THREE.Mesh(geometry, wireframeMat);
    wireframeMesh.position.y += 0.02;
    scene.add(wireframeMesh);

    // 4. Gradient Descent Trajectory Curve & Checkpoint Spheres
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
    const tubeGeo = new THREE.TubeGeometry(curve, 80, 0.08, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const trajectoryMesh = new THREE.Mesh(tubeGeo, tubeMat);
    scene.add(trajectoryMesh);

    // Active Checkpoint Marker
    const markerGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const markerMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const marker = new THREE.Mesh(markerGeo, markerMat);
    scene.add(marker);

    // Pulse Halo for Marker
    const haloGeo = new THREE.RingGeometry(0.4, 0.7, 24);
    haloGeo.rotateX(-Math.PI / 2);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    scene.add(halo);

    // 5. Animation Render Loop
    let animationId: number;
    let stepCounter = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      controls.update();

      // Scrub marker along curve
      stepCounter = (stepCounter + 0.004) % 1;
      const pt = curve.getPoint(stepCounter);
      marker.position.copy(pt);
      halo.position.copy(pt);
      halo.position.y += 0.05;

      // Pulse halo
      const scale = 1 + 0.25 * Math.sin(Date.now() * 0.006);
      halo.scale.set(scale, scale, scale);

      renderer.render(scene, camera);
    };

    animate();

    // 6. Resize Observer
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener("resize", handleResize);

    // 7. Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      controls.dispose();
      geometry.dispose();
      surfaceMaterial.dispose();
      wireframeMat.dispose();
      tubeGeo.dispose();
      tubeMat.dispose();
      markerGeo.dispose();
      markerMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isReducedMotion]);

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
      className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl border border-white/[0.08] bg-[#06080e] overflow-hidden shadow-2xl"
    >
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating HUD Controls */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-white/[0.08] backdrop-blur-md">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs font-mono font-bold text-white">Learning Orbit 3D</span>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={() => setIsReducedMotion(true)}
          className="px-2.5 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 border border-white/[0.08] text-[11px] font-mono text-[var(--text-muted)] hover:text-white backdrop-blur-md transition-colors"
          title="Switch to accessible 2D static poster"
        >
          2D Poster View
        </button>
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-10 p-3.5 rounded-xl bg-[#080b12]/85 border border-white/[0.08] backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6 text-xs font-mono">
          <div>
            <span className="text-[10px] text-[var(--text-muted)] block uppercase">Manifold</span>
            <span className="text-white font-bold">Non-Convex Ackley</span>
          </div>
          <div>
            <span className="text-[10px] text-[var(--text-muted)] block uppercase">Trajectory</span>
            <span className="text-cyan-400 font-bold">Decoupled Momentum</span>
          </div>
          <div>
            <span className="text-[10px] text-[var(--text-muted)] block uppercase">Optimum</span>
            <span className="text-emerald-400 font-bold">(0.0, 0.0)</span>
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

