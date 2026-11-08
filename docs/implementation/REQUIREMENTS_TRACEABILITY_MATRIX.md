# RewindVerse — Requirements Traceability Matrix (RTM)

**Document:** `docs/implementation/REQUIREMENTS_TRACEABILITY_MATRIX.md`  
**Version:** 2.0  
**Status:** `VERIFIED` (All 26 Core Requirements Validated)  
**Standard:** Enterprise Traceability & Verification Standard

---

## Traceability Table

| Req ID | Module / Feature | Specification Ref | Implementation Location | Priority | Status | Acceptance Criteria & Verification Evidence |
|---|---|---|---|---|---|---|
| **REQ-001** | RVTS Trace Schema | RVTS v0.1.0 | `packages/rvts` | P0 | `VERIFIED` | 7 Vitest unit tests passing; validates manifest, frames, and stream format. |
| **REQ-002** | Deterministic Replay | PRD §4.2 | `apps/web/app/studio/replay` | P0 | `VERIFIED` | Scrubber navigates 10k+ steps with synchronized loss & parameters. |
| **REQ-003** | 2D/3D Parity | Vis Standard §2.0 | `ThreeSurfaceViewer.tsx` | P0 | `VERIFIED` | Toggle between 2D Top-Down and 3D Perspective; WebGL context recovery verified. |
| **REQ-004** | Diagnostic Insights | PRD §4.3 | `packages/diagnostics` | P0 | `VERIFIED` | 5 Vitest unit tests passing; step ranges highlighted in UI. |
| **REQ-005** | Dual Run Compare | PRD §4.4 | `apps/web/app/studio/compare` | P0 | `VERIFIED` | Run A vs Run B comparison with synchronized dual scrubbing. |
| **REQ-006** | 3D Embeddings | PRD §4.5 | `apps/web/app/studio/embeddings` | P0 | `VERIFIED` | 2D/3D PCA projection with variance explained and camera reset. |
| **REQ-007** | CSV Ingestion & Sanitization | Security Std §3.1 | `packages/rvts/src/csv.ts` | P0 | `VERIFIED` | 4 Vitest unit tests passing; prepends `'` to dangerous formula injection prefixes. |
| **REQ-008** | Offline Local Storage | PRD §4.7 | `apps/web/lib/storage.ts` | P0 | `VERIFIED` | Saves and retrieves runs offline; zero network calls. |
| **REQ-009** | Cloud Sync & Share | PRD §4.8 | `apps/web/app/api/traces/share` | P0 | `VERIFIED` | Verified via `cloud:verify` script and `/share/[token]` playback. |
| **REQ-010** | Algorithm Catalogue | Algo Spec §1.0 | `apps/web/app/studio/algorithms` | P0 | `VERIFIED` | Searchable cards for optimizers, losses, and models with math formulas. |
| **REQ-011** | Algorithm Forge | Forge Spec §1.0 | `apps/web/app/studio/forge` | P0 | `VERIFIED` | AST parser safety verified; Jacobian finite-difference check passing. |
| **REQ-012** | Data-to-Algorithm Fit Lab | Complete Spec §6.0 | `apps/web/app/studio/fit-lab` | P1 | `VERIFIED` | Automated baseline comparison, leakage checks, and fit report export. |
| **REQ-013** | Data Lab & Statistical Profiler | Complete Spec §5.0 | `apps/web/app/studio/data` | P1 | `VERIFIED` | Full data quality checks, missingness analysis, and distribution histograms. |
| **REQ-014** | Experiment Intelligence & Branching | Complete Spec §9.0 | `apps/web/app/studio/experiments`| P1 | `VERIFIED` | What-If parameter sensitivity and checkpoint state restoration. |
| **REQ-015** | RewindBench Leaderboards | Complete Spec §13.0 | `apps/web/app/studio/benchmarks` | P1 | `VERIFIED` | Tracks across 5 standard datasets with verified vs self-reported tiers. |
| **REQ-016** | Model Trust & Reliability | Complete Spec §14.0 | `apps/web/app/studio/trust` | P1 | `VERIFIED` | Expected Calibration Error (ECE), reliability diagrams, and noise stress. |
| **REQ-017** | Explainability Workbench | Complete Spec §16.0 | `apps/web/app/studio/explainability`| P2 | `VERIFIED` | Permutation feature importance and counterfactual sensitivity sliders. |
| **REQ-018** | Research Notebook | Complete Spec §19.0 | `apps/web/app/studio/notebook` | P2 | `VERIFIED` | Markdown cells, reactive formulas, inline charts, and `.ipynb` export. |
| **REQ-019** | Reproduction Studio | Complete Spec §15.0 | `apps/web/app/studio/reproduce` | P2 | `VERIFIED` | Cryptographic SHA-256 manifests and numerical tolerance diff checking. |
| **REQ-020** | Compute & Training Profiler | Complete Spec §20.0 | `apps/web/app/studio/profiler` | P2 | `VERIFIED` | Step duration, throughput, FLOPS tracking, and memory meter. |
| **REQ-021** | Security & AST Sandbox | Security Std §2.0 | `packages/rewindml/src/forge` | P0 | `VERIFIED` | 7 Vitest unit tests passing; zero dynamic code execution or `eval()`. |
| **REQ-022** | Master Website Redesign | Redesign Spec §5.0 | `apps/web/app/page.tsx` | P0 | `VERIFIED` | 10-section narrative public homepage with 2D/3D visual proof. |
| **REQ-023** | Atmosphere Background System | Redesign Spec §6.0 | `components/backgrounds/*` | P1 | `VERIFIED` | Modular `AmbientMesh`, `SignalGrid`, `TraceWave`, and `SectionGlow`. |
| **REQ-024** | 3D Hero & Fallback Ladder | Redesign Spec §7.0 | `components/hero/*` | P1 | `VERIFIED` | `LearningOrbitHero` with accessible `LearningOrbitPoster` SVG fallback. |
| **REQ-025** | Studio Goal-Driven Hierarchy | Redesign Spec §4.0 | `apps/web/app/studio/layout.tsx` | P0 | `VERIFIED` | 5 collapsible sections: Workspace, Build, Analyze, Research, Settings. |
| **REQ-026** | Monorepo Governance & CI | Repo Spec §15, 16 | `.github/workflows/ci.yml` | P0 | `VERIFIED` | GitHub Actions CI, `.editorconfig`, `.gitattributes`, and templates. |
