/* Hallmark · macrostructure: Index-First · design-system: design.md
 *
 * The six browse pages under /notes and /lab-reports were near-identical copies
 * of each other — same breadcrumb block, same search row, same grid, same three
 * empty states, differing only in labels and which field the API item uses for
 * its name. They're one component per depth now, parameterised by kind.
 *
 * Behaviour changes that came with the consolidation:
 *  - the level is read from useParams(), not `pathname.split("/").pop()`, which
 *    silently returned the wrong segment on the deeper routes
 *  - the search filter runs through useDeferredValue, so typing stays responsive
 *    on a long subject list
 *  - the loading skeleton matches the real grid, so nothing re-flows on arrival
 *  - rows prefetch their destination on hover/focus
 */

import NavigationLinkCard from "@/components/atoms/cards/navigation-link-card";
import {
  FolderIcon,
  ICON_HUE,
  LabReportsIcon,
  NotesIcon,
} from "@/components/atoms/icons/dimensional";
import SearchBox from "@/components/atoms/inputs/search-box";
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
  type Crumb,
} from "@/components/molecules/page-shell";
import { APP_PATHS } from "@/constants/path-config";
import {
  labSubjectQuery,
  useGetLabReportSubjectDetails,
} from "@/hooks/networking/content/lab-report-subject-details";
import { useGetLabReportSubjectTopicDetails } from "@/hooks/networking/content/lab-report-topic-details";
import { useGetLabReportLevelDetails } from "@/hooks/networking/content/lab-report-level-details";
import {
  noteSubjectQuery,
  useGetNoteSubjectDetails,
} from "@/hooks/networking/content/note-subject-details";
import { useGetNoteSubjectTopicDetails } from "@/hooks/networking/content/note-topic-details";
import { useGetNoteLevelDetails } from "@/hooks/networking/content/note-level-details";
import { SearchX } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

export type ContentKind = "notes" | "labs";

const KINDS = {
  notes: {
    label: "Notes",
    root: APP_PATHS.NOTES,
    hue: ICON_HUE.notes,
    Icon: NotesIcon,
    noun: "notes",
  },
  labs: {
    label: "Lab Reports",
    root: APP_PATHS.LAB_REPORTS,
    hue: ICON_HUE.labs,
    Icon: LabReportsIcon,
    noun: "lab reports",
  },
} as const;

/* -- Level → subjects ---------------------------------------------------- */

export function LevelSubjectsIndex({ kind }: { kind: ContentKind }) {
  const meta = KINDS[kind];
  const { level = "" } = useParams<{ level: string }>();

  const notes = useGetNoteLevelDetails(kind === "notes" ? level : "");
  const labs = useGetLabReportLevelDetails(kind === "labs" ? level : "");
  const query = kind === "notes" ? notes : labs;

  const [searchTerm, setSearchTerm] = useState("");
  // keeps keystrokes responsive while a long list re-filters
  const deferredSearch = useDeferredValue(searchTerm);

  const subjects = useMemo(
    () => (Array.isArray(query.data) ? query.data : []),
    [query.data]
  );

  const filtered = useMemo(() => {
    const needle = deferredSearch.trim().toLowerCase();
    if (!needle) return subjects;
    return subjects.filter(item =>
      (item.subName || "").toLowerCase().includes(needle)
    );
  }, [subjects, deferredSearch]);

  const trail: Crumb[] = [
    { label: "Home", href: APP_PATHS.HOME },
    { label: meta.label, href: meta.root },
    { label: `Level ${level}` },
  ];

  return (
    <PageShell>
      <Breadcrumbs trail={trail} />

      <PageTitle
        icon={<meta.Icon className="h-8 w-8" />}
        title="Choose a subject"
        meta={
          subjects.length
            ? `Level ${level} · ${subjects.length} subjects`
            : `Level ${level}`
        }
      >
        <div className="mt-2xs w-full max-w-sm">
          <SearchBox
            name={`${kind}-subject-search`}
            label="Search subjects"
            placeholder="Search subjects…"
            onSubmit={setSearchTerm}
            onChange={setSearchTerm}
            onClear={() => setSearchTerm("")}
            disabled={query.isPending}
          />
        </div>
      </PageTitle>

      {query.error ? (
        <ErrorComponent
          message={`Couldn't load ${meta.noun} for level ${level}`}
          refreshFunc={() => query.refetch()}
        />
      ) : query.isPending ? (
        <IndexGridSkeleton rows={6} columns={3} withIcon label="Loading subjects" />
      ) : !subjects.length ? (
        <EmptyState
          title={`No ${meta.noun} for level ${level} yet`}
          hint="Nothing has been uploaded for this level. Try another level, or submit your own."
        />
      ) : !filtered.length ? (
        <EmptyState
          title="No subjects match your search"
          icon={<SearchX className="h-5 w-5" aria-hidden="true" />}
          hint={`Nothing matches “${searchTerm.trim()}”.`}
          action={{ label: "Clear search", onClick: () => setSearchTerm("") }}
        />
      ) : (
        <>
          {/* announced once per settled filter, not per keystroke */}
          <p className="sr-only" aria-live="polite">
            {filtered.length} subjects
          </p>
          <IndexGrid columns={3}>
            {filtered.map((item, index) => {
              const subject = item?.route?.split("/").pop() || "";
              const isExternal = Boolean(item?.url);
              return (
                <RevealItem key={`${subject}-${index}`} index={index}>
                  <NavigationLinkCard
                    label={item.subName}
                    url={item?.url}
                    path={`${meta.root}/${level}/${subject}`}
                    isExternal={isExternal}
                    icon={<FolderIcon className="h-8 w-8" hue={meta.hue} />}
                    prefetch={
                      isExternal
                        ? undefined
                        : kind === "notes"
                          ? noteSubjectQuery(level, subject)
                          : labSubjectQuery(level, subject)
                    }
                  />
                </RevealItem>
              );
            })}
          </IndexGrid>
        </>
      )}

      <PageMark>
        <meta.Icon className="h-24 w-24" />
      </PageMark>
    </PageShell>
  );
}

/* -- Subject → topics ---------------------------------------------------- */

export function SubjectTopicsIndex({ kind }: { kind: ContentKind }) {
  const meta = KINDS[kind];
  const { level = "", subName = "" } = useParams<{
    level: string;
    subName: string;
  }>();

  const notes = useGetNoteSubjectDetails(
    kind === "notes" ? level : "",
    kind === "notes" ? subName : ""
  );
  const labs = useGetLabReportSubjectDetails(
    kind === "labs" ? level : "",
    kind === "labs" ? subName : ""
  );
  const query = kind === "notes" ? notes : labs;

  const topics = useMemo(
    () => (Array.isArray(query.data) ? query.data : []),
    [query.data]
  );

  const trail: Crumb[] = [
    { label: "Home", href: APP_PATHS.HOME },
    { label: meta.label, href: meta.root },
    { label: `Level ${level}`, href: `${meta.root}/${level}` },
    { label: subName.replace(/-/g, " ") },
  ];

  return (
    <PageShell>
      <Breadcrumbs trail={trail} />

      <PageTitle
        icon={<meta.Icon className="h-8 w-8" />}
        title="Choose a topic"
        meta={
          topics.length
            ? `${subName.replace(/-/g, " ")} · ${topics.length} topics`
            : subName.replace(/-/g, " ")
        }
      />

      {query.error ? (
        <ErrorComponent
          message="Couldn't load the topics for this subject"
          refreshFunc={() => query.refetch()}
        />
      ) : query.isPending ? (
        <IndexGridSkeleton rows={6} columns={3} withIcon label="Loading topics" />
      ) : !topics.length ? (
        <EmptyState
          title="No topics here yet"
          hint={`Nothing has been uploaded for this subject.`}
        />
      ) : (
        <IndexGrid columns={3}>
          {topics.map((item, index) => {
            const topicSlug = item?.route?.split("/").pop() || "";
            const isExternal = Boolean(item?.url);
            return (
              <RevealItem key={`${topicSlug}-${index}`} index={index}>
                <NavigationLinkCard
                  label={item.topic}
                  url={item?.url}
                  path={`${meta.root}/${level}/${subName}/${topicSlug}`}
                  isExternal={isExternal}
                  icon={<FolderIcon className="h-8 w-8" hue={meta.hue} />}
                />
              </RevealItem>
            );
          })}
        </IndexGrid>
      )}

      <PageMark>
        <meta.Icon className="h-24 w-24" />
      </PageMark>
    </PageShell>
  );
}

/* -- Topic → files ------------------------------------------------------- */

export function TopicFilesIndex({ kind }: { kind: ContentKind }) {
  const meta = KINDS[kind];
  const {
    level = "",
    subName = "",
    topic = "",
  } = useParams<{ level: string; subName: string; topic: string }>();

  const notes = useGetNoteSubjectTopicDetails(
    kind === "notes" ? level : "",
    kind === "notes" ? subName : "",
    kind === "notes" ? topic : ""
  );
  const labs = useGetLabReportSubjectTopicDetails(
    kind === "labs" ? level : "",
    kind === "labs" ? subName : "",
    kind === "labs" ? topic : ""
  );
  const query = kind === "notes" ? notes : labs;

  const files = useMemo(
    () => (Array.isArray(query.data) ? query.data : []),
    [query.data]
  );

  const trail: Crumb[] = [
    { label: "Home", href: APP_PATHS.HOME },
    { label: meta.label, href: meta.root },
    { label: `Level ${level}`, href: `${meta.root}/${level}` },
    { label: subName.replace(/-/g, " "), href: `${meta.root}/${level}/${subName}` },
    { label: topic.replace(/-/g, " ") },
  ];

  return (
    <PageShell>
      <Breadcrumbs trail={trail} />

      <PageTitle
        icon={<meta.Icon className="h-8 w-8" />}
        title={kind === "notes" ? "Open a note" : "Open a report"}
        meta={
          files.length
            ? `${topic.replace(/-/g, " ")} · ${files.length} files`
            : topic.replace(/-/g, " ")
        }
      />

      {query.error ? (
        <ErrorComponent
          message={`Couldn't load the ${meta.noun} for this topic`}
          refreshFunc={() => query.refetch()}
        />
      ) : query.isPending ? (
        <IndexGridSkeleton rows={6} columns={3} withIcon label="Loading files" />
      ) : !files.length ? (
        <EmptyState
          title="Nothing here yet"
          hint={`No ${meta.noun} have been uploaded for this topic.`}
        />
      ) : (
        <IndexGrid columns={3}>
          {files.map((item, index) => (
            <RevealItem key={`${item.title}-${index}`} index={index}>
              <NavigationLinkCard
                label={item.title}
                url={item?.url}
                // every leaf here is a hosted file, so it always leaves the app
                path={item?.url ?? "#"}
                isExternal
                icon={<meta.Icon className="h-8 w-8" />}
              />
            </RevealItem>
          ))}
        </IndexGrid>
      )}

      <PageMark>
        <meta.Icon className="h-24 w-24" />
      </PageMark>
    </PageShell>
  );
}
