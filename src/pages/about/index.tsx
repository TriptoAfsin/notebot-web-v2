/* Hallmark · macrostructure: Index-First (content variant) · design-system: design.md
 *
 * This page still carried the Vite scaffold's copy — "About React + TypeScript +
 * Vite + Tailwind CSS + Redux Toolkit" — and Redux isn't even a dependency any
 * more. Rewritten with what the codebase actually knows: what NoteBot is, where
 * else it runs, and who maintains it. No invented numbers.
 */

import { NotesIcon } from "@/components/atoms/icons/dimensional";
import NavigationLinkCard from "@/components/atoms/cards/navigation-link-card";
import {
  Breadcrumbs,
  IndexGrid,
  PageShell,
  PageTitle,
  RevealItem,
} from "@/components/molecules/page-shell";
import { APP_CONFIG } from "@/constants/app-config";
import { APP_PATHS } from "@/constants/path-config";

const ELSEWHERE = [
  {
    label: "NoteBot on Google Play",
    meta: "The Android app",
    href: APP_CONFIG.appLink,
  },
  {
    label: "NoteBot on Messenger",
    meta: "Ask for notes in chat",
    href: APP_CONFIG.botLink,
  },
  {
    label: "Submit your notes",
    meta: "Add to the archive",
    href: APP_CONFIG.submitLink,
  },
  {
    label: APP_CONFIG.founder.name,
    meta: "Maintainer",
    href: APP_CONFIG.founder.web,
  },
] as const;

export default function AboutPage() {
  return (
    <PageShell className="max-w-3xl">
      <Breadcrumbs
        trail={[{ label: "Home", href: APP_PATHS.HOME }, { label: "About" }]}
      />

      <PageTitle
        icon={<NotesIcon className="h-8 w-8" />}
        title={`About ${APP_CONFIG.name}`}
      />

      <div className="max-w-[65ch] space-y-md text-base leading-relaxed">
        <p>
          NoteBot collects the class notes, lab reports, question papers and
          syllabi that BUTEX students actually pass between each other, and puts
          them in one place you can search.
        </p>
        <p>
          Everything here is contributed. If you have notes that helped you, add
          them — the next batch gets them too.
        </p>
      </div>

      <h2 className="label-mono mb-sm mt-2xl">Elsewhere</h2>

      <IndexGrid columns={2}>
        {ELSEWHERE.map((item, index) => (
          <RevealItem key={item.href} index={index}>
            <NavigationLinkCard
              label={item.label}
              meta={item.meta}
              path={item.href}
              url={item.href}
              isExternal
            />
          </RevealItem>
        ))}
      </IndexGrid>
    </PageShell>
  );
}
