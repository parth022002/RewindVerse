# RewindVerse — Website Visual Experience & 3D Design Specification

**Document type:** Website art direction, visual experience, 3D implementation and interaction specification  
**Product:** RewindVerse  
**Primary application:** Rewind Studio  
**Version:** 1.0  
**Date:** 8 November 2026  
**Status:** Implementation specification — all features below are proposed requirements until built and verified  
**Companion documents:** Final PRD; Technical Stack & Architecture; Website Design & Engineering Standards; Security Architecture & Implementation Standard; 2D/3D Visualization Product & Optimization Standard

---

## 0. Purpose and how to use this document

This document defines how to make the RewindVerse public website visually distinctive, futuristic, credible and memorable through purposeful 3D elements, layered backgrounds, motion and polished interactions. It is written for frontend developers, visual designers, 3D artists, product designers and QA engineers.

It is not a general instruction to add as many effects as possible. It defines a controlled visual system that supports the product story while preserving readability, accessibility, responsiveness and loading performance.

### Requirement language

- **MUST:** required for a production-quality implementation.
- **SHOULD:** strongly recommended; deviations require a reason.
- **MAY:** optional or experimental.
- **P0:** must be implemented for the first polished website release.
- **P1:** high-value enhancement after P0 is stable.
- **P2:** optional advanced polish or later product evolution.

### Evidence rule

A design shown in Figma, a mockup, a generated image or this document is not an implemented feature. Mark a requirement as complete only when the corresponding code exists and the interaction has been visually and functionally tested across desktop and mobile.

---

# 1. Brand and experience direction

## 1.1 Official brand system

| Item | Approved direction |
|---|---|
| Platform name | **RewindVerse** |
| Main workspace | **Rewind Studio** |
| Tagline | **Every Model Has a Story.** |
| Product promise | **Train a model, then replay how it learned.** |
| Brand personality | Intelligent, exploratory, precise, premium, approachable, technically credible |
| Core visual metaphor | A learning journey moving through time: signal, trajectory, iteration, insight and replay |
| Primary visual signature | A continuous path/orbit that forms or passes through a stylised R / rewind motif |

Use the selected RewindVerse wordmark and symbol consistently. Do not redraw or distort the logo in the 3D scene. Keep a flat SVG/PNG brand mark available for low-bandwidth, print, favicon and reduced-motion contexts.

## 1.2 The design objective

The website should communicate three things within the first few seconds:

1. RewindVerse is an advanced machine-learning product, not a generic AI landing page.
2. Its defining experience is replaying and understanding how models learn.
3. The product has a real working interface with trustworthy, inspectable visualizations.

The public website may be cinematic. The Rewind Studio application must remain focused, information-dense where necessary, accessible and fast. Never apply the marketing site's ambient animations indiscriminately to the analytical workspace.

## 1.3 Product storytelling sequence

Use this narrative across the homepage:

**Curiosity → Experiment → Replay → Insight → Understanding → Explore Studio**

The page should demonstrate the product, not merely claim that it is powerful.

---

# 2. Visual design system

## 2.1 Color direction

Use a deep navy/slate foundation with restrained cyan, electric blue and violet accents. A bright accent should indicate an action, selected state or data series—not decorate every surface.

Suggested semantic tokens are starting values. Final tokens must be tested for contrast in both themes.

```css
:root {
  color-scheme: dark;
  --background: oklch(0.13 0.025 263);
  --surface: oklch(0.17 0.025 263);
  --surface-raised: oklch(0.20 0.03 263);
  --surface-overlay: oklch(0.22 0.035 263);
  --text: oklch(0.96 0.01 255);
  --text-muted: oklch(0.72 0.025 258);
  --border: oklch(0.32 0.025 263 / 0.72);
  --primary: oklch(0.76 0.16 225);
  --secondary: oklch(0.68 0.18 285);
  --accent: oklch(0.79 0.15 195);
  --success: oklch(0.76 0.14 155);
  --warning: oklch(0.82 0.15 80);
  --danger: oklch(0.68 0.19 25);
}

[data-theme="light"] {
  color-scheme: light;
  --background: oklch(0.985 0.004 255);
  --surface: oklch(0.965 0.008 255);
  --surface-raised: oklch(1 0 0);
  --surface-overlay: oklch(1 0 0);
  --text: oklch(0.22 0.025 263);
  --text-muted: oklch(0.48 0.025 258);
  --border: oklch(0.86 0.015 263);
  --primary: oklch(0.52 0.16 235);
  --secondary: oklch(0.52 0.17 285);
  --accent: oklch(0.50 0.13 205);
  --success: oklch(0.48 0.13 155);
  --warning: oklch(0.58 0.13 75);
  --danger: oklch(0.52 0.17 25);
}
```

Requirements:

- MUST use semantic CSS variables rather than hard-coded color values scattered through components.
- MUST test text, icon, control, focus-ring and chart contrast in dark and light modes.
- SHOULD reserve gradient text for a small number of brand moments such as the wordmark or a hero phrase.
- MUST not encode chart meaning using color alone. Pair color with line style, marker, label or legend.
- SHOULD use translucent panels carefully. On mobile and low-end devices, reduce large-area blur/backdrop filters.

## 2.2 Typography

- Display / headings: Geist, Inter or another approved geometric sans-serif.
- Body: same family or a highly legible neutral sans-serif.
- Metrics, code, step indices and technical labels: Geist Mono or Fira Code.
- Use locally hosted or `next/font`-managed fonts; do not load multiple unnecessary weights.
- Use fluid type with `clamp()` but keep a readable minimum size.
- Avoid all-caps paragraph text and overly wide measure. Body copy should usually remain around 60–75 characters per line on desktop.

## 2.3 Spacing, grid and surfaces

- Use a consistent 4px/8px spacing scale.
- Default marketing container: max width around 1200–1360px, adjusted to content.
- Bento cards: one column on narrow screens; two or three columns at tablet/desktop breakpoints where content supports it.
- Prefer `gap-4` to `gap-6`, section spacing around 80–144px on large screens and smaller values on mobile.
- Surface borders: 1px subtle neutral border; use glow only on selected/highlighted elements.
- Corner radius: a small set of tokens (e.g. 12, 18, 24px); avoid inconsistent radii.
- Do not turn every section into a card. Use open editorial sections between bento groups to create rhythm.

## 2.4 Background visual vocabulary

Use a controlled combination of the following layers:

1. **Base field:** deep navy-to-slate gradient or light neutral in light theme.
2. **Mesh light:** two or three blurred radial gradients with low opacity.
3. **Grid or coordinate field:** fine SVG/CSS line grid, mask-faded at edges.
4. **Signal path:** a thin curved SVG path with a few nodes, referencing the rewind/training trajectory motif.
5. **Grain/noise:** extremely subtle, static and optimized; never a large animated noise canvas.
6. **Foreground content:** solid or near-solid contrast surface so content remains readable.

Background rules:

- MUST be decorative only. It may not contain essential copy, controls, charts or status information.
- MUST have a static CSS/SVG fallback.
- SHOULD use SVG/CSS for simple grids, orbital rings and waveforms; do not use WebGL for effects that CSS can render cheaply.
- SHOULD avoid huge animated blur filters, full-screen particle fields and permanent high-frequency shader animation.
- MUST not cause layout shift.
- MUST adapt to dark/light theme and reduced-motion settings.

---

# 3. Public website experience architecture

## 3.1 Public pages

| Route | Purpose | Visual treatment | Primary action |
|---|---|---|---|
| `/` | Explain RewindVerse and show the core value | Cinematic but restrained hero, product replay vignette, bento feature layout | Open Rewind Studio |
| `/product` | Explain product modules | Interactive feature demos and product screenshots | Explore Studio |
| `/how-it-works` | Teach Train → Record → Replay → Inspect | Step-based product narrative and trace lifecycle | Try a demo |
| `/visualizations` | Show the visualization catalogue | 2D/3D examples with mode switch | Explore visualizer |
| `/learn` | Explain Academy and learning journeys | Lesson cards and progressive learning map | Start learning |
| `/docs` | Developer and user documentation | Clean, low-motion documentation layout | Read docs |
| `/security` | Explain local-first privacy and safety | Clear trust-oriented diagrams and plain language | Read security model |
| `/about` | Mission and project principles | Editorial brand story | Open Studio |

Do not create pages solely to make the navigation look larger. Every route needs unique content and a clear purpose.

## 3.2 Global header

- Left: official RewindVerse wordmark.
- Centre/desktop: Product, Visualizations, Learn, Docs.
- Right: theme control, sign-in only when implemented, primary “Open Studio” CTA.
- Mobile: accessible menu with visible focus state and Escape-to-close behaviour.
- Header background may begin transparent over hero, then gain an opaque surface after scroll. The transition must not cause layout shift.
- Keep header height stable and reserve logo dimensions.

## 3.3 Homepage recommended section order

1. **Hero:** short product promise, one primary CTA, one secondary CTA, restrained animated 3D signature visual.
2. **Working product proof:** small real or clearly labelled demo of training replay. Do not fake model values.
3. **How it works:** Train → Record → Replay → Inspect → Understand.
4. **Core capabilities:** RewindML, Rewind Replay, Rewind Insights, Rewind Compare, Rewind Academy.
5. **Visualization showcase:** interactive example with 2D/3D/Auto choice.
6. **Portable trace concept:** explain RVTS and cross-tool portability without claiming industry-standard status.
7. **Learning and developer pathways:** two distinct audience paths.
8. **Privacy and safety:** local-first explanation and explicit sharing model.
9. **Final CTA:** Open Rewind Studio / Read documentation.
10. **Footer:** product, learn, developer, security, legal and social links.

## 3.4 Hero copy direction

Suggested primary copy:

> **Train a model. Replay how it learned.**
>
> Explore every update, understand training behaviour and turn model runs into something you can inspect and learn from.

Primary CTA: **Open Rewind Studio**  
Secondary CTA: **Explore the replay**

Do not claim “all models”, “all frameworks”, “real-time AI diagnosis” or “industry standard” unless the actual supported-feature matrix proves it.

---

# 4. Hero 3D experience

## 4.1 Purpose

The hero scene must embody the product metaphor: a model's learning journey across a landscape of loss, signal and progress. It should be recognizable as RewindVerse even without the wordmark, but must not compete with the headline or CTA.

## 4.2 Recommended visual concept: The Learning Orbit

A compact, abstract scene containing:

- A dark, softly lit 3D surface representing a loss landscape.
- One luminous trajectory line moving toward a lower region of the surface.
- A small number of checkpoint nodes along the path.
- A subtle orbital arc or rewind-inspired loop.
- A focal marker at the current training step.
- Optional faint coordinate grid and distant points.

The scene should be abstract and data-inspired, not a literal brain, robot, generic AI head or random floating cube collection.

## 4.3 Interaction behaviour

| Interaction | Expected behaviour |
|---|---|
| Idle | Slow, subtle drift or low-frequency camera movement; no constant rapid rotation |
| Pointer movement | Small parallax or camera shift with a strict movement limit |
| Scroll | Optional short camera/position transition between hero and next section; disable under reduced motion |
| Checkpoint hover/focus | Highlight node and reveal a small HTML label with accessible text |
| Replay action | Advance along a deterministic, precomputed demonstration path |
| Pause | Stop continuous scene updates and show a paused state |
| Reduced motion | Static poster or subtle opacity-only state; no automatic orbit or scroll-linked camera movement |
| WebGL unavailable | Render a static SVG/WebP poster using the same visual composition |

The 3D scene is an illustration of the product concept unless it is explicitly connected to a real trace. If the trajectory is illustrative, label it as a demo/illustrative scene and never imply it is live user training.

## 4.4 Desktop and mobile composition

Desktop:

- Text left, 3D scene right, with the scene constrained to a defined box.
- Hero content remains above the fold at common laptop sizes.
- Scene must not cover, overlap or reduce contrast of the heading/CTA.

Tablet:

- Reduce scene complexity and size.
- Avoid text overlay on the scene.
- Keep the CTA and product promise near the top.

Mobile:

- Use a static or low-detail compact 3D emblem only if it meets the mobile performance budget.
- Otherwise use an optimized poster image and SVG overlay.
- Do not force touch users to rotate or manipulate a decorative object to understand the page.

## 4.5 Technical implementation approach

Recommended packages, subject to the existing lockfile and compatibility review:

- `three`
- `@react-three/fiber` v9 when using React 19; do not adopt an alpha major version for production without a dedicated review.
- `@react-three/drei` for selected controls/helpers only; avoid importing its entire surface into the initial bundle.
- `motion` for UI transitions around the scene, not for replacing Three.js rendering.

Implementation rules:

1. Keep the 3D component in a dedicated client-only module.
2. Dynamically import the scene with a fixed-size fallback poster.
3. Do not import Three.js from the top-level public layout or global navigation.
4. Avoid state updates on every rendered frame. Use refs/uniforms for frame-level changes.
5. Prefer `frameloop="demand"` for static scenes and explicit invalidation when the scene changes.
6. Pause when off-screen or document visibility is hidden.
7. Use a capped render scale / pixel ratio and adapt quality to device constraints.
8. Create geometry/material/texture resources once; reuse them across frames.
9. Dispose of geometry, materials, textures and render targets when their owner unmounts or resources are replaced.
10. Handle WebGL context loss and renderer creation failure without crashing the page.
11. Keep the scene's UI labels and controls outside the canvas in normal DOM elements.
12. No audio autoplay, flashing lights or rapid repeated camera movement.

## 4.6 Quality and fallback ladder

| Tier | Conditions | Rendering mode |
|---|---|---|
| A | Desktop, WebGL available, normal motion preference | Full hero scene with restrained motion |
| B | Tablet / moderate GPU / data-saving preference | Fewer particles, lower render scale, reduced motion |
| C | Mobile / battery saver / low GPU / high memory pressure | Static poster with optional tap-to-load scene |
| D | Reduced motion or WebGL unavailable | Static SVG/WebP poster; all content remains available |

The user must always be able to access the product CTA regardless of scene loading.

---

# 5. Background and ambient visual system

## 5.1 Background component catalogue

| Component | Suggested implementation | Where to use | Motion |
|---|---|---|---|
| `MeshGradientBackground` | CSS radial gradients | Hero and high-level section transitions | Static or very slow opacity shift |
| `SignalGridBackground` | SVG/CSS grid with edge mask | Product/technical sections | Static |
| `OrbitLines` | SVG path and nodes | Hero, trace explanation | Small draw-once reveal; static thereafter |
| `TraceWaveBackground` | SVG curve path | How-it-works section | Short one-time draw animation |
| `NoiseOverlay` | Small compressed static texture or CSS approximation | Dark surfaces | Static; avoid large animated noise |
| `GlowField` | CSS radial gradients | CTA or selected feature | Static or small opacity change |
| `StarField3D` | Optional low-count instanced points | Hero only, if measured affordable | Low-frequency; pause when hidden |
| `DataPlane3D` | Three.js grid plane / loss surface | Product showcase, demo route | User-controlled or short replay |

## 5.2 Approved background layers

A background may combine at most:

- one base color/gradient;
- one ambient mesh-gradient layer;
- one texture/grid/orbit layer;
- foreground content.

Do not stack many animated gradients, particles, glows, blur overlays and parallax layers on the same viewport. More effects do not automatically produce better design.

## 5.3 CSS mesh-gradient example

```css
.hero-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  isolation: isolate;
  background:
    radial-gradient(42rem 28rem at 78% 28%,
      color-mix(in oklch, var(--secondary) 18%, transparent), transparent 70%),
    radial-gradient(36rem 26rem at 18% 62%,
      color-mix(in oklch, var(--primary) 17%, transparent), transparent 72%),
    linear-gradient(135deg, var(--background), var(--surface));
}

.hero-background::after {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0.18;
  background-image: url("/assets/noise.svg");
  background-repeat: repeat;
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .hero-background,
  .hero-background::before,
  .hero-background::after {
    animation: none !important;
    transition: none !important;
  }
}
```

If the texture's SVG is too complex or expensive, replace it with a static raster texture or remove it. Do not ship an oversized noise file.

## 5.4 Section-specific background direction

| Section | Recommended background | Reason |
|---|---|---|
| Hero | Mesh gradient + fading coordinate grid + Learning Orbit 3D | Establish the brand and product metaphor |
| Working demo | Near-solid surface, subtle grid | Keep training controls and chart values legible |
| How it works | Signal path / checkpoint nodes | Reinforce sequence and replay |
| Capabilities | Alternating surface bands and bento cards | Provide rhythm without visual overload |
| Visualization gallery | Neutral canvas with restrained ambient glow | Let charts and models be the focus |
| Developer/trace section | Dark code surface, line grid, compact technical pattern | Signal engineering credibility |
| Privacy/security | Clean neutral background, simple diagrams | Trust and readability |
| Final CTA | Brighter gradient field and one orbital motif | Strong closing action |

---

# 6. 3D element catalogue for the public website

The public website needs a small set of memorable 3D moments, not a full 3D scene on every section.

| Element | Purpose | Priority | Interaction | Fallback |
|---|---|---:|---|---|
| Learning Orbit hero | Primary visual identity and learning metaphor | P0 | Pause, replay, reduced parallax | Static poster/SVG |
| 3D Loss Surface preview | Explain the unique replay/optimization product | P0 | Switch example checkpoint or play a short path | 2D contour image/SVG |
| Neural Network Structure | Show layer/node relationships | P1 | Focus a layer and inspect shape metadata | 2D node-link diagram |
| RVTS Trace Timeline Orbit | Explain time/checkpoint/event flow | P1 | Hover/focus event nodes | Linear timeline |
| Embedding Cluster | Show dimensionality reduction | P2 | Select a point/cluster | 2D projection |
| Model/Feature Map | Future ML learning story | P2 | Select layer/channel | Static feature-map grid |

A 3D element must have an explicit communication objective. Do not add 3D merely to fill whitespace.

---

# 7. Product demo: real data vs illustrative data

The public site may include a carefully curated demo trace. Its state must be classified clearly:

- **Live computation:** generated by a supported algorithm at runtime.
- **Recorded sample:** loaded from an included, versioned example trace.
- **Illustrative animation:** decorative storytelling not derived from model execution.

These categories must never be visually or textually confused. If a hero path is illustrative, say “illustrative training path”. A sample experiment should include its algorithm, objective, seed and trace provenance in its demo details.

The Studio product itself must use the actual RewindML/replay data pipeline. Never use an animated fake chart while claiming it represents a model's actual training.

---

# 8. Animation and interaction standards

## 8.1 Motion principles

- Motion should explain hierarchy, continuity, feedback or state change.
- Keep most UI transitions short and subtle (roughly 140–260 ms for common UI transitions; this is a design target, not a hard platform requirement).
- Use spring motion for draggable or spatial elements; use simple CSS transitions for colors, borders and opacity.
- Avoid animating layout properties where transforms/opacity can accomplish the effect.
- Avoid scroll-jacking and forced horizontal scrolling.
- Avoid continuous parallax across the entire document.
- Do not animate every card into view.
- Respect `prefers-reduced-motion`; offer a site-level motion setting if animation is central to the experience.

Suggested spring preset for small UI interactions:

```ts
export const uiSpring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};
```

## 8.2 Motion inventory

| Interaction | Motion | Max intent |
|---|---|---|
| Navigation menu | opacity + small y translation | Signal open/close |
| Button hover | subtle color/border/1–2% scale at most | Feedback |
| Feature card hover | slight lift / border highlight | Discoverability |
| Section entry | one-time opacity and small vertical translation | Establish hierarchy |
| Hero path | short trace draw or controlled low-frequency movement | Product metaphor |
| Modal/dialog | opacity + small scale/translate | Spatial continuity |
| Tab switch | crossfade content or indicator movement | State clarity |
| 3D camera | user-triggered or brief guided transition | Explore 3D object |

## 8.3 Reduced motion and user controls

The site MUST:

- detect `prefers-reduced-motion`;
- stop auto-rotating/scroll-linked 3D scenes when reduced motion is requested;
- replace large transforms with fades or static states;
- provide a pause control for non-essential moving content;
- persist the user's explicit motion preference if a site-level setting is offered;
- avoid flashing and rapid high-contrast patterns.

---

# 9. Responsive layout requirements

## 9.1 Breakpoint behaviour

Breakpoints must be based on content needs, not merely fixed device labels. At minimum, verify narrow mobile, wide mobile, tablet, laptop and large desktop.

| Layout | Expected behaviour |
|---|---|
| Narrow mobile | Single column; no essential hover-only UI; static/compact hero; controls reachable without 3D manipulation |
| Wide mobile | Compact bento; two-column mini cards only if labels remain readable |
| Tablet | Reduced hero scene; stacked content where necessary; touch controls large enough |
| Laptop | Full two-column hero; interactive demo; core bento grid |
| Large desktop | Wider container; generous negative space; limit line lengths and card stretch |

## 9.2 3D sizing

- Use a fixed aspect-ratio container so canvas load does not shift the page.
- Match camera aspect to actual canvas dimensions on resize.
- Cap device pixel ratio/render scale on high-DPI devices to avoid excess pixel work.
- Do not assume device pixel ratio 3 is always desirable; it can multiply render workload.
- Use a responsive object scale and camera framing, not only CSS scaling of a high-detail scene.
- Provide touch and keyboard alternatives to pointer drag.

---

# 10. Accessibility requirements

Target WCAG 2.2 AA for applicable page content and controls. The canvas cannot be the only source of information.

- All essential content must exist in semantic HTML.
- Interactive 3D objects must have an adjacent textual description, data summary or accessible control panel.
- Keyboard users must be able to reach and operate relevant controls without dragging in 3D space.
- Focus state must be visible and must not be obscured by sticky navigation or overlays.
- Contrast must be tested for text and non-text controls.
- Charts need accessible titles, summaries, labels and tabular or textual alternatives for key values.
- Do not use color as the only encoding for line series, node type or status.
- Use reduced-motion alternatives and avoid auto-rotating content without a pause mechanism.
- Tooltips must be available on focus, not only hover.
- Mobile controls should have sufficiently large touch targets.

---

# 11. Implementation architecture

## 11.1 Recommended component hierarchy

```text
apps/web/
  app/
    (marketing)/
      page.tsx
      product/page.tsx
      visualizations/page.tsx
      how-it-works/page.tsx
      learn/page.tsx
    (studio)/
      studio/page.tsx
  components/
    brand/
      rewindverse-wordmark.tsx
      brand-symbol.tsx
    layout/
      site-header.tsx
      site-footer.tsx
      section-container.tsx
    backgrounds/
      mesh-gradient-background.tsx
      signal-grid-background.tsx
      orbit-lines.tsx
      trace-wave-background.tsx
      noise-overlay.tsx
    hero/
      hero-section.tsx
      hero-learning-orbit.tsx
      hero-scene-fallback.tsx
    3d/
      scene-canvas.tsx
      learning-orbit-scene.tsx
      loss-surface-scene.tsx
      scene-quality-controller.tsx
      webgl-fallback.tsx
    demos/
      replay-demo.tsx
      loss-landscape-preview.tsx
    ui/
      ...
  public/
    assets/
      backgrounds/
      posters/
      icons/
      textures/
```

Keep reusable 3D primitives in a package if they are needed by Rewind Studio. Do not let the public marketing hero become a dependency of the ML engine or trace packages.

## 11.2 Server/client boundary

- Marketing content, headings, metadata, static diagrams and product copy SHOULD render as Server Components.
- Interactive controls, canvas, WebGL, pointer events and browser storage MUST be Client Components.
- The 3D scene MUST be dynamically imported from a Client Component; do not add Three.js to the top-level route bundle.
- Use explicit loading and error boundaries around 3D components.
- Do not use browser globals during server rendering.

## 11.3 Dynamic scene loading pattern

Example architecture (adapt to the installed Next.js version and client/server constraints):

```tsx
"use client";

import dynamic from "next/dynamic";

const LearningOrbitScene = dynamic(
  () => import("./learning-orbit-scene"),
  {
    ssr: false,
    loading: () => <HeroSceneFallback />,
  }
);

export function HeroSceneSlot() {
  return (
    <div className="relative aspect-[5/4] w-full overflow-hidden rounded-3xl">
      <HeroSceneFallback />
      <LearningOrbitScene />
    </div>
  );
}
```

In production, add an intersection/visibility gate, reduced-motion check, feature detection and error fallback before mounting the full scene. Test the exact dynamic import behaviour against the installed Next.js version.

## 11.4 Scene component responsibilities

| Component | Responsibility |
|---|---|
| SceneCanvas | Canvas creation, renderer settings, error boundary and lifecycle |
| SceneQualityController | Determine quality tier based on explicit user preference/device constraints |
| LearningOrbitScene | Compose the hero objects and path |
| LossSurfaceScene | Render a sampled loss surface and trace path |
| SceneControls | Accessible pause, reset, replay and view controls in HTML |
| SceneFallback | Static poster/SVG and textual description |
| SceneTelemetry | Optional aggregate frame/load metrics without collecting trace content |

---

# 12. 3D performance and rendering rules

3D effects are a progressive enhancement. The page must remain useful if WebGL is unavailable, GPU acceleration is disabled or the 3D chunk fails to load.

1. Use a small number of meshes and materials in the hero.
2. Use instancing for repeated points/nodes when appropriate.
3. Reuse geometries, materials and textures.
4. Avoid real-time post-processing unless visually necessary and measured.
5. Use compressed textures and small texture dimensions.
6. Cap renderer pixel ratio/render scale.
7. Use demand rendering for scenes that do not need continuous animation.
8. Pause rendering while off-screen or tab-hidden.
9. Keep frame-level values in refs/uniforms rather than React state updates every frame.
10. Dispose of GPU resources on unmount/replacement.
11. Avoid creating new geometry/material objects every frame.
12. Keep 3D data separate from the React component's presentation state.
13. Load the scene only when it is likely to be seen; a below-the-fold scene should not be eagerly downloaded at initial page load.
14. Provide a static poster with explicit dimensions/aspect ratio to prevent CLS.
15. Record scene mount time, first rendered frame, average frame time and fallback usage in development profiling; do not collect identifying user data.

The Three.js documentation notes that geometries, materials and textures require explicit disposal, and its responsive guidance discusses managing pixel ratio/render size carefully. See references in Section 18.

---

# 13. Website content and visual hierarchy

The website should prioritize product explanation and evidence:

- Hero heading: one sentence about the product's core benefit.
- Supporting copy: one or two sentences maximum.
- Primary CTA: “Open Rewind Studio”.
- Secondary CTA: “Explore the replay”.
- Product demo: a small real/recorded trace with provenance label.
- Feature sections: 3–5 high-value product capabilities, not a wall of claims.
- Technical section: show RVTS portability, Python recording and validation honestly.
- Trust section: local-first processing and deliberate sharing.
- Learning section: explain the learner journey.
- Footer: concise links to docs, security, product, learning and legal pages.

Avoid unverified claims such as “the world's first”, “best”, “all ML models”, “instant for every file”, “zero latency” or “fully secure”.

---

# 14. Asset creation and governance

## 14.1 Asset types

- Logo: approved SVG master and raster variants.
- Hero scene: procedural 3D geometry plus static poster fallback.
- Background grid/orbit: small optimized SVGs.
- Grain/noise: small static asset or CSS-only alternative.
- Product screenshots: real application state; redact personal data.
- Demo trace: versioned, documented public sample.
- Icons: Lucide or a consistent in-house SVG set.

## 14.2 Asset requirements

- Use original assets or assets with compatible licences.
- Store source files for generated 3D assets (e.g. Blender project) alongside optimized exports.
- Prefer GLB/GLTF for reusable 3D models; use Draco/Meshopt only when decode cost is justified and supported by the loader pipeline.
- Avoid large 4K textures for small UI scenes.
- Keep alt text meaningful for informative images; decorative backgrounds should be hidden from assistive technology.
- Do not include tracking pixels or unapproved third-party embeds.

## 14.3 Rights and provenance

Do not copy reference-site CSS, source code, photography, illustrations, 3D scenes, typography or layout pixel-for-pixel. The supplied sites are for high-level inspiration only. Keep an asset provenance record with creator/source, licence, modification and approved use.

---

# 15. Interaction and visual quality acceptance checklist

A public page is ready only when:

- [ ] Brand name and logo match the approved RewindVerse identity.
- [ ] Hero communicates the product in a few seconds.
- [ ] Primary CTA is visible and works without interacting with 3D.
- [ ] 3D scene loads progressively and has a stable static fallback.
- [ ] Background layers do not reduce text contrast.
- [ ] No background animation causes scroll-jank or layout shift.
- [ ] Every 3D control has keyboard/touch support or a clear static alternative.
- [ ] Reduced-motion preference is respected.
- [ ] Dark and light themes remain readable.
- [ ] Mobile composition has been designed intentionally, not merely shrunk.
- [ ] All product screenshots and demos are truthful and correctly labelled.
- [ ] Console has no uncaught errors or failed asset requests.
- [ ] WebGL failure does not break the rest of the page.
- [ ] The section's 3D bundle is not loaded unnecessarily on routes that do not use it.
- [ ] Performance acceptance tests pass on agreed reference devices.

---

# 16. Phased implementation plan

## P0 — Website visual foundation

1. Finalize design tokens and light/dark theme.
2. Build semantic header, footer, container, buttons and cards.
3. Build mesh-gradient, grid and orbit SVG backgrounds.
4. Build responsive homepage layout and content structure.
5. Add reduced-motion and accessible navigation.
6. Add a fixed-size static hero poster.

**Exit gate:** the complete site works without JavaScript-heavy 3D and remains responsive/accessibile.

## P1 — Hero and product demo 3D

1. Add dynamically loaded Learning Orbit scene.
2. Add device/reduced-motion quality tiers.
3. Add loss-surface preview using a versioned demo trace or explicitly illustrative data.
4. Connect the replay button to a deterministic demo event sequence.
5. Add WebGL fallback and cleanup.
6. Verify bundle and frame budgets.

**Exit gate:** 3D adds measurable product understanding and does not break initial page performance.

## P2 — Extended storytelling

1. Add 3D neural-network structure preview.
2. Add trace lifecycle/orbit diagram.
3. Add product visualization gallery with 2D/3D selection where meaningful.
4. Add more detailed motion only after usability and performance testing.

**Exit gate:** additional 3D scenes are reusable, lazy-loaded, accessible and justified by content.

---

# 17. Visual QA process

For each page and viewport:

1. Capture the initial static render.
2. Capture the page after fonts and images load.
3. Capture normal-motion and reduced-motion states.
4. Capture dark and light themes.
5. Test keyboard-only navigation and focus order.
6. Test mobile touch interactions.
7. Test WebGL disabled/context lost.
8. Test slow network and failed dynamic chunk.
9. Inspect console, network errors and hydration warnings.
10. Compare screenshot diffs against the accepted baseline.
11. Measure layout shift and main-thread blocking.
12. Review content readability when the 3D scene is running.

Do not accept a visual review performed only on a developer's high-end desktop.

---

# 18. External technical references

Use these official references to verify implementation details against the versions actually installed in the repository. Do not rely on memory for version-specific APIs.

- Next.js App Router: https://nextjs.org/docs/app
- Next.js lazy loading and dynamic imports: https://nextjs.org/docs/app/guides/lazy-loading
- Next.js Server and Client Components: https://nextjs.org/docs/app/getting-started/server-and-client-components
- Next.js Image Optimization: https://nextjs.org/docs/app/getting-started/images
- Next.js Font Optimization: https://nextjs.org/docs/app/getting-started/fonts
- React Three Fiber: https://r3f.docs.pmnd.rs/
- Three.js responsive design: https://threejs.org/manual/pages/responsive.html
- Three.js resource cleanup: https://threejs.org/manual/pages/cleanup.html
- Three.js object/resource disposal: https://threejs.org/manual/pages/how-to-dispose-of-objects.html
- Motion for React: https://motion.dev/docs/react
- Motion accessibility: https://motion.dev/docs/react-accessibility
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- MDN `prefers-reduced-motion`: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion

---

# 19. Final design decision

RewindVerse should look like a premium, modern ML product with an unmistakable visual signature. Its 3D scenes should represent training, trajectories, checkpoints and model structure. Its backgrounds should create depth with gradients, grids, paths and restrained lighting. Its motion should be intentional and accessible.

The public website earns attention; Rewind Studio earns trust through clarity, correctness and control. A successful design is not the page with the most effects. It is the page where every visual decision makes RewindVerse easier to recognize, understand and use.
