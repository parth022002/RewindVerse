"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ObjectiveType, OBJECTIVES } from "@rewindverse/rewindml";
import { RotateCcw, AlertTriangle, Grid, Play, Pause, Compass } from "lucide-react";

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
  const [wireframeOn, setWireframeOn] = useState<boolean>(true);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(false);

  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const wireframeMeshRef = useRef<THREE.Mesh | null>(null);

  // Progressive enhancement check for WebGPU hardware support
  useEffect(() => {
    if (typeof navigator !== "undefined" && "gpu" in navigator) {
      (navigator as any).gpu
        ?.requestAdapter?.()
        .then((adapter: any) => {
          if (adapter) {
            setGpuBackend("WebGL 2 • WebGPU Ready");
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
    scene.background = new THREE.Color(0x050814);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(12, 14, 18);
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
    controls.maxDistance = 50;
    controls.minDistance = 3;
    controls.autoRotate = isAutoRotating;
    controls.autoRotateSpeed = 0.8;
    controlsRef.current = controls;

    // 5. Lighting (Studio 3-Point Lighting)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x00f2fe, 2.2);
    keyLight.position.set(14, 22, 14);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xa855f7, 1.8);
    fillLight.position.set(-14, 10, -12);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xec4899, 1.0);
    rimLight.position.set(0, -10, 15);
    scene.add(rimLight);

    // 6. Generate 3D Loss Surface Mesh with Scientific Elevation Gradients
    const objDef = OBJECTIVES[objectiveType];
    const [xMin, xMax] = objDef.domain.x;
    const [yMin, yMax] = objDef.domain.y;

    const segments = 56;
    const geometry = new THREE.PlaneGeometry(xMax - xMin, yMax - yMin, segments, segments);
    geometry.rotateX(-Math.PI / 2); // Lay flat on X-Z plane

    const pos = geometry.attributes.position;
    const colors: number[] = [];

    // Scale factor to keep loss height visually readable in scene
    const heightScale =
      objectiveType === "rosenbrock" ? 0.02 : objectiveType === "quadratic" ? 0.18 : 0.3;

    let minH = Infinity;
    let maxH = -Infinity;
    const rawHeights: number[] = [];

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
      rawHeights.push(clampedHeight);
      if (clampedHeight < minH) minH = clampedHeight;
      if (clampedHeight > maxH) maxH = clampedHeight;
    }

    // 4-Color Scientific Elevation Mapping
    const colorBottom = new THREE.Color(0x061838);
    const colorMid = new THREE.Color(0x00f2fe);
    const colorHigh = new THREE.Color(0x8b5cf6);
    const colorPeak = new THREE.Color(0xec4899);

    for (let i = 0; i < pos.count; i++) {
      const h = rawHeights[i];
      const norm = (h - minH) / (maxH - minH || 1);
      const c = new THREE.Color();
      if (norm < 0.35) {
        c.lerpColors(colorBottom, colorMid, norm / 0.35);
      } else if (norm < 0.72) {
        c.lerpColors(colorMid, colorHigh, (norm - 0.35) / 0.37);
      } else {
        c.lerpColors(colorHigh, colorPeak, (norm - 0.72) / 0.28);
      }
      colors.push(c.r, c.g, c.b);
    }

    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();

    const surfaceMaterial = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.28,
      metalness: 0.45,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.88,
      emissive: new THREE.Color(0x06152d),
      emissiveIntensity: 0.25,
    });

    const surfaceMesh = new THREE.Mesh(geometry, surfaceMaterial);
    scene.add(surfaceMesh);

    // Wireframe overlay for technical clarity
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const wireframeMesh = new THREE.Mesh(geometry, wireframeMat);
    wireframeMesh.position.y += 0.02;
    wireframeMeshRef.current = wireframeMesh;
    scene.add(wireframeMesh);

    // Precision Grid floor
    const grid = new THREE.GridHelper(xMax - xMin, 12, 0x00f2fe, 0x1e293b);
    grid.position.y = minH - 1.5;
    scene.add(grid);

    // 7. Ambient Stardust Particles (Floating Data Points in 3D Space)
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const pColor1 = new THREE.Color(0x00f2fe);
    const pColor2 = new THREE.Color(0x8b5cf6);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * (xMax - xMin) * 2.2;
      particlePositions[i * 3 + 1] = Math.random() * 18 - 4;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * (yMax - yMin) * 2.2;

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

    // 8. 3D Volumetric Glowing Trajectory Tubes & Checkpoints
    let trajectoryTube: THREE.Mesh | null = null;
    let sphereMarker: THREE.Mesh | null = null;
    let markerHalo: THREE.Mesh | null = null;
    let secondaryTube: THREE.Mesh | null = null;
    let secondaryMarker: THREE.Mesh | null = null;

    if (trajectory.length > 0) {
      const activePath = trajectory.slice(0, currentStepIndex + 1);
      const pathPoints = activePath.map((pt) => {
        const h = Math.max(-10, Math.min(15, pt.loss * heightScale)) + 0.18;
        return new THREE.Vector3(pt.x, h, pt.y);
      });

      if (pathPoints.length >= 2) {
        const curve = new THREE.CatmullRomCurve3(pathPoints);
        const tubeGeo = new THREE.TubeGeometry(curve, Math.max(20, pathPoints.length * 3), 0.08, 8, false);
        const tubeMat = new THREE.MeshStandardMaterial({
          color: 0x00f2fe,
          emissive: 0x00f2fe,
          emissiveIntensity: 0.9,
          roughness: 0.2,
        });
        trajectoryTube = new THREE.Mesh(tubeGeo, tubeMat);
        scene.add(trajectoryTube);
      }

      // Active Step Sphere Marker (Glowing Cyan Core)
      const curPt = trajectory[currentStepIndex] || trajectory[0];
      const curH = Math.max(-10, Math.min(15, curPt.loss * heightScale)) + 0.22;
      const sphereGeo = new THREE.SphereGeometry(0.32, 20, 20);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x00f2fe,
        emissiveIntensity: 1.0,
      });
      sphereMarker = new THREE.Mesh(sphereGeo, sphereMat);
      sphereMarker.position.set(curPt.x, curH, curPt.y);
      scene.add(sphereMarker);

      // Active Marker Pulsing Halo Ring
      const haloGeo = new THREE.RingGeometry(0.38, 0.68, 24);
      haloGeo.rotateX(-Math.PI / 2);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0x00f2fe,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
      markerHalo = new THREE.Mesh(haloGeo, haloMat);
      markerHalo.position.set(curPt.x, curH + 0.05, curPt.y);
      scene.add(markerHalo);
    }

    // Secondary Trajectory (for Compare mode - Run B in Violet)
    if (secondaryTrajectory && secondaryTrajectory.length > 0) {
      const activeSecPath = secondaryTrajectory.slice(0, currentStepIndex + 1);
      const secPoints = activeSecPath.map((pt) => {
        const h = Math.max(-10, Math.min(15, pt.loss * heightScale)) + 0.2;
        return new THREE.Vector3(pt.x, h, pt.y);
      });

      if (secPoints.length >= 2) {
        const secCurve = new THREE.CatmullRomCurve3(secPoints);
        const secTubeGeo = new THREE.TubeGeometry(secCurve, Math.max(20, secPoints.length * 3), 0.08, 8, false);
        const secTubeMat = new THREE.MeshStandardMaterial({
          color: 0xa855f7,
          emissive: 0xa855f7,
          emissiveIntensity: 0.9,
          roughness: 0.2,
        });
        secondaryTube = new THREE.Mesh(secTubeGeo, secTubeMat);
        scene.add(secondaryTube);
      }

      const curSecPt = secondaryTrajectory[currentStepIndex] || secondaryTrajectory[0];
      const curSecH = Math.max(-10, Math.min(15, curSecPt.loss * heightScale)) + 0.24;
      const secSphereGeo = new THREE.SphereGeometry(0.32, 20, 20);
      const secSphereMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xa855f7,
        emissiveIntensity: 1.0,
      });
      secondaryMarker = new THREE.Mesh(secSphereGeo, secSphereMat);
      secondaryMarker.position.set(curSecPt.x, curSecH, curSecPt.y);
      scene.add(secondaryMarker);
    }

    // 9. Animation render loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();

      // Drift floating stardust particles
      particles.rotation.y += 0.0006;

      // Pulse active marker halo
      if (markerHalo) {
        const scale = 1 + 0.25 * Math.sin(Date.now() * 0.007);
        markerHalo.scale.set(scale, scale, scale);
      }

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

    // 10. Resize observer
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
      particleGeo.dispose();
      particleMat.dispose();
      if (trajectoryTube) {
        trajectoryTube.geometry.dispose();
        if (Array.isArray(trajectoryTube.material)) {
          trajectoryTube.material.forEach((m) => m.dispose());
        } else {
          trajectoryTube.material.dispose();
        }
      }
      if (sphereMarker) {
        sphereMarker.geometry.dispose();
        if (Array.isArray(sphereMarker.material)) {
          sphereMarker.material.forEach((m) => m.dispose());
        } else {
          sphereMarker.material.dispose();
        }
      }
      if (markerHalo) {
        markerHalo.geometry.dispose();
        if (Array.isArray(markerHalo.material)) {
          markerHalo.material.forEach((m) => m.dispose());
        } else {
          markerHalo.material.dispose();
        }
      }
      if (secondaryTube) {
        secondaryTube.geometry.dispose();
        if (Array.isArray(secondaryTube.material)) {
          secondaryTube.material.forEach((m) => m.dispose());
        } else {
          secondaryTube.material.dispose();
        }
      }
      if (secondaryMarker) {
        secondaryMarker.geometry.dispose();
        if (Array.isArray(secondaryMarker.material)) {
          secondaryMarker.material.forEach((m) => m.dispose());
        } else {
          secondaryMarker.material.dispose();
        }
      }
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      cameraRef.current = null;
      wireframeMeshRef.current = null;
    };
  }, [objectiveType, trajectory, currentStepIndex, secondaryTrajectory, isAutoRotating]);

  // Synchronize wireframe overlay visibility dynamically
  useEffect(() => {
    if (wireframeMeshRef.current) {
      wireframeMeshRef.current.visible = wireframeOn;
    }
  }, [wireframeOn]);

  const handleResetCamera = () => {
    if (controlsRef.current && cameraRef.current) {
      cameraRef.current.position.set(12, 14, 18);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const handleSetPreset = (preset: "iso" | "top" | "side") => {
    if (!cameraRef.current || !controlsRef.current) return;
    if (preset === "iso") {
      cameraRef.current.position.set(12, 14, 18);
    } else if (preset === "top") {
      cameraRef.current.position.set(0, 26, 0.001);
    } else if (preset === "side") {
      cameraRef.current.position.set(24, 4, 0);
    }
    cameraRef.current.lookAt(0, 0, 0);
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
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

  const curLossVal = trajectory[currentStepIndex]?.loss?.toFixed(4) || "—";
  const curCoords = trajectory[currentStepIndex]
    ? `(${trajectory[currentStepIndex].x.toFixed(2)}, ${trajectory[currentStepIndex].y.toFixed(2)})`
    : "—";

  return (
    <div
      className={`relative aspect-[16/10] rounded-2xl bg-[#050814] border border-white/[0.08] overflow-hidden flex items-center justify-center shadow-2xl backdrop-blur-xl ${className}`}
    >
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 3D HUD Badges */}
      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-mono text-cyan-300 border border-white/[0.1] flex items-center gap-2 pointer-events-none shadow-lg">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        {secondaryTrajectory ? (
          <span>
            <strong className="text-cyan-400">Run A</strong> vs{" "}
            <strong className="text-purple-400">Run B</strong> (3D Surface)
          </span>
        ) : (
          <span>3D Objective Surface: z = f(x, y)</span>
        )}
      </div>

      <div className="absolute top-4 right-4 flex flex-wrap items-center gap-1.5">
        <span className="hidden sm:inline-block bg-black/70 backdrop-blur-md px-2.5 py-1.5 rounded-xl text-[10px] font-mono text-cyan-300 border border-white/[0.1]">
          {gpuBackend}
        </span>

        {/* Auto-Rotate Toggle */}
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
          <span className="hidden md:inline">Rotate</span>
        </button>

        {/* Wireframe Toggle */}
        <button
          onClick={() => setWireframeOn((prev) => !prev)}
          className={`backdrop-blur-md px-2.5 py-1.5 rounded-xl text-xs font-mono border transition-colors flex items-center gap-1 ${
            wireframeOn
              ? "bg-cyan-950/80 border-cyan-500/50 text-cyan-300"
              : "bg-black/70 hover:bg-black/90 border-white/[0.1] text-[var(--text-muted)] hover:text-white"
          }`}
          title="Toggle 3D Wireframe Overlay"
        >
          <Grid className="w-3 h-3" />
          <span className="hidden md:inline">Mesh</span>
        </button>

        {/* Camera Angle Presets */}
        <div className="flex items-center bg-black/70 backdrop-blur-md rounded-xl border border-white/[0.1] p-0.5 text-[11px] font-mono">
          <button
            onClick={() => handleSetPreset("iso")}
            className="px-2 py-1 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-colors"
            title="Isometric Angle"
          >
            Iso
          </button>
          <button
            onClick={() => handleSetPreset("top")}
            className="px-2 py-1 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-colors"
            title="Top-Down View"
          >
            Top
          </button>
          <button
            onClick={() => handleSetPreset("side")}
            className="px-2 py-1 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-colors"
            title="Side Elevation View"
          >
            Side
          </button>
        </div>

        <button
          onClick={handleResetCamera}
          className="bg-black/70 hover:bg-black/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl text-xs font-mono text-white border border-white/[0.1] flex items-center gap-1.5 transition-colors"
          title="Reset Camera Angle"
        >
          <RotateCcw className="w-3 h-3 text-cyan-400" />
          <span className="hidden lg:inline">Reset</span>
        </button>
      </div>

      {/* Telemetry Footer */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-4 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/[0.1] text-xs font-mono text-[var(--text-muted)] shadow-lg">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Coord</span>
            <span className="text-white font-bold">{curCoords}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Loss</span>
            <span className="text-cyan-400 font-bold">{curLossVal}</span>
          </div>
        </div>

        <div className="bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-mono text-white border border-white/[0.1] shadow-lg">
          Step {currentStepIndex} of {Math.max(0, trajectory.length - 1)}
        </div>
      </div>
    </div>
  );
}
