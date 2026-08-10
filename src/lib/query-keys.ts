/* Centralised query keys.
 *
 * Previously each hook inlined its own key, and three of them were wrong:
 * `labReportSubjectDetails` / `noteSubjectDetails` keyed only on `subject`, and
 * the topic hooks keyed only on `topic`. Level 1 and Level 3 both have a
 * "physics" subject, so they collided in the cache and served each other's
 * data. Keys now carry every argument the fetcher reads.
 */

export const queryKeys = {
  status: () => ["status"] as const,
  jokes: () => ["jokes"] as const,
  results: (limit?: number) => ["results", limit ?? null] as const,

  notes: {
    all: () => ["notes"] as const,
    level: (level: number | string) => ["notes", "level", String(level)] as const,
    subject: (level: number | string, subject: string) =>
      ["notes", "subject", String(level), subject] as const,
    topic: (level: number | string, subject: string, topic: string) =>
      ["notes", "topic", String(level), subject, topic] as const,
  },

  labs: {
    all: () => ["labs"] as const,
    level: (level: number | string) => ["labs", "level", String(level)] as const,
    subject: (level: number | string, subject: string) =>
      ["labs", "subject", String(level), subject] as const,
    topic: (level: number | string, subject: string, topic: string) =>
      ["labs", "topic", String(level), subject, topic] as const,
  },

  syllabus: {
    all: () => ["syllabus"] as const,
    root: () => ["syllabus", "root"] as const,
    batch: (batch: number | string) =>
      ["syllabus", "batch", String(batch)] as const,
    dept: (batch: number | string, dept: string) =>
      ["syllabus", "dept", String(batch), dept] as const,
  },
} as const;

/* How long each class of data stays fresh.
 *
 * The whole app previously ran on the default `staleTime: 0`, so every mount
 * refired every request — walking Notes → Level 2 → Physics → back re-fetched
 * the level list from scratch. These windows make navigation instant.
 */
export const STALE_TIME = {
  /** Note / lab / syllabus trees change a handful of times per semester. */
  content: 30 * 60 * 1000,
  /** Results get published during the term — worth re-checking. */
  results: 5 * 60 * 1000,
  /** Platform up/down badge. */
  status: 60 * 1000,
  /** Jokes are the point of asking again. Never cache. */
  volatile: 0,
} as const;

/* How long content survives in memory and in the persisted cache.
 *
 * This is the number that actually decides what a returning visitor sees, not the staleTime
 * above: with `refetchOnMount` and `refetchOnWindowFocus` both off, staleness alone never
 * triggers a refetch, so a cached tree is *served* for this long. At 24h a student could open
 * the app on three consecutive mornings and still be reading a label that changed on day one —
 * which is exactly what happened after a large content correction. Six hours keeps navigation
 * instant within a study session while guaranteeing at most a half-day of drift.
 */
export const GC_TIME = 6 * 60 * 60 * 1000;
