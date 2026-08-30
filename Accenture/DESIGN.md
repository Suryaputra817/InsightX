# DESIGN.md — InsightX Visual System

> **Product**: InsightX — AI Business Investigator
> **Design Philosophy**: AI Intelligence Observatory
> **Quality Benchmark**: Palantir × Linear × Vercel × Stripe
> **Target Impression**: "This is not another dashboard. This is an AI intelligence system."

---

## 1. DESIGN PHILOSOPHY

InsightX combines five design forces:

| Force | Inspiration | Application |
|---|---|---|
| **Restraint** | Apple | Never decorate — every element earns its place |
| **Product Polish** | Linear | Micro-interactions feel engineered, not designed |
| **Typography** | Vercel | Type carries hierarchy; decoration is secondary |
| **Information Design** | Stripe | Dense data made legible through spacing and weight |
| **Intelligence Aesthetics** | Palantir | Dark, atmospheric, trustworthy, operational |

### Visual Metaphor System
The entire product operates on a single coherent metaphor: an **AI Intelligence Observatory** — a sophisticated command center where raw business signals are transformed into actionable intelligence.

| Business Concept | Visual Metaphor |
|---|---|
| Data | Particles / signal field |
| Anomaly | Disturbance / bright deviation in the field |
| Investigation | Navigation / camera moving through data |
| Evidence | Connected luminous nodes |
| Hypothesis | Possible paths branching from evidence |
| Confidence | Signal strength / brightness intensity |
| Recommendation | Resolved destination point |
| Action | Execution pulse radiating outward |

> [!IMPORTANT]
> These metaphors must remain **subtle**. The interface is an enterprise product, not a sci-fi movie UI. The metaphors inform design decisions — they are never literal.

---

## 2. COLOR SYSTEM

### 2.1 Base Palette

All colors use HSL for precise control. No raw hex values in components — always reference tokens.

```
--ix-bg-void:          hsl(222, 47%, 5%)       // #0b0f1a  — deepest background
--ix-bg-base:          hsl(222, 33%, 7%)       // #0d1117  — primary canvas
--ix-bg-surface:       hsl(220, 26%, 10%)      // #131a24  — card / section surfaces
--ix-bg-elevated:      hsl(218, 22%, 13%)      // #1a2233  — raised interactive elements
--ix-bg-overlay:       hsla(220, 30%, 8%, 0.8) // glass overlay base

--ix-border-subtle:    hsl(218, 20%, 16%)      // #1f2937  — grid lines, dividers
--ix-border-default:   hsl(216, 18%, 22%)      // #2d3748  — card borders
--ix-border-focus:     hsl(230, 80%, 65%)      // #6366f1  — focus rings
```

### 2.2 Text Hierarchy

```
--ix-text-primary:     hsl(210, 40%, 96%)      // #f1f5f9  — headlines, primary values
--ix-text-secondary:   hsl(215, 16%, 57%)      // #8492a6  — body, descriptions
--ix-text-tertiary:    hsl(215, 14%, 38%)      // #556270  — timestamps, metadata
--ix-text-muted:       hsl(215, 12%, 26%)      // #3a4553  — disabled, decorative labels
```

### 2.3 Semantic Colors

```
// Intelligence / AI / Primary action
--ix-accent-primary:   hsl(230, 80%, 65%)      // #6366f1  — indigo — buttons, active states
--ix-accent-glow:      hsla(230, 80%, 65%, 0.15)  // indigo glow for backgrounds
--ix-accent-subtle:    hsl(230, 50%, 20%)      // dark indigo surface

// Evidence / Data / Neutral Intelligence
--ix-data-blue:        hsl(210, 70%, 55%)      // #3b82f6  — charts, data lines, evidence
--ix-data-cyan:        hsl(190, 70%, 50%)      // #06b6d4  — evidence connections, traces

// Anomaly / Negative
--ix-anomaly:          hsl(0, 72%, 57%)        // #e54545  — anomaly markers, decline values
--ix-anomaly-glow:     hsla(0, 72%, 57%, 0.12) // anomaly background pulse
--ix-anomaly-surface:  hsl(0, 40%, 12%)        // anomaly card background

// Positive
--ix-positive:         hsl(152, 60%, 45%)      // #22c55e  — growth, resolution, completion
--ix-positive-surface: hsl(152, 30%, 10%)      // positive card background

// Warning / Uncertainty
--ix-warning:          hsl(38, 80%, 55%)       // #d97706  — correlated status, caution
--ix-warning-surface:  hsl(38, 30%, 10%)       // warning card background

// Hypothesis / AI Reasoning
--ix-hypothesis:       hsl(260, 60%, 60%)      // #8b5cf6  — hypothesis nodes, AI reasoning
--ix-hypothesis-glow:  hsla(260, 60%, 60%, 0.10)
```

### 2.4 Color Rules

1. **Never communicate meaning through color alone.** Every colored state has a text label + icon.
2. **Saturation discipline:** Primary UI elements use colors at 60-80% saturation. Only anomaly pulses and CTAs reach higher saturation.
3. **Background color layering:** Always use the depth system (void → base → surface → elevated). Never place content directly on `--ix-bg-void`.
4. **No "gaming RGB" — ** No cyan-pink gradients, no rainbow effects, no neon accents.

---

## 3. TYPOGRAPHY

### 3.1 Typeface

**Primary:** `Inter` (Google Fonts) — weights 300, 400, 500, 600, 700, 800

Inter is selected for:
- Superior screen readability at small sizes (evidence metadata, timestamps)
- Tabular number support (financial values align perfectly)
- Neutral, professional character — does not impose personality

### 3.2 Type Scale

```
--ix-text-display:     48px / 1.1  / 800  — landing hero headline
--ix-text-hero-sub:    20px / 1.5  / 400  — landing subheadline
--ix-text-page:        24px / 1.3  / 700  — page titles (Dashboard, Investigations)
--ix-text-section:     16px / 1.4  / 600  — section headers within pages
--ix-text-card-title:  14px / 1.4  / 600  — card titles, evidence findings
--ix-text-body:        14px / 1.6  / 400  — paragraphs, descriptions
--ix-text-small:       12px / 1.5  / 500  — badges, metadata, chart labels
--ix-text-micro:       10px / 1.4  / 600  — timestamps, source tags, system labels
```

### 3.3 Typography Rules

1. **No giant type inside the dashboard.** Display size is landing-page only.
2. **KPI values** use `--ix-text-page` size with weight 800 for maximum visual density.
3. **Percentage changes** use `--ix-text-small` with semantic color and directional icon.
4. **All financial numbers** use `font-variant-numeric: tabular-nums` for column alignment.
5. **Labels and badges** use `text-transform: uppercase; letter-spacing: 0.08em` at micro size.
6. **Line lengths** never exceed 72ch for body text, 48ch for card descriptions.

---

## 4. SPACING & LAYOUT

### 4.1 Spacing Scale (4px base unit)

```
--ix-space-1:    4px     — icon padding, badge internal
--ix-space-2:    8px     — tight element gaps
--ix-space-3:    12px    — list item spacing
--ix-space-4:    16px    — card internal padding
--ix-space-5:    20px    — section gaps within cards
--ix-space-6:    24px    — card-to-card gaps
--ix-space-8:    32px    — section-to-section gaps
--ix-space-10:   40px    — page section divisions
--ix-space-12:   48px    — major layout breaks
--ix-space-16:   64px    — landing page section spacing
--ix-space-20:   80px    — hero vertical padding
```

### 4.2 Border Radius

```
--ix-radius-sm:    6px   — badges, small buttons, input fields
--ix-radius-md:    10px  — cards, containers, modals
--ix-radius-lg:    16px  — hero cards, major panels
--ix-radius-xl:    20px  — landing page sections, glass overlays
--ix-radius-full:  9999px — pills, circular indicators, avatar rings
```

### 4.3 Layout Grid

- **Max content width:** `1280px`
- **Landing page max width:** `1440px`
- **Sidebar width:** `240px` collapsed to `64px`
- **Dashboard grid:** 12-column CSS Grid with `24px` gutter
- **Card grids:** Auto-fill with `minmax(280px, 1fr)`

---

## 5. DEPTH & ELEVATION SYSTEM

### 5.1 Z-Layers

```
Layer 0  — Background        z-index: 0     (void, atmospheric effects)
Layer 1  — 3D Scene           z-index: 1     (Three.js canvas, particle fields)
Layer 2  — Content Surface    z-index: 10    (cards, sections, charts)
Layer 3  — Floating UI        z-index: 20    (hero overlay cards, tooltips)
Layer 4  — Navigation         z-index: 30    (sidebar, topbar)
Layer 5  — Modal / Overlay    z-index: 40    (modals, investigation runner)
Layer 6  — Toast / System     z-index: 50    (notifications, error toasts)
```

### 5.2 Shadow System

Shadows use cool-toned translucent blacks to maintain the intelligence aesthetic:

```
--ix-shadow-sm:     0 1px 2px hsla(220, 40%, 3%, 0.4)
--ix-shadow-md:     0 4px 12px hsla(220, 40%, 3%, 0.5)
--ix-shadow-lg:     0 8px 32px hsla(220, 40%, 3%, 0.6)
--ix-shadow-glow:   0 0 40px hsla(230, 80%, 65%, 0.08)    // accent glow
--ix-shadow-anomaly: 0 0 30px hsla(0, 72%, 57%, 0.10)     // anomaly glow
```

### 5.3 Glassmorphism (Selective Use Only)

Glass is permitted ONLY on:
- Sidebar navigation panel
- Landing page floating intelligence cards
- Investigation runner overlay
- Modal backdrops

Glass properties:
```
background: hsla(220, 30%, 8%, 0.7);
backdrop-filter: blur(24px) saturate(1.2);
border: 1px solid hsla(220, 20%, 20%, 0.3);
```

> [!WARNING]
> **Never apply glass to primary data cards.** Dashboard content (KPIs, evidence, hypotheses) must use solid `--ix-bg-surface` for maximum readability. Glass is decorative — data is functional.

---

## 6. LIGHTING & ATMOSPHERE

### 6.1 Background Layering

Every page uses a 4-layer background stack (bottom to top):

```
1. Solid base:       --ix-bg-void
2. Radial atmosphere: subtle radial gradient from accent color at 3-5% opacity
3. Noise texture:    film grain overlay at 2-4% opacity (removes digital flatness)
4. Content:          cards, charts, text
```

### 6.2 Atmospheric Gradients

```
// Top-left intelligence glow (landing page, dashboard)
radial-gradient(
  ellipse 600px 400px at 15% 10%,
  hsla(230, 80%, 50%, 0.05),
  transparent
)

// Bottom-right secondary warmth
radial-gradient(
  ellipse 500px 500px at 85% 90%,
  hsla(260, 60%, 40%, 0.03),
  transparent
)
```

### 6.3 Noise / Grain

Apply a `<div>` or CSS pseudo-element with a tiny repeating noise PNG at `opacity: 0.025`. Purpose: removes the "dead digital" feeling from large dark surfaces. The grain must be **invisible on conscious inspection** — it should only register subconsciously as texture richness.

### 6.4 Lighting Rules

1. **Radial glows** establish spatial hierarchy — they subtly draw attention to the primary content zone.
2. **Never stack multiple strong gradients.** One ambient glow per viewport section maximum.
3. **Edge highlights** on cards: use `border-top: 1px solid hsla(230, 60%, 50%, 0.08)` to simulate light falling from above.
4. **3D scene lighting** uses a single directional key light + ambient — never over-light geometry.

---

## 7. HERO 3D — ART DIRECTION

### 7.1 Concept

The hero visualization represents "the intelligence field" — a large floating analytical structure where business signals exist as particles, and anomalies manifest as disturbances in the field.

### 7.2 Technology Stack

```
Primary:    React Three Fiber + Drei
Geometry:   Procedural (no imported 3D models)
Particles:  InstancedMesh or Points with BufferGeometry
Shaders:    Custom ShaderMaterial only for particle opacity/color
Fallback:   CSS/SVG animated constellation if WebGL unavailable
```

### 7.3 Scene Architecture

```
Scene
├── AmbientLight (intensity: 0.15)
├── DirectionalLight (position: [5, 8, 5], intensity: 0.4)
├── ParticleField
│   ├── 2000-4000 particles (desktop) / 500-800 (mobile)
│   ├── Base color: hsla(210, 50%, 60%, 0.3)
│   ├── Anomaly cluster: hsla(0, 72%, 57%, 0.6) — brighter, denser
│   └── Evidence connections: thin luminous lines (hsla(190, 70%, 50%, 0.2))
├── AnomalyCore
│   ├── Small glowing sphere at anomaly cluster center
│   ├── Subtle pulse animation (scale 0.95 → 1.05, 3s cycle)
│   └── Color: --ix-anomaly with 20% bloom
├── OrbitControls (disabled — camera is script-driven)
└── DepthFog (near: 8, far: 25, color: --ix-bg-void)
```

### 7.4 Particle Behavior

- **Idle state:** Particles drift slowly with Perlin noise displacement (speed: 0.001 units/frame)
- **Anomaly region:** Particles in a sphere (radius ~2 units) are brighter and drift faster
- **Evidence lines:** Appear on scroll (thin lines connecting anomaly cluster to 3-4 evidence points)
- **Mouse interaction:** Particles nearest to raycasted mouse position gently repel (spring constant: 0.02)

### 7.5 Camera

```
Position:    [0, 0, 12]
FOV:         45
Near/Far:    0.1 / 100
Idle motion:  Slow sinusoidal drift: x ± 0.3, y ± 0.15 over 20s cycle
Scroll:       Camera z moves from 12 → 8 as user scrolls hero section (parallax depth)
Easing:       Smooth spring interpolation (damping: 0.92)
```

### 7.6 Mouse Interaction

```
Mouse X → scene rotation Y:  range ±0.08 radians, damped (lerp factor: 0.03)
Mouse Y → scene rotation X:  range ±0.04 radians, damped (lerp factor: 0.03)
Particle lag:                 particles follow rotation with 200ms delay
```

All interactions use `lerp()` interpolation — never snap. The object must feel like it has **physical mass and inertia**.

### 7.7 Responsive 3D

| Breakpoint | Particles | Effects | Post-processing |
|---|---|---|---|
| Desktop (≥1280px) | 3000 | Full scene + mouse + scroll | Optional subtle bloom |
| Tablet (768-1279px) | 1200 | Reduced scene, no mouse interaction | No bloom |
| Mobile (<768px) | 0 | CSS/SVG fallback constellation | None |

### 7.8 Performance Budget

- **Target:** 60fps on 2020+ hardware
- **GPU memory:** < 50MB for 3D scene
- **Initial load:** 3D assets must not block first contentful paint. Load via `Suspense` with skeleton fallback.
- Use `devicePixelRatio` clamped to max `2` to prevent GPU overwork on 4K displays.

### 7.9 WebGL Fallback

If WebGL is unavailable or device is low-power:
```
Display a CSS-animated constellation:
- 40-60 small dots (2-3px) positioned via CSS transforms
- Connected by thin SVG lines (opacity 0.1)
- Subtle drift animation via CSS keyframes (60s loop)
- One dot pulses red (the anomaly)
```

---

## 8. HERO TYPOGRAPHY & OVERLAY

### 8.1 Hero Text Layout

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  [Badge] Next-Generation Decision Intelligence          │
│                                                         │
│  Your Dashboard Shows                                   │
│  What Changed.                                          │
│  We Explain Why.          ← visually dominant line       │
│                                                         │
│  AI-powered business investigation that detects         │
│  anomalies, connects evidence, evaluates possible       │
│  causes, and recommends the next action.                │
│                                                         │
│  [ Start Investigation ]  [ Explore Investigation ]     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

"We Explain Why." uses:
- `font-size: 48-56px` (display)
- `font-weight: 800`
- Gradient text: `linear-gradient(135deg, #f1f5f9, #6366f1)` applied via `background-clip: text`

### 8.2 Hero Floating Intelligence Cards

3-4 small cards float around the 3D scene with subtle parallax (moving slower than scroll):

```
Card 1 (top-right):    Revenue ₹42.8M ↓8.2%      — border-left: 2px solid --ix-anomaly
Card 2 (mid-right):    North Region ↓17.4%         — border-left: 2px solid --ix-data-blue
Card 3 (bottom-left):  Logistics 87% confidence    — border-left: 2px solid --ix-hypothesis
```

Properties:
```
background: hsla(220, 30%, 8%, 0.6);
backdrop-filter: blur(16px);
border: 1px solid hsla(220, 20%, 20%, 0.2);
border-radius: --ix-radius-md;
padding: 12px 16px;
font-size: 11px;
```

Cards use `transform: translateY(scrollY * 0.05)` for depth parallax.

### 8.3 Typography Animation (Hero Only)

```
1. Badge fades in:          0ms → 400ms    (opacity 0→1, translateY 8→0)
2. "Your Dashboard Shows":  200ms → 600ms  (opacity 0→1, translateY 16→0)
3. "What Changed.":         400ms → 800ms  (same)
4. "We Explain Why.":       600ms → 1100ms (opacity 0→1, translateY 20→0)  ← slightly slower
5. Subheading:              900ms → 1300ms
6. CTAs:                    1100ms → 1500ms
7. Floating cards:          1400ms → 2000ms (staggered, 200ms each)
```

Easing: `cubic-bezier(0.16, 1, 0.3, 1)` — fast start, smooth land.

---

## 9. LANDING PAGE SCROLL STORYBOARD

### 9.1 Section Sequence

```
SCENE 1: HERO
  Purpose: Cinematic first impression + core value proposition
  3D:      Full particle field with anomaly core
  Content: Headline, subheading, CTAs, floating cards

SCENE 2: THE INSIGHTS GAP
  Purpose: Problem articulation — why current BI fails
  Layout:  Split comparison (Traditional BI vs InsightX)
  Motion:  Scroll-triggered: left side fades to gray, right side illuminates

SCENE 3: HOW IT WORKS — Four Steps
  Purpose: Mental model for the product
  Layout:  Horizontal 4-step process (Detect → Investigate → Explain → Act)
  Motion:  Each step highlights progressively on scroll
  Visual:  Numbered steps with connecting line that fills as user scrolls

SCENE 4: LIVE INVESTIGATION PREVIEW
  Purpose: Proof of product — show the actual investigation data
  Layout:  Condensed investigation card showing:
           Revenue ↓8.2% → North ↓17.4% → Enterprise ↓23.1%
           → Delivery delays ↑31% → Logistics hypothesis 87%
  Motion:  Progressive reveal: each node appears as user scrolls into view
  Visual:  Simplified version of the investigation tree

SCENE 5: FINAL CTA
  Purpose: Conversion
  Headline: "Turn Business Data Into Decisions."
  CTA:      Start Free Investigation
```

### 9.2 Section Transitions

Sections blend into each other — no hard cuts. Achieve this with:
- Overlapping background gradients that crossfade
- Content elements that animate upward as the previous section fades
- The atmospheric glow shifts position between sections

---

## 10. DASHBOARD DESIGN

### 10.1 Layout Architecture

```
┌──────────┬──────────────────────────────────────────────────┐
│          │  TOPBAR: Search | Investigation Status | Profile │
│ SIDEBAR  ├──────────────────────────────────────────────────┤
│          │                                                  │
│ Logo     │  PAGE TITLE: Business Overview                   │
│ ──────── │  SUBTITLE: Monitor performance and investigate   │
│ Overview │                                                  │
│ Invest.  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐      │
│ Evidence │  │ Rev │ │ Ord │ │ Cust│ │ Conv│ │Compl│       │
│ Recom.   │  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘      │
│ Actions  │                                                  │
│ ──────── │  ┌──────────────────────────────────────┐        │
│ Sources  │  │  Expected vs Actual Revenue Chart    │        │
│ Settings │  └──────────────────────────────────────┘        │
│          │                                                  │
│          │  ┌──────────────────────────────────────┐        │
│          │  │  Active Investigations               │        │
│          │  │  Revenue Decline | HIGH | Investigate│        │
│          │  └──────────────────────────────────────┘        │
└──────────┴──────────────────────────────────────────────────┘
```

### 10.2 KPI Card Specification

```
┌─────────────────────────────────┐
│  REVENUE              [anomaly] │  ← 10px micro label + status indicator
│  ₹42.8M                        │  ← 24px / weight 800 / --ix-text-primary
│  ↓ 8.2%                        │  ← 12px / weight 700 / --ix-anomaly + TrendingDown icon
│  ▁▂▃▄▃▅▂                       │  ← 24px sparkline (SVG, 6-point, stroke-only)
│  Target: ₹46.6M                │  ← 10px / --ix-text-tertiary
└─────────────────────────────────┘

Normal state:    bg: --ix-bg-surface, border: --ix-border-subtle
Anomaly state:   border-color: hsla(0, 72%, 57%, 0.3), subtle anomaly glow shadow
Hover:           translateY(-2px), shadow-md, border brightens 10%
```

### 10.3 Chart Design

```
Expected line:   --ix-data-blue, strokeWidth: 2, strokeDasharray: "6 4"
Actual area:     --ix-anomaly, strokeWidth: 2.5, fill gradient (10% → 0% opacity)
Grid:            --ix-border-subtle, horizontal only, strokeDasharray: "3 3"
Axes:            --ix-text-tertiary, 11px
Tooltip:         bg: --ix-bg-elevated, border: --ix-border-default, radius-md
Anomaly marker:  Vertical dashed line at deviation point, --ix-anomaly
```

---

## 11. INVESTIGATION WORKSPACE

### 11.1 Purpose

This is the **most important screen in the entire product.** It must answer the complete reasoning chain:

```
WHAT HAPPENED? → WHERE? → WHY? → HOW CONFIDENT? → WHAT TO DO?
```

### 11.2 Section Layout

```
┌─────────────────────────────────────────────────────────┐
│ ← Investigations / Revenue Decline Investigation        │
│ Status: INVESTIGATING  |  Severity: HIGH  |  Aug 24     │
│ ─────────────────────────────────────────────────────── │
│                                                         │
│ ┌─── SECTION A: WHAT HAPPENED? ──────────────────────┐ │
│ │  Expected: ₹46.6M  Actual: ₹42.8M                 │ │
│ │  Variance: -₹3.8M  Change: -8.2%                  │ │
│ │  [Expected vs Actual Area Chart]                   │ │
│ └────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─── SECTION B: WHERE DID IT HAPPEN? ────────────────┐ │
│ │  [Region] [Customer] [Product]    ← tab selector   │ │
│ │  North    ████████████████░░  -17.4%  [PRIMARY]    │ │
│ │  South    ███░░░░░░░░░░░░░░  -3.1%                │ │
│ │  East     ██░░░░░░░░░░░░░░░  +1.2%                │ │
│ │  West     ███░░░░░░░░░░░░░░  -2.8%                │ │
│ └────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─── SECTION C: DIAGNOSTIC CONNECTION TREE ──────────┐ │
│ │  Revenue → North → Enterprise → Delays → Logistics │ │
│ │  (interactive clickable node flow)                 │ │
│ └────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌── SECTION E: EVIDENCE ──┐ ┌── SECTION F: HYPOTHESES─┐│
│ │  [LOGISTICS] +31%       │ │  Logistics    87% SUPP  ││
│ │  [LOGISTICS] +44%       │ │  Competitor   54% CORR  ││
│ │  [CRM]      +27%        │ │  Sales        29% INSUF ││
│ │  [MARKET]   -12%        │ │  [causal warnings]      ││
│ └─────────────────────────┘ └──────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### 11.3 Dimension Breakdown Bars

```
Primary contributor:
  bg: hsla(0, 72%, 57%, 0.06)
  border: 1px solid hsla(0, 72%, 57%, 0.25)
  Badge: "PRIMARY ANOMALY SEGMENT" in --ix-anomaly at micro size

Regular segment:
  bg: --ix-bg-elevated
  border: transparent

Bar fill:
  Negative: --ix-anomaly
  Positive: --ix-positive
  Width:    percentage × 2.5, capped at 100%
```

### 11.4 Investigation Runner

When "Run Investigation" is clicked, a **full-screen overlay** shows the diagnostic engine executing:

```
┌─────────────────────────────────────────────────┐
│  ⚡ InsightX Investigation Engine               │
│  Step 7 of 12                                   │
│ ─────────────────────────────────────────────── │
│                                                  │
│  > Detecting anomaly...                  [OK]    │
│  > Comparing actual vs expected...       [OK]    │
│  > Analyzing dimension variances...      [OK]    │
│  > Isolating primary segments...         [OK]    │
│  > Scanning evidence databases...        [OK]    │
│  > Correlating logistics data...         [OK]    │
│  > Analyzing complaints...            [ACTIVE]   │
│                                                  │
│  ████████████████████░░░░░░░░  58%               │
│                                                  │
│  Programmatic diagnostic checks in execution.    │
└─────────────────────────────────────────────────┘
```

- **Completed steps:** `--ix-text-primary`, `[OK]` in `--ix-positive`
- **Active step:** `--ix-accent-primary`, `[ACTIVE]` pulsing
- **Progress bar:** gradient from `--ix-accent-primary` to `--ix-data-blue`
- **Overlay:** `--ix-bg-overlay` with `backdrop-filter: blur(24px)`
- **Step timing:** 300ms per step for demo (deterministic, not random)

---

## 12. CAUSAL STATUS BADGE SYSTEM

### 12.1 Badge Definitions

| Status | Color Token | Background | Tooltip |
|---|---|---|---|
| `SUPPORTED` | `--ix-positive` | `--ix-positive-surface` | "Strong evidence alignment. Not experimental proof of causation." |
| `CORRELATED` | `--ix-warning` | `--ix-warning-surface` | "Statistical association observed. Causation unconfirmed." |
| `CONTRADICTED` | `--ix-anomaly` | `--ix-anomaly-surface` | "Available evidence argues against this hypothesis." |
| `INSUFFICIENT_EVIDENCE` | `--ix-text-tertiary` | `hsla(215, 14%, 38%, 0.1)` | "Not enough data to evaluate this hypothesis." |
| `CAUSALITY_NOT_ESTABLISHED` | `--ix-data-blue` | `hsla(210, 70%, 55%, 0.1)` | "Statistical support exists but no experimental confirmation." |

### 12.2 Badge Component

```
Size:       10px uppercase, letter-spacing 0.08em, font-weight 700
Padding:    4px 8px
Radius:     --ix-radius-sm
Border:     1px solid (color at 30% opacity)
```

### 12.3 Causal Warning Block

Every hypothesis card MUST include:

```
┌─ ⚠ Causal Assessment ──────────────────────────────────┐
│  "Evidence strongly supports logistics disruption as a  │
│   likely contributor, but observational data does not    │
│   establish experimental causality."                    │
└─────────────────────────────────────────────────────────┘

border-left: 2px solid --ix-hypothesis
background:  --ix-hypothesis-glow
font-size:   10px
color:       --ix-text-secondary
```

---

## 13. CONFIDENCE VISUALIZATION

### 13.1 Confidence Display

Confidence is shown as a **ring + number** combination:

```
    ┌──────┐
    │ 87%  │  ← 14px / weight 800 / --ix-accent-primary
    │ Conf │  ← 7px / uppercase / --ix-text-tertiary
    └──────┘
    (dashed ring border around the number, arc filled proportionally)
```

Ring: `border: 2px dashed` with a colored arc overlay matching the percentage.

### 13.2 Confidence Rules

1. Never label as "certainty" or "probability of causation."
2. Always label as "Confidence."
3. Visual weight scales with confidence: 87% gets full opacity accent color, 29% gets muted tertiary color.

---

## 14. EVIDENCE CARD SPECIFICATION

```
┌─────────────────────────────────────────────────┐
│  [LOGISTICS]                    Reliability: 94% │
│  ─────────────────────────────────────────────── │
│  North-region delivery delays soared by 44%.     │
│                                                  │
│  Aug 23, 4:00 PM    Hypothesis: Logistics disrup │
└─────────────────────────────────────────────────┘

Source badge:     bg: --ix-bg-elevated, border: --ix-border-default
                  text: --ix-text-tertiary, 10px uppercase
Reliability:      color intensity scales with value (>80 green, 50-80 amber, <50 red)
Finding text:     --ix-text-primary, 13px, weight 500
Timestamp:        --ix-text-muted, 10px
Hypothesis link:  --ix-hypothesis, 10px, clickable
```

### Evidence Highlight Interaction

When a hypothesis is selected, evidence cards connected to it:
- Border changes to `--ix-hypothesis` at 40% opacity
- Background gains subtle `--ix-hypothesis-glow`
- Scale: `1.005` (barely perceptible lift)

Unrelated evidence cards:
- Opacity drops to `0.4`

---

## 15. MOTION SYSTEM

### 15.1 Duration Tokens

```
--ix-motion-micro:      120ms   — button hover, badge state
--ix-motion-fast:       200ms   — card hover elevation, tooltip show
--ix-motion-normal:     300ms   — panel transitions, tab switch
--ix-motion-slow:       500ms   — page transitions, section reveals
--ix-motion-cinematic:  800ms   — hero text reveal, investigation start
--ix-motion-epic:      1200ms   — 3D camera transitions, full-page overlays
```

### 15.2 Easing Functions

```
--ix-ease-out:       cubic-bezier(0.16, 1, 0.3, 1)     — primary ease for reveals
--ix-ease-spring:    cubic-bezier(0.34, 1.56, 0.64, 1)  — bouncy for attention
--ix-ease-smooth:    cubic-bezier(0.4, 0, 0.2, 1)       — gentle standard
--ix-ease-in-out:    cubic-bezier(0.65, 0, 0.35, 1)     — symmetric transitions
```

### 15.3 Animation Patterns

```
Page enter:        opacity 0→1, translateY 12→0, duration: slow, ease: out
Card stagger:      each card delays 80ms from previous, same animation
Section reveal:    intersection observer triggers at 20% visibility
Investigation:     progressive line-by-line with 300ms intervals
Evidence highlight: opacity + border + scale transition, duration: fast
Status change:     optimistic color transition, duration: fast
```

### 15.4 Motion Principles

Every animation must answer one of:
1. **What changed?** (status transitions, value updates)
2. **Where should I look?** (section reveals, attention pulses)
3. **What is connected?** (evidence highlighting, tree node selection)
4. **What is important?** (anomaly pulse, critical badge)
5. **What action happened?** (button press, action creation)

If an animation answers none of these, **remove it.**

---

## 16. COMPONENT NAMING CONVENTIONS

```
Layout:              Layout, Sidebar, Topbar
Metric display:      MetricCard, AnomalyBadge, ConfidenceRing
Investigation:       InvestigationCard, InvestigationTree, InvestigationRunner
Data display:        DimensionBreakdown, EvidenceCard, EvidenceList
AI reasoning:        HypothesisCard, CausalStatusBadge, CausalWarning
Actions:             RecommendationCard, ActionCard, ActionTimeline
Modals:              CreateActionModal
Feedback:            SkeletonCard, EmptyState, ErrorState, LoadingState
```

---

## 17. RESPONSIVE BREAKPOINTS

```
--ix-bp-mobile:     < 640px
--ix-bp-tablet:     640px – 1023px
--ix-bp-desktop:    1024px – 1439px
--ix-bp-wide:       ≥ 1440px
```

### Mobile Priorities

On mobile, the information hierarchy compresses to:
1. Anomaly metric (what happened)
2. Top affected dimension (where)
3. Primary hypothesis with confidence (why)
4. Primary recommendation (what to do)
5. Everything else behind expandable sections

### Sidebar Behavior

- Desktop: always visible (240px)
- Tablet: collapsed icon-only (64px), expand on hover
- Mobile: hidden, accessible via hamburger menu

---

## 18. ACCESSIBILITY

1. **Contrast:** All text/background combinations meet WCAG AA (4.5:1 for body, 3:1 for large text)
2. **Focus states:** `outline: 2px solid --ix-border-focus; outline-offset: 2px`
3. **Keyboard navigation:** All interactive elements reachable via Tab. Investigation tree nodes navigable via arrow keys.
4. **ARIA labels:** All icon-only buttons have `aria-label`. Status badges have `role="status"`.
5. **Reduced motion:** Respect `prefers-reduced-motion: reduce` — disable 3D, disable scroll animations, use instant transitions.
6. **Color independence:** Every semantic color state has an accompanying text label + icon. Never rely on color alone.
7. **Screen readers:** Causal status badges read as "Causal status: Supported. Evidence strongly supports this as a likely contributor but does not establish experimental causality."

---

## 19. PERFORMANCE RULES

1. **3D scene** loads via `React.lazy` + `Suspense`. Never blocks first paint.
2. **Particle count** clamped by device capability detection (`navigator.hardwareConcurrency`, `deviceMemory`).
3. **`devicePixelRatio`** clamped to `Math.min(window.devicePixelRatio, 2)`.
4. **Images** use WebP with lazy loading.
5. **Font loading:** `Inter` loaded with `font-display: swap` — system font renders first.
6. **Bundle splitting:** Each page is a separate chunk. Landing page 3D is its own chunk.
7. **Animation frames:** All rAF loops use `will-change: transform` and avoid layout thrashing.
8. **Target metrics:** LCP < 2.5s, FID < 100ms, CLS < 0.1.
