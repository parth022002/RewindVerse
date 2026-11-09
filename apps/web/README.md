# @rewindverse/web

**RewindVerse Web Platform & Rewind Studio**

The primary web application for RewindVerse, built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Three.js, and Lucide React.

---

## Architecture Overview

`apps/web` delivers both the public marketing and educational experience as well as the complete client-side **Rewind Studio** workspace:

1. **Public Experience**:
   - `/`: Landing page featuring the interactive **2D/3D Hero Demo Switcher** (`HeroDemo.tsx`) and the 5-layer coordinate background field (`BackgroundField.tsx`).
   - `/product`: Product capability breakdowns (RewindML, Rewind Replay, Rewind Insights, Rewind Compare, Rewind Academy).
   - `/how-it-works`: 5-stage interactive workflow guide (Train → Record → Replay → Inspect → Understand).
   - `/visualizations`: Interactive 6-module 2D/3D visualization catalog with data provenance badges.
   - `/learn`: Academy challenge curricula and optimization learning journeys.
   - `/how-it-works`: Interactive platform architecture and visual replay guide.
   - `/security`: Local-first trust architecture and data privacy standards.
   - `/about`: Mission statement, founding story, and engineering principles.
   - `/roadmap`: Public milestones and technical evolution plans.

2. **Rewind Studio Workspace** (`/studio/*`):
   - `/studio`: Studio home dashboard with quick action hub and local workspace run history.
   - `/studio/lab`: Interactive browser ML training laboratory (Continuous Loss Surfaces & Supervised Logistic Regression) with real-time decision boundary and `.rvtrace` export.
   - `/studio/import`: Safe drag-and-drop trace & CSV ingestion with live preview, formula sanitization, and capability detection.
   - `/studio/replay/[id]`: Multi-view synchronized playback (SVG Loss curve, 2D Trajectory, 3D Surface, Step Inspector, Diagnostic jump links).
   - `/studio/compare`: Side-by-side run comparison with dual 3D trajectory overlays and JSON export.
   - `/studio/insights`: Diagnostic explanation center with step-cited evidence narratives.
   - `/studio/academy`: Interactive "predict-before-run" challenges (Anisotropic Ravine Dilemma).
   - `/studio/embeddings`: High-dimensional embedding projector with Power Iteration PCA (2D/3D) and category filtering.

3. **Cloud Sharing**:
   - `/share/[token]`: Secure read-only shared replay view with watermark and step scrubbing.
   - `/api/traces/share`: Next.js BFF endpoint with Neon Postgres & S3 persistence.
   - `/api/cloud/status`: Health check BFF verifying live Neon PostgreSQL and S3 Object Storage connectivity.

---

## Technology Stack

- **Framework**: Next.js 15.5.29 (App Router, Turbopack ready)
- **UI Engine**: React 19.0.0
- **Styling**: Tailwind CSS with custom OKLCH design tokens and glassmorphic micro-interactions
- **3D Graphics**: Three.js 0.187.0 with WebGL 2, OrbitControls, and automatic context-loss recovery
- **State & Storage**: Zustand and browser IndexedDB (`apps/web/lib/storage.ts`) for 100% offline local-first privacy

---

## Development

```bash
# Start development server
pnpm --filter @rewindverse/web dev

# Run TypeScript typecheck
pnpm --filter @rewindverse/web typecheck

# Build for production
pnpm --filter @rewindverse/web build
```

---

## Performance Targets

- **First Load JS**: ≤ 122 kB across all 24 routes (Target: ≤ 200 kB gzip)
- **Zero Hydration Mismatch**: Pure SSR-safe loading with dynamic client-only imports for Three.js renderers (`ssr: false`)
- **WebGL Resilience**: Graceful fallback to 2D Canvas when WebGL is unavailable; handles `webglcontextlost` and `webglcontextrestored` without crashing

