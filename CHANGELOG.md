# Changelog

All notable changes to the RewindVerse platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-11-08

### Added
- **Complete Research Platform Expansion:**
  - Data-to-Algorithm Fit Lab (`/studio/fit-lab`) with suitability matrices and capability radar charts.
  - Data Lab & Statistical Profiler (`/studio/data`) with missing value detection, correlation matrices, and distribution histograms.
  - Experiment Intelligence & What-If Branching (`/studio/experiments`) with parameter sensitivity graphs.
  - RewindBench Standardized Leaderboards (`/studio/benchmarks`) across 5 standard datasets.
  - Model Trust, Calibration & Reliability Lab (`/studio/trust`) with Expected Calibration Error (ECE) and reliability diagrams.
  - Explainability Workbench (`/studio/explainability`) with feature importance bars and counterfactual sensitivity sliders.
  - Interactive Research Notebook (`/studio/notebook`) with markdown cells, reactive formulas, and inline charts.
  - Reproduction Studio (`/studio/reproduce`) with cryptographic SHA-256 manifests.
  - Compute & Training Profiler (`/studio/profiler`) with FLOPS tracking and memory utilization breakdown.
  - Research Projects Workspace (`/studio/projects`) for project lifecycle management.
  - Unified Exploration Hub (`/explore`) indexing 48+ algorithms, 2D/3D visual modes, and provenances.
- **Atmosphere & Visual Architecture:**
  - Reusable background primitives: `AmbientMeshBackground`, `SignalGridBackground`, `TraceWaveBackground`, `SectionGlow`.
  - Signature 3D `LearningOrbitHero` on non-convex Ackley manifold with accessible `LearningOrbitPoster` SVG fallback.
- **Governance & Specifications:**
  - Master Redesign documentation suite in `docs/redesign/` (Audit, Route Matrix, Design System, Motion System, 3D Asset Register, Responsive & A11y, Performance Before/After, Acceptance Report).
  - GitHub Actions CI workflow for linting, typechecking, testing, and production builds.

### Changed
- Streamlined public navigation to 4 core pillars: Product, Explore, Learn, Resources + Open Studio CTA.
- Reorganized Rewind Studio sidebar into 5 collapsible goal-driven workflows: Workspace, Build, Analyze, Research & Learn, Settings.
- Optimized bundle splitting so Three.js and heavy visualizers are loaded strictly on demand, reducing shared first-load JS to 103 kB.

### Security
- Sanitized `.env.example` to remove hardcoded credential templates.
- Enforced strict AST allowlisting on Algorithm Forge custom update rules.

