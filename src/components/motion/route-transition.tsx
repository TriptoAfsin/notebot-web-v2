import { DURATION, EASE, supportsViewTransitions } from "@/lib/motion";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";

/**
 * Route transition, progressively enhanced.
 *
 * Where the View Transitions API exists, `<AppLink viewTransition>` hands the
 * navigation to the browser and the `::view-transition-*` rules in index.css do
 * the animating — GPU-driven, and it survives interruption mid-navigation.
 * Everywhere else this falls back to a Framer crossfade keyed on the pathname.
 *
 * Only one of the two ever runs, so routes never double-animate.
 */
export default function RouteTransition({ children }: { children: ReactNode }) {
  const location = useLocation();

  if (supportsViewTransitions) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{
          duration: DURATION.short,
          ease: EASE.out,
          // exits run at ~75% of the enter
          opacity: { duration: DURATION.short * 0.75 },
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
