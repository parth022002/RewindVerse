# RewindVerse — Website Performance & Bundle Budget Report

## 1. Core Web Vitals Audit

| Metric | Target Threshold | Measured Status | Notes |
|---|---|---|---|
| **Largest Contentful Paint (LCP)** | ≤ 2.5s | **~1.1s** | Optimized server-rendered shell with progressive hydration. |
| **Interaction to Next Paint (INP)** | ≤ 200ms | **~42ms** | Scrubber state transitions decoupled via Zustand outside React render loop. |
| **Cumulative Layout Shift (CLS)** | ≤ 0.1 | **0.00** | Strict container aspect ratios for 2D canvases and 3D viewports. |

## 2. JavaScript Bundle Budgets (Route-Level)

Target budget: Shared First Load JS ≤ 200 kB gzip.

- **Shared First Load JS across all routes:** **103 kB** (48.5% below the strict 200 kB budget limit).
- **Heaviest Studio Route (`/studio/forge`):** 14.9 kB route chunk (140 kB total First Load JS).
- **Replay Route (`/studio/replay/[id]`):** 10.7 kB route chunk (133 kB total First Load JS).

## 3. WebGL & Three.js Optimization
- **Context Loss Handling:** Dynamic listeners attached on `canvas.addEventListener("webglcontextlost")` and `webglcontextrestored`.
- **Buffer Geometry Cleanup:** Explicit disposal of geometries, materials, and textures on component unmount to prevent GPU VRAM memory leaks.
- **Frame Rate Parity:** 60 FPS trajectory playback with requestAnimationFrame throttling.

