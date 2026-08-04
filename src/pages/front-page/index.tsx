/* Hallmark · macrostructure: Catalogue · theme: Cobalt (brand-anchored)
 * design-system: design.md · designed-as-app
 *
 * The launcher. Mark and wordmark on top, then the tile grid — now split into
 * two labelled sections (Study, then Extras) instead of one undifferentiated
 * run of ten. Tiles carry the authored 3D glyph set; the grid is explicitly
 * centred in a max-width track (it was drifting right on wide viewports); the
 * entrance is one staggered reveal rather than a whole-block slide.
 */

import BrandLogo from "@/components/atoms/brand-logo";
import IconLinkButton from "@/components/atoms/buttons/icon-link-button";
import { APP_CONFIG } from "@/constants/app-config";
import {
  LAUNCHER_ITEMS,
  LAUNCHER_SECTIONS,
  type LauncherSection,
} from "@/constants/content-config";
import { labLevelQuery } from "@/hooks/networking/content/lab-report-level-details";
import { noteLevelQuery } from "@/hooks/networking/content/note-level-details";
import { syllabusRootQuery } from "@/hooks/networking/content/syllabus";
import { staggerStyle } from "@/lib/motion";

/* Hovering a tile warms the page behind it, so the first browse screen usually
 * paints from cache. Only the routes that fetch on mount are listed. */
const PREFETCH = {
  notes: noteLevelQuery(1),
  "lab-reports": labLevelQuery(1),
  syllabus: syllabusRootQuery(),
} as const;

const ICON_SIZE = "h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]";

function itemsIn(section: LauncherSection) {
  return LAUNCHER_ITEMS.filter(item => item.section === section);
}

export default function FrontPage() {
  let revealIndex = 0;

  return (
    <div className="mx-auto w-full max-w-5xl px-md pb-2xl pt-xl md:px-lg">
      <div className="flex flex-col items-center">
        <BrandLogo className="h-24 w-24" width={96} height={96} />
        <h1 className="mt-sm font-display text-xl font-bold tracking-tight">
          {APP_CONFIG.name}
        </h1>
      </div>

      {LAUNCHER_SECTIONS.map(section => {
        const items = itemsIn(section.id);
        if (items.length === 0) return null;

        return (
          <section key={section.id} className="mt-xl">
            {/* hairline rule carries the section break; the label rides on it */}
            <div className="mb-md flex items-center gap-sm">
              <h2 className="label-mono">{section.label}</h2>
              <span aria-hidden="true" className="h-px flex-1 bg-rule" />
            </div>

            <div className="grid grid-cols-3 gap-md md:grid-cols-4 lg:grid-cols-6">
              {items.map(item => {
                const index = revealIndex++;
                return (
                  <div
                    key={item.id}
                    className="reveal min-w-0"
                    style={staggerStyle(index)}
                  >
                    <IconLinkButton
                      path={item.href}
                      label={item.title}
                      isExternal={item.isExternal}
                      prefetch={PREFETCH[item.id as keyof typeof PREFETCH]}
                      icon={<item.Icon className={ICON_SIZE} />}
                      labelClassName="text-sm"
                    />
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
