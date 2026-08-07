/* Hallmark · design-system: design.md
 *
 * The shape of the page you're about to get, drawn while its chunk loads.
 *
 * The route fallback used to be a centred spinner, which tells you only "wait".
 * A skeleton in the destination's own geometry tells you where you are and stops
 * the layout jumping when the real content lands — the same reasoning behind the
 * in-page skeletons in atoms/skeletons, reused here rather than reinvented.
 *
 * Shapes are matched by pathname, and the fallback for an unmapped route is the
 * generic index grid rather than nothing.
 */

import {
  IndexGridSkeleton,
  JokeSkeleton,
  ResultGridSkeleton,
  TileGridSkeleton,
} from "@/components/atoms/skeletons";
import { cn } from "@/lib/utils";

/**
 * Tiles per launcher section — Study, then Extras (see LAUNCHER_ITEMS in
 * constants/content-config).
 *
 * These counts are load-bearing, not decorative. The skeleton first drew a single
 * 10-tile grid while the real launcher draws two labelled sections, so when the
 * page arrived the footer jumped and Lighthouse charged 0.044 of layout shift for
 * it. Matching the structure is the entire job of a skeleton; getting the shape
 * wrong makes it worse than none. Kept as literals rather than imported because
 * content-config pulls in the whole dimensional glyph set, which would land in
 * the entry bundle.
 */
const HOME_SECTION_TILES = [7, 3];

function Bar({ className }: { className?: string }) {
  return <span className={cn("skeleton block h-3.5", className)} />;
}

/** The breadcrumb + title block every browse page opens with. */
function PageHead({ wide = false }: { wide?: boolean }) {
  return (
    <>
      <div className="mb-lg flex items-center gap-xs">
        <Bar className="h-2.5 w-10" />
        <Bar className="h-2.5 w-16" />
      </div>
      <div className="mb-lg flex items-center gap-sm">
        <span className="skeleton h-8 w-8 shrink-0 rounded-control" />
        <Bar className={cn("h-5", wide ? "w-64" : "w-40")} />
      </div>
    </>
  );
}

/**
 * Paragraph run, for the prose pages (About, Privacy, Terms).
 *
 * Carries its own status role because — unlike the grid and card skeletons in
 * atoms/skeletons — there's no inner component here to announce the wait.
 */
function ProseSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className="max-w-[65ch] space-y-sm"
    >
      <span className="sr-only">Loading</span>
      <Bar className="w-full" />
      <Bar className="w-[94%]" />
      <Bar className="w-[88%]" />
      <Bar className="w-2/5" />
    </div>
  );
}

function shapeFor(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const branch = segments[0] ?? "";
  const depth = segments.length;

  if (depth === 0) return "home";
  if (branch === "results") return "results";
  if (branch === "jokes") return "joke";
  if (branch === "tex-gpt") return "prose";
  if (branch === "about" || branch === "privacy" || branch === "terms") {
    return "prose";
  }
  // Notes / labs / syllabus / q-bank: level lists are 2-up, the rest 3-up, which
  // is what the real pages render.
  return depth === 1 ? "levels" : "index";
}

export default function RouteSkeleton({ pathname }: { pathname: string }) {
  const shape = shapeFor(pathname);

  if (shape === "home") {
    return (
      <div className="mx-auto w-full max-w-5xl px-md pb-2xl pt-xl md:px-lg">
        <div className="flex flex-col items-center">
          <span className="skeleton h-24 w-24 rounded-card" />
          {/* h-7 ≈ the 27px line box of the text-xl wordmark it stands in for */}
          <Bar className="mt-sm h-7 w-40" />
        </div>

        {HOME_SECTION_TILES.map((tiles, index) => (
          <section key={index} className="mt-xl">
            <div className="mb-md flex items-center gap-sm">
              {/* h-4 ≈ the 16px line box of a label-mono heading */}
              <Bar className="h-4 w-14" />
              <span aria-hidden="true" className="h-px flex-1 bg-rule" />
            </div>
            <TileGridSkeleton tiles={tiles} />
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className="container px-md pb-2xl pt-lg md:px-lg">
      <PageHead wide={shape === "prose"} />

      {shape === "prose" ? <ProseSkeleton /> : null}
      {shape === "joke" ? <JokeSkeleton /> : null}
      {shape === "results" ? <ResultGridSkeleton rows={6} /> : null}
      {shape === "levels" ? (
        <IndexGridSkeleton rows={4} columns={2} withIcon />
      ) : null}
      {shape === "index" ? <IndexGridSkeleton rows={6} columns={3} /> : null}
    </div>
  );
}
