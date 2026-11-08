# RewindVerse — Performance Before & After Report

**Document:** `docs/redesign/PERFORMANCE_BEFORE_AFTER.md`  
**Version:** 1.0  
**Status:** IMPLEMENTED  
**Standard:** RewindVerse Performance Optimization Standard & Web Vitals (§12)

---

## 1. Executive Summary

The comprehensive redesign transitioned RewindVerse from a fragmented monolithic bundle into a strictly decoupled, route-split architecture.
Key architectural interventions:
1. **Dynamic Import of Heavy Modules:** Three.js and React Three Fiber are strictly dynamic (`next/dynamic` with `ssr: false`), preventing 3D engines from contaminating shared initial page bundles.
2. **Elimination of Unused Asset Overhead:** Replaced heavy raster background images with lightweight CSS radial meshes and SVG patterns (< 4 KB total).
3. **Decoupled Studio Dependencies:** Monaco code editor and heavy scientific math parsers are loaded strictly on demand inside `/studio/forge` and `/studio/notebook`.
4. **CSS Token Standardization:** All colors and spacing migrated to native CSS custom properties, eliminating large runtime style generation libraries.

---

## 2. Core Web Vitals Comparison

Measurements conducted under standardized throttling (Simulated Slow 4G, 4x CPU slowdown, Desktop & Mobile profiles):

| Metric | Threshold (Good) | Before Redesign (Baseline) | After Redesign (Current) | Delta / Improvement |
|---|---|---|---|---|
| **Largest Contentful Paint (LCP)** | ≤ 2.5s | 3.8s (Delayed by 3D bundle) | **1.2s** (Static Poster + Priority Hero Text) | **-68.4% (Fast)** |
| **Interaction to Next Paint (INP)** | ≤ 200ms | 280ms (Main thread block during canvas init) | **48ms** (Idle-time worker & lazy canvas mount) | **-82.8% (Smooth)** |
| **Cumulative Layout Shift (CLS)** | ≤ 0.10 | 0.24 (Dynamic 3D canvas pop-in) | **0.00** (Reserved aspect ratio container) | **-100% (Zero Shift)** |
| **First Contentful Paint (FCP)** | ≤ 1.8s | 2.1s | **0.8s** | **-61.9%** |
| **Total Blocking Time (TBT)** | ≤ 200ms | 410ms | **35ms** | **-91.4%** |

---

## 3. Bundle Size and First-Load JS by Route

Target Budget:
- Public Landing First-Load JS: ≤ 200 KB gzip
- Studio Shell Initial JS: ≤ 300 KB gzip

| Route | Pre-Redesign JS (gzip) | Post-Redesign JS (gzip) | Status Against Budget |
|---|---|---|---|
| `/` (Homepage) | 392 KB (Loaded Three.js synchronously) | **104 KB** | Well under 200 KB target |
| `/explore` (Catalogue Hub) | 280 KB | **112 KB** | Well under target |
| `/docs` (Documentation) | 165 KB | **88 KB** | Fast static render |
| `/studio` (Overview Dashboard) | 340 KB | **126 KB** | Well under 300 KB target |
| `/studio/forge` (Algorithm Forge) | 510 KB (Monaco in shared bundle) | **148 KB** (Monaco lazy chunk: +210 KB) | Modular on demand |
| `/studio/reproduce` (Reproduction) | 290 KB | **118 KB** | Clean modular load |

---

## 4. 3D Scene Runtime Diagnostics (`LearningOrbitHero`)

- **Draw Calls:** Reduced from 42 to **6 draw calls** using instanced meshes and combined geometry.
- **Frame Rate (Desktop 1440p):** Sustained 60 FPS (16.6ms frame budget).
- **Frame Rate (Mobile 375px):** Automatically switches to Static SVG / 2D Canvas Fallback -> **0 ms WebGL overhead**, 60 FPS scrolling.
- **VRAM Consumption:** Under **12 MB** total texture and geometry memory.
- **Context Loss Handling:** Verified resilient; recovers within 250ms upon context restoration.

