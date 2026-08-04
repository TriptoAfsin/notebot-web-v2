import { DURATION, EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Menu ⇄ close, morphed rather than swapped.
 *
 * The outer two bars slide onto the centre line and rotate into the cross while
 * the middle bar collapses horizontally underneath them. Same three elements
 * throughout, so the control reads as one object folding.
 *
 * These are `<rect>`s, not `<line>`s, on purpose: a line has a zero-area
 * geometry box, so `transform-box: fill-box` gives it no centre to rotate about
 * and the two bars collapse onto the same diagonal. Rects have a real box, and
 * because `y` is an attribute rather than a transform, each bar's rotation
 * origin tracks it as it slides.
 */

const BAR_X = 3.5;
const BAR_W = 17;
const BAR_H = 1.8;
/** y that centres a bar vertically in the 24-unit viewBox. */
const CENTER_Y = 12 - BAR_H / 2;

export default function MenuMorph({
  open,
  className,
}: {
  open: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const transition = reduced
    ? { duration: 0.15 }
    : { duration: DURATION.short, ease: EASE.out };

  const bar = {
    x: BAR_X,
    height: BAR_H,
    rx: BAR_H / 2,
    fill: "currentColor",
    style: {
      transformBox: "fill-box" as const,
      transformOrigin: "center",
    },
  };

  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-5 w-5", className)}
      aria-hidden="true"
      focusable="false"
    >
      <motion.rect
        {...bar}
        width={BAR_W}
        initial={false}
        animate={{ y: open ? CENTER_Y : 6.1, rotate: open ? 45 : 0 }}
        transition={transition}
      />
      {/* scaleX, not an animated `width` — width is a layout property, and the
          rule is transform-and-opacity only */}
      <motion.rect
        {...bar}
        y={CENTER_Y}
        width={BAR_W}
        initial={false}
        animate={{ scaleX: open ? 0 : 1, opacity: open ? 0 : 1 }}
        transition={transition}
      />
      <motion.rect
        {...bar}
        width={BAR_W}
        initial={false}
        animate={{ y: open ? CENTER_Y : 16.1, rotate: open ? -45 : 0 }}
        transition={transition}
      />
    </svg>
  );
}
