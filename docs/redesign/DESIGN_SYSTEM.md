# RewindVerse — Design System & Semantic Tokens (v1.0)

## 1. Visual Foundation & Color Palette

The RewindVerse visual identity is built upon **Deep Obsidian Navy Neutrals** accented by an **Aurora Accent Family (Cyan, Blue, Violet)**.

### 1.1 Dark Theme Tokens (Default)
```css
:root, .dark {
  color-scheme: dark;
  /* Neutrals */
  --background: oklch(0.14 0.025 260);      /* #080b12 Deep space obsidian */
  --surface: oklch(0.18 0.025 260);         /* #0e1422 Slate base surface */
  --surface-raised: oklch(0.22 0.025 260);  /* #141c2e Raised panels */
  --surface-overlay: oklch(0.26 0.025 260); /* #1c263d Modals and popovers */
  --text: oklch(0.96 0.008 255);            /* #f8fafc Crisp white text */
  --text-muted: oklch(0.72 0.020 255);      /* #94a3b8 Secondary labels */
  --text-dim: oklch(0.55 0.020 255);        /* #64748b Tertiary / footnotes */
  --border: rgba(255, 255, 255, 0.08);      /* Subtle 1px structural borders */
  --border-strong: rgba(255, 255, 255, 0.16);

  /* Accents */
  --primary: oklch(0.80 0.13 210);          /* Electric Cyan #00f2fe */
  --accent-blue: oklch(0.74 0.14 240);      /* Sky Blue #38bdf8 */
  --accent-violet: oklch(0.68 0.18 295);    /* Electric Violet #8b5cf6 */
  --success: oklch(0.72 0.14 155);          /* Emerald #10b981 */
  --warning: oklch(0.82 0.14 75);           /* Amber #f59e0b */
  --danger: oklch(0.70 0.17 25);            /* Rose #f43f5e */
  --focus-ring: oklch(0.80 0.13 210);       /* Accessible Cyan outline */
}
```

### 1.2 Light Theme Tokens
```css
[data-theme="light"], .light {
  color-scheme: light;
  --background: oklch(0.985 0.006 255);    /* Crisp off-white */
  --surface: oklch(1.0 0 0);               /* Pure white */
  --surface-raised: oklch(0.965 0.009 255);/* Slate 50 tint */
  --surface-overlay: oklch(0.93 0.012 255);/* Slate 100 tint */
  --text: oklch(0.20 0.025 260);           /* Slate 900 text */
  --text-muted: oklch(0.46 0.025 260);     /* Slate 600 secondary */
  --text-dim: oklch(0.60 0.020 260);       /* Slate 400 tertiary */
  --border: rgba(15, 23, 42, 0.08);
  --border-strong: rgba(15, 23, 42, 0.16);
  --primary: oklch(0.55 0.18 245);          /* Deep ocean blue */
}
```

---

## 2. Typography Hierarchy

1. **Brand Headings:** Geometric sans-serif (`font-sans` with negative tracking `-0.025em`).
2. **Body Text:** Highly legible sans-serif with comfortable line height (`leading-relaxed`).
3. **Metrics, Formulas & Code:** Geist Mono / monospace (`font-mono`) with tabular lining figures.

---

## 3. Reusable Layout Primitives
- `PageContainer`: Responsive maximum width container (`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`).
- `SectionContainer`: Consistent vertical section spacing (`py-16 md:py-24`).
- `SurfacePanel`: Standardized glassmorphism panel (`glass-panel rounded-2xl border border-[var(--border)] p-6`).
- `MetricBadge`: High-contrast semantic indicator for status, provenance, and capability tokens.

