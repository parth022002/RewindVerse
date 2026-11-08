# RewindVerse Documentation Index & Architecture Blueprint

Welcome to the central documentation index for **RewindVerse** — the interactive machine learning training replay, learning, and experiment intelligence platform.

---

## 📚 Core Specification Documents

The platform is designed and governed by 8 foundational specification documents:

### 1. Product & Business Foundations
- [`RewindVerse_Final_PRD.md`](./RewindVerse_Final_PRD.md)  
  *Product Requirements Document (v4.1)*: Platform vision, target user personas, core functional modules (RewindML, Rewind Replay, Rewind Insights, Rewind Compare, Rewind Academy, RVTS), feature matrices, and launch criteria.

### 2. Architecture & Technical Stack
- [`RewindVerse_Technical_Stack_Final.md`](./RewindVerse_Technical_Stack_Final.md)  
  *Technical Architecture Specification (v2.0)*: Monorepo workspace structure, Next.js App Router conventions, Web Workers data pipelines, state management (Zustand), offline storage (IndexedDB), and cloud infrastructure (Neon PostgreSQL, AWS S3 / Cloudflare R2).

### 3. Design & Visual Experience
- [`RewindVerse_Website_Design_and_Engineering_Standards.md`](./RewindVerse_Website_Design_and_Engineering_Standards.md)  
  *Website Design & Engineering Standard (v1.0)*: Dark-first UI design system, OKLCH color palettes, typography scale (Geist & Geist Mono), component guidelines, and accessibility standards (WCAG 2.2 AA).
- [`RewindVerse_Website_Visual_Experience_and_3D_Design_Specification.md`](./design/RewindVerse_Website_Visual_Experience_and_3D_Design_Specification.md)  
  *Website Art Direction & 3D Specification (v1.0)*: Multi-layer background field (mesh lights, coordinate grid, trajectory path), 3D hero Learning Orbit, restrained micro-interactions, and mobile responsiveness.

### 4. Security & Privacy Architecture
- [`RewindVerse_Security_Architecture_and_Implementation_Standard.md`](./RewindVerse_Security_Architecture_and_Implementation_Standard.md)  
  *Security Architecture Standard (v1.0)*: Local-first offline data isolation, CSV formula injection sanitization, parser DoS protections, zero-telemetry policy, and cryptographic share token model.

### 5. 2D/3D Visualization Engineering
- [`RewindVerse_2D_3D_Visualization_Product_and_Optimization_Standard.md`](./engineering/RewindVerse_2D_3D_Visualization_Product_and_Optimization_Standard.md)  
  *Visualization Product Standard (v1.0)*: The core rule of visualization ("One source of truth, multiple faithful views"), view mode preference model (`2D` / `3D` / `Auto`), and strict 5-tier data provenance badges (`recorded`, `derived`, `projected`, `sampled`, `illustrative`).
- [`RewindVerse_3D_Visualization_and_Pending_Development_Plan.md`](./engineering/RewindVerse_3D_Visualization_and_Pending_Development_Plan.md)  
  *3D Visualization Roadmap & Plan (v1.0)*: Execution plan across P0 MVP surfaces, P1 real-model slices, P2 high-dimensional PCA embeddings, and P3 research inspections.

### 6. End-to-End Performance Optimization
- [`RewindVerse_Complete_Website_Performance_Optimization_Standard.md`](./engineering/RewindVerse_Complete_Website_Performance_Optimization_Standard.md)  
  *Performance & Release Standard (v1.0)*: Core Web Vitals thresholds, route-level JavaScript bundle budgets (≤ 200 kB gzip), WebGL context loss recovery, and worker-isolated computation.

---

## 🏗 Monorepo Directory Organization

```
RewindVerse Code/
├── apps/
│   └── web/                   # Next.js 15 Web Application & Rewind Studio
├── packages/
│   ├── rvts/                  # RVTS JSON Schema, types, parsers, and CSV converters
│   ├── rewindml/              # Browser ML simulation engine & optimizers (SGD, Adam)
│   ├── replay-engine/         # Playback state machine, frame indexer, scrubber sync
│   ├── diagnostics/           # Heuristic detectors (divergence, plateau, instability)
│   └── config/                # Shared TypeScript, ESLint, and Tailwind presets
├── sdk/
│   └── python/                # rewindverse-trace Python SDK & rvtrace CLI
├── fixtures/
│   └── rvts/                  # Cross-language shared conformance test fixtures
├── tests/
│   └── unit/                  # Vitest unit test suite (18/18 tests passing)
├── docs/                      # Master engineering, architecture, and design specifications
├── PROJECT_CHECKLIST.md       # Master engineering progress tracker (v2.0)
└── REQUIRED_CREDENTIALS_AND_CONFIG.md  # Production keys, env variables, and setup instructions
```

---

## ⚡ Quick Start

```bash
# Install all dependencies across monorepo
pnpm install

# Run TypeScript typecheck (0 errors)
pnpm typecheck

# Run Vitest test suite (18/18 tests passing)
pnpm test

# Run Next.js production build (24/24 routes compiled)
pnpm build
```

