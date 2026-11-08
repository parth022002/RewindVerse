# RewindVerse — Requirements Traceability Matrix (RTM)

**Status Vocabulary:** `NOT_STARTED` → `IN_PROGRESS` → `IMPLEMENTED` → `TESTING` → `VERIFIED` → `RELEASED`

| Req ID | Module / Feature | Specification Ref | Existing Implementation | Required Changes | Priority | Status | Acceptance Criteria & Evidence |
|---|---|---|---|---|---|---|---|
| **REQ-001** | RVTS Trace Schema | RVTS v0.1.0 | `packages/rvts` | Backward compatibility with legacy schema | P0 | `VERIFIED` | 7 Vitest unit tests passing; validates manifest, frames, and stream format. |
| **REQ-002** | Deterministic Replay | PRD §4.2 | `apps/web/app/studio/replay` | Metric synchronization and step inspection | P0 | `VERIFIED` | Scrubber navigates 10k+ steps with synchronized loss & parameters. |
| **REQ-003** | 2D/3D Parity | Vis Standard §2.0 | `ThreeSurfaceViewer.tsx` | Fallback modes and context recovery | P0 | `VERIFIED` | Toggle between 2D Top-Down and 3D Perspective; WebGL context recovery verified. |
| **REQ-004** | Diagnostic Insights | PRD §4.3 | `packages/diagnostics` | Heuristics for NaN, plateaus, vanishing grad | P0 | `VERIFIED` | 5 Vitest unit tests passing; step ranges highlighted in UI. |
| **REQ-005** | Dual Run Compare | PRD §4.4 | `apps/web/app/studio/compare` | Overlay trajectories and metrics diff | P0 | `VERIFIED` | Run A vs Run B comparison with synchronized dual scrubbing. |
| **REQ-006** | 3D Embeddings | PRD §4.5 | `apps/web/app/studio/embeddings` | Power Iteration PCA in browser | P0 | `VERIFIED` | 2D/3D PCA projection with variance explained and camera reset. |
| **REQ-007** | CSV Ingestion & Sanitization | Security Std §3.1 | `packages/rvts/src/csv.ts` | OWASP formula injection protection | P0 | `VERIFIED` | 4 Vitest unit tests passing; prepends `'` to dangerous prefixes. |
| **REQ-008** | Offline Local Storage | PRD §4.7 | `apps/web/lib/storage.ts` | IndexedDB run persistence | P0 | `VERIFIED` | Saves and retrieves runs offline; zero network calls. |
| **REQ-009** | Cloud Sync & Share | PRD §4.8 | `apps/web/app/api/traces/share` | Neon PostgreSQL & S3 bucket integration | P0 | `VERIFIED` | Verified via `cloud:verify` script and `/share/[token]` playback. |
| **REQ-010** | Algorithm Catalogue | Algo Spec §1.0 | `apps/web/app/studio/algorithms` | Master cross-disciplinary taxonomy | P0 | `VERIFIED` | Searchable cards for optimizers, losses, and models with math formulas. |
| **REQ-011** | Algorithm Forge | Forge Spec §1.0 | `apps/web/app/studio/forge` | 5 Research Studios (Data, Eq, Flow, Code, Bench) | P0 | `VERIFIED` | AST parser safety verified; Jacobian finite-difference check passing. |
| **REQ-012** | Data-to-Algorithm Fit Lab | Complete Spec §6.0 | Missing standalone workspace | Build `/studio/fit-lab` with `ProblemSpec` & recommender | P1 | `IN_PROGRESS` | Automated baseline comparison, leakage checks, and fit report export. |
| **REQ-013** | Data Lab & Observatory | Complete Spec §5.0 | Basic profiler in Forge | Build `/studio/data` with schema typing and pipelines | P1 | `IN_PROGRESS` | Full data quality checks, missingness analysis, and transform lineage. |
| **REQ-014** | Experiment Intelligence & Branching | Complete Spec §9.0 | Basic run list in studio | Build `/studio/experiments` with What-If Branching | P1 | `IN_PROGRESS` | Tag grouping, metric comparison, checkpoint state restoration. |
| **REQ-015** | RewindBench Benchmark Tracks | Complete Spec §13.0 | Forge comparator | Build `/studio/benchmarks` with verifiable leaderboard | P1 | `IN_PROGRESS` | Tracks for optimizers and ML with verified vs self-reported tiers. |
| **REQ-016** | Model Trust & Reliability | Complete Spec §14.0 | Divergence detector in insights | Build `/studio/trust` with ECE calibration and noise stress | P1 | `IN_PROGRESS` | Reliability diagrams, perturbation tolerance, and covariate drift. |
| **REQ-017** | Explainability Workbench | Complete Spec §16.0 | Visualizer prototypes | Build `/studio/explainability` with PFI and PDP/ICE | P2 | `IN_PROGRESS` | Permutation feature importance and partial dependence curves. |
| **REQ-018** | Research Notebook | Complete Spec §19.0 | Markdown export | Build `/studio/notebook` with interactive cells and KaTeX | P2 | `IN_PROGRESS` | Combined code, math formulas, visualizer embeds, and `.ipynb` export. |
| **REQ-019** | Reproduction Studio | Complete Spec §15.0 | Trace export/import | Build `/studio/reproduce` for `.rvcapsule` verification | P2 | `IN_PROGRESS` | Numerical tolerance diff checking against recorded runs. |
| **REQ-020** | Compute & Training Profiler | Complete Spec §20.0 | Fuel counter in worker | Build `/studio/profiler` with latency and memory meters | P2 | `IN_PROGRESS` | Step duration, throughput, and bottleneck diagnostics. |
| **REQ-021** | Security & AST Sandbox | Security Std §2.0 | `packages/rewindml/src/forge` | Recursive-descent AST interpreter with fuel budget | P0 | `VERIFIED` | 7 Vitest unit tests passing; zero dynamic code execution. |
