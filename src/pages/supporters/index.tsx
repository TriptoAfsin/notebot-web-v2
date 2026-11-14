/* Hallmark · macrostructure: Index-First (content variant) · design-system: design.md
 *
 * The supporters wall promised by the NoteBot Supporter Pack. One card,
 * typography only, like /about and /jokes. Names live in constants/supporters.ts.
 */

import { NotesIcon } from "@/components/atoms/icons/dimensional";
import {
  Breadcrumbs,
  PageShell,
  PageTitle,
} from "@/components/molecules/page-shell";
import { APP_CONFIG } from "@/constants/app-config";
import { APP_PATHS } from "@/constants/path-config";
import { SUPPORTER_PACK_URL, SUPPORTERS } from "@/constants/supporters";

const MONTH = new Intl.DateTimeFormat("en", { month: "short", year: "numeric" });

function formatSince(since: string) {
  const [year, month] = since.split("-").map(Number);
  if (!year || !month) return since;
  return MONTH.format(new Date(year, month - 1, 1));
}

export default function SupportersPage() {
  const named = SUPPORTERS.filter(s => !s.anonymous);
  const anonymous = SUPPORTERS.length - named.length;

  return (
    <PageShell className="max-w-3xl">
      <Breadcrumbs
        trail={[
          { label: "Home", href: APP_PATHS.HOME },
          { label: "Supporters" },
        ]}
      />

      <PageTitle
        icon={<NotesIcon className="h-8 w-8" />}
        title="Supported by"
        meta={
          SUPPORTERS.length > 0
            ? `${SUPPORTERS.length} ${SUPPORTERS.length === 1 ? "supporter" : "supporters"}`
            : undefined
        }
      />

      <div className="max-w-[65ch] space-y-md text-base leading-relaxed">
        <p>
          NoteBot has never charged a student, and it never will. Servers, bots
          and app store fees are paid by the people on this page.
        </p>
      </div>

      <div className="surface mt-lg p-lg">
        {named.length > 0 ? (
          <ul className="grid grid-cols-[minmax(0,1fr)] gap-x-lg gap-y-sm sm:grid-cols-[repeat(2,minmax(0,1fr))]">
            {named.map(s => (
              <li
                key={`${s.name}-${s.since}`}
                className="flex min-w-0 items-baseline justify-between gap-sm border-b border-rule pb-xs"
              >
                <span className="truncate font-medium text-foreground">
                  {s.name}
                </span>
                <span className="label-mono tabular shrink-0">
                  {formatSince(s.since)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">
            No names here yet. The first supporter gets the top spot.
          </p>
        )}
        {anonymous > 0 ? (
          <p className="label-mono mt-md">
            And {anonymous} who chose to stay anonymous
          </p>
        ) : null}
      </div>

      <div className="mt-lg max-w-[65ch] space-y-sm text-sm text-muted-foreground">
        <p>
          Want your name here? Pick up the NoteBot Supporter Pack on{" "}
          <a
            href={SUPPORTER_PACK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="affordance link-accent font-medium"
          >
            SupportKori
          </a>{" "}
          (in taka), or back NoteBot on{" "}
          <a
            href={APP_CONFIG.support.patreon}
            target="_blank"
            rel="noopener noreferrer"
            className="affordance link-accent font-medium"
          >
            Patreon
          </a>
          . Then email the name you want shown to{" "}
          <a
            href={`mailto:${APP_CONFIG.supportEmail}`}
            className="affordance link-accent font-medium"
          >
            {APP_CONFIG.supportEmail}
          </a>
          .
        </p>
      </div>
    </PageShell>
  );
}
