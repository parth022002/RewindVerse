"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ObjectiveType, OBJECTIVES } from "@rewindverse/rewindml";
import { RotateCcw, AlertTriangle, Layers } from "lucide-react";

interface ThreeSurfaceViewerProps {
  objectiveType: ObjectiveType;
  trajectory: { step: number; x: number; y: number; loss: number }[];
  currentStepIndex: number;
  secondaryTrajectory?: { step: number; x: number; y: number; loss: number }[];
  className?: string;
}

export function ThreeSurfaceViewer({
  objectiveType,
  trajectory,
  currentStepIndex,
  secondaryTrajectory,
  className = "",
}: ThreeSurfaceViewerProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [gpuBackend, setGpuBackend] = useState<string>("WebGL 2 (Active)");
  const controlsRef = useRef<OrbitControls | null>(null);

  // Progressive enhancement check for WebGPU hardware support
  useEffect(() => {
    if (typeof navigator !== "undefined" && "gpu" in navigator) {
      (navigator as any).gpu
        ?.requestAdapter?.()
        .then((adapter: any) => {
          if (adapter) {
            setGpuBackend("WebGL 2 (Active) • WebGPU Ready");
          }
        })
        .catch(() => {});
    }
  }, []);

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
    camera.position.set(12, 14, 18);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 50;
    controls.minDistance = 3;
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00d2ff, 1.2);
    dirLight1.position.set(10, 20, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa855f7, 0.8);
    dirLight2.position.set(-10, -10, -10);
    scene.add(dirLight2);

    // 6. Generate 3D Loss Surface Mesh
    const objDef = OBJECTIVES[objectiveType];
    const [xMin, xMax] = objDef.domain.x;
    const [yMin, yMax] = objDef.domain.y;

    const segments = 45;
    const geometry = new THREE.PlaneGeometry(xMax - xMin, yMax - yMin, segments, segments);
    geometry.rotateX(-Math.PI / 2); // Lay flat on X-Z plane

    const pos = geometry.attributes.position;
    const colors: number[] = [];

    // Scale factor to keep loss height visually readable in scene
    const heightScale = objectiveType === "rosenbrock" ? 0.02 : objectiveType === "quadratic" ? 0.18 : 0.3;

    for (let i = 0; i < pos.count; i++) {
      const u = pos.getX(i);
      const v = pos.getZ(i);

      let val = 0;
      if (objectiveType === "quadratic") {
        val = 0.5 * (u * u + 10 * v * v);
      } else if (objectiveType === "rosenbrock") {
        const a = 1 - u;
        const b = v - u * u;
        val = a * a + 100 * b * b;
      } else {
        // saddle
        val = u * u - v * v;
      }

      const clampedHeight = Math.max(-10, Math.min(15, val * heightScale));
      pos.setY(i, clampedHeight);

      // Color mapping: Cyan at bottom, Violet at top
      const normalizedHeight = Math.max(0, Math.min(1, (clampedHeight + 5) / 15));
      const color = new THREE.Color().setHSL(0.55 - normalizedHeight * 0.35, 0.85, 0.45);
      colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();

    const surfaceMaterial = new THREE.MeshStandardMaterial({
      vertexColors: true,
      wireframe: false,
      roughness: 0.3,
      metalness: 0.1,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });

    const surfaceMesh = new THREE.Mesh(geometry, surfaceMaterial);
    scene.add(surfaceMesh);

    // Wireframe overlay for technical clarity
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x00d2ff,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const wireframeMesh = new THREE.Mesh(geometry, wireframeMat);
    scene.add(wireframeMesh);

    // Grid floor
    const grid = new THREE.GridHelper(xMax - xMin, 10, 0x00d2ff, 0x1e293b);
    grid.position.y = -3;
    scene.add(grid);

    // 7. Trajectory Path in 3D
    let trajectoryLine: THREE.Line | null = null;
    let sphereMarker: THREE.Mesh | null = null;
    let secondaryLine: THREE.Line | null = null;
    let secondaryMarker: THREE.Mesh | null = null;

    if (trajectory.length > 0) {
      const activePath = trajectory.slice(0, currentStepIndex + 1);
      const pathPoints = activePath.map((pt) => {
        const h = Math.max(-10, Math.min(15, pt.loss * heightScale)) + 0.15; // slightly above surface
        return new THREE.Vector3(pt.x, h, pt.y);
      });

      const lineGeo = new THREE.BufferGeometry().setFromPoints(pathPoints);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x00ffff,
        linewidth: 3,
      });
      trajectoryLine = new THREE.Line(lineGeo, lineMat);
      scene.add(trajectoryLine);

      // Active Step Sphere Marker (Cyan)
      const curPt = trajectory[currentStepIndex] || trajectory[0];
      const curH = Math.max(-10, Math.min(15, curPt.loss * heightScale)) + 0.2;
      const sphereGeo = new THREE.SphereGeometry(0.3, 16, 16);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x00d2ff,
        emissiveIntensity: 0.8,
      });
      sphereMarker = new THREE.Mesh(sphereGeo, sphereMat);
      sphereMarker.position.set(curPt.x, curH, curPt.y);
      scene.add(sphereMarker);
    }

    // Secondary Trajectory (for Compare mode)
    if (secondaryTrajectory && secondaryTrajectory.length > 0) {
      const activeSecPath = secondaryTrajectory.slice(0, currentStepIndex + 1);
      const secPoints = activeSecPath.map((pt) => {
        const h = Math.max(-10, Math.min(15, pt.loss * heightScale)) + 0.18;
        return new THREE.Vector3(pt.x, h, pt.y);
      });

      const secLineGeo = new THREE.BufferGeometry().setFromPoints(secPoints);
      const secLineMat = new THREE.LineBasicMaterial({
        color: 0xa855f7,
        linewidth: 3,
      });
      secondaryLine = new THREE.Line(secLineGeo, secLineMat);
      scene.add(secondaryLine);

      const curSecPt = secondaryTrajectory[currentStepIndex] || secondaryTrajectory[0];
      const curSecH = Math.max(-10, Math.min(15, curSecPt.loss * heightScale)) + 0.22;
      const secSphereGeo = new THREE.SphereGeometry(0.3, 16, 16);
      const secSphereMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xa855f7,
        emissiveIntensity: 0.8,
      });
      secondaryMarker = new THREE.Mesh(secSphereGeo, secSphereMat);
      secondaryMarker.position.set(curSecPt.x, curSecH, curSecPt.y);
      scene.add(secondaryMarker);
    }

    // 8. Animation loop & WebGL context loss recovery
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(animId);
    };
    const handleContextRestored = () => {
      animate();
    };
    renderer.domElement.addEventListener("webglcontextlost", handleContextLost, false);
    renderer.domElement.addEventListener("webglcontextrestored", handleContextRestored, false);

    // 9. Resize observer
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
      renderer.domElement.removeEventListener("webglcontextlost", handleContextLost);
      renderer.domElement.removeEventListener("webglcontextrestored", handleContextRestored);
      controls.dispose();
      geometry.dispose();
      surfaceMaterial.dispose();
      wireframeMat.dispose();
      if (trajectoryLine) {
        trajectoryLine.geometry.dispose();
        (trajectoryLine.material as THREE.Material).dispose();
      }
      if (sphereMarker) {
        sphereMarker.geometry.dispose();
        (sphereMarker.material as THREE.Material).dispose();
      }
      if (secondaryLine) {
        secondaryLine.geometry.dispose();
        (secondaryLine.material as THREE.Material).dispose();
      }
      if (secondaryMarker) {
        secondaryMarker.geometry.dispose();
        (secondaryMarker.material as THREE.Material).dispose();
      }
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [objectiveType, trajectory, currentStepIndex, secondaryTrajectory]);

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
          Your browser or device does not currently have WebGL hardware acceleration enabled. Please use the 2D view.
        </p>
      </div>
    );
  }

  return (
    <div className={`relative aspect-[16/10] rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden flex items-center justify-center shadow-xl ${className}`}>
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 3D HUD Badges */}
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-mono text-cyan-400 border border-white/10 flex items-center gap-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        {secondaryTrajectory ? (
          <span>
            <strong className="text-cyan-400">Run A</strong> vs <strong className="text-purple-400">Run B</strong> (3D Surface)
          </span>
        ) : (
          "3D Objective Surface: z = f(x, y)"
        )}
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-2">
        <span className="hidden sm:inline-block bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-lg text-[10px] font-mono text-cyan-300 border border-white/10">
          {gpuBackend}
        </span>
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
        Left Click + Drag: Orbit • Right Click: Pan • Scroll: Zoom
      </div>

      <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-mono text-white border border-white/10 pointer-events-none">
        Step {currentStepIndex} of {Math.max(0, trajectory.length - 1)}
      </div>
    </div>
  );
}

