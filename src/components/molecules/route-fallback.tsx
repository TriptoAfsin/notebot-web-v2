/* Hallmark · design-system: design.md
 *
 * Suspense fallback for a lazy route chunk.
 *
 * Two rules, both about not lying to the user:
 *
 *  - Nothing at all for the first 150ms. A warm chunk resolves in ~40ms, and a
 *    skeleton that appears and vanishes inside a frame reads as a glitch.
 *  - After that, the shape of the page being loaded rather than a spinner. A
 *    spinner says "wait"; a skeleton says "a 3-column index is coming", and the
 *    real content replaces it without moving anything.
 */

import RouteSkeleton from "@/components/molecules/route-skeleton";
import { useEffect, useState } from "react";

const SHOW_AFTER_MS = 150;

export default function RouteFallback({ pathname }: { pathname: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), SHOW_AFTER_MS);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      // fades in rather than snapping, so even the delayed appearance is soft
      style={{ animation: "reveal 260ms var(--ease-out) both" }}
    >
      <RouteSkeleton pathname={pathname} />
    </div>
  );
}
