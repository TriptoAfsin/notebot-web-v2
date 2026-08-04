/* Hallmark · design-system: design.md
 *
 * The corner mark on browse pages. It used to be a raw PNG pinned with
 * `absolute bottom-24 right-5` — which overlapped content on narrow viewports
 * and sat on a different stacking context to the page. This renders the page's
 * own authored glyph instead, fixed to the viewport corner, held behind
 * everything and non-interactive, and hidden below `sm` where there isn't room
 * for decoration.
 */

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export default function PageMark({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed bottom-24 right-5 z-base hidden select-none sm:block",
        // pulled back so it reads as a watermark, not a floating sticker
        "opacity-40",
        className
      )}
    >
      {children}
    </div>
  );
}
