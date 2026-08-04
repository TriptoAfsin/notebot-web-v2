/* Hallmark · design-system: design.md
 *
 * One source of truth for the app's destinations.
 *
 * The launcher tiles, the four level lists, and the Q-Bank drive links used to
 * be re-declared inside every page that showed them (and the level labels were
 * emoji, which the design system bans as iconography). Consolidating them here
 * means the pages, the breadcrumbs and the ⌘K palette can never drift apart.
 */

import {
  ConverterIcon,
  JokesIcon,
  LabReportsIcon,
  NotesIcon,
  PhoneBookIcon,
  QBankIcon,
  ResultsIcon,
  SubmitIcon,
  SyllabusIcon,
} from "@/components/atoms/icons/dimensional";
import TexGptMark from "@/components/atoms/icons/tex-gpt-mark";
import type { ReactElement } from "react";
import { APP_CONFIG } from "./app-config";
import { APP_PATHS } from "./path-config";

// React 19's types no longer expose a global `JSX` namespace.
export type DimensionalIcon = (props: {
  className?: string;
  title?: string;
}) => ReactElement;

/** Which launcher section a tile belongs to. */
export type LauncherSection = "study" | "extras";

export type LauncherItem = {
  id: string;
  title: string;
  /** Short line used by the ⌘K palette, never rendered on the tile. */
  hint: string;
  href: string;
  Icon: DimensionalIcon;
  section: LauncherSection;
  isExternal?: boolean;
};

export const LAUNCHER_ITEMS: readonly LauncherItem[] = [
  /* --- Section 1 · Study ------------------------------------------------ */
  {
    id: "notes",
    title: "Notes",
    hint: "Class notes by level and subject",
    href: APP_PATHS.NOTES,
    Icon: NotesIcon,
    section: "study",
  },
  {
    id: "lab-reports",
    title: "Lab Reports",
    hint: "Lab reports by level and subject",
    href: APP_PATHS.LAB_REPORTS,
    Icon: LabReportsIcon,
    section: "study",
  },
  {
    id: "q-bank",
    title: "Q-Bank",
    hint: "Past questions and solves",
    href: APP_PATHS.QBANKS,
    Icon: QBankIcon,
    section: "study",
  },
  {
    id: "syllabus",
    title: "Syllabus",
    hint: "Syllabus by batch and department",
    href: APP_PATHS.SYLLABUS,
    Icon: SyllabusIcon,
    section: "study",
  },
  {
    id: "results",
    title: "Results",
    hint: "Latest published results",
    href: APP_PATHS.RESULTS,
    Icon: ResultsIcon,
    section: "study",
  },
  {
    id: "tex-gpt",
    title: "Tex-GPT",
    hint: "Ask questions about textiles",
    href: APP_PATHS.TEX_GPT,
    Icon: TexGptMark,
    section: "study",
  },
  {
    id: "submit",
    title: "Submit Notes",
    hint: "Contribute your own notes",
    href: APP_CONFIG.submitLink,
    Icon: SubmitIcon,
    section: "study",
    isExternal: true,
  },

  /* --- Section 2 · Extras ---------------------------------------------- */
  {
    id: "phone-book",
    title: "Phone Book",
    hint: "BUTEX contact directory",
    href: "https://triptoafsin.github.io/butex-phonebook-v2/",
    Icon: PhoneBookIcon,
    section: "extras",
    isExternal: true,
  },
  {
    id: "count-koto",
    title: "Count Koto",
    hint: "Textile count converter",
    href: "https://triptoafsin.github.io/CountKoto-/",
    Icon: ConverterIcon,
    section: "extras",
    isExternal: true,
  },
  {
    id: "jokes",
    title: "Jokes",
    hint: "One-liners, on demand",
    href: APP_PATHS.JOKES,
    Icon: JokesIcon,
    section: "extras",
  },
] as const;

/** Section headings for the launcher. */
export const LAUNCHER_SECTIONS: ReadonlyArray<{
  id: LauncherSection;
  label: string;
}> = [
  { id: "study", label: "Study" },
  { id: "extras", label: "Extras" },
] as const;

/* -------------------------------------------------------------------------
 * Levels
 *
 * `count` drives the <LevelIcon>, so Level 3 literally renders three stacked
 * slabs. That's the replacement for 🧒 👦 🧑 🧑‍🎓 — same ordinal signal, but
 * it's part of the typographic system instead of the OS emoji font.
 * ----------------------------------------------------------------------- */

export type Level = {
  level: 1 | 2 | 3 | 4;
  label: string;
  count: 1 | 2 | 3 | 4;
};

export const LEVELS: readonly Level[] = [
  { level: 1, label: "Level 1", count: 1 },
  { level: 2, label: "Level 2", count: 2 },
  { level: 3, label: "Level 3", count: 3 },
  { level: 4, label: "Level 4", count: 4 },
] as const;

/** The one external note archive linked from the Notes index. */
export const BUTEX_NOTES_ARCHIVE = {
  label: "BUTEX Notes archive",
  hint: "Community archive on GitHub",
  href: "https://github.com/itachi-re/butex-notes",
} as const;

/* -------------------------------------------------------------------------
 * Q-Bank — Drive folders, one per level plus the solves folder.
 * ----------------------------------------------------------------------- */

export type QBankFolder = {
  id: string;
  label: string;
  href: string;
  /** Level count for the layers mark; the solves folder has none. */
  count?: 1 | 2 | 3 | 4;
};

export const Q_BANK_FOLDERS: readonly QBankFolder[] = [
  {
    id: "qb-1",
    label: "Level 1",
    count: 1,
    href: "https://drive.google.com/drive/folders/1Fu7l9FBq3gdWUKNnTix6RibLvy3e25Ra?usp=sharing",
  },
  {
    id: "qb-2",
    label: "Level 2",
    count: 2,
    href: "https://drive.google.com/drive/folders/1KZvgEL3f1kDY54H5Ha218l7yZfPn6jM6?usp=sharing",
  },
  {
    id: "qb-3",
    label: "Level 3",
    count: 3,
    href: "https://drive.google.com/drive/folders/1mbygPQPSEDkP6NoRxJxJATWI8aBgzxsZ?usp=sharing",
  },
  {
    id: "qb-4",
    label: "Level 4",
    count: 4,
    href: "https://drive.google.com/drive/folders/17QQ6mXUYe3FL7sf4VMzdBBkRbJAId0VT?usp=sharing",
  },
  {
    id: "qb-solves",
    label: "QB Solves",
    href: "https://drive.google.com/drive/folders/1hvldnZCyOX412pBbdElbRvh33o7uqg2R?usp=sharing",
  },
] as const;
