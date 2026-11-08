# RewindVerse — Platform & Developer Documentation

Welcome to the official developer documentation for **RewindVerse** — an interactive machine-learning training replay, algorithm exploration, and research platform.

---

## 📚 Documentation Sections

### 1. Algorithm Catalogue
- [`algorithms/ALGORITHM_CATALOG.md`](./algorithms/ALGORITHM_CATALOG.md)  
  Comprehensive mathematical definitions, complexity profiles, and visualization capabilities across 48+ supported algorithms:
  - **Optimization:** SGD, Heavy Ball Momentum, Adam, AdamW, RMSProp, AdaGrad, L-BFGS, Nelder-Mead.
  - **Deep Learning:** Scaled Dot-Product Attention, Multi-Head Routing, Residual MLPs.
  - **Classical Machine Learning:** Random Forests, Support Vector Machines, K-Means Clustering.
  - **Statistics & State Estimation:** Extended Kalman Filter, Metropolis-Hastings MCMC, PCA.

### 2. Algorithm Forge Specifications
- [`forge/ALGORITHM_FORGE_SPECIFICATION.md`](./forge/ALGORITHM_FORGE_SPECIFICATION.md)  
  Foundational specification for the custom Algorithm Forge workspace, execution paths, templates, safety guardrails, and validation engine.
- [`algorithm-forge/ADVANCED_ALGORITHM_FORGE_SPECIFICATION.md`](./algorithm-forge/ADVANCED_ALGORITHM_FORGE_SPECIFICATION.md)  
  Advanced Algorithm Forge & Research Workbench architecture covering:
  - Multi-paradigm authoring: Data-first, Equation-first (SymPy/MathJax/KaTeX), Flow-first (Visual Node Graph), Code-first (Sandboxed Python/TS), and Hybrid pipelines.
  - Verification & validation suite: AST analysis, dimension checking, gradient checking, and local-first execution.
  - Benchmark comparison matrices, sensitivity analysis, and export targets.

### 3. RewindVerse Training Trace Specification (RVTS)
The open standard format for recording, exchanging, and replaying machine learning experiments:
- **Format:** Newline-delimited JSON Lines (`.rvtrace`).
- **Structure:**
  1. `manifest` (metadata, producer, declared capabilities)
  2. `step` (step index, metrics, parameters, gradients)
  3. `event` (anomaly flags, divergence markers, plateau alerts)
  4. `footer` (completion status and final step summary)
- **Validation:** Conforms to strict JSON Schema Draft 2020-12 validation via `@rewindverse/rvts`.

### 4. Python SDK & CLI (`sdk/python`)
- [`Python SDK Documentation`](../sdk/python/README.md)  
  The `rewindverse-trace` Python package provides non-blocking recording for PyTorch, Scikit-Learn, and custom training loops with a single context manager.
  ```bash
  pip install rewindverse-trace
  ```

---

## 🚀 Quick Start

### Starting the Web Workspace
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to access the public platform and [http://localhost:3000/studio](http://localhost:3000/studio) to launch Rewind Studio.

### Verification & Testing
```bash
# Typecheck all packages
pnpm typecheck

# Run unit tests (Vitest)
pnpm test

# Run Python SDK tests
pnpm test:python

# Build for production
pnpm build
```

---

## 🛡️ Privacy & Security
RewindVerse operates with a **local-first privacy architecture**. Training runs, datasets, and parameter checkpoints are executed inside client Web Workers and stored in browser IndexedDB. Zero private weights or dataset records are uploaded to remote servers unless explicitly exported by the user.
