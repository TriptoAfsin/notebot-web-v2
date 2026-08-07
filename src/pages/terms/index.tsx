/* Hallmark · macrostructure: Index-First (prose variant) · design-system: design.md
 *
 * Terms of use. Scoped to what this site actually is — a free, contributed
 * archive with an AI answer tool over it — so the clauses that matter are
 * copyright/takedown, the TexGPT accuracy disclaimer, and availability. The
 * daily TexGPT allowance reads from APP_CONFIG so the number can't drift out of
 * sync with the composer.
 */

import LegalDoc, {
  LegalList,
  type LegalSection,
} from "@/components/molecules/legal-doc";
import { APP_CONFIG } from "@/constants/app-config";
import { APP_PATHS } from "@/constants/path-config";
import type { ReactNode } from "react";

const LAST_UPDATED = "August 7, 2026";

/** Inline external link, matching the prose treatment. See privacy/index.tsx. */
function Out({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="link-accent"
    >
      {children}
    </a>
  );
}

const SECTIONS: readonly LegalSection[] = [
  {
    heading: "What this site is",
    body: (
      <>
        <p>
          {APP_CONFIG.name} is a free, student-run archive of class notes, lab
          reports, question papers and syllabi for BUTEX students, plus TexGPT,
          an assistant that answers questions using that archive.
        </p>
        <p>
          It is an independent project. It is not an official service of BUTEX or
          any department, and it is not endorsed by or affiliated with the
          university. Nothing here is an official university record.
        </p>
      </>
    ),
  },
  {
    heading: "Using the archive",
    body: (
      <>
        <p>
          You may browse, download and share this material for your own study and
          for helping other students. In return, please don't:
        </p>
        <LegalList
          items={[
            "Sell, paywall or rebrand the archive as your own product.",
            "Scrape or automate requests at a volume that degrades the service for others.",
            "Attempt to break, overload or gain unauthorized access to the site or its API.",
            "Upload material you don't have the right to share.",
          ]}
        />
      </>
    ),
  },
  {
    heading: "Contributed content and copyright",
    body: (
      <>
        <p>
          Almost everything here was contributed by students. Copyright in each
          note, report or paper stays with whoever created it — uploading it to
          NoteBot does not transfer ownership, and it does not make the material
          ours.
        </p>
        <p>
          When you submit material you confirm you either created it or have
          permission to share it, and you allow us to publish it here for other
          students to read and download.
        </p>
        <p>
          If something of yours has been posted without permission, tell us and
          we will take it down. No lawyers required — see{" "}
          <span className="text-foreground">Contact</span> below.
        </p>
      </>
    ),
  },
  {
    heading: "TexGPT",
    body: (
      <>
        <p>
          TexGPT generates answers from the archive. It can be wrong, incomplete
          or out of date, and it can misread a source. Treat its answers as a
          starting point, check them against the underlying notes and your course
          material, and don't submit them as your own graded work.
        </p>
        <p>
          Use is limited to {APP_CONFIG.limit.texGpt} questions per day so the
          service stays available to everyone; the allowance resets daily. Don't
          use it to generate harmful content, and don't put personal or sensitive
          information into your questions.
        </p>
      </>
    ),
  },
  {
    heading: "Results, syllabi and other published data",
    body: (
      <p>
        Results, syllabi and routines shown here are mirrored from published
        sources for convenience. They can lag behind or contain errors. For
        anything that matters — eligibility, grades, deadlines — the official
        notice from your department is the authority, not this site.
      </p>
    ),
  },
  {
    heading: "Links to other services",
    body: (
      <p>
        Files are often hosted on third-party services such as Google Drive, and
        the site links out to the NoteBot Android app, the Messenger bot and
        other student tools. We don't control those services and aren't
        responsible for their content, availability or terms.
      </p>
    ),
  },
  {
    heading: "Availability",
    body: (
      <p>
        The site is provided as is, with no warranty of any kind. It's maintained
        by volunteers in their spare time: features may change, content may be
        added or removed, and the service may be unavailable without notice. We
        don't guarantee that anything you find here today will still be here
        tomorrow, so keep your own copies of what you need.
      </p>
    ),
  },
  {
    heading: "Liability",
    body: (
      <p>
        To the fullest extent permitted by law, the maintainers are not liable
        for any loss arising from your use of this site or the material on it —
        including academic outcomes based on incorrect notes, results or TexGPT
        answers. You use it at your own discretion.
      </p>
    ),
  },
  {
    heading: "Changes to these terms",
    body: (
      <p>
        These terms may be updated as the project changes. The date at the top
        reflects the latest revision, and continuing to use the site means you
        accept the current version.
      </p>
    ),
  },
  {
    heading: "Contact",
    body: (
      <p>
        Takedown requests, corrections and anything else:{" "}
        <Out href={APP_CONFIG.botLink}>message us on Messenger</Out> or reach{" "}
        <Out href={APP_CONFIG.founder.web}>{APP_CONFIG.founder.name}</Out>, who
        maintains the project. These terms are governed by the laws of
        Bangladesh.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalDoc
      title="Terms of Use"
      updated={LAST_UPDATED}
      intro={
        <>
          <p>
            {APP_CONFIG.name} is free to use and built on notes students share
            with each other. These terms set out the small number of rules that
            keep it that way.
          </p>
          <p>
            The short version: use the archive for study, credit and respect the
            people who wrote it, don't trust TexGPT blindly, and understand that
            a volunteer project comes with no guarantees.
          </p>
        </>
      }
      sections={SECTIONS}
      alsoRead={{ label: "our Privacy Policy", href: APP_PATHS.PRIVACY }}
    />
  );
}
