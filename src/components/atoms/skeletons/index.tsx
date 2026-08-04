/* Hallmark · design-system: design.md
 *
 * Skeletons that match the shape they stand in for.
 *
 * The old RootContentSkeleton rendered a stack of full-width cards while the
 * real content was a 3-column grid, so every list visibly re-flowed the moment
 * data landed. These mirror the grid, the row height and the row internals, so
 * the swap is invisible.
 *
 * The sweep is functional motion — it keeps running under reduced-motion,
 * just slower.
 */

import { IndexGrid } from "@/components/molecules/page-shell";
import { cn } from "@/lib/utils";

function Bar({ className }: { className?: string }) {
  return <span className={cn("skeleton block h-3.5", className)} />;
}

/** One index row, matched to <NavigationLinkCard>'s height and padding. */
export function IndexRowSkeleton({ withIcon = false }: { withIcon?: boolean }) {
  return (
    <div className="surface flex items-center gap-sm p-md">
      {withIcon ? (
        <span className="skeleton h-8 w-8 shrink-0 rounded-control" />
      ) : null}
      <span className="flex min-w-0 flex-1 flex-col gap-2xs">
        <Bar className="w-[62%]" />
      </span>
      <span className="skeleton h-4 w-4 shrink-0 rounded-sm" />
    </div>
  );
}

/** A full index grid of rows, in the same column count as the real grid. */
export function IndexGridSkeleton({
  rows = 6,
  columns = 3,
  withIcon = false,
  label = "Loading",
}: {
  rows?: number;
  columns?: 1 | 2 | 3;
  withIcon?: boolean;
  label?: string;
}) {
  return (
    <div role="status" aria-busy="true" aria-live="polite">
      <span className="sr-only">{label}</span>
      <IndexGrid columns={columns}>
        {Array.from({ length: rows }, (_, index) => (
          <IndexRowSkeleton key={index} withIcon={withIcon} />
        ))}
      </IndexGrid>
    </div>
  );
}

/** Matched to the launcher tile — square, icon block, label bar. */
export function TileGridSkeleton({ tiles = 10 }: { tiles?: number }) {
  return (
    <div
      role="status"
      aria-busy="true"
      className="grid w-full grid-cols-3 gap-md md:grid-cols-4 lg:grid-cols-6"
    >
      <span className="sr-only">Loading</span>
      {Array.from({ length: tiles }, (_, index) => (
        <div
          key={index}
          className="surface flex aspect-square flex-col items-center justify-center gap-xs p-sm"
        >
          <span className="skeleton h-12 w-12 rounded-control" />
          <Bar className="w-3/5" />
        </div>
      ))}
    </div>
  );
}

/** Matched to the results card — two text lines and a trailing glyph. */
export function ResultCardSkeleton() {
  return (
    <div className="surface flex items-start justify-between gap-sm p-md">
      <span className="flex min-w-0 flex-1 flex-col gap-2xs">
        <Bar className="w-full" />
        <Bar className="w-4/5" />
      </span>
      <span className="skeleton h-4 w-4 shrink-0 rounded-sm" />
    </div>
  );
}

export function ResultGridSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className="grid grid-cols-[minmax(0,1fr)] gap-md sm:grid-cols-[repeat(2,minmax(0,1fr))] lg:grid-cols-[repeat(3,minmax(0,1fr))]"
    >
      <span className="sr-only">Loading results</span>
      {Array.from({ length: rows }, (_, index) => (
        <ResultCardSkeleton key={index} />
      ))}
    </div>
  );
}

/** Matched to the joke card — three prose lines plus the button. */
export function JokeSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className="surface mx-auto flex max-w-xl flex-col gap-sm p-lg"
    >
      <span className="sr-only">Loading a joke</span>
      <Bar className="w-full" />
      <Bar className="w-[92%]" />
      <Bar className="w-3/5" />
      <span className="skeleton mt-sm h-10 w-36 rounded-control" />
    </div>
  );
}
