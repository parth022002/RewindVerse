<div align="center">

# 🌌 RewindVerse

**Every Model Has a Story.**  
*Train a model, then replay how it learned.*

An interactive machine learning training replay, learning, and experiment intelligence platform.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black.svg?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg?logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.187-black.svg?logo=three.js&logoColor=white)](https://threejs.org/)
[![Neon Database](https://img.shields.io/badge/Neon-PostgreSQL-00e599.svg?logo=postgresql&logoColor=white)](https://neon.tech/)
[![Neon S3](https://img.shields.io/badge/Neon-Object%20Storage-00d2ff.svg)](https://neon.tech/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-3776ab.svg?logo=python&logoColor=white)](https://python.org/)
[![Vitest](https://img.shields.io/badge/Vitest-33%2F33%20Passed-brightgreen.svg?logo=vitest&logoColor=white)]()
[![Routes](https://img.shields.io/badge/Next.js%20Routes-41%2F41%20Compiled-brightgreen.svg)]()
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

<br />

[**Explore Rewind Studio**](http://localhost:3000/studio) • [**Algorithm Forge**](http://localhost:3000/studio/forge) • [**Catalogue**](http://localhost:3000/studio/algorithms) • [**Interactive Lab**](http://localhost:3000/studio/lab) • [**Documentation**](./docs/README.md) • [**Checklist**](./PROJECT_CHECKLIST.md)

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Product Architecture & Studio Modules](#-product-architecture--studio-modules)
- [Monorepo Workspace Structure](#-monorepo-workspace-structure)
- [Technical Stack](#-technical-stack)
- [Getting Started](#-getting-started)
- [Environment Configuration](#-environment-configuration)
- [Cloud Integration & Verification](#-cloud-integration--verification)
- [Python SDK & CLI](#-python-sdk--cli)
- [Testing & Quality Assurance](#-testing--quality-assurance)
- [Security & Privacy Architecture](#-security--privacy-architecture)
- [Documentation Index](#-documentation-index)
- [Contributing & License](#-license)

---

## 🔭 Overview

Traditional experiment tracking tools treat machine learning training as flat tables of numbers and static end-state charts. When an optimizer diverges, plateaus, or oscillates, researchers are left with static line plots and post-mortem logs.

**RewindVerse transforms machine learning training into an interactive time-travel experience.**

With RewindVerse, developers and ML practitioners can:
1. **Scrub through training timelines**: Play, pause, step forward, rewind, and inspect exact weights, gradients, and loss changes step-by-step with $O(1)$ random seek latency.
2. **Inspect 2D & 3D Loss Landscapes**: Observe optimizers navigating continuous mathematical surfaces (Quadratic ravines, Rosenbrock banana valleys, Saddle points) or dynamic decision boundary hyperplanes.
3. **Run 100% Offline with Local-First Privacy**: Training simulations, replay indexing, CSV parsing, and heuristic diagnostics execute entirely inside the browser using dedicated Web Workers and IndexedDB.
4. **Share Traces Seamlessly via Cloud**: Generate permanent, read-only public replay links with 1 click, backed by Neon Serverless PostgreSQL and Neon S3-compatible Object Storage.
5. **Standardize on RVTS**: Leverage the open **RewindVerse Training Trace (RVTS)** standard — a compact, streaming JSON Lines format with formal JSON Schema Draft 2020-12 validation.

---

## ✨ Key Features

| Capability | Description |
|---|---|
| **Deterministic Replay** | Millisecond-accurate scrubber across 10,000+ steps with synchronized loss curves, parameter trajectories, and step inspector. |
| **2D & 3D Visual Parity** | WebGL 2 / Three.js surface generator with height-based gradient shaders, real-time trajectory splines, active step markers, and WebGL context-loss recovery. |
| **Rewind Insights** | Evidence-backed heuristic detectors that automatically identify divergence (NaN/Inf), plateaus, vanishing/exploding gradients, and learning rate instability with click-to-jump step ranges. |
| **Dual-Run Comparison** | Simultaneous 3D dual-trajectory overlays (Run A vs Run B), synchronized scrubbers, and automated convergence ratio metrics. |
| **3D Embedding Projector** | High-dimensional vector space exploration powered by deterministic in-browser Power Iteration PCA with 2D/3D projections. |
| **Rewind Academy** | Interactive "predict-before-run" educational challenges (e.g. *The Anisotropic Ravine Dilemma*). |
| **Universal Import Center** | Drag-and-drop ingestion of `.rvtrace` and PyTorch/Wandb CSV files with automatic column mapping and spreadsheet formula injection sanitization. |
| **Dual Storage Model** | Full functionality offline via IndexedDB, with optional 1-click cloud sync to Neon PostgreSQL & Neon Object Storage. |

---

## 🏛 Product Architecture & Studio Modules

RewindVerse is structured into a public marketing and educational portal and the flagship **Rewind Studio Workspace** (`/studio`):

```
RewindVerse Platform
├── Marketing & Documentation Portal (apps/web)
│   ├── /                 # Hero orbit demo, workflow overview, bento grid
│   ├── /product          # Core product specifications & interactive preview
│   ├── /how-it-works     # Step-by-step RVTS pipeline breakdown
│   ├── /visualizations   # 2D/3D visualization catalog & provenance standards
│   ├── /learn            # Interactive optimization guides
│   ├── /docs             # Engineering specifications & API reference
│   ├── /security         # Security architecture & privacy standards
│   └── /share/[token]    # Cloud-backed read-only trace playback view
│
└── Rewind Studio Hub (/studio)
    ├── /studio/forge        # Algorithm Forge (5 Research Studios: Data, Eq, Flow, Code, Bench)
    ├── /studio/algorithms   # Algorithm Catalogue & Registry (Math, Provenance, RVTS Signals)
    ├── /studio/fit-lab      # Data-to-Algorithm Fit Lab (ProblemSpec, Baseline Models, Fit Reports)
    ├── /studio/data         # Data Lab (Multi-modal Ingestion, Profiler, Zero-Leakage Splits)
    ├── /studio/experiments  # Experiment Intelligence & What-If Checkpoint Branching
    ├── /studio/benchmarks   # RewindBench (Verifiable Leaderboards & Standardized Tracks)
    ├── /studio/trust        # Model Trust & Reliability Lab (ECE Calibration, Noise Stress Testing)
    ├── /studio/explainability # Explainability Workbench (PFI, PDP / ICE Attribution Curves)
    ├── /studio/notebook     # Interactive Research Notebook (Markdown, KaTeX, Executable Cells)
    ├── /studio/reproduce    # Reproduction Studio (.rvcapsule Parity & Tolerance Diff Checking)
    ├── /studio/profiler     # Compute & Training Profiler (Step Latency, Throughput & Memory)
    ├── /studio/lab          # Interactive RewindML Optimizer Lab (Continuous & Classification)
    ├── /studio/replay       # Replay Viewer with O(1) scrubbing & multi-view sync
    ├── /studio/compare      # Dual-run trajectory comparison & convergence analytics
    ├── /studio/insights     # Heuristic diagnostic detectors & evidence narratives
    ├── /studio/embeddings   # 3D Power Iteration PCA vector projector
    ├── /studio/import       # Universal CSV & .rvtrace ingestion center
    └── /studio/academy      # Interactive predict-before-run challenges
```

### Studio Modules in Detail

#### 0. Advanced Algorithm Forge Research Workbench (`/studio/forge`) & Master Catalogue (`/studio/algorithms`)
- **Data Workbench**: Synthetic objective generator (Anisotropic Ravine, Rosenbrock Banana, 2D Gaussian Blobs) + Custom CSV/TSV statistical profiler (count, nulls, mean, std dev, min, max, dtype) + Train/Val/Test partitioning slider + Preprocessing pipelines (Raw, Z-score, Min-Max).
- **Equation Studio**: Mathematical token palette with 1-click insertion + Live LaTeX rendering + **Central Finite-Difference Jacobian & Gradient Verification** ($g_i \approx \frac{f(\theta+\epsilon e_i) - f(\theta-\epsilon e_i)}{2\epsilon}$) with real-time pass/fail precision badges.
- **Visual Algorithm Builder**: Dual-mode workflow containing a **Conceptual Algorithmic Lifecycle Flowchart** (Intake $\to$ Forward $\to$ Loss $\to$ Backprop $\to$ Update $\to$ Convergence $\to$ Checkpoint) and an **Executable Computational DAG** with real-time DFS cycle detection.
- **Code Studio**: Tabbed research runtime contracts for **Python (§8.3)** and **TypeScript (§8.4)** with allowlisted static safety analysis (zero dynamic `eval()`) and 1-Click "Export .py Script" (`run_custom_algorithm.py`) with NumPy harness and RVTS recorder.
- **Benchmark Comparator**: Side-by-side simultaneous convergence race benchmarking user forge algorithms against **Vanilla SGD**, **Polyak Momentum**, and **Adam** on identical test coordinates and objective functions.
- **Sandboxed Test Bench**: Execute custom algorithms against Quadratic Bowl, Rosenbrock, or Saddle surfaces with live fuel metering (up to 500,000 units), divergence detection, interactive 2D contour & 3D Three.js wireframe viewer, and instant `.rvtrace`, `manifest.json`, and `report.md` exports.
- **Algorithm Catalogue**: Comprehensive searchable registry covering mathematical definitions, explicit assumptions, hyperparameter ranges, and declared RVTS trace capabilities.
- **Specifications**: See [`docs/algorithm-forge/ADVANCED_ALGORITHM_FORGE_SPECIFICATION.md`](docs/algorithm-forge/ADVANCED_ALGORITHM_FORGE_SPECIFICATION.md) and [`docs/algorithms/ALGORITHM_CATALOG.md`](docs/algorithms/ALGORITHM_CATALOG.md).

#### 1. Interactive RewindML Lab (`/studio/lab`)
- **Mode 1: Continuous Loss Landscapes**: Explore 2D and 3D surfaces (Quadratic, Rosenbrock, Saddle) with SGD, Momentum, Adam, AdamW, RMSProp, and Adagrad optimizers. Adjust learning rate, momentum, noise levels, and starting coordinates in real-time.
- **Mode 2: Binary Classification**: Train Logistic Regression on 2D Gaussian Blobs with moving decision boundary hyperplanes and accuracy metrics.
- **Transport Controls**: Play, Pause, Step +1, Rewind, and Speed multipliers (0.5x, 1x, 2x, 5x).
- **Export & Share**: Direct "Save to Workspace" (IndexedDB), "Export .rvtrace", and **"Share to Cloud"** (Neon S3 + PostgreSQL).

#### 2. Trace Replay Viewer (`/studio/replay/[id]`)
- Synchronized SVG loss curve and 2D/3D parameter trajectories.
- Keyboard navigation (Space = Play/Pause, Arrow Left/Right = Step, Home/End = Start/Finish).
- Capability-aware panel gating (hides parameters or gradients if absent from the trace).
- Detailed Step Inspector showing parameters, weights, loss values, and learning rate.

#### 3. Diagnostic Insights (`/studio/insights`)
- Automated scan for:
  - **Divergence**: Non-finite loss values (NaN, $\infty$).
  - **Plateaus**: Loss slope below threshold over rolling patience windows.
  - **Gradient Health**: Vanishing ($\|\nabla\| < 10^{-5}$) or exploding ($\|\nabla\| > 10^3$) gradients.
  - **Learning Rate Instability**: High-frequency loss oscillations.
- Generates human-readable evidence narratives citing exact step ranges with click-to-jump navigation.

---

## 📦 Monorepo Workspace Structure

The project is structured as a modular `pnpm` monorepo with strict package boundaries:

```
RewindVerse Code/
├── apps/
│   └── web/                         # Next.js 15 App Router web application
│       ├── app/                     # 24 production routes (Marketing, Studio, APIs)
│       ├── components/              # React UI & Three.js 3D visualization components
│       ├── lib/                     # DB client, Neon S3 adapter, local IndexedDB storage
│       └── styles/                  # Tailwind CSS v4 & custom glassmorphism design tokens
│
├── packages/
│   ├── rvts/                        # Canonical RVTS schema, streaming parser, validator, CSV converter
│   ├── rewindml/                    # Browser-native math engines, optimizers, PRNG, ML worker
│   ├── replay-engine/               # O(1) frame indexer, replay state machine, synchronizer
│   ├── diagnostics/                 # Heuristic diagnostic detectors & narrative generators
│   └── config/                      # Shared base configurations
│
├── sdk/
│   └── python/                      # rewindverse-trace Python recording SDK & CLI
│       ├── rewindverse_trace/       # RunRecorder context manager, validator, CLI
│       └── tests/                   # Python unittest test suite
│
├── drizzle/                         # Auto-generated DDL migration files
├── fixtures/                        # Shared cross-language RVTS conformance fixtures
├── scripts/                         # Pilot test suite, cloud verification, and smoke tests
├── docs/                            # Foundational architectural & engineering specifications
├── package.json                     # Root workspace configuration
├── pnpm-workspace.yaml              # Monorepo package declaration
├── tsconfig.base.json               # Shared strict TypeScript compiler configuration
├── tsconfig.json                    # Root IDE TypeScript project configuration
└── vercel.json                      # Vercel production deployment configuration
```

### Packages Overview

| Package | Path | Purpose | Dependencies |
|---|---|---|---|
| `@rewindverse/web` | `apps/web` | Next.js 15 Frontend, BFF API routes & Studio | React 19, Three.js, Drizzle, AWS S3 SDK |
| `@rewindverse/rvts` | `packages/rvts` | Canonical format, parser, validator, CSV converter | Zero external dependencies |
| `@rewindverse/rewindml` | `packages/rewindml` | Browser-native optimization & ML algorithms | `@rewindverse/rvts` |
| `@rewindverse/replay-engine` | `packages/replay-engine` | State machine & synchronized scrubbing | `@rewindverse/rvts` |
| `@rewindverse/diagnostics` | `packages/diagnostics` | Heuristic error & instability detectors | `@rewindverse/rvts` |
| `rewindverse-trace` | `sdk/python` | Python training recorder & CLI tool | Standard Library (zero heavy dependencies) |

---

## 🛠 Technical Stack

### Frontend & Application Layer
- **Framework**: [Next.js 15.5](https://nextjs.org/) (App Router, React Server Components, Route Handlers)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with OKLCH dynamic color spaces and glassmorphism micro-interactions
- **3D Graphics Engine**: [Three.js 0.187](https://threejs.org/) with WebGL 2 fallback and WebGL context-loss restoration
- **Icons**: [Lucide React](https://lucide.dev/)

### Data & Cloud Infrastructure
- **Database**: [Neon Serverless PostgreSQL](https://neon.tech/) with pooled and unpooled connections
- **ORM & Migrations**: [Drizzle ORM](https://orm.drizzle.team/) & `drizzle-kit`
- **Object Storage**: [Neon S3-Compatible Object Storage](https://neon.tech/) (`@aws-sdk/client-s3` with path-style addressing)
- **Local Persistence**: Browser IndexedDB with synchronous transactional stores

### Computation & Streaming
- **Off-Thread Workers**: Dedicated Web Workers for browser simulation and surface sampling
- **Interchange Standard**: RVTS (JSON Lines with line-by-line streaming)

### Tooling & Quality Assurance
- **Package Manager**: [pnpm v10](https://pnpm.io/)
- **Type Checking**: [TypeScript 5.7](https://www.typescriptlang.org/) (strict mode across all packages)
- **Testing**: [Vitest 3.0](https://vitest.dev/) & Python `unittest`
- **Deployment**: [Vercel](https://vercel.com/) with custom security headers

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20.0.0` or higher (Node 22 recommended)
- **pnpm**: `v10.0.0` or higher
- **Python**: `v3.10` or higher (optional, for Python SDK)

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/parth022002/RewindVerse.git
cd RewindVerse

# Install dependencies across all monorepo workspaces
pnpm install
```

### 2. Run Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application or jump directly into the [Optimizer Lab](http://localhost:3000/studio/lab).

### 3. Build for Production

```bash
# Compiles all domain packages and creates an optimized Next.js build
pnpm build
```

---

## 🔐 Environment Configuration

RewindVerse follows a **Local-First, Privacy-First Architecture**. You **do not need any cloud credentials** to run, test, and use the full platform locally.

When you want to enable **Cloud Trace Sharing** (generating public links like `rewindverse.com/share/[token]`), configure the following variables in `.env` or `apps/web/.env.local`:

```env
# Neon Serverless PostgreSQL
DATABASE_URL="postgresql://<user>:<password>@<endpoint>-pooler.<region>.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
DATABASE_URL_UNPOOLED="postgresql://<user>:<password>@<endpoint>.<region>.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Neon S3-Compatible Object Storage
AWS_ENDPOINT_URL_S3="https://<branch-id>.storage.c-1.<region>.aws.neon.tech"
AWS_ACCESS_KEY_ID="nak_live_..."
AWS_SECRET_ACCESS_KEY="nsk_live_..."
AWS_REGION="ap-southeast-1"
S3_BUCKET="rewind-traces"

# Application Public Domain
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

For complete credential setup instructions, refer to [`REQUIRED_CREDENTIALS_AND_CONFIG.md`](./REQUIRED_CREDENTIALS_AND_CONFIG.md).

---

## ☁️ Cloud Integration & Verification

The project includes an end-to-end cloud persistence pipeline verified against Neon:

```
[Interactive Lab / Studio]
          │
          ▼
   POST /api/traces/share
   ├── 1. Upload .rvtrace blob ──────────► [Neon S3: rewind-traces]
   ├── 2. Index metadata & token ────────► [Neon PostgreSQL: traces & share_tokens]
   └── 3. Return share URL (/share/[token])
          │
          ▼
   GET /api/traces/share?token=...
   ├── 1. Resolve token & s3Key ─────────► [Neon PostgreSQL]
   ├── 2. Download trace stream ─────────► [Neon S3]
   └── 3. Parse & playback in browser ──► [Interactive Scrubber & 3D Viewer]
```

### Verification Scripts

Run the comprehensive automated test suites:

```bash
# 1. Cloud Integration Test (Milestones 6, 7 & 8)
node scripts/verify-cloud-integration.mjs

# 2. Pilot Testing & Production Readiness Audit
node scripts/pilot-test.mjs
```

**Pilot Test Output:**
```
✓ [PASS]  | Neon S3 Object Storage API (rewind-traces) | R/W verified
✓ [PASS]  | Neon PostgreSQL Schema & Foreign Keys      | Verified tables: share_tokens, traces, workspaces
✓ [PASS]  | Trace Cloud Upload & Retrieval Playback    | Token resolved; 25 steps verified bit-identical
✓ [PASS]  | Application Route Architecture             | 24 production routes verified
✓ [PASS]  | First Load JS Budget (<150 kB)             | All routes: 103 kB - 122 kB (Passed with headroom)
```

---

## 🐍 Python SDK & CLI

Record training traces directly from PyTorch, TensorFlow, JAX, Scikit-Learn, or raw Python loops:

### Installation
```bash
cd sdk/python
pip install -e .
```

### Recording Traces
```python
from rewindverse_trace import RunRecorder

with RunRecorder(
    run_name="resnet50_cifar10",
    model_name="ResNet50",
    output_path="traces/cifar10.rvtrace",
    hyperparameters={"lr": 0.001, "batch_size": 64, "optimizer": "Adam"}
) as rec:
    for epoch in range(100):
        # Your model training step
        loss = 2.5 / (epoch + 1)
        rec.log_step(
            step=epoch,
            metrics={"loss": loss, "accuracy": 0.4 + 0.005 * epoch},
            parameters={"w": [0.1 * epoch, 0.2 * epoch]},
            lr=0.001
        )
```

### CLI Commands
```bash
# Validate an RVTS trace file against the canonical specification
rvtrace validate traces/cifar10.rvtrace

# Inspect metadata, step count, and capabilities
rvtrace inspect traces/cifar10.rvtrace
```

---

## 🧪 Testing & Quality Assurance

RewindVerse maintains a comprehensive multi-tier testing pipeline:

```bash
# 1. Typecheck all packages (strict TypeScript, 0 errors)
pnpm typecheck

# 2. Run Vitest unit tests (18/18 passed)
pnpm test

# 3. Run Python SDK unit tests (3/3 passed)
python -m unittest discover sdk/python/tests

# 4. Run Next.js production linter (0 errors, 0 warnings)
pnpm --filter @rewindverse/web lint

# 5. Database Schema Migration Preview
pnpm db:push
```

### Quality Metrics Summary

- **TypeScript Typecheck**: 0 errors across 5 workspace packages.
- **Unit Tests**: 18 Vitest tests + 3 Python tests passing with 100% success.
- **Next.js Production Build**: All 24 routes compiled and statically prerendered.
- **Bundle Budget**: First Load JS is between **103 kB and 122 kB** across all routes (well below the 150 kB PRD budget).
- **Accessibility**: Built to WCAG 2.2 AA standards with full keyboard navigation and high-contrast color tokens.

---

## 🛡️ Security & Privacy Architecture

RewindVerse was engineered from inception with strict security and privacy standards:

1. **Local-First Zero Telemetry**: Training runs and weights are processed in memory and stored locally in IndexedDB. No behavioral trackers or invasive analytics are loaded.
2. **Spreadsheet Formula Injection Sanitization**: All CSV imports strip and escape potentially malicious formula triggers (`=`, `+`, `-`, `@`) to protect users opening exported files in Excel or Google Sheets.
3. **Denial-of-Service Limits**: File imports are bounded to 50 MB, line counts capped at 100,000 steps, and Web Workers isolated to prevent browser thread starvation.
4. **Read-Only Cloud Tokens**: Shared traces use cryptographically randomized 16-character tokens with strictly read-only access to prevent unauthorized mutation.
5. **Security Headers**: Production deployment enforces `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and strict `Referrer-Policy`.

For full details, read the [RewindVerse Security Architecture Standard](./docs/security/RewindVerse_Security_Architecture_and_Implementation_Standard.md).

---

## 📚 Documentation Index

Detailed architectural specifications and engineering standards are available in [`docs/`](./docs/README.md):

| Document | Description |
|---|---|
| [`PROJECT_CHECKLIST.md`](./PROJECT_CHECKLIST.md) | Master tracking across all 16 engineering phases, algorithm catalogue, and cloud milestones. |
| [`REQUIRED_CREDENTIALS_AND_CONFIG.md`](./REQUIRED_CREDENTIALS_AND_CONFIG.md) | Guide to Neon PostgreSQL and S3 environment variables. |
| [`docs/algorithms/ALGORITHM_CATALOG.md`](./docs/algorithms/ALGORITHM_CATALOG.md) | Master algorithm catalogue covering mathematical foundations, optimization, models, RVTS trace requirements, and reference equations. |
| [`docs/forge/ALGORITHM_FORGE_SPECIFICATION.md`](./docs/forge/ALGORITHM_FORGE_SPECIFICATION.md) | Algorithm Forge specification: 3 creation modes, manifest schema, allowlisted AST validator, worker execution contract, and security gates. |
| [`docs/RewindVerse_Final_PRD.md`](./docs/RewindVerse_Final_PRD.md) | Core product requirements, persona workflows, and acceptance criteria. |
| [`docs/RewindVerse_Technical_Stack_Final.md`](./docs/RewindVerse_Technical_Stack_Final.md) | Full architectural blueprint and technology decisions. |
| [`docs/RewindVerse_Website_Design_and_Engineering_Standards.md`](./docs/RewindVerse_Website_Design_and_Engineering_Standards.md) | Design system tokens, color models, typography, and component standards. |
| [`docs/RewindVerse_Security_Architecture_and_Implementation_Standard.md`](./docs/RewindVerse_Security_Architecture_and_Implementation_Standard.md) | Threat modeling, formula injection defense, and cryptographic sharing. |
| [`docs/design/RewindVerse_Website_Visual_Experience_and_3D_Design_Specification.md`](./docs/design/RewindVerse_Website_Visual_Experience_and_3D_Design_Specification.md) | Website art direction, multi-layer background field, and hero 3D orbit. |
| [`docs/engineering/RewindVerse_2D_3D_Visualization_Product_and_Optimization_Standard.md`](./docs/engineering/RewindVerse_2D_3D_Visualization_Product_and_Optimization_Standard.md) | Visualization parity, data provenance badges, and 3D surface shaders. |
| [`docs/engineering/RewindVerse_3D_Visualization_and_Pending_Development_Plan.md`](./docs/engineering/RewindVerse_3D_Visualization_and_Pending_Development_Plan.md) | 3D surface execution plan, PCA projections, and WebGPU detection. |
| [`docs/engineering/RewindVerse_Complete_Website_Performance_Optimization_Standard.md`](./docs/engineering/RewindVerse_Complete_Website_Performance_Optimization_Standard.md) | WebGL context-loss recovery, worker pooling, and bundle size limits. |

---

## 📄 License

RewindVerse is licensed under the [Apache License, Version 2.0](LICENSE).

```
Copyright 2026 RewindVerse Contributors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0
```

---

<div align="center">
  <sub>Built with precision for machine learning engineers, researchers, and students.</sub>
</div>
