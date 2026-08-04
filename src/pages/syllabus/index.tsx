/* Hallmark · macrostructure: Index-First · design-system: design.md
 *
 * The loading state now renders a shape-matched grid rather than a single
 * full-width card, so the list doesn't re-flow when data lands.
 */

import NavigationLinkCard from "@/components/atoms/cards/navigation-link-card";
import { FolderIcon, SyllabusIcon, ICON_HUE } from "@/components/atoms/icons/dimensional";
import { IndexGridSkeleton } from "@/components/atoms/skeletons";
import EmptyState from "@/components/molecules/empty-state";
import ErrorComponent from "@/components/molecules/error-comonent";
import PageMark from "@/components/molecules/page-mark";
import {
  Breadcrumbs,
  IndexGrid,
  PageShell,
  PageTitle,
  RevealItem,
} from "@/components/molecules/page-shell";
import { APP_PATHS } from "@/constants/path-config";
import { syllabusBatchQuery } from "@/hooks/networking/content/syllabus-batch";
import { useGetSyllabus } from "@/hooks/networking/content/syllabus";

export default function SyllabusPage() {
  const { data, isPending, error, refetch } = useGetSyllabus();

  const trail = [
    { label: "Home", href: APP_PATHS.HOME },
    { label: "Syllabus" },
  ];

  return (
    <PageShell>
      <Breadcrumbs trail={trail} />

      <PageTitle
        icon={<SyllabusIcon className="h-8 w-8" />}
        title="Choose a batch"
        meta={
          data?.length
            ? `${data.length} batches available`
            : "Syllabus, by batch and department"
        }
      />

      {error ? (
        <ErrorComponent
          message="Couldn't load the batch list"
          refreshFunc={refetch}
        />
      ) : isPending ? (
        <IndexGridSkeleton rows={6} columns={3} withIcon label="Loading batches" />
      ) : data && data.length > 0 ? (
        <IndexGrid columns={3}>
          {data.map((batch, index) => (
            <RevealItem key={batch.batch} index={index}>
              <NavigationLinkCard
                label={`Batch ${batch.batch}`}
                path={`${APP_PATHS.SYLLABUS}/${batch.batch}`}
                prefetch={syllabusBatchQuery(batch.batch)}
                icon={
                  <FolderIcon className="h-9 w-9" hue={ICON_HUE.syllabus} />
                }
              />
            </RevealItem>
          ))}
        </IndexGrid>
      ) : (
        <EmptyState
          title="No syllabus published yet"
          hint="Check back once the department uploads this term's syllabus."
        />
      )}

      <PageMark>
        <SyllabusIcon className="h-24 w-24" />
      </PageMark>
    </PageShell>
  );
}
