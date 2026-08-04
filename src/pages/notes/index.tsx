/* Hallmark · macrostructure: Index-First · design-system: design.md
 *
 * Level picker for notes. Same rows in the same order; the 🧒 👦 🧑 🧑‍🎓 emoji
 * are now <LevelIcon count>, which carries the same ordinal in the app's own
 * visual language. Hovering a row prefetches that level's subject list.
 */

import { LevelIcon, NotesIcon } from "@/components/atoms/icons/dimensional";
import NavigationLinkCard from "@/components/atoms/cards/navigation-link-card";
import PageMark from "@/components/molecules/page-mark";
import {
  Breadcrumbs,
  IndexGrid,
  PageShell,
  PageTitle,
  RevealItem,
} from "@/components/molecules/page-shell";
import { BUTEX_NOTES_ARCHIVE, LEVELS } from "@/constants/content-config";
import { APP_PATHS } from "@/constants/path-config";
import { noteLevelQuery } from "@/hooks/networking/content/note-level-details";

export default function NotesPage() {
  return (
    <PageShell>
      <Breadcrumbs
        trail={[
          { label: "Home", href: APP_PATHS.HOME },
          { label: "Notes" },
        ]}
      />

      <PageTitle
        icon={<NotesIcon className="h-8 w-8" />}
        title="Choose a level"
        meta="Class notes, by level and subject"
      />

      <IndexGrid columns={2}>
        {LEVELS.map((level, index) => (
          <RevealItem key={level.level} index={index}>
            <NavigationLinkCard
              label={level.label}
              path={`${APP_PATHS.NOTES}/${level.level}`}
              prefetch={noteLevelQuery(level.level)}
              icon={<LevelIcon className="h-9 w-9" count={level.count} />}
            />
          </RevealItem>
        ))}

        <RevealItem index={LEVELS.length}>
          <NavigationLinkCard
            label={BUTEX_NOTES_ARCHIVE.label}
            meta={BUTEX_NOTES_ARCHIVE.hint}
            path={BUTEX_NOTES_ARCHIVE.href}
            url={BUTEX_NOTES_ARCHIVE.href}
            isExternal
            icon={<NotesIcon className="h-9 w-9" />}
          />
        </RevealItem>
      </IndexGrid>

      <PageMark>
        <NotesIcon className="h-24 w-24" />
      </PageMark>
    </PageShell>
  );
}
