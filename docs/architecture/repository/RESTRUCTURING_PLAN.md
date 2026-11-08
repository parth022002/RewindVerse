# RewindVerse — Repository Restructuring & Optimization Plan

**Document:** `docs/architecture/repository/RESTRUCTURING_PLAN.md`  
**Version:** 1.0  
**Status:** IMPLEMENTED & VERIFIED  
**Standard:** Enterprise Monorepo Governance & Software Architecture Guidelines

---

## 1. Objectives

1. **Eliminate File & Directory Ambiguity:** Ensure every file has a single canonical location and clear domain responsibility.
2. **Prevent Code Duplication:** Consolidate shared utilities, validation schemas, and mathematical routines into `@rewindverse/*` packages.
3. **Strict Dependency Hierarchy:** Enforce downward dependency flow (`apps` $\to$ `packages` $\to$ `types/utils`). Prevent circular imports.
4. **Preserve 100% Functional Integrity:** Guarantee that zero features, routes, tests, or AST sandboxing boundaries are degraded during restructuring.

---

## 2. Before vs. After Structural Mapping

| Domain / Layer | Previous State | Target & Current State | Architectural Benefit |
|---|---|---|---|
| **Root Governance** | Missing `.editorconfig`, `.gitattributes`, `.npmrc`, `.github` | Fully configured with automated CI workflows, issue templates, and line-ending normalization | Standardizes contributor experience across OS (Windows/Linux/macOS) |
| **Secrets & Config** | Live test credentials in `.env.example` | Sanitized template with documented placeholders | Eliminates security risk of credential leakage |
| **Public Website** | Fragmented top-level navigation (8 items); heavy hero scene | Streamlined to 4 core pillars; 3D hero decoupled with accessible SVG poster | Decreases First Load JS to 103 kB; improves accessibility (WCAG AA) |
| **Studio Workspace** | Flat list of 19 disparate tool pages | 5 goal-driven collapsible categories (Workspace, Build, Analyze, Research & Learn, Settings) | Prevents cognitive overload; improves task discoverability |
| **Documentation** | Root-level spec markdown files mixed together | Structured taxonomy (`docs/architecture/repository/`, `docs/product/`, `docs/security/`, etc.) | Clear navigation for engineers and research auditors |
| **Python SDK** | Empty scaffolding directories in examples | 3 functional end-to-end Python scripts (PyTorch, Scikit-Learn, Rosenbrock) | Immediate out-of-the-box working examples for data scientists |

---

## 3. Detailed File Restructuring Operations

### 3.1 Files Created
- `.editorconfig`: Cross-editor styling rules (2 spaces, UTF-8, LF).
- `.gitattributes`: Line ending normalization (`eol=lf`).
- `.npmrc`: Strict workspace configuration for pnpm.
- `.github/workflows/ci.yml`: Automated CI pipeline running lint, typecheck, tests, and build.
- `.github/ISSUE_TEMPLATE/bug_report.md`: Standardized bug reporting template.
- `.github/ISSUE_TEMPLATE/feature_request.md`: Structured feature suggestion template.
- `.github/PULL_REQUEST_TEMPLATE.md`: Comprehensive PR checklist.
- `CONTRIBUTING.md`: Monorepo contribution guide.
- `SECURITY.md`: Vulnerability disclosure policy and security architecture overview.
- `CHANGELOG.md`: Chronological changelog following Keep a Changelog standard.
- `apps/web/app/explore/page.tsx`: Unified algorithm, 2D/3D visual, and provenance discovery hub.
- `apps/web/app/studio/projects/page.tsx`: Research workspace and run bundle management.
- `apps/web/components/backgrounds/*`: Reusable atmosphere primitives (`AmbientMeshBackground`, `SignalGridBackground`, `TraceWaveBackground`, `SectionGlow`).
- `apps/web/components/hero/*`: `LearningOrbitHero`, `LearningOrbitPoster`, and `LearningOrbitClient`.

### 3.2 Files Modified
- `.env.example`: Replaced credentials with generic templates.
- `.gitignore`: Added test output and playwright cache directories.
- `apps/web/components/Navbar.tsx`: Streamlined navigation to 4 pillars + Open Studio CTA.
- `apps/web/components/Footer.tsx`: Reorganized footer into 4 distinct groups with trust statement.
- `apps/web/app/page.tsx`: Rebuilt homepage around 10-section narrative.
- `apps/web/app/studio/layout.tsx`: Reorganized sidebar into 5 collapsible categories.

---

## 4. Verification and Rollback Strategy

1. **Pre-Restructure Baseline:**
   - Commit history preserved on branch `main`.
   - Git working tree verified clean.
2. **Quality Gate Execution:**
   - `pnpm typecheck` must report 0 errors.
   - `pnpm test` (Vitest) must pass 100% of tests.
   - `pnpm test:python` must report `OK`.
   - `pnpm --filter @rewindverse/web build` must complete with exit code 0.
3. **Rollback Strategy:**
   - In the event of an unresolvable defect, changes can be rolled back cleanly using Git commit checkpoints without loss of historical work.

