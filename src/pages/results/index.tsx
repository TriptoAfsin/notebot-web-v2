/* Hallmark · macrostructure: Index-First · design-system: design.md
 *
 * "Load more" used to blank the whole list back to skeletons, because the limit
 * change is a new cache entry and the page tested `isLoading || isFetching`. The
 * hook now carries `keepPreviousData`, so the current page stays on screen while
 * the larger one loads and the button carries the pending state instead.
 */

import { ResultsIcon } from "@/components/atoms/icons/dimensional";
import { ResultGridSkeleton } from "@/components/atoms/skeletons";
import EmptyState from "@/components/molecules/empty-state";
import ErrorComponent from "@/components/molecules/error-comonent";
import {
  Breadcrumbs,
  IndexGrid,
  PageShell,
  PageTitle,
  RevealItem,
} from "@/components/molecules/page-shell";
import NavigationLinkCard from "@/components/atoms/cards/navigation-link-card";
import { Button } from "@/components/ui/button";
import { APP_PATHS } from "@/constants/path-config";
import { useGetResults } from "@/hooks/networking/content/results";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const PAGE_SIZE = 10;
const MAX_LIMIT = 20;

export default function ResultsPage() {
  const [limit, setLimit] = useState(PAGE_SIZE);
  const { data, isPending, isPlaceholderData, error, refetch } =
    useGetResults(limit);

  const results = data ?? [];
  const canLoadMore = results.length > 0 && limit < MAX_LIMIT;

  return (
    <PageShell>
      <Breadcrumbs
        trail={[{ label: "Home", href: APP_PATHS.HOME }, { label: "Results" }]}
      />

      <PageTitle
        icon={<ResultsIcon className="h-8 w-8" />}
        title="Latest results"
        meta={
          results.length
            ? `${results.length} published · opens the notice`
            : "Published results"
        }
      />

      {error ? (
        <ErrorComponent
          message="Couldn't load the results"
          refreshFunc={() => refetch()}
        />
      ) : isPending ? (
        <ResultGridSkeleton rows={6} />
      ) : results.length === 0 ? (
        <EmptyState
          title="No results published yet"
          hint="Nothing has been posted. Check back after the exams."
        />
      ) : (
        <>
          <IndexGrid columns={3}>
            {results.map((result, index) => (
              <RevealItem key={result.href} index={index}>
                <NavigationLinkCard
                  label={result.content}
                  meta={result.date}
                  path={result.href}
                  url={result.href}
                  isExternal
                />
              </RevealItem>
            ))}
          </IndexGrid>

          {canLoadMore ? (
            <div className="mt-xl flex justify-center">
              <Button
                variant="outline"
                onClick={() => setLimit(previous => previous + PAGE_SIZE)}
                // the pending state lives on the button, not on the list
                disabled={isPlaceholderData}
                className="w-40"
              >
                {isPlaceholderData ? (
                  <Loader2 className="animate-spin" aria-hidden="true" />
                ) : null}
                {isPlaceholderData ? "Loading…" : `Load ${PAGE_SIZE} more`}
              </Button>
            </div>
          ) : null}
        </>
      )}
    </PageShell>
  );
}
