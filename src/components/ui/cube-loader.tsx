/* Hallmark · design-system: design.md
 *
 * A tumbling Rubik's cube, built in CSS 3D.
 *
 * Six faces on `transform-style: preserve-3d`, each a 3×3 grid of stickers on a
 * dark plastic body. The tile grid is the point: a solid-coloured cube at this
 * size reads as a flat rotating rhombus, whereas the 3×3 stickers make the
 * rotation legible and the object unmistakable.
 *
 * The per-face `translateZ` lives HERE, as an inline transform, not in a
 * `.cube3d__face--front` CSS class. Those classes were built as a template
 * string (`cube3d__face--${face}`), so Tailwind's content scanner never saw the
 * literal names and purged all six rules out of `@layer components` — every face
 * then rendered at z=0 and the cube collapsed into a flat 3×3 square. Deriving
 * the transform from `size` in JS makes the geometry immune to purging and keeps
 * it in one place.
 *
 * Sticker hues are the six the dimensional icon set uses, so the loader belongs
 * to the app's palette rather than importing a toy-brand red/green. The tumble
 * itself stays in index.css, so it's transform-only, GPU-composited, and swaps to
 * a static three-quarter pose under reduced-motion.
 */

import { cn } from "@/lib/utils";

/** Face orientations. `translateZ(half)` pushes each out to the cube's surface. */
const FACES = [
  { key: "front", rotate: "" },
  { key: "back", rotate: "rotateY(180deg) " },
  { key: "right", rotate: "rotateY(90deg) " },
  { key: "left", rotate: "rotateY(-90deg) " },
  { key: "top", rotate: "rotateX(90deg) " },
  { key: "bottom", rotate: "rotateX(-90deg) " },
] as const;

/** The six sticker hues — the icon set's palette, not Rubik's licensed colours. */
const STICKERS = [252, 195, 300, 85, 150, 35] as const;

/* A fixed scramble. Solved faces would each be one flat colour, which loses the
 * tile grid again at small sizes; a scramble keeps every face readable. Fixed
 * rather than random so the loader looks identical on every render. */
const SCRAMBLE: readonly number[][] = [
  [0, 1, 0, 2, 0, 3, 1, 0, 4],
  [1, 2, 1, 0, 1, 4, 3, 1, 2],
  [2, 3, 5, 1, 2, 0, 2, 4, 2],
  [3, 0, 3, 4, 3, 2, 5, 3, 1],
  [4, 5, 2, 3, 4, 1, 4, 0, 5],
  [5, 4, 1, 5, 5, 3, 0, 2, 5],
];

export function CubeLoader({
  size = 24,
  className,
  label,
}: {
  /** Edge length in px. Face depth and tile radii derive from this. */
  size?: number;
  className?: string;
  /** Screen-reader text. Pass null when an adjacent label already says it. */
  label?: string | null;
}) {
  const half = size / 2;

  return (
    <span
      className={cn("cube3d", className)}
      style={{ ["--cube-size" as string]: `${size}px` }}
      role={label ? "status" : undefined}
      aria-hidden={label ? undefined : true}
    >
      {label ? <span className="sr-only">{label}</span> : null}
      <span className="cube3d__inner">
        {FACES.map((face, faceIndex) => (
          <span
            key={face.key}
            className="cube3d__face"
            style={{ transform: `${face.rotate}translateZ(${half}px)` }}
          >
            {SCRAMBLE[faceIndex].map((sticker, tileIndex) => (
              <span
                key={tileIndex}
                className="cube3d__tile"
                style={{ ["--tile-hue" as string]: String(STICKERS[sticker]) }}
              />
            ))}
          </span>
        ))}
      </span>
    </span>
  );
}

export default CubeLoader;
