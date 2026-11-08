# RewindVerse — Complete Website Performance & Optimization Standard

**Document type:** End-to-end web performance engineering, 3D performance, runtime optimization, delivery, measurement and release standard  
**Product:** RewindVerse  
**Primary application:** Rewind Studio  
**Version:** 1.0  
**Date:** 8 November 2026  
**Status:** Engineering standard — performance goals are targets until field and laboratory evidence is collected  
**Companion documents:** Final PRD; Technical Stack & Architecture; Website Design & Engineering Standards; Security Architecture & Implementation Standard; Website Visual Experience & 3D Design Specification; 2D/3D Visualization Product & Optimization Standard

---

## 0. Purpose

This document defines how to keep the complete RewindVerse website and Rewind Studio fast, responsive, stable and efficient while supporting premium visuals, animations, 2D/3D visualization, ML computation, trace processing and future integrations.

It covers the complete user journey:

**First visit → initial render → asset loading → navigation → Studio startup → experiment execution → replay → visualization interaction → sharing/export.**

The goal is not to optimize a single Lighthouse score at the expense of the real application. Performance must be measured across the public website, Studio, trace import, replay, charts, 3D scenes and mobile devices.

### Requirement language

- **MUST:** required for production.
- **SHOULD:** recommended; deviations must be justified.
- **MAY:** optional or later-stage.
- **P0:** release blocking.
- **P1:** high-value optimization.
- **P2:** later optimization once data shows a need.

---

# 1. Performance principles

1. **Fast first content, progressive enhancement.** The user should understand the page before heavy visuals load.
2. **No unnecessary initial JavaScript.** Keep the marketing routes light; load Studio and 3D code only when needed.
3. **No heavy work on the main thread.** ML training, large trace parsing and expensive analysis belong in workers where possible.
4. **Measure real devices.** A smooth 3D scene on a developer workstation proves nothing about a mid-range phone.
5. **Prefer native platform capabilities.** HTML, CSS, SVG and browser APIs should handle simple work before adding a library.
6. **Adapt quality rather than fail.** Reduce rendering scale/detail or fall back to 2D/static output when device conditions require it.
7. **Set budgets before adding effects.** New large assets, dependencies and animation loops require measurement.
8. **Optimize the bottleneck, not the metric label.** Use traces, filmstrips and attribution to find the responsible resource or task.
9. **Privacy-safe telemetry.** Record performance metrics only; never send trace contents, dataset values, model parameters or personal data to analytics.
10. **Protect correctness.** A faster visualization must not downsample or transform data in a misleading way.

---

# 2. Performance goals and acceptance thresholds

## 2.1 Field Core Web Vitals goals

Use the standard “good” Core Web Vitals thresholds at the 75th percentile for mobile and desktop separately:

| Metric | Good target | What it means |
|---|---:|---|
| LCP | ≤ 2.5 seconds | Main content appears quickly |
| INP | ≤ 200 milliseconds | User interactions respond quickly |
| CLS | ≤ 0.1 | Page layout remains visually stable |

These are external web performance thresholds, not a guarantee that every route will achieve them. Measure real-user data in the field once sufficient traffic exists. Until then, use lab tests and clearly label their limitations.

## 2.2 Internal RewindVerse targets

Use these as engineering budgets to guide implementation. They are project targets, not externally certified benchmarks.

| Area | Initial target | Release gate |
|---|---|---|
| Public landing initial JS | Aim ≤ 200 KB gzip for route-specific + shared first-load JS; review if framework baseline differs | No unreviewed large dependency; build analysis attached |
| Studio initial JS | Aim ≤ 300 KB gzip excluding deferred chart/3D/advanced modules | Core shell interactive before optional visualizers load |
| 3D route bundle | Load only on routes/sections that use it; route-level budget defined from actual analyzer output | Dynamic chunk and fallback proven |
| Hero LCP asset | Optimized responsive image/poster; target ≤ 250 KB where visual quality permits | LCP candidate is not lazy-loaded and has reserved dimensions |
| Font transfer | Prefer one variable family + one mono family; subset required glyphs | No unnecessary font weights or external runtime font request |
| TTFB | Aim ≤ 0.8 seconds for cached/public pages in the target deployment geography | Investigate server/data dependencies where this is exceeded |
| Main-thread tasks | No avoidable task > 50 ms during key interactions | Long tasks profiled and addressed |
| 2D interactive charts | Smooth interactions on reference laptop and acceptable interaction on mid-range phone | No main-thread data transform that blocks input |
| 3D hero | Target 55–60 FPS on reference desktop; ≥30 FPS on defined mid-range mobile test device where 3D is enabled | Adaptive fallback passes; do not force 60 FPS on every device |
| App startup | Render shell and route skeleton before loading large optional libraries | Cold start measured on throttled network/device |
| Trace handling | Parse incrementally/chunked for large supported files; show progress and cancellation | Memory/time tested against documented file-size classes |

Important: gzip bundle size is only one indicator. Do not use it as a substitute for CPU evaluation cost, hydration, image transfer, GPU work or real-user responsiveness.

## 2.3 Device profiles

Create a stable benchmark matrix and record the exact device/browser/OS for every report:

- **Profile A — high-end desktop:** current laptop/desktop with discrete or strong integrated GPU.
- **Profile B — standard laptop:** common integrated GPU, 8–16 GB RAM.
- **Profile C — mid-range mobile:** Android or iOS device representative of the target audience.
- **Profile D — low capability:** CPU/network throttling and limited GPU; test fallbacks, not necessarily full 3D.

Also test slow 4G / constrained network, cold cache, warm cache, low battery mode where available, reduced motion and WebGL unavailable.

---

# 3. Critical rendering path and page-load optimization

## 3.1 Rendering strategy

- Use Next.js App Router and React Server Components for static/public content by default.
- Keep client components small and near the interactive feature that needs them.
- Do not mark an entire page or layout as `use client` merely because one child needs interactivity.
- Stream non-critical content below the fold where appropriate.
- Provide stable skeletons/placeholders with known dimensions.
- Avoid hydration of decorative content when CSS/SVG is enough.
- Ensure the core content is available even if JavaScript fails or is delayed.

## 3.2 Route-level loading strategy

| Route / feature | Loading strategy |
|---|---|
| Home marketing page | Server-render headline, copy, navigation, CTA, section layout and static hero poster |
| Hero 3D | Dynamic client chunk, load after first content and capability checks; fallback remains visible |
| Product feature cards | Server-rendered; no client bundle unless interactive |
| Visualization gallery | Server-render catalogue and static preview; load selected renderer on demand |
| Rewind Studio shell | Load core interactive shell and essential state only |
| Charts | Load the chart library only when chart panel or route is opened |
| 3D loss landscape | Load Three.js/R3F on explicit 3D selection or route-specific demand |
| Advanced diagnostics | Load worker/module when user opens or requests advanced analysis |
| Documentation | Static/SSR; avoid application-level charting dependencies |

Use Next.js dynamic imports for large client components and libraries. Verify that dynamic imports are declared in a way that Next.js can analyze and split correctly. Official Next.js lazy-loading guidance: https://nextjs.org/docs/app/guides/lazy-loading

## 3.3 Avoid loading the 3D engine globally

Never import Three.js, React Three Fiber, Drei, large shader libraries or 3D model loaders into the root layout, global navigation or shared utility barrel that is imported by every route.

Bad pattern:

```ts
// Avoid: imported by app-wide component; leaks heavy renderer into shared graph.
import { Canvas } from "@react-three/fiber";
```

Preferred direction:

```tsx
"use client";

import dynamic from "next/dynamic";

const LossSurface3D = dynamic(
  () => import("./loss-surface-3d"),
  {
    ssr: false,
    loading: () => <LossSurfacePoster />,
  }
);

export function LossSurfacePanel() {
  return (
    <section aria-label="Loss surface visualization">
      <LossSurface3D />
    </section>
  );
}
```

Check the exact Next.js version and server/client boundary rules before using `ssr: false`; in current App Router patterns this needs to be inside a Client Component.

---

# 4. JavaScript, React and dependency optimization

## 4.1 Dependency governance

Before installing a package:

1. Confirm the requirement cannot be handled by native browser APIs or existing dependencies.
2. Check maintenance status, security advisories, bundle weight and licence.
3. Check current API documentation using Context7 or official docs.
4. Prefer importing a specific function/component instead of a full package barrel when possible.
5. Add a bundle impact note to the PR.
6. Remove replaced or unused packages.

Do not add competing libraries for the same concern without a written reason. RewindVerse already has a preferred stack: Next.js, React, TypeScript, Tailwind, Radix/shadcn-style UI, Motion, Zustand, D3, Three.js/R3F where required, Web Workers and RVTS.

## 4.2 React performance

- Avoid unnecessary state at the top of the component tree.
- Keep state close to the component that uses it.
- Use selectors in Zustand to subscribe only to required state.
- Avoid putting frame-by-frame 3D values into React state.
- Memoize only where profiling shows repeated expensive work; do not add `useMemo`/`useCallback` mechanically.
- Use stable keys and avoid index keys for reorderable data.
- Virtualize long trace/event lists and large tables.
- Avoid rendering thousands of SVG elements when Canvas/WebGL is more suitable.
- Keep derived chart data outside hot render paths and recompute only when source data changes.
- Split expensive panels into separate components and lazy-load advanced panels.

## 4.3 Avoid hydration and rendering pitfalls

- Do not read `window`, `document`, `localStorage`, `navigator` or WebGL capabilities during server render.
- Read browser-only data after mount or through client-only components.
- Keep SSR and first client render deterministic.
- Do not generate random IDs/scene positions separately on server and client.
- Do not render date/time strings that vary between server and client without a stable formatting plan.
- Resolve hydration warnings; do not silence them without identifying the cause.

---

# 5. Image, video, font and background optimization

## 5.1 Images

- Use Next.js `Image` or an equivalent optimized image pipeline for content images.
- Prefer AVIF/WebP variants where browser support and quality are acceptable; retain a fallback where needed.
- Provide `width`/`height` or `aspect-ratio` to reserve layout space.
- Use `sizes` to prevent unnecessarily large files from being served to mobile.
- Do not lazy-load the actual LCP image; lazy-load below-the-fold images.
- Use blur/color placeholders only when they improve perceived loading without adding expensive work.
- Compress screenshots and crop them for actual display dimensions.
- Do not ship a 4K image as a small feature-card background.
- Use a poster for 3D/animation fallback rather than forcing a video background.

## 5.2 Fonts

- Use `next/font` for self-hosting and controlled loading.
- Prefer one variable sans-serif and one monospace family.
- Load only needed subsets and language ranges.
- Avoid multiple font families with overlapping roles.
- Use `font-display: swap` or the framework's optimized strategy; set fallbacks with similar metrics to reduce layout shift.
- Do not preconnect to external font sites if fonts are self-hosted and no external request is needed.

## 5.3 Background effects

- Use CSS gradients, SVG patterns and static images before canvas or WebGL.
- Keep background SVGs simple and compressed.
- Avoid huge full-screen blurred layers with animated filters.
- Avoid background videos unless the product story cannot be told more efficiently.
- Use `content-visibility` or rendering containment only after testing focus, sticky elements and browser behaviour.
- Use `prefers-reduced-motion` and `prefers-reduced-data` where appropriate.
- Avoid scroll event handlers that trigger layout reads/writes on every event.

---

# 6. Animation and interaction performance

## 6.1 Animation rules

- Animate `transform` and `opacity` where possible.
- Avoid continuously animating width, height, top, left, margin, filter and large shadows.
- Use CSS for simple hover/focus/opacity transitions.
- Use Motion for complex layout transitions, gestures and spring interactions only where helpful.
- Default small UI spring can use stiffness 300 and damping 30 as a design preset, then be tuned by feel and performance.
- Do not run many independent infinite loops simultaneously.
- Do not use a requestAnimationFrame loop if an animation can be CSS/Web Animations API.
- Stop offscreen animations and pause scenes when the tab is hidden.
- Keep animations interruptible; interaction should never wait for a long flourish to finish.

## 6.2 Motion preference

Respect OS-level `prefers-reduced-motion`. For reduced-motion users:

- disable large parallax and camera orbit;
- stop auto-playing scene animation;
- replace large position/scale changes with opacity or instant state changes;
- keep essential educational transitions where safe, but give control to users;
- preserve all features in a static or direct-manipulation mode.

Motion's own accessibility guidance: https://motion.dev/docs/react-accessibility  
MDN reduced motion: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion

## 6.3 Interaction responsiveness

- Avoid synchronous trace parsing or large calculations inside click handlers.
- Move CPU-heavy work to workers.
- Break large work into chunks and allow cancellation.
- Keep input handlers short; schedule non-critical rendering after the immediate feedback is shown.
- Avoid large component re-render cascades during sliders, scrubbers and timeline drags.
- For chart scrubbing, update a lightweight cursor/selection first, then update expensive annotations/data views as needed.

---

# 7. 3D and WebGL performance standard

3D is an enhancement, not a required dependency for every route. A failed 3D scene must not break the website.

## 7.1 Scene lifecycle

- Load renderer only when the scene is selected/visible.
- Use a stable scene container size to prevent CLS.
- Pause the render loop when the scene is outside the viewport or document is hidden.
- Prefer `frameloop="demand"` for static or mostly static scenes.
- Use `invalidate()` only when state changes require a new frame.
- Avoid creating new geometry, materials, vectors, arrays or closures every frame.
- Use instancing for repeated nodes/particles where appropriate.
- Reuse geometry and materials across objects.
- Use small/optimized textures; avoid large texture maps for subtle detail.
- Keep post-processing minimal; each effect requires measurement.
- Cap pixel ratio/render scale; high-DPI render buffers can multiply GPU work.
- Adapt object count, shadow quality, antialiasing and post-processing based on the scene quality tier.
- Use progressive loading for 3D models and show useful fallback while loading.

## 7.2 Resource disposal

Three.js GPU resources do not automatically disappear simply because JavaScript references are dropped. Dispose unused geometry, materials, textures, render targets and other resources. Verify ownership when resources are shared; avoid disposing a texture still in use elsewhere.

Official references:
- https://threejs.org/manual/pages/cleanup.html
- https://threejs.org/manual/pages/how-to-dispose-of-objects.html

## 7.3 Adaptive rendering tiers

| Tier | Conditions | Policy |
|---|---|---|
| High | Strong device, normal motion, stable frame time | Full quality within budget |
| Balanced | Standard laptop/tablet | Reduced render scale, fewer particles, limited shadows |
| Low | Mid-range mobile / thermal pressure | Low detail, no heavy post-processing, slower/paused animation |
| Static | WebGL unavailable, reduced motion, user preference or repeated context failure | Poster/SVG/2D alternative |

Use real measurement and user settings, not unreliable browser sniffing alone. Do not assume `navigator.deviceMemory` or GPU strings exist or are trustworthy. Device heuristics may suggest a tier; runtime frame time and explicit user choice should influence adjustments.

## 7.4 Context loss and error recovery

- Listen for WebGL context loss/restoration as supported by the rendering layer.
- On failure, show static fallback and a retry action.
- Do not repeatedly recreate a failing renderer in a tight loop.
- Release resources before route transitions when scene ownership ends.
- Test tab backgrounding, device sleep, route navigation, resize and memory pressure.

## 7.5 3D performance tests

Measure:

- scene dynamic import download and parse time;
- time to first useful 3D frame;
- steady-state FPS/frame time;
- GPU/CPU usage where tooling permits;
- memory growth over repeated mount/unmount cycles;
- behavior under resize and high DPR;
- dropped frames during interaction;
- fallback and reduced-motion paths.

Targets should be reported by device profile; do not report a single FPS number without device, browser, scene and render-scale details.

---

# 8. Rewind Studio and ML workload optimization

## 8.1 Worker boundaries

Use Web Workers for:

- RewindML training loops;
- gradient/objective calculations when heavy;
- RVTS JSONL parsing and semantic validation;
- gzip decompression;
- large CSV parsing and mapping previews;
- derived diagnostics;
- large trace indexing and export serialization;
- embedding pre-processing where supported.

Keep UI updates, accessibility announcements and controls on the main thread. Web Workers do not remove the need for chunking and memory limits.

## 8.2 Worker messaging

- Use versioned, typed message envelopes.
- Include request IDs and experiment IDs.
- Support progress, cancellation, success, partial failure and fatal failure messages.
- Transfer `ArrayBuffer` ownership where possible rather than cloning very large buffers.
- Do not post thousands of messages per second; batch metrics/snapshots according to the trace cadence.
- Protect the UI against stale responses from a previous run.
- Bound queue length and support backpressure.

Example contract:

```ts
export type WorkerRequest =
  | { type: "RUN_START"; requestId: string; experimentId: string; config: RunConfig }
  | { type: "RUN_PAUSE"; requestId: string; experimentId: string }
  | { type: "RUN_RESUME"; requestId: string; experimentId: string }
  | { type: "RUN_CANCEL"; requestId: string; experimentId: string }
  | { type: "TRACE_VALIDATE"; requestId: string; buffer: ArrayBuffer };

export type WorkerResponse =
  | { type: "PROGRESS"; requestId: string; step: number; metrics: MetricBatch }
  | { type: "COMPLETE"; requestId: string; traceId: string }
  | { type: "VALIDATION_RESULT"; requestId: string; result: ValidationResult }
  | { type: "FAILED"; requestId: string; code: string; message: string };
```

The example is illustrative. Validate every message at the worker boundary and ensure no untrusted message can trigger arbitrary code execution.

## 8.3 Numerical and visualization accuracy

- Do not downsample raw trace data in a way that changes the reported training values.
- Maintain a raw data source and a separate display-decimation layer.
- Label interpolated values and avoid implying they were recorded.
- Keep Float64 precision where needed for numerical parity; document Float32 display conversions.
- Diagnostics should compute from original supported series, not chart-decimated display points.
- If large datasets are decimated for display, choose an algorithm that preserves extrema/events and document the method.
- Do not perform expensive model/trace calculations inside a React render.

## 8.4 Large trace processing

- Enforce compressed and uncompressed size limits.
- Stream/decompress in chunks where feasible.
- Limit line length, nesting depth, record count and total allocation.
- Provide progress and cancellation.
- Avoid `JSON.parse` of an unbounded whole-file string for large traces.
- Build an index for step navigation when useful.
- Keep parsing and validation in a worker.
- Show memory estimates/warnings before processing very large files.
- Never execute imported content or deserialize arbitrary Python pickle/joblib artifacts.

---

# 9. Data visualization performance

## 9.1 Rendering choice

| Data volume / interaction | Recommended renderer |
|---|---|
| Small categorical chart / accessible labels | SVG / DOM |
| Standard line charts with moderate points | SVG/D3 |
| Very dense scatter or heatmap | Canvas 2D or WebGL |
| 3D landscape or embeddings | Three.js/R3F, dynamically loaded |
| Tables with many rows | Virtualized table/list |
| Dense network graph | Canvas/WebGL or level-of-detail graph |

Do not choose WebGL just because the product uses 3D elsewhere. Use the simplest renderer that meets accuracy, interactivity and accessibility requirements.

## 9.2 Chart optimization

- Keep scales and axes stable while dragging where possible.
- Use decimation for rendering only, preserving original data and event markers.
- Draw hover/cursor overlays separately from the full chart where helpful.
- Use Canvas for large numbers of points; render interactive labels/selected points in SVG/DOM.
- Avoid rebuilding all SVG nodes on every cursor move.
- Throttle/debounce expensive search and filter actions.
- Use `requestAnimationFrame` or pointer events carefully; avoid synchronous layout reads.
- Ensure chart color/legend and accessible data table remain available.

## 9.3 Compare and replay

- Synchronize charts by trace step using the explicit step unit.
- Do not assume different traces have the same step unit or cadence.
- Do not invent missing values to align charts.
- Use precomputed normalized indexes for large trace overlays.
- Update only the current cursor/selection when scrubbing; avoid full re-render of all visualizations for every pointer event.
- Provide an option to pause heavy chart updates while dragging and settle on release.

---

# 10. Network, caching and delivery optimization

## 10.1 Caching strategy

| Resource | Strategy |
|---|---|
| Hashed JS/CSS assets | Long-lived immutable cache |
| Versioned public posters/images | Long-lived immutable cache |
| Public static docs | CDN/cache with controlled revalidation |
| User-specific metadata | Private/no-store or carefully scoped cache; never shared accidentally |
| Trace objects | Private by default; signed, short-lived access when explicitly shared |
| RVTS schema/version metadata | Versioned and cacheable; preserve old supported schema versions |
| API responses | Explicit cache policy by data classification |

Never put private trace data behind a public shared cache. Cache invalidation and access revocation must be part of the sharing design.

## 10.2 Asset compression

- Enable Brotli or gzip at the delivery layer where supported.
- Use AVIF/WebP images when appropriate.
- Compress SVG and remove unnecessary metadata/comments.
- Use GLB compression only when decode cost and loader support are understood.
- Avoid shipping source maps publicly if they expose sensitive internal source; upload privately to the monitoring system as configured.

## 10.3 Prefetching

- Use framework prefetching for likely navigation where it improves real journeys.
- Avoid prefetching heavy Studio/3D route chunks from every public page if the user is unlikely to open them.
- Do not prefetch large traces or personalized resources.
- Test bandwidth and CPU impact on mobile data.

---

# 11. Server, database and API performance

## 11.1 Server rendering and route handlers

- Keep marketing pages static/ISR where content allows.
- Avoid blocking static rendering on non-critical third-party services.
- Keep API route handlers short and bounded.
- Do not run long ML training or heavy trace processing in serverless request handlers.
- Apply request body size limits and timeouts.
- Use a background job only when a real asynchronous cloud operation is introduced; do not add queue infrastructure prematurely.

## 11.2 Database

- Index user/workspace/share lookup fields used by frequent queries.
- Select only needed columns.
- Use pagination/cursors for large metadata lists.
- Avoid N+1 queries.
- Add connection pooling appropriate to the hosting model.
- Do not store large trace blobs in relational rows; use private object storage if cloud sharing is enabled.
- Record query duration in aggregate, privacy-safe telemetry.

## 11.3 Object storage

- Upload/download large trace data directly to private object storage with short-lived signed URLs where appropriate.
- Do not proxy multi-megabyte trace payloads through application servers unnecessarily.
- Enforce object size, content type, checksum and ownership controls.
- Verify ownership at the server before issuing download/access capability.
- Revoke shares by invalidating metadata/permission state; use short URL expiry and avoid long-lived public object paths.

---

# 12. Third-party scripts and analytics

- Keep third-party scripts to a minimum.
- Load analytics only after the privacy/consent design permits it.
- Avoid tag-manager sprawl.
- Do not load chat widgets, heatmaps or ad trackers by default.
- Defer non-critical scripts until idle or after interaction.
- Use a restrictive Content Security Policy.
- Do not send raw trace content, dataset values, model parameters, file names or user-entered prompts to product analytics.
- Track coarse events such as `demo_started`, `visualization_mode_selected`, `trace_import_completed` with schema allowlists and no sensitive payloads.
- Measure the performance impact of any third-party script before enabling it in production.

---

# 13. Performance measurement toolchain

## 13.1 Local developer workflow

- Browser DevTools Performance panel for main-thread work, long tasks, layout and rendering.
- Network panel for waterfall, cache and transfer size.
- Lighthouse/PageSpeed Insights for lab audits and route comparison.
- `@next/bundle-analyzer` or the currently supported Next.js analyzer for bundle inspection.
- Playwright for repeatable route, screenshot and interaction checks.
- `web-vitals` library for field metrics where appropriate.
- WebPageTest for network/device filmstrips and repeatable throttling scenarios.
- React Profiler for expensive components.
- Three.js/R3F renderer diagnostics for scene-level profiling.

Tools must be pinned/configured in CI where reproducibility matters. Lab scores vary by hardware and environment; preserve raw reports and run configuration.

## 13.2 Field measurement

Once production traffic exists, collect Core Web Vitals using an approved privacy-preserving RUM setup. Segment by:

- route group (marketing, docs, Studio, visualization);
- mobile/desktop;
- browser family;
- device quality tier where available and non-identifying;
- scene enabled/fallback;
- release version.

Do not collect trace values or file contents. Use aggregation and appropriate consent/retention controls.

## 13.3 Performance dashboard

Monitor at minimum:

- LCP, INP, CLS and TTFB;
- initial JS and CSS transfer size by route;
- image/font transfer;
- 3D chunk download and first-frame time;
- WebGL failure/fallback rate;
- scene FPS/frame-time bands;
- worker start/completion time;
- trace parse/validation duration by safe size bucket;
- replay seek latency by trace size bucket;
- error rate and long-task count.

---

# 14. Automated performance regression gates

Every meaningful PR should include checks appropriate to the change.

| Check | P0/P1 gate |
|---|---|
| Production build | Must succeed without unexpected warnings/errors |
| TypeScript/lint | Must pass |
| Unit tests | Must pass |
| Critical Playwright journeys | Must pass |
| Visual snapshots | Review when UI/scene changes |
| Bundle report | Required if dependencies, layout shell or rendering code changes |
| Lighthouse/route audit | Required for public page and major Studio route at release candidates |
| Web Vitals | No regression beyond agreed tolerance without an issue/approval |
| 3D lifecycle test | Mount/unmount, resize, context failure, reduced motion and fallback tested |
| Worker test | Cancellation, stale responses, malformed data and large input behaviour tested |
| Trace benchmark | Parser/replay benchmark updated when trace or chart pipeline changes |

Do not set a hard numeric CI gate from a noisy Lighthouse score alone. Use stable budgets for bundle size, asset weight, test failures and reproducible timing checks; run field data as a complementary signal.

---

# 15. Optimization workflow for every feature

Use the following workflow for all major pages, animations, charts and 3D scenes:

1. **Define the user outcome.** What is the feature meant to help the visitor understand or do?
2. **Choose the lightest implementation.** HTML/CSS/SVG first; Canvas/Three.js only when necessary.
3. **Set a budget.** Asset size, initial JS, CPU/GPU cost, memory and target devices.
4. **Implement a stable fallback.** Reserve dimensions and render useful content immediately.
5. **Split and defer.** Load only when the feature is needed or near the viewport.
6. **Profile before tuning.** Capture baseline network, CPU, GPU and interaction traces.
7. **Optimize bottlenecks.** Reduce data, avoid work, reuse resources, move work to workers, then tune visuals.
8. **Test device tiers.** Desktop, laptop, tablet, mobile and reduced-motion.
9. **Test failure modes.** Offline, slow network, blocked WebGL, worker crash, invalid trace and navigation away mid-task.
10. **Record evidence.** Attach before/after metrics, device/browser and test report to the PR.
11. **Recheck after dependencies change.** Version upgrades can alter bundle and runtime performance.

---

# 16. Route-by-route optimization plan

| Route | Main risk | Optimization focus |
|---|---|---|
| Home | Hero art and 3D bundle delaying LCP | Static first frame, dynamic scene, optimized poster/fonts |
| Product | Many rich demos and images | Lazy demos, optimized images, shared components |
| How it works | Scroll effects and animated diagrams | SVG first, one-time motion, no scroll-jacking |
| Visualizations | 3D/chart libraries | Load selected renderer only, show static gallery cards |
| Learn | Heavy interactive lesson content | Load only active lesson assets, lightweight initial listing |
| Docs | Excess code highlighters and navigation JS | Static rendering, selective code highlighting, minimal client components |
| Studio | React hydration, charting, workers and state | Small shell, route-level chunks, workers, selective subscriptions |
| Replay | Large trace, many charts and event list | Worker parsing/indexing, virtualization, decimation, cursor isolation |
| Compare | Multiple large traces/charts | Incremental indexing, synchronized cursor, chart rendering tiers |

---

# 17. Accessibility, privacy and performance alignment

Performance improvements must not remove accessibility or privacy controls.

- Reduced motion must reduce actual render work, not only hide a visual animation while the renderer continues running.
- Static fallback must contain equivalent meaning and data summary.
- Do not use skeletons that cause screen readers to announce repeated irrelevant updates.
- Do not announce every training step to assistive technology; announce meaningful milestones and expose current values on demand.
- Do not collect raw traces in performance telemetry.
- Do not expose user-specific cached responses through public CDN cache rules.
- Do not disable browser zoom to make a layout fit.
- A 3D renderer must not trap keyboard focus or consume all touch gestures.

---

# 18. Incident and degradation behaviour

If performance or GPU capability is insufficient:

1. Disable or reduce decorative scene motion.
2. Lower render resolution and detail.
3. Switch from 3D to 2D or static poster.
4. Keep text, navigation, controls and export available.
5. Preserve training state; do not silently cancel computation when a scene fails.
6. Show a concise notice only if the change materially affects the user.
7. Offer retry when failure may be temporary.
8. Record a non-identifying failure metric for investigation if permitted.

If a worker fails:

- report the failure clearly;
- preserve the last safely recorded trace/checkpoint where possible;
- do not claim a run completed;
- allow export of partial data only if the format explicitly supports and labels it;
- avoid automatically rerunning a potentially expensive training operation without user consent.

---

# 19. Release acceptance checklist

## 19.1 Public website

- [ ] Good Core Web Vitals targets measured or an explicit remediation plan exists.
- [ ] LCP resource is optimized and not accidentally lazy-loaded.
- [ ] Images have correct dimensions/aspect ratios and responsive sizes.
- [ ] Fonts are subsetted/self-hosted using the approved mechanism.
- [ ] 3D scene is dynamically loaded and has a static fallback.
- [ ] No unnecessary third-party script blocks initial rendering.
- [ ] All key pages work on mobile and desktop.
- [ ] Reduced motion stops non-essential scene loops and large movement.
- [ ] No significant layout shift during asset/scene loading.
- [ ] Public route bundles have been analyzed.

## 19.2 Rewind Studio

- [ ] Initial shell is interactive before advanced visualization chunks are loaded.
- [ ] Training and trace parsing execute off the main UI thread where appropriate.
- [ ] Worker messages are versioned, validated and cancellable.
- [ ] Long lists and dense tables are virtualized where needed.
- [ ] Replay seeking remains responsive at documented trace sizes.
- [ ] 2D and 3D renderers are loaded only when selected/required.
- [ ] Display decimation does not alter original records or diagnostic inputs.
- [ ] 3D resources are disposed correctly.
- [ ] WebGL failure and context loss are handled.
- [ ] Privacy-safe performance telemetry excludes trace contents.

## 19.3 Evidence

- [ ] Lighthouse/PageSpeed reports saved for release candidate.
- [ ] Bundle analyzer report saved.
- [ ] Playwright results saved.
- [ ] Real-device or agreed device-lab tests completed.
- [ ] 3D frame-time and lifecycle test results saved.
- [ ] Trace parse/replay benchmarks saved.
- [ ] Before/after data available for any optimization claim.

---

# 20. Priority backlog

## P0 — Essential

1. Define route-level JS and asset budgets.
2. Keep Server Components default for static/public content.
3. Lazy-load all 3D scenes and advanced visualization packages.
4. Add stable image/poster dimensions and optimize the LCP asset.
5. Self-host/subset fonts.
6. Implement reduced-motion and scene pause behavior.
7. Move training, trace parsing and heavy analysis to workers.
8. Implement trace parser size limits, chunking and cancellation.
9. Add bundle analysis to the PR/release workflow.
10. Establish Playwright critical journeys and visual checks.
11. Add 3D resource lifecycle/fallback tests.
12. Create a baseline Lighthouse/Web Vitals report by route.

## P1 — High value

1. Add adaptive scene quality tiers.
2. Add real-user Core Web Vitals monitoring with privacy controls.
3. Add route/feature bundle budgets to CI.
4. Virtualize large trace/event lists.
5. Add Canvas renderer for high-density visualizations where SVG is too expensive.
6. Add replay seek benchmarks and chart decimation tests.
7. Add WebGL context-loss and memory-pressure scenarios.
8. Add network/CPU throttling scenarios to Playwright/WebPageTest workflow.

## P2 — Advanced

1. Predictive prefetch of likely navigation, with bandwidth controls.
2. Advanced render quality tuning based on actual frame-time telemetry.
3. Offline caching for public docs/tutorial assets where value is demonstrated.
4. Progressive 3D model/texture loading for advanced visualizer routes.
5. Automated performance regression triage and trend reports.

---

# 21. Optimization ownership and governance

- Every feature owner is responsible for its performance budget.
- Any new major dependency must include bundle impact.
- Any new 3D scene must include device/fallback plan and frame-time profile.
- Any large dataset feature must include memory and cancellation strategy.
- Any PR that increases initial JavaScript substantially must justify the change.
- Performance budgets must be reviewed using real measurements, not arbitrary targets alone.
- If a budget is exceeded, open a tracked remediation issue and document the release exception.
- Re-run performance checks after Next.js, React, Three.js/R3F, browser or hosting upgrades.

---

# 22. Official technical references

Use the version-specific official docs during implementation:

- Next.js App Router: https://nextjs.org/docs/app
- Next.js lazy loading: https://nextjs.org/docs/app/guides/lazy-loading
- Next.js Server and Client Components: https://nextjs.org/docs/app/getting-started/server-and-client-components
- Next.js Image Optimization: https://nextjs.org/docs/app/getting-started/images
- Next.js Font Optimization: https://nextjs.org/docs/app/getting-started/fonts
- web.dev Core Web Vitals: https://web.dev/explore/learn-core-web-vitals
- web.dev performance learning: https://web.dev/learn/performance/
- web.dev INP optimization: https://web.dev/explore/how-to-optimize-inp
- web.dev TTFB optimization: https://web.dev/articles/optimize-ttfb
- React Three Fiber: https://r3f.docs.pmnd.rs/
- Three.js responsive rendering: https://threejs.org/manual/pages/responsive.html
- Three.js cleanup: https://threejs.org/manual/pages/cleanup.html
- Three.js disposal: https://threejs.org/manual/pages/how-to-dispose-of-objects.html
- Motion for React: https://motion.dev/docs/react
- Motion accessibility: https://motion.dev/docs/react-accessibility
- MDN reduced motion: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- WCAG 2.2: https://www.w3.org/TR/WCAG22/

---

# 23. Final engineering position

The fastest RewindVerse website is not the one with every effect removed. It is the one that loads the right content first, defers work until it is useful, selects an appropriate rendering path for each device, and never makes the user wait for decoration.

The public site should feel premium and immersive through a small number of well-crafted backgrounds and 3D moments. Rewind Studio should prioritize numerical correctness, fast input response, trace safety and clear data exploration. Performance is a product feature and must be measured continuously—not a cleanup task left until the end.
