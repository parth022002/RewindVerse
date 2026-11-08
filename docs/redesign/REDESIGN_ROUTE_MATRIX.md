# RewindVerse — Redesign Route & Architecture Matrix

| Route | Category | Redesign Purpose | Primary Action | Target Viewport Support |
|---|---|---|---|---|
| **`/`** | Public | Signature homepage with Learning Orbit 3D hero, product proof, and workflow overview. | Open Rewind Studio | Mobile, Tablet, Laptop, Desktop |
| **`/product`** | Public | Explains the complete RVTS pipeline (Bring Data $\to$ Explore $\to$ Experiment $\to$ Replay). | Explore the Workflow | Responsive Grid |
| **`/explore`** | Public | Unified directory for algorithm families, 2D/3D visualizations, and interactive examples. | Search Algorithms | Searchable Grid |
| **`/learn`** | Public | Guided learning pathways, interactive Academy previews, and optimization challenges. | Start Learning | Card Progression |
| **`/docs`** | Public | Fast, legible developer documentation, API contracts, and Python SDK references. | Copy Code / Read Specs | Split Docs Layout |
| **`/security`** | Public | Comprehensive security standard: local-first isolation, zero `eval()`, OWASP CSV sanitization. | Inspect Trust Model | Technical Callouts |
| **`/roadmap`** | Public | Transparent view of shipped (P0), active (P1), and future (P2/P3) capabilities. | View Milestone Log | Timeline View |
| **`/studio`** | Studio Shell | Overview dashboard: recent projects, quick-start tiles, active runs, and storage status. | Create Project | Responsive Dashboard |
| **`/studio/projects`** | Studio Shell | Project workspace management, versioned dataset links, and experiment groups. | New Project | Project Grid |
| **`/studio/data`** | Studio Build | Data Lab: schema inference, statistical profiling, and zero-leakage partitions. | Import Dataset | Data Table + Profiler |
| **`/studio/algorithms`**| Studio Build | Searchable Algorithm Catalogue: mathematical formulas, assumptions, and RVTS signals. | Customize Algorithm | Card Filter Grid |
| **`/studio/forge`** | Studio Build | Research Workbench: Data, Equation (Jacobian check), Flow DAG, Code Studio, and Comparator. | Run Simulation | Multi-Studio Workspace |
| **`/studio/fit-lab`** | Studio Build | Data-to-Algorithm Fit Lab: ProblemSpec, candidate recommendation, and fit report. | Run Fit Benchmark | Step Pipeline |
| **`/studio/lab`** | Studio Build | Interactive continuous loss landscapes and logistic regression classifier decision boundaries. | Stream Optimizer Steps | 2D/3D Canvas + Controls |
| **`/studio/replay/[id]`**| Studio Analyze| Millisecond-accurate scrubber with synchronized loss curves, trajectories, and step inspector. | Seek Iteration | Replay Scrubber HUD |
| **`/studio/compare`** | Studio Analyze| Dual-run side-by-side 3D trajectory overlays with synchronized scrubber and convergence ratio. | Select Dual Runs | Split 3D View |
| **`/studio/insights`**| Studio Analyze| Automated heuristic detectors for divergence, loss plateaus, and gradient exploding/vanishing. | Jump to Step Range | Diagnostic Evidence List |
| **`/studio/embeddings`**| Studio Analyze| 3D Power Iteration PCA high-dimensional vector space projector with variance metrics. | Rotate / Project | 3D Point Cloud View |
| **`/studio/benchmarks`**| Studio Research| RewindBench standardized tracks with verified, reproducible, and self-reported leaderboards. | Submit Algorithm | Leaderboard Table |
| **`/studio/trust`** | Studio Research| Model Trust Lab: ECE calibration, reliability diagrams, and noise perturbation stress testing. | Run Noise Stress Test | Calibration Bins Chart |
| **`/studio/explainability`**| Studio Research| Explainability Workbench: Permutation Feature Importance (PFI) and Partial Dependence (PDP). | Select Feature | Importance Bars + PDP |
| **`/studio/notebook`**| Studio Research| Interactive Research Notebook combining Markdown, LaTeX KaTeX formulas, and executable code. | Execute Cell / Export | Notebook Cells List |
| **`/studio/reproduce`**| Studio Research| Reproduction Studio: `.rvcapsule` numerical tolerance verification ($\Delta \le 10^{-4}$). | Verify Capsule | Parity Verdict HUD |
| **`/studio/profiler`**| Studio Research| Compute Profiler: step latency breakdown, throughput meter, and memory allocation inspector. | Profile Run | Latency Breakdown Bars |
| **`/studio/settings`**| Studio System | Local IndexedDB management, cloud sync keys, and theme preferences. | Clear / Export DB | Form Panels |

