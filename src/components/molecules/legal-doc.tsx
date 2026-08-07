/* Hallmark · macrostructure: Index-First (prose variant) · design-system: design.md
 *
 * Shared furniture for the two legal documents. Privacy and Terms are the same
 * shape — a dated preamble, then numbered sections of prose — so the shape lives
 * here and each page carries only its text.
 *
 * Body copy is capped at 65ch: legal prose is the one place on this site where
 * someone reads full paragraphs, and a 3xl container measured edge to edge is
 * too wide a line to track.
 */

import AppLink from "@/components/atoms/links/app-link";
import {
  Breadcrumbs,
  PageShell,
  PageTitle,
} from "@/components/molecules/page-shell";
import { APP_PATHS } from "@/constants/path-config";
import { staggerStyle } from "@/lib/motion";
import type { ReactNode } from "react";

export type LegalSection = {
  heading: string;
  body: ReactNode;
};

export default function LegalDoc({
  title,
  updated,
  intro,
  sections,
  alsoRead,
}: {
  title: string;
  /** Rendered verbatim — a fixed date, not `new Date()`, so it means something. */
  updated: string;
  intro: ReactNode;
  sections: readonly LegalSection[];
  alsoRead: { label: string; href: string };
}) {
  return (
    <PageShell className="max-w-3xl">
      <Breadcrumbs
        trail={[{ label: "Home", href: APP_PATHS.HOME }, { label: title }]}
      />

      <PageTitle title={title} meta={`Last updated ${updated}`} />

      <div className="max-w-[65ch] space-y-md text-base leading-relaxed">
        {intro}
      </div>

      <div className="mt-2xl space-y-xl">
        {sections.map((section, index) => (
          <section
            key={section.heading}
            className="reveal max-w-[65ch] border-t border-rule pt-lg"
            style={staggerStyle(index)}
          >
            <div className="mb-sm flex items-baseline gap-sm">
              <span className="label-mono tabular">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2 className="text-base font-semibold">{section.heading}</h2>
            </div>

            <div className="space-y-sm text-sm leading-relaxed text-muted-foreground">
              {section.body}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-2xl text-sm text-muted-foreground">
        See also{" "}
        <AppLink to={alsoRead.href} className="link-accent inline font-medium">
          {alsoRead.label}
        </AppLink>
        .
      </p>
    </PageShell>
  );
}

/** Bulleted list, styled to match the surrounding prose. */
export function LegalList({ items }: { items: readonly ReactNode[] }) {
  return (
    <ul className="ml-md list-disc space-y-2xs">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
