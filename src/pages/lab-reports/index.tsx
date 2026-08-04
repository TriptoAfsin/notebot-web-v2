/* Hallmark · macrostructure: Index-First · design-system: design.md */

import NavigationLinkCard from "@/components/atoms/cards/navigation-link-card";
import {
  ICON_HUE,
  LabReportsIcon,
  LevelIcon,
} from "@/components/atoms/icons/dimensional";
import PageMark from "@/components/molecules/page-mark";
import {
  Breadcrumbs,
  IndexGrid,
  PageShell,
  PageTitle,
  RevealItem,
} from "@/components/molecules/page-shell";
import { LEVELS } from "@/constants/content-config";
import { APP_PATHS } from "@/constants/path-config";
import { labLevelQuery } from "@/hooks/networking/content/lab-report-level-details";

export default function LabReportsPage() {
  return (
    <PageShell>
      <Breadcrumbs
        trail={[
          { label: "Home", href: APP_PATHS.HOME },
          { label: "Lab Reports" },
        ]}
      />

      <PageTitle
        icon={<LabReportsIcon className="h-8 w-8" />}
        title="Choose a level"
        meta="Lab reports, by level and subject"
      />

      <IndexGrid columns={2}>
        {LEVELS.map((level, index) => (
          <RevealItem key={level.level} index={index}>
            <NavigationLinkCard
              label={level.label}
              path={APP_PATHS.LAB_REPORTS_LEVELS(String(level.level))}
              prefetch={labLevelQuery(level.level)}
              icon={
                <LevelIcon
                  className="h-9 w-9"
                  count={level.count}
                  hue={ICON_HUE.labs}
                />
              }
            />
          </RevealItem>
        ))}
      </IndexGrid>

      <PageMark>
        <LabReportsIcon className="h-24 w-24" />
      </PageMark>
    </PageShell>
  );
}
