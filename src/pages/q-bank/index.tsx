/* Hallmark · macrostructure: Index-First · design-system: design.md
 *
 * Every row here opens a Google Drive folder, so each is marked external. The
 * previous version used a router <Link> with target="_blank" for absolute URLs,
 * which asks the router to resolve a path it doesn't own.
 */

import NavigationLinkCard from "@/components/atoms/cards/navigation-link-card";
import {
  FolderIcon,
  ICON_HUE,
  LevelIcon,
  QBankIcon,
} from "@/components/atoms/icons/dimensional";
import PageMark from "@/components/molecules/page-mark";
import {
  Breadcrumbs,
  IndexGrid,
  PageShell,
  PageTitle,
  RevealItem,
} from "@/components/molecules/page-shell";
import { Q_BANK_FOLDERS } from "@/constants/content-config";
import { APP_PATHS } from "@/constants/path-config";

export default function QBankPage() {
  return (
    <PageShell>
      <Breadcrumbs
        trail={[
          { label: "Home", href: APP_PATHS.HOME },
          { label: "Question Bank" },
        ]}
      />

      <PageTitle
        icon={<QBankIcon className="h-8 w-8" />}
        title="Choose a level"
        meta="Past questions and solves · opens Google Drive"
      />

      <IndexGrid columns={2}>
        {Q_BANK_FOLDERS.map((folder, index) => (
          <RevealItem key={folder.id} index={index}>
            <NavigationLinkCard
              label={folder.label}
              path={folder.href}
              url={folder.href}
              isExternal
              icon={
                folder.count ? (
                  <LevelIcon
                    className="h-9 w-9"
                    count={folder.count}
                    hue={ICON_HUE.qbank}
                  />
                ) : (
                  <FolderIcon className="h-9 w-9" hue={ICON_HUE.qbank} />
                )
              }
            />
          </RevealItem>
        ))}
      </IndexGrid>

      <PageMark>
        <QBankIcon className="h-24 w-24" />
      </PageMark>
    </PageShell>
  );
}
