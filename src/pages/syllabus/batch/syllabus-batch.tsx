/* Hallmark · macrostructure: Index-First · design-system: design.md
 *
 * The batch is read from useParams() rather than `pathname.split("/").pop()`.
 * A row was also previously marked external when the *department* carried a url,
 * while still routing to an internal path — so it opened the in-app page with a
 * new-tab affordance on it. External rows now actually go to the url.
 */

import NavigationLinkCard from "@/components/atoms/cards/navigation-link-card";
import { FolderIcon, ICON_HUE, SyllabusIcon } from "@/components/atoms/icons/dimensional";
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
import { useGetBatchSyllabus } from "@/hooks/networking/content/syllabus-batch";
import { syllabusDeptQuery } from "@/hooks/networking/content/syllabus-dept";
import { useParams } from "react-router-dom";

export default function SyllabusBatch() {
  const { batch = "" } = useParams<{ batch: string }>();
  const { data, isPending, error, refetch } = useGetBatchSyllabus(batch);

  const departments = Array.isArray(data) ? data : [];

  return (
    <PageShell>
      <Breadcrumbs
        trail={[
          { label: "Home", href: APP_PATHS.HOME },
          { label: "Syllabus", href: APP_PATHS.SYLLABUS },
          { label: `Batch ${batch}` },
        ]}
      />

      <PageTitle
        icon={<SyllabusIcon className="h-8 w-8" />}
        title="Choose a department"
        meta={
          departments.length
            ? `Batch ${batch} · ${departments.length} departments`
            : `Batch ${batch}`
        }
      />

      {error ? (
        <ErrorComponent
          message={`Couldn't load the departments for batch ${batch}`}
          refreshFunc={() => refetch()}
        />
      ) : isPending ? (
        <IndexGridSkeleton
          rows={6}
          columns={3}
          withIcon
          label="Loading departments"
        />
      ) : departments.length === 0 ? (
        <EmptyState
          title="No departments listed"
          hint="Nothing has been published for this batch yet."
        />
      ) : (
        <IndexGrid columns={3}>
          {departments.map((item, index) => {
            const dept = item?.dept?.toLowerCase() ?? "";
            const isExternal = Boolean(item?.url);
            return (
              <RevealItem key={`${dept}-${index}`} index={index}>
                <NavigationLinkCard
                  label={item.dept}
                  url={item?.url}
                  path={APP_PATHS.SYLLABUS_BATCH_DEPT(batch, dept)}
                  isExternal={isExternal}
                  icon={
                    <FolderIcon className="h-8 w-8" hue={ICON_HUE.syllabus} />
                  }
                  prefetch={
                    isExternal ? undefined : syllabusDeptQuery(batch, dept)
                  }
                />
              </RevealItem>
            );
          })}
        </IndexGrid>
      )}

      <PageMark>
        <SyllabusIcon className="h-24 w-24" />
      </PageMark>
    </PageShell>
  );
}
