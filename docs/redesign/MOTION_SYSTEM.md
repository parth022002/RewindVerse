# RewindVerse — Motion and Animation Design System

**Document:** `docs/redesign/MOTION_SYSTEM.md`  
**Version:** 1.0  
**Status:** IMPLEMENTED  
**Standard:** RewindVerse Master Redesign Specification §8

---

## 1. Motion Philosophy

Motion in RewindVerse serves four non-negotiable functions:
1. **Guide Attention:** Direct the user's eye to high-priority changes (e.g. step updates, loss convergence, error notifications).
2. **Indicate State:** Confirm user actions (e.g. button presses, drawer openings, tab switches) with instant, predictable feedback.
3. **Clarify Cause and Effect:** Show relationships between controls and outcomes (e.g. moving a replay timeline slider directly advances trajectory checkpoints).
4. **Preserve Fluidity:** Never delay user tasks, block clicks, hijack scroll, or create constant visual noise.

Decorations and infinite continuous animations are prohibited unless isolated to restrained, slow-drifting ambient atmosphere (`ambient` preset, opacity < 0.25).

---

## 2. Motion Tokens and Durations

| Token | Duration | Cubic Bezier / Physics | Primary Use Case |
|---|---|---|---|
| `micro` | 120ms–180ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Button press/hover, switch toggle, icon swap, badge update |
| `short` | 160ms–220ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Dropdown menus, tooltips, popovers, quick disclosures |
| `standard` | 200ms–280ms | Spring (`stiffness: 300, damping: 30`) | Dialog/modal entrances, drawer slides, accordion expands |
| `large` | 280ms–420ms | `cubic-bezier(0.25, 1, 0.5, 1)` | Full page/route crossfades, hero section entrance |
| `ambient` | 12s–24s | Linear / sinusoidal | Ambient background mesh drift, subtle constellation rotation |

### Spring Presets (Motion for React / Framer Motion)

```typescript
export const uiSpring = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 0.8
};

export const snappySpring = {
  type: "spring",
  stiffness: 450,
  damping: 35,
  mass: 0.6
};

export const gentleSpring = {
  type: "spring",
  stiffness: 180,
  damping: 24,
  mass: 1.0
};
```

---

## 3. Approved Animation Patterns

1. **Card Hover Lift:** Max 2px–3px Y translation (`translateY(-2px)`) with subtle border highlight. Never scale (> 1.02) cards or distort content.
2. **Tab / Segmented Control Indicator:** Smooth layout transition across active tabs using Framer Motion `layoutId="active-pill"`.
3. **Replay Step Scrubber:** Synchronous rendering tied 1:1 to user drag or play ticks without lag or layout shifting.
4. **Loss Landscape Trajectory:** Step point moves along 3D/2D coordinates with velocity proportional to playback speed.
5. **Toast & Alert Notification:** Slide in from bottom-right (200ms `standard`), auto-dismiss without abrupt layout collapse.

---

## 4. Prohibited Patterns

- **No Scroll Hijacking:** Native window scrolling must always remain 100% responsive and unhindered.
- **No Mandatory Splash/Intro Screens:** Users must immediately see usable content upon initial render.
- **No Infinite Bouncing or Pulsing Elements:** CTAs must rely on typographic hierarchy and contrast, not continuous pulsation.
- **No Heavy Layout Property Animation:** Never animate `width`, `height`, `top`, `left`, `margin`, or `padding`. Animate strictly `transform` (`scale`, `translate3d`) and `opacity`.
- **No Uninterrupted Video Loops on Mobile:** Video or heavy WebGL canvases must not run unattended on mobile devices.

---

## 5. Accessibility and `prefers-reduced-motion`

RewindVerse strictly honors system accessibility settings via media query `@media (prefers-reduced-motion: reduce)`.

### Reduced Motion Rules:
- All transform transitions are replaced by instant opacity shifts (`transition: opacity 100ms linear`) or instant state changes (`duration: 0`).
- Parallax effects and automatic Three.js camera rotations are paused or frozen at a stationary front-facing angle.
- Video playback is paused by default, requiring explicit user play trigger.
- Ambient mesh drifting is completely disabled.
- Full text explanations and data summaries remain 100% intact and visible.

