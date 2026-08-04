/* Hallmark · design-system: design.md · enrichment: Tier-B authored 3D SVG
 *
 * The render framework for the dimensional icon set.
 *
 * The first pass built every glyph from isometric prisms, which meant all ten
 * shared one silhouette — a stack of slabs — and read as generic. This replaces
 * that with authored, chunky 3/4-view forms: each icon has a shape you can
 * recognise from across the room, a glossy two-stop body, a specular sheen, an
 * extruded depth layer and a soft contact shadow.
 *
 * What stays shared is the *lighting model*, not the shape. Light reads from the
 * upper left in every glyph; lightness and chroma are tokens; only the HUE
 * rotates per icon. That's what keeps ten colours reading as one family instead
 * of ten unrelated stickers.
 */

import { useId } from "react";

export const VIEW = 64;

/** The fill references handed to each icon's paint function. */
export type Fills = {
  /** Main body — the lit surface. */
  body: string;
  /** Lighter secondary surface: back cards, ribbons, rings. */
  bodyLight: string;
  /** Deeper surface: inner shadows, spines, clips. */
  bodyDeep: string;
  /** Darkest — the extrusion under a shape, which reads as thickness. */
  bodyDark: string;
  /** Near-white page. Stays light in both themes so glyphs keep their pop. */
  paper: string;
  /** Slightly shaded page, for the far leaf of an open book. */
  paperShade: string;
  /** White-to-transparent gloss. Layer this over a body, never under it. */
  sheen: string;
  /** Radial ground shadow. */
  shadow: string;
};

/* Two-stop ramps. `-hi` is the upper-left stop, the bare token the lower-right,
 * so the gradient direction encodes the light direction for the whole set. */
const RAMPS = [
  ["body", "--g-body-hi", "--g-body"],
  ["bodyLight", "--g-light-hi", "--g-light"],
  ["bodyDeep", "--g-deep-hi", "--g-deep"],
  ["bodyDark", "--g-dark-hi", "--g-dark"],
  ["paper", "--g-paper-hi", "--g-paper"],
  ["paperShade", "--g-paper-2-hi", "--g-paper-2"],
] as const;

const tokenColor = (token: string) =>
  `oklch(var(${token}-l) var(${token}-c) var(--glyph-hue))`;

/** The gloss highlight. Named token, not an inline white. */
const GLOSS = "oklch(var(--c-gloss))";

export type GlyphProps = {
  className?: string;
  /** Accessible name. Omit for decorative icons beside a text label. */
  title?: string;
};

export function Glyph({
  hue,
  className,
  title,
  paint,
}: GlyphProps & {
  /** OKLCH hue angle for this glyph. */
  hue: number;
  paint: (fills: Fills) => React.ReactNode;
}) {
  // A shared gradient id would make every icon resolve to whichever hue happened
  // to be first in the document, so ids are namespaced per instance.
  const uid = useId().replace(/[^a-zA-Z0-9-]/g, "");
  const ref = (name: string) => `url(#g${uid}-${name})`;

  const fills: Fills = {
    body: ref("body"),
    bodyLight: ref("bodyLight"),
    bodyDeep: ref("bodyDeep"),
    bodyDark: ref("bodyDark"),
    paper: ref("paper"),
    paperShade: ref("paperShade"),
    sheen: ref("sheen"),
    shadow: ref("shadow"),
  };

  return (
    <svg
      viewBox={`0 0 ${VIEW} ${VIEW}`}
      className={className}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      focusable="false"
      style={{ ["--glyph-hue" as string]: String(hue) }}
    >
      {title ? <title>{title}</title> : null}

      <defs>
        {RAMPS.map(([name, hi, base]) => (
          <linearGradient
            key={name}
            id={`g${uid}-${name}`}
            x1="0.1"
            y1="0"
            x2="0.85"
            y2="1"
          >
            <stop offset="0" stopColor={tokenColor(hi)} />
            <stop offset="1" stopColor={tokenColor(base)} />
          </linearGradient>
        ))}

        {/* The gloss. Strongest at the top-left corner, gone by 60%. */}
        <linearGradient
          id={`g${uid}-sheen`}
          x1="0.05"
          y1="0"
          x2="0.6"
          y2="0.95"
        >
          <stop offset="0" stopColor={GLOSS} stopOpacity="0.5" />
          <stop offset="0.55" stopColor={GLOSS} stopOpacity="0.08" />
          <stop offset="1" stopColor={GLOSS} stopOpacity="0" />
        </linearGradient>

        <radialGradient id={`g${uid}-shadow`}>
          <stop
            offset="0"
            stopColor="oklch(var(--g-shadow) / var(--g-shadow-alpha))"
          />
          <stop offset="1" stopColor="oklch(var(--g-shadow) / 0)" />
        </radialGradient>
      </defs>

      {/* Contact shadow — grounds the glyph so it sits on the tile rather than
          floating in it. */}
      <ellipse cx="32" cy="56.5" rx="19" ry="4" fill={fills.shadow} />

      {paint(fills)}
    </svg>
  );
}
