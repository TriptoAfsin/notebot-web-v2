/* Hallmark · design-system: design.md
 *
 * Suspense fallback for a lazy route chunk.
 *
 * The old shell fell back to a bare spinner, which flashed on and off for the
 * ~40ms a warm chunk takes to resolve. This holds blank for 150ms first, so a
 * fast navigation shows nothing at all — the spinner-with-no-minimum-visible-time
 * problem, solved by simply not showing one for fast work.
 */

import { CubeLoader } from "@/components/ui/cube-loader";
import { useEffect, useState } from "react";

const SHOW_AFTER_MS = 150;

export default function RouteFallback() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), SHOW_AFTER_MS);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="container flex min-h-[40dvh] items-center justify-center px-md"
      // fades in rather than snapping, so even the delayed appearance is soft
      style={{ animation: "reveal 260ms var(--ease-out) both" }}
    >
      <CubeLoader size={30} label="Loading" />
    </div>
  );
}
