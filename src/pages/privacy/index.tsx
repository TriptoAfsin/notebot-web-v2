/* Hallmark · macrostructure: Index-First (prose variant) · design-system: design.md
 *
 * The privacy notice. Everything here is drawn from what the codebase actually
 * does — the Clarity tag in index.html, the localStorage keys the query cache and
 * the Tex-GPT history write, the daily-limit cookie, and the API the Tex-GPT
 * composer posts to. Nothing is claimed that the app doesn't do: there are no
 * accounts, so there is no account data to describe.
 */

import LegalDoc, {
  LegalList,
  type LegalSection,
} from "@/components/molecules/legal-doc";
import { APP_CONFIG } from "@/constants/app-config";
import { APP_PATHS } from "@/constants/path-config";
import type { ReactNode } from "react";

const LAST_UPDATED = "August 7, 2026";

const CLARITY_PRIVACY = "https://privacy.microsoft.com/privacystatement";

/**
 * Inline external link, matching the prose treatment.
 *
 * `link-accent` alone — pairing it with Tailwind's `text-accent` paints the text
 * in `--accent`, which in this system is `--c-paper-3`, a surface token. That
 * rendered links all but invisible against the dark page.
 */
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
    heading: "What we don't collect",
    body: (
      <>
        <p>
          {APP_CONFIG.name} has no accounts and no sign-up. We never ask you for
          a name, email address, phone number, student ID or password, and there
          is no profile attached to your browsing. You can read every note, lab
          report, question paper and syllabus here without identifying yourself.
        </p>
        <p>
          We don't sell or rent any data about you, and we don't run advertising
          or ad-tracking networks.
        </p>
      </>
    ),
  },
  {
    heading: "Analytics",
    body: (
      <>
        <p>
          We use Microsoft Clarity to understand how the site is used — which
          pages get opened, where people get stuck, and whether something is
          broken on a particular device. Clarity records page views, clicks,
          scrolling and similar interactions, along with your device type,
          browser, screen size and an approximate location derived from your IP
          address. It stores identifiers in your browser to recognize a returning
          session.
        </p>
        <p>
          We use this in aggregate to improve the site. Microsoft processes the
          data as described in the{" "}
          <Out href={CLARITY_PRIVACY}>Microsoft Privacy Statement</Out>.
        </p>
      </>
    ),
  },
  {
    heading: "What stays on your device",
    body: (
      <>
        <p>
          Some things are stored locally in your browser and are never sent to
          us:
        </p>
        <LegalList
          items={[
            "Your light / dark theme preference.",
            "A cached copy of the note, lab, syllabus and question-bank index, so the site opens instantly and keeps working offline.",
            "Your TexGPT conversation history — the questions and answers stay in your own browser storage.",
            "A small first-party cookie counting how many TexGPT questions you have asked today, so the daily allowance can reset.",
          ]}
        />
        <p>
          Clearing your browser's site data for this domain removes all of it,
          including your TexGPT history.
        </p>
      </>
    ),
  },
  {
    heading: "TexGPT",
    body: (
      <>
        <p>
          When you ask TexGPT a question, the text you type is sent to the
          NoteBot API, which searches the archive and generates an answer. The
          request is processed to produce your answer and to keep the service
          working — for example, rate limiting and diagnosing errors.
        </p>
        <p>
          Because your questions leave your device, please don't type personal or
          sensitive information into TexGPT. It is a study tool, not a private
          notebook.
        </p>
      </>
    ),
  },
  {
    heading: "Notes you submit",
    body: (
      <p>
        Submitting notes is optional and goes through an external Google Form. If
        you use it, whatever you enter in that form — including anything you
        choose to tell us about yourself — reaches us, and Google processes the
        submission under its own privacy terms. Files you contribute may be
        published in the archive for other students to download.
      </p>
    ),
  },
  {
    heading: "Links and files hosted elsewhere",
    body: (
      <p>
        Many notes, papers and syllabi are files hosted on third-party services
        such as Google Drive, and parts of the site link out to the NoteBot
        Android app, the Messenger bot and other student tools. Once you follow
        one of those links, you are on someone else's service and their privacy
        policy applies, not ours.
      </p>
    ),
  },
  {
    heading: "Your choices",
    body: (
      <LegalList
        items={[
          "Block or clear cookies and site data for this domain in your browser settings.",
          "Use your browser's private / incognito mode — nothing is kept once you close the window.",
          "Delete your TexGPT history from the chat panel, or by clearing site data.",
          "Simply avoid TexGPT and the submission form if you would rather send us nothing at all.",
        ]}
      />
    ),
  },
  {
    heading: "Changes to this notice",
    body: (
      <p>
        If what we collect changes, this page changes with it and the date at the
        top is updated. Continuing to use the site after a change means you
        accept the updated notice.
      </p>
    ),
  },
  {
    heading: "Contact",
    body: (
      <p>
        Questions about privacy, or a request to remove something you
        contributed? Reach us on{" "}
        <Out href={APP_CONFIG.botLink}>Messenger</Out> or through{" "}
        <Out href={APP_CONFIG.founder.web}>{APP_CONFIG.founder.name}</Out>, who
        maintains the project.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalDoc
      title="Privacy Policy"
      updated={LAST_UPDATED}
      intro={
        <>
          <p>
            {APP_CONFIG.name} is a free, student-run archive of BUTEX course
            material. This page explains, in plain terms, what happens to
            information when you use it.
          </p>
          <p>
            The short version: there are no accounts, we collect no personal
            details about you, and the only tracking on the site is aggregate
            usage analytics.
          </p>
        </>
      }
      sections={SECTIONS}
      alsoRead={{ label: "our Terms of Use", href: APP_PATHS.TERMS }}
    />
  );
}
