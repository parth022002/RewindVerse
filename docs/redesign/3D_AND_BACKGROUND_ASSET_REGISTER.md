# RewindVerse — 3D & Background Asset Register

**Document:** `docs/redesign/3D_AND_BACKGROUND_ASSET_REGISTER.md`  
**Version:** 1.0  
**Status:** IMPLEMENTED  
**Standard:** RewindVerse Master Redesign Specification §6, §7

---

## 1. Background Architecture & Atmosphere System

Atmosphere in RewindVerse uses a layered, composable stack designed to guarantee high visual credibility without sacrificing GPU headroom or text contrast.

### Layer Stack:
1. **Base Neutral (Layer 0):** Deep slate `#030712` (dark) or `#f8fafc` (light).
2. **Ambient Mesh (Layer 1):** Blurred CSS radial gradients using cyan (`rgba(6, 182, 212, 0.08)`), blue (`rgba(59, 130, 246, 0.06)`), and violet (`rgba(139, 92, 246, 0.05)`).
3. **Technical Texture (Layer 2):** Fine SVG grid lines (`SignalGridBackground`) or subtle trajectory wave lines (`TraceWaveBackground`).
4. **Hero 3D Scene (Layer 3 - Isolated):** Contained strictly within the homepage hero or specialized Studio visualizers.

---

## 2. Reusable Background Components

| Component | Technology | Target Routes | Performance Budget |
|---|---|---|---|
| `AmbientMeshBackground` | CSS Radial Gradients + Filter blur | Global Public Pages | 0 KB JS overhead, GPU composite only |
| `SignalGridBackground` | SVG Vector Pattern (32px / 64px) | Homepage, Explorer, Data Lab | < 2 KB SVG, zero paint overhead |
| `TraceWaveBackground` | SVG Curve Path (Loss & Step motifs) | Product Page, Replay Canvas | < 4 KB SVG |
| `SectionGlow` | CSS Absolute Radial Glow | Feature Cards & Callout Sections | 0 KB JS overhead |

---

## 3. Signature 3D Scene: `LearningOrbitHero`

The Learning Orbit scene visually represents the journey of algorithm optimization across a non-convex loss landscape.

### Specifications:
- **Geometry:** Custom paramaterized non-convex surface (Ackley / Rosenbrock / Saddle manifold) with wireframe coordinate lines.
- **Trajectory Curve:** CatmullRomCurve3 path tracing gradient descent with illuminated checkpoint nodes.
- **Interactive Scrubber:** Clicking or dragging checkpoint spheres updates step statistics (Loss: 0.842 -> 0.012, Epoch: 1 -> 50).
- **Lighting:** Directional key light with subtle cyan/violet rim lighting (`color: #06b6d4`, `#8b5cf6`).
- **Resource Constraints:**
  - Vertices: < 12,000 vertices total.
  - Draw Calls: < 8 draw calls per frame.
  - Textures: Procedural vertex coloring, zero external PNG/JPG textures required.
  - Memory Footprint: < 15 MB GPU VRAM.

---

## 4. 3D Adaptive Tiering & Fallback Ladder

To ensure smooth operation across mobile phones, integrated GPUs, and high-end workstations, the 3D pipeline implements a 4-tier fallback ladder:

```
[ Tier 1: High (Desktop dGPU) ]
       │
       ▼ (if FPS < 45 or Tablet)
[ Tier 2: Balanced (Laptop / Mid-range) ] -> 50% geometry density, no post-processing
       │
       ▼ (if Mobile or High DPR)
[ Tier 3: Low (Mobile Phone) ] ----------> Simplified 2D canvas trajectory or low-poly wireframe
       │
       ▼ (if WebGL Disabled or prefers-reduced-motion)
[ Tier 4: Static Poster Fallback ] -------> Crisp SVG/WebP vector diagram with full step data
```

### Context Loss & Recovery:
- The `Canvas` listener catches `webglcontextlost` and immediately replaces the viewport with `LearningOrbitPoster.tsx`.
- Automatically restores when `webglcontextrestored` fires, without crashing the React root tree.

---

## 5. Asset Registry Table

| Asset Identifier | Format | Location | Dimensions | Size | Purpose |
|---|---|---|---|---|---|
| `brand-logo-full` | SVG / PNG | `/public/Logo.png` | 512x128 | 18 KB | Public Header, Footer |
| `brand-mark-r` | SVG / PNG | `/public/Favicon.png` | 64x64 | 4 KB | App Favicon, Compact Sidebar |
| `hero-orbit-poster` | SVG | Inline Component | Responsive | 6 KB | Static fallback for 3D Hero |
| `signal-grid` | SVG Pattern | Inline CSS/SVG | 64x64 repeat | 0.8 KB | Engineering texture backdrop |
| `loss-surface-mesh` | Three.js BufferGeo | Procedural Client | Variable | 0 KB assets | Real-time optimization landscape |

