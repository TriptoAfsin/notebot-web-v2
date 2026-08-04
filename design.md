# Design — NoteBot Web

A locked design system for this app. Every page redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the
system needs to grow.

Produced by `hallmark redesign ./src` (multi-page flow). The diversification rule
is **inverted** here: pages must share this system, not differ from each other.

## Genre

`modern-minimal` — the dev-tool / platform register. Restrained surfaces, hairline
structure, one signal accent, confident sans display. NoteBot Web is a utility
students reach for between classes; it should feel like an instrument, not a poster.

## Theme

`Cobalt`, re-anchored on NoteBot's existing brand blue (`#377fcc` → hue 252).
The brand hue survives the redesign; the ramp around it is rebuilt in OKLCH so
lightness steps are perceptually even in both modes.

Cobalt normally ships light-only with one dark band. NoteBot is a dual-mode PWA,
so the theme is extended to a full dark ground that keeps the same anchor hue —
only lightness and chroma move between modes, never the hue.

### Axes (for the record)

- **Paper band** — dual: cool light (`L 98.4%`, hue 252) / cool dark (`L 14.5%`, hue 252)
- **Display style** — grotesk-sans (Space Grotesk 600/700, tracking `-0.02em`)
- **Accent hue** — cobalt blue, hue 252 (the inherited brand hue)

### Light mode

```
--color-paper       oklch(98.4% 0.004 252)   page ground
--color-paper-2     oklch(96.2% 0.006 252)   raised surface, card
--color-paper-3     oklch(93.4% 0.008 252)   hover surface, inset
--color-rule        oklch(89.5% 0.009 252)   hairline
--color-rule-2      oklch(82.0% 0.012 252)   emphasised hairline
--color-muted       oklch(52.0% 0.014 252)   secondary text
--color-ink-2       oklch(34.0% 0.016 252)   body text
--color-ink         oklch(21.0% 0.020 252)   headings
--color-accent      oklch(54.5% 0.170 252)   the one signal
--color-accent-ink  oklch(99.0% 0.004 252)   text on accent
--color-focus       oklch(54.5% 0.170 252)
--color-danger      oklch(55.0% 0.190  27)
--color-success     oklch(58.0% 0.130 155)
```

### Dark mode

Elevation goes *lighter*, never darker. Accent gains lightness and sheds chroma
so it doesn't vibrate against the dark ground.

```
--color-paper       oklch(14.5% 0.008 252)
--color-paper-2     oklch(18.2% 0.010 252)
--color-paper-3     oklch(22.5% 0.012 252)
--color-rule        oklch(27.0% 0.012 252)
--color-rule-2      oklch(34.0% 0.014 252)
--color-muted       oklch(66.0% 0.014 252)
--color-ink-2       oklch(85.0% 0.010 252)
--color-ink         oklch(95.0% 0.008 252)
--color-accent      oklch(70.0% 0.145 252)
--color-accent-ink  oklch(15.0% 0.020 252)
--color-focus       oklch(74.0% 0.140 252)
--color-danger      oklch(68.0% 0.170  27)
--color-success     oklch(72.0% 0.120 155)
```

Accent occupies **≤ 5 % of any viewport**. It marks: the active nav item, focus
rings, one primary button per view, the live-status dot, a link's hover underline,
and the small square anchor beside a page title. Nothing else.

## Typography

Three families — the 2+1 ceiling, no more.

- **Display:** Satoshi (Fontshare), 500 / 700, tracking `-0.02em`. Page titles,
  headings, wordmark.
- **Body:** Geist, 400 / 500. All prose, all UI labels, all card titles.
- **Mono (outlier):** JetBrains Mono, 400 / 500. Two roles only — machine-readout
  labels (uppercase `0.06em`, e.g. `LEVEL 03`, breadcrumb trail, kbd hints) and code.

**Size scale: Tailwind's defaults, unchanged.** The pre-redesign pages are written
against them, so redefining `text-xl` / `text-2xl` resizes every page at once.
Only additive steps (`text-2xs`, `text-title`, `text-title-lg`) are declared.
Hierarchy in this redesign comes from weight, colour and spacing — not size.

Weight contrast is ≥ 200 units between body (400) and headings (700). Headings are
always roman — no italic display, ever. Tabular numerals on anything that columns up.

## Spacing

4-point named scale. Values live in `src/index.css` as `--space-*` and are mirrored
into Tailwind's `spacing` scale so `p-md`, `gap-lg` etc. resolve to the same tokens.
Never type a raw pixel value.

## Motion

Three easings, three durations, and a hard cap of **three animation primitives per
page**.

```
--ease-out     cubic-bezier(0.16, 1, 0.3, 1)     entering
--ease-in      cubic-bezier(0.7, 0, 0.84, 0)     leaving
--ease-in-out  cubic-bezier(0.65, 0, 0.35, 1)    toggles

--dur-micro    120ms   press, tick, colour shift
--dur-short    220ms   hover, tooltip, menu open
--dur-long     420ms   route change, sheet, accordion
```

- **Reveal pattern:** one orchestrated entrance per route — fade + 8 px rise,
  staggered by DOM index at 40 ms, capped at 320 ms total. Never re-fires on scroll.
- **Route transition:** the View Transitions API where the browser supports it
  (react-router 7 `viewTransition`), with a Framer Motion crossfade fallback.
  Exit is 75 % of enter.
- **Reduced-motion fallback:** all spatial motion collapses to a ≤ 150 ms opacity
  crossfade. Skeletons and spinners keep running, just slower.
- Animate `transform` and `opacity` only. `transition-all` is banned.
- Focus rings never animate — they appear instantly.

## Microinteractions stance

- **Silent success.** No "Done!" toasts. Toasts are for failures and for actions
  whose effect isn't visible.
- **Hover 800 ms delay, focus 0 ms delay** on tooltips. Different intents.
- **One hover signal per element.** A card either lifts *or* shifts its border
  colour — not both, and never a scale.
- **Spinner floor:** 150 ms delay before showing, 300 ms minimum once shown.
  Prefer a shape-matched skeleton over a spinner whenever the layout is known.
- **Search-as-you-type** is debounced 250 ms and announces its result count once
  via `aria-live="polite"`, never per keystroke.
- Every hover affordance has a `:focus-visible` equivalent. Hit targets ≥ 44 px
  on coarse pointers.

## Icons

**One library per role. Three roles, no mixing.**

1. **Dimensional set** (`src/components/atoms/icons/dimensional/`) — modern 3D
   isometric SVG, authored in code (Tier-B), not sourced and not sketchy. Each
   glyph is built from **solid geometric planes on a fixed 30° isometric
   projection** over a 48×48 grid: a lit top face, a shaded side face, a recessed
   front face, and a crisp 1px edge highlight where planes meet. Every face is
   filled from a two-stop token gradient — no hand-drawn strokes, no wobble, no
   outline-icon look. Colours come entirely from `--icon-face-top` /
   `--icon-face-side` / `--icon-face-front`, so the whole set re-lights itself in
   dark mode. Used for the ten home-launcher tiles and the level/section marks.
   Replaces the old PNGs (and the 1.1 MB `tex-gpt.png`).
2. **Lucide** (`lucide-react`) — every functional UI icon: chevrons, external-link,
   search, refresh, alerts, empty states, send, download. 1.5 stroke, 20 px default.
3. **Morphicons** — exactly two morphing toggles: theme (sun ⇄ moon) and the nav
   sheet (menu ⇄ close). Spring physics, nowhere else.

**Emoji are banned as icons.** The old `🧒 Level 1` / `📗 Choose Level` labels
resolve to dimensional marks and Lucide glyphs. Emoji survive only inside
user-generated content (jokes copy) and the footer's solidarity line, which is
prose, not iconography.

## Surface language

Hairlines do the work. One containment signal per element, never stacked.

- **Card:** `--color-paper-2` fill, 1 px `--color-rule` border, 10 px radius, no shadow.
  Hover shifts the border to `--color-rule-2` and the fill to `--color-paper-3`.
  Focus-within draws the accent ring.
- **Tile** (home launcher): same surface, `aspect-square`, dimensional icon above a
  Geist 500 label. Hover lifts 2 px and lights the icon's accent face.
- **Button:** 8 px radius. One solid accent primary per view; everything else is a
  bordered ghost. No pills, no gradients.
- **Input:** 8 px radius, 1 px rule border, accent border + ring on focus.
- **Shadow:** at most one, `0 1px 2px` whisper, and only on floating surfaces
  (sheet, command palette, sticky header once scrolled). Never on a dark card —
  elevation there is lightness.

## Page families

Pages within a family share the family's shape; they vary only in component
archetypes. **Structure and element positions are preserved from the pre-redesign
app** — this redesign replaces the visual and interaction layer only.

- **Launcher page** (`/`) — **Catalogue**. Uniform grid of equal tiles; brand mark
  and wordmark above; no hero, no display type. The inventory *is* the page.
- **Browse pages** (`/notes`, `/lab-reports`, `/q-bank`, `/syllabus`, `/results`,
  and every `:level` / `:subName` / `:topic` / `:batch` / `:dept` route) —
  **Index-First**. The page IS a list of links. Mono breadcrumb trail, one short
  title row, optional search, then hairline-separated link rows. No reveal beyond
  the single route entrance.
- **Tool page** (`/tex-gpt`) — **Workbench**. Function carries the page: transcript,
  composer, suggestion chips, reference disclosure. No enrichment, no decoration.
- **Content page** (`/jokes`, `/about`) — Index-First's quieter sibling: one card,
  typography only.

## Navigation and footer

- **Nav — N13 inline ⌘K pill.** Flush full-width bar, single hairline bottom border,
  blur only once scrolled. Wordmark left; a visible search pill with a `⌘K` kbd hint
  centre-right; morphing theme toggle and sheet toggle right. The pill opens a real
  `cmdk` palette — ⌘K/Ctrl-K to open, Esc and backdrop to close, ↑/↓ to move,
  Enter to go. Collapses to an icon below 40 rem; the palette becomes a full-height
  sheet. The header's element order and position are unchanged from before.
- **Footer — Ft2 inline single line.** Hairline rule above, one row: copyright,
  author credit, solidarity line. No columns, no social row.

## CTA voice

- **Primary:** solid `--color-accent`, `--color-accent-ink` text, 8 px radius,
  `--dur-micro` press. Label names the destination — "Load 10 more", "Ask again",
  never "Click here". One per view.
- **Secondary:** bordered ghost on `--color-paper-2`. Same radius, same press.
- Labels never wrap. `white-space: nowrap` on every affordance; the parent reflows.

## Per-page allowances

- Launcher page MAY use the dimensional icon set at full size (Tier-B enrichment).
- Browse pages MUST NOT use enrichment — the link list is the content. Small
  dimensional section marks are allowed at 32 px in the title row.
- Tool page MUST NOT use enrichment.
- The old decorative `position: absolute` corner PNGs on browse pages are removed:
  they overlapped content on small viewports and are pure decoration.

## What pages MUST share

- The wordmark and brand logo treatment.
- The accent colour and its ≤ 5 % placement budget.
- Space Grotesk display + Geist body + JetBrains Mono labels.
- The CTA voice — radius, padding rhythm, press timing.
- The breadcrumb trail: JetBrains Mono, uppercase, `0.06em`, Lucide chevron separator.
- The title row: dimensional mark + Space Grotesk 700 title, stacked single column.
- Card, tile, input, and skeleton surfaces.

## What pages MAY differ on

- Grid density (the launcher is 3→6 up; browse grids are 1→3 up).
- Whether a search row is present.
- Which dimensional mark leads the title row.

## Banned in this system

Carried from Hallmark's named tells, plus the ones this codebase specifically hit:

- Eyebrows / section numbers as decoration, and the tag-left / heading-right
  two-column section head. Title rows are a vertical stack, always.
- Emoji as an icon. Mixed icon libraries within one role.
- `transition-all`, `hover:scale-*`, bouncy or overshoot easings on UI.
- Gradient text, gradient heroes, glassmorphism, aurora blobs, floating orbs.
- Pure `#000` / `#fff`; zero-chroma greys; raw hex or `oklch()` written inline
  instead of through a token. (The old `#377fcc` / `#2780d0` / `bg-gray-100` /
  `dark:bg-zinc-800` literals scattered through the pages are all gone.)
- Card-in-card, side-stripe cards, stacked shadows, shadow-glow on dark.
- `min-height: 100vh` centred hero. Decorative absolutely-positioned imagery.
- Spinners with no minimum visible time. Skeletons that don't match the
  layout they stand in for.

## Exports

Drop-in formats for reusing this system.

### tokens.css

Canonical source: `src/index.css` `:root` and `.dark`. `tokens.css` at the project
root mirrors it standalone.

### Tailwind

Tokens are surfaced through `tailwind.config.js` (`theme.extend`): `colors` map to
the OKLCH custom properties, plus `fontFamily`, `spacing`, `borderRadius`,
`transitionTimingFunction`, `transitionDuration`, `zIndex`, `keyframes`, `animation`.

### shadcn/ui CSS variables

The existing shadcn variable names (`--background`, `--foreground`, `--primary`,
`--card`, `--border`, `--input`, `--ring`, `--muted`, `--accent`, `--radius`, …)
are retained and re-pointed at the OKLCH tokens above, so every already-installed
shadcn component inherits the new system without being rewritten.

## Stamp

Every page and component touched by this redesign carries:

```
/* Hallmark · genre: modern-minimal · macrostructure: <family> · theme: Cobalt (brand-anchored, hue 252) · design-system: design.md · designed-as-app */
```
