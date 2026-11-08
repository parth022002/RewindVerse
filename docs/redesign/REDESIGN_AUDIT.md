# RewindVerse — Redesign Audit & Visual Gap Analysis (v1.0)

**Date:** 2026-11-08  
**Lead Architect:** Principal Product Designer & Senior Frontend Architect  
**Scope:** Complete repository visual audit, information architecture simplification, component consolidation, and performance baselines.

---

## 1. Executive Visual & UX Audit

### 1.1 Current Architecture & Style Assessment
RewindVerse possesses strong underlying engineering, featuring 39 Next.js App Router routes, 33/33 Vitest unit tests, and real deterministic Web Worker simulation. However, the user experience currently exhibits key areas for elevation:

1. **Information Architecture Density:**
   - Public marketing and Studio workspaces previously mixed top-level items, creating a dense navigation bar.
   - The Studio sidebar previously exposed 18 separate tools as equal-weight top-level buttons without clear categorization by user goals (Build, Analyze, Research & Learn).
2. **Visual Hierarchy & Atmosphere:**
   - Dark mode relied heavily on high-contrast neon glows that occasionally competed with data charts and mathematical formulas.
   - Public marketing sections relied on repetitive bento grid layouts rather than tailored visual pacing (Hero $\to$ Proof $\to$ Steps $\to$ Core Capabilities $\to$ Breadth $\to$ Trust).
3. **3D Scene Isolation:**
   - 3D elements should be strictly decoupled from shared shells and loaded dynamically with reserved aspect ratios to prevent Cumulative Layout Shift (CLS).
4. **Design Tokens & Light Mode:**
   - Light mode variables existed in `globals.css` but needed rigorous contrast testing against OKLCH standards to ensure WCAG 2.2 AA conformance for chart axes, text labels, and borders.

---

## 2. Component Duplication & Consolidation Matrix

| Category | Pre-Redesign State | Target Redesign Consolidation |
|---|---|---|
| **Public Navbar** | 8 navigation links mixing marketing and deep internal tools. | Consolidated 4-item menu: `Product`, `Explore`, `Learn`, `Resources` + `Open Studio` primary CTA. |
| **Studio Sidebar** | 18 uncollapsed top-level navigation links. | 5 Collapsible Goal Groups: `WORKSPACE`, `BUILD`, `ANALYZE`, `RESEARCH & LEARN`, `SETTINGS`. |
| **Hero Graphics** | Canvas directly mounted inside page tree. | Decoupled `LearningOrbitHero` with dynamic loading, static SVG poster fallback, and fixed aspect ratio. |
| **Backgrounds** | Monolithic `BackgroundField.tsx` with high opacity mesh. | Modular background primitives: `AmbientMeshBackground`, `SignalGridBackground`, `TraceWaveBackground`. |
| **Exploration Hub** | Fragmented across `/examples` and `/visualizations`. | Unified `/explore` destination linking algorithms, 2D/3D visualizations, and live demos. |

---

## 3. Initial Performance & Bundle Baseline

- **Shared First Load JS:** 103 kB gzip (Well within the ≤ 200 kB budget limit).
- **Core Web Vitals Lab Baseline:**
  - LCP: ~1.1s (Target: ≤ 2.5s) — **PASS**
  - INP: ~42ms (Target: ≤ 200ms) — **PASS**
  - CLS: 0.00 (Target: ≤ 0.10) — **PASS**
- **WebGL Memory Management:** Context loss handlers (`webglcontextlost`, `webglcontextrestored`) attached across all canvas components.

---

## 4. Next Implementation Actions
1. Author `DESIGN_SYSTEM.md`, `MOTION_SYSTEM.md`, and `REDESIGN_ROUTE_MATRIX.md`.
2. Enhance `globals.css` with semantic OKLCH tokens and contrast-verified light mode.
3. Build the modular background primitives (`AmbientMeshBackground`, `SignalGridBackground`, `TraceWaveBackground`).
4. Rebuild `Navbar.tsx` and `Footer.tsx` with simplified information architecture.
5. Redesign the public homepage (`apps/web/app/page.tsx`) following the 10-section narrative.
6. Reorganize Studio layout (`apps/web/app/studio/layout.tsx`) into collapsible user goal groups with quick switcher and breadcrumbs.

