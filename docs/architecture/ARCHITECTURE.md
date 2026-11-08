# RewindVerse — System Architecture & Component Design (v2.0)

## 1. High-Level Architecture Overview

RewindVerse is structured around a **Local-First, Decoupled-Compute Model**:
- Computation and numerical evaluation take place in browser Web Workers or local Python CLI runtimes.
- Tracing and replay are standardized through the **RewindVerse Training Trace Specification (RVTS v0.1.0)**.
- Visualizations maintain parity across 2D (Canvas/SVG) and 3D (Three.js WebGL 2).
- Data persistence utilizes client-side IndexedDB with optional end-to-end encrypted sharing via Neon PostgreSQL and Neon Object Storage (S3).

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Rewind Studio Web App                           │
│  (Next.js 15 App Router · React 19 · Tailwind CSS · Three.js · Zustand)│
├──────────────┬──────────────┬──────────────┬──────────────┬────────────┤
│   Data Lab   │ Algo Catalog │ Algo Forge   │   Fit Lab    │ Experiment │
│   & Ingestion│  & Explorer  │ 5 Studios    │ Evaluation   │    Lab     │
├──────────────┴──────────────┴──────────────┴──────────────┴────────────┤
│                     Core Platform Packages                             │
├──────────────────────┬──────────────────────┬──────────────────────────┤
│    @rewindverse/rvts │ @rewindverse/rewindml│ @rewindverse/replay      │
│  Trace Parser & Spec │  Engine & Optimizers │ State Machine & Indexer  │
├──────────────────────┴──────────────────────┴──────────────────────────┤
│             Sandboxed Compute & Worker Boundaries                      │
├─────────────────────────────────────────────┬──────────────────────────┤
│  Browser Web Worker (AST Safe Interpreter)  │ Local Python CLI & SDK   │
│  - Fuel Budget Metering (500k max)          │ - PyTorch / JAX Logging  │
│  - Zero eval() / Zero new Function()        │ - rvtrace Streaming JSONL│
├─────────────────────────────────────────────┴──────────────────────────┤
│                        Data Storage Layers                             │
├─────────────────────────────────────────────┬──────────────────────────┤
│  IndexedDB (Local-First Offline Storage)    │ Neon PostgreSQL & S3     │
│  - Runs, Datasets, Manifests, Bookmarks     │ - Public Share Tokens    │
└─────────────────────────────────────────────┴──────────────────────────┘
```

## 2. Core Workspace Modules

1. **Rewind Studio (`/studio`)**: Main dashboard summarizing recent experiments, active datasets, and quick launch triggers.
2. **Data-to-Algorithm Fit Lab (`/studio/fit-lab`)**: Problem-first recommendation engine that tests candidate algorithms against user data under defined evaluation protocols.
3. **Data Lab (`/studio/data`)**: Ingestion, schema typing, statistical profiling, and preprocessing pipelines.
4. **Algorithm Forge (`/studio/forge`)**: Research workbench featuring Data Workbench, Equation Studio (Jacobian verification), Visual Flowchart, Code Studio, and Benchmark Comparator.
5. **Algorithm Catalogue (`/studio/algorithms`)**: Comprehensive taxonomy of optimization algorithms, loss functions, neural architectures, and RVTS capabilities.
6. **Replay Viewer (`/studio/replay/[id]`)**: High-precision timeline scrubber with synchronized loss curves, parameters, and step inspectors.
7. **Experiment Intelligence (`/studio/experiments`)**: Multi-run parameter/metric tracking and What-if checkpoint branching.
8. **RewindBench (`/studio/benchmarks`)**: Standardized benchmarking tracks with verifiable leaderboards.
9. **Model Trust Lab (`/studio/trust`)**: Calibration error metrics, reliability curves, and adversarial noise stress testing.
10. **Explainability Workbench (`/studio/explainability`)**: Permutation feature importance and partial dependence plots.
11. **Research Notebook (`/studio/notebook`)**: Executable scientific notebook combining markdown, KaTeX math, code cells, and visualizer frames.
12. **Reproduction Studio (`/studio/reproduce`)**: `.rvcapsule` verification workspace with epsilon-tolerance numerical diffing.
13. **Compute Profiler (`/studio/profiler`)**: Runtime latency, step throughput, and memory allocation inspector.
