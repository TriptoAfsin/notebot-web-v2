/* Hallmark · macrostructure: Index-First · design-system: design.md
 *
 * The endpoint returns either a list of syllabus entries or a single bare object.
 * That's normalised in the hook now, so this page renders one list — the old
 * version duplicated the whole card markup across an `Array.isArray` branch.
 */

import NavigationLinkCard from "@/components/atoms/cards/navigation-link-card";
import { SyllabusIcon } from "@/components/atoms/icons/dimensional";
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
import { useGetDeptSyllabus } from "@/hooks/networking/content/syllabus-dept";
import { useParams } from "react-router-dom";

export default function SyllabusDept() {
  const { batch = "", dept = "" } = useParams<{
    batch: string;
    dept: string;
  }>();
  const { data, isPending, error, refetch } = useGetDeptSyllabus(batch, dept);

  const entries = data ?? [];

  return (
    <PageShell>
      <Breadcrumbs
        trail={[
          { label: "Home", href: APP_PATHS.HOME },
          { label: "Syllabus", href: APP_PATHS.SYLLABUS },
          { label: `Batch ${batch}`, href: APP_PATHS.SYLLABUS_BATCH(batch) },
          { label: dept.toUpperCase() },
        ]}
      />

      <PageTitle
        icon={<SyllabusIcon className="h-8 w-8" />}
        title="Open the syllabus"
        meta={
          entries.length
            ? `${dept.toUpperCase()} · ${entries.length} ${entries.length === 1 ? "entry" : "entries"}`
            : dept.toUpperCase()
        }
      />

      {error ? (
        <ErrorComponent
          message="Couldn't load this syllabus"
          refreshFunc={() => refetch()}
        />
      ) : isPending ? (
        <IndexGridSkeleton rows={3} columns={3} withIcon label="Loading syllabus" />
      ) : entries.length === 0 ? (
        <EmptyState
          title="No syllabus published"
          hint="Nothing has been uploaded for this department yet."
        />
      ) : (
        <IndexGrid columns={3}>
          {entries.map((item, index) => (
            <RevealItem key={`${item.topic}-${index}`} index={index}>
              <NavigationLinkCard
                label={item.topic}
                url={item.url}
                path={item.url ?? "#"}
                isExternal={Boolean(item.url)}
                icon={<SyllabusIcon className="h-8 w-8" />}
              />
            </RevealItem>
          ))}
        </IndexGrid>
      )}

      <PageMark>
        <SyllabusIcon className="h-24 w-24" />
      </PageMark>
    </PageShell>
  );
}
