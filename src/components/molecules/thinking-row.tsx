/* Hallmark · design-system: design.md
 *
 * The pending row on Tex-GPT.
 *
 * The old version was a single static line — "Searching knowledge base…" — for
 * the whole wait, so a slow answer gave no sense of progress. This walks honest
 * stages: retrieval stages advance on a timer while the request is genuinely in
 * flight, and the row switches to the generation stage when retrieval resolves.
 * The label never claims a step that hasn't started.
 *
 * Below the label sit three shimmer lines the width of a typical answer, so the
 * space the answer will occupy is already reserved and nothing jumps when it
 * lands.
 */

import TexGptMark from "@/components/atoms/icons/tex-gpt-mark";
import { CubeLoader } from "@/components/ui/cube-loader";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

/** Retrieval stages, advanced on a timer while the request is in flight. */
const RETRIEVAL_STAGES = [
  "Reading your question",
  "Searching the document set",
  "Ranking the closest passages",
] as const;

const STAGE_MS = 1400;

/** How long the shimmer lines are, as a fraction of the row. */
const SKELETON_WIDTHS = ["100%", "94%", "62%"] as const;

export default function ThinkingRow({
  /** True while the retrieval request itself is outstanding. */
  isRetrieving,
}: {
  isRetrieving: boolean;
}) {
  const [stage, setStage] = useState(0);

  /* Advance through the retrieval stages, then hold on the last one — the timer
   * describes progress, it doesn't invent completion. */
  useEffect(() => {
    if (!isRetrieving) return;

    const timer = window.setInterval(() => {
      setStage(current => Math.min(current + 1, RETRIEVAL_STAGES.length - 1));
    }, STAGE_MS);

    return () => window.clearInterval(timer);
  }, [isRetrieving]);

  const label = isRetrieving
    ? RETRIEVAL_STAGES[stage]
    : "Writing the answer";

  return (
    <div className="flex gap-sm">
      <div className="shrink-0 pt-0.5">
        <TexGptMark className="h-8 w-8" />
      </div>

      <div
        className="min-w-0 flex-1 rounded-card border border-rule bg-paper-2 px-md py-sm"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-sm">
          {/* the cube carries its own six-colour sticker palette */}
          <CubeLoader size={20} label={null} />
          <p className="label-working text-sm font-medium normal-case tracking-normal">
            {label}
            <span className="ai-caret ml-1" aria-hidden="true" />
          </p>
        </div>

        {/* the answer's footprint, reserved ahead of time */}
        <div className="mt-sm space-y-2" aria-hidden="true">
          {SKELETON_WIDTHS.map((width, index) => (
            <span
              key={width}
              className={cn("skeleton block h-3")}
              style={{
                width,
                // offset each line's sweep so they don't pulse in lockstep
                animationDelay: `${index * 160}ms`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
