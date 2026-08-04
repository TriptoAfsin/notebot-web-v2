import type { CSSProperties } from "react";

/** True when the browser can drive a real cross-document view transition. */
export const supportsViewTransitions =
  typeof document !== "undefined" && "startViewTransition" in document;

/** True when the visitor has asked for less motion. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Stagger index for the `.reveal` class.
 *
 * The entrance is CSS-driven (one `animation-delay: calc(var(--i) * 40ms)`)
 * rather than a Framer variant per row — a 60-row subject list would otherwise
 * mount 60 motion components for a one-shot fade. Total stagger is capped so a
 * long list still settles inside ~320ms.
 */
export function staggerStyle(index: number, cap = 8): CSSProperties {
  return { "--i": Math.min(index, cap) } as CSSProperties;
}

/** Tokenised easings, for the few places Framer drives the animation. */
export const EASE = {
  out: [0.16, 1, 0.3, 1],
  in: [0.7, 0, 0.84, 0],
  inOut: [0.65, 0, 0.35, 1],
} as const;

export const DURATION = {
  micro: 0.12,
  short: 0.22,
  long: 0.42,
} as const;
