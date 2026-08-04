import { DURATION, EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { useId } from "react";

const RAYS = [
  [12, 1, 12, 3],
  [12, 21, 12, 23],
  [1, 12, 3, 12],
  [21, 12, 23, 12],
  [4.2, 4.2, 5.6, 5.6],
  [18.4, 18.4, 19.8, 19.8],
  [4.2, 19.8, 5.6, 18.4],
  [18.4, 5.6, 19.8, 4.2],
] as const;

/**
 * Sun ⇄ moon, morphed rather than swapped.
 *
 * The disc grows and a punch-out circle slides in from off-canvas to bite the
 * crescent, while the rays retract toward the centre. One continuous motion, so
 * the toggle reads as the *same object* changing state — a cross-fade between
 * two different glyphs would not.
 */
export default function ThemeMorph({
  dark,
  className,
}: {
  dark: boolean;
  className?: string;
}) {
  const maskId = useId();
  const reduced = useReducedMotion();
  const transition = reduced
    ? { duration: 0.15 }
    : { duration: DURATION.long, ease: EASE.out };

  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-5 w-5", className)}
      aria-hidden="true"
      focusable="false"
    >
      <mask id={maskId}>
        <rect x="0" y="0" width="24" height="24" fill="white" />
        <motion.circle
          r="9"
          fill="black"
          initial={false}
          animate={{ cx: dark ? 17 : 30, cy: dark ? 6 : -4 }}
          transition={transition}
        />
      </mask>

      <motion.circle
        cx="12"
        cy="12"
        fill="currentColor"
        mask={`url(#${maskId})`}
        initial={false}
        animate={{ r: dark ? 9.5 : 5.2 }}
        transition={transition}
      />

      <motion.g
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        initial={false}
        animate={{ opacity: dark ? 0 : 1, scale: dark ? 0.45 : 1 }}
        transition={transition}
        // view-box + explicit origin is exact; fill-box would centre on the
        // rays' own bounding box, which is not the disc's centre.
        style={{ transformBox: "view-box", transformOrigin: "12px 12px" }}
      >
        {RAYS.map(([x1, y1, x2, y2]) => (
          <line key={`${x1}-${y1}`} x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
      </motion.g>
    </svg>
  );
}
