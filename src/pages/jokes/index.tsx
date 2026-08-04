/* Hallmark · macrostructure: Index-First (content variant) · design-system: design.md
 *
 * Revamped for smoothness. What was wrong before:
 *  - `isLoading || isFetching` swapped the whole card for a skeleton on every
 *    refetch, so asking for another joke made the page jump twice.
 *  - The card sized to its content, so each joke resized the layout.
 *  - The button gave no feedback while the request was in flight, and its label
 *    would have resized it if it had.
 *
 * Now: the card holds its height, the old joke crossfades out as the new one
 * rises in, the skeleton appears only on the very first load, and the button
 * shows in-flight state at a fixed width. One primitive — a crossfade — carries
 * the whole interaction.
 */

import { JokesIcon } from "@/components/atoms/icons/dimensional";
import { JokeSkeleton } from "@/components/atoms/skeletons";
import ErrorComponent from "@/components/molecules/error-comonent";
import PageMark from "@/components/molecules/page-mark";
import {
  Breadcrumbs,
  PageShell,
  PageTitle,
} from "@/components/molecules/page-shell";
import { Button } from "@/components/ui/button";
import { APP_PATHS } from "@/constants/path-config";
import { useGetJokes } from "@/hooks/networking/content/jokes";
import { DURATION, EASE } from "@/lib/motion";
import { AnimatePresence, motion } from "framer-motion";
import { RefreshCw } from "lucide-react";

export default function JokesPage() {
  const { data, isPending, isFetching, error, refetch } = useGetJokes();

  return (
    <PageShell>
      <Breadcrumbs
        trail={[{ label: "Home", href: APP_PATHS.HOME }, { label: "Jokes" }]}
      />

      <PageTitle
        icon={<JokesIcon className="h-8 w-8" />}
        title="Jokes"
        meta="One-liners, on demand"
      />

      {error ? (
        <ErrorComponent
          message="Couldn't fetch a joke"
          refreshFunc={() => refetch()}
        />
      ) : isPending ? (
        /* Skeleton only on the very first load — never between jokes. */
        <JokeSkeleton />
      ) : (
        <div className="surface mx-auto max-w-xl p-lg">
          {/* min-height reserves room for a two-or-three line joke, so a short
              one doesn't collapse the card and a long one doesn't shove the
              button down the page */}
          <div className="grid min-h-[6.5rem] place-items-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={data?.joke}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: DURATION.short, ease: EASE.out }}
                className="text-balance text-center text-base leading-relaxed text-foreground"
              >
                {data?.joke}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* the joke replaces itself in place, so announce the settled value */}
          <p className="sr-only" aria-live="polite">
            {isFetching ? "Finding a joke" : data?.joke}
          </p>

          <div className="mt-lg flex justify-center">
            <Button
              onClick={() => refetch()}
              disabled={isFetching}
              // fixed width so the label swap can't resize the control
              className="w-44"
            >
              <RefreshCw
                className={isFetching ? "animate-spin" : undefined}
                aria-hidden="true"
              />
              {isFetching ? "Finding one…" : "Another joke"}
            </Button>
          </div>
        </div>
      )}

      <PageMark>
        <JokesIcon className="h-24 w-24" />
      </PageMark>
    </PageShell>
  );
}
