/* Hallmark · design-system: design.md
 *
 * One registry for every lazy route's import.
 *
 * The point is that `lazy()` in App.tsx and the preloader here call the SAME
 * import factory. A module's promise is cached after the first call, so warming
 * a chunk on hover and then rendering it on click costs exactly one fetch — the
 * click side finds the payload already resolved and renders without suspending.
 *
 * That matters because react-router 7 wraps navigation in `startTransition`, and
 * a transition deliberately suppresses Suspense fallbacks: when a route's chunk
 * isn't loaded yet, React keeps the CURRENT screen on display while history has
 * already moved on. The URL changes, the page doesn't. Warming the chunk before
 * the click is what removes that window.
 */

/** Every lazily-loaded route, keyed by name. */
export const ROUTE_CHUNKS = {
  home: () => import("@/pages/front-page"),
  about: () => import("@/pages/about"),
  privacy: () => import("@/pages/privacy"),
  terms: () => import("@/pages/terms"),
  settings: () => import("@/pages/settings"),
  notes: () => import("@/pages/notes"),
  noteLevels: () => import("@/pages/notes/levels/note-levels"),
  noteSubjects: () => import("@/pages/notes/subjects/note-subjects"),
  noteTopics: () => import("@/pages/notes/topics/note-topics"),
  labReports: () => import("@/pages/lab-reports"),
  labLevels: () => import("@/pages/lab-reports/levels/lab-levels"),
  labSubjects: () => import("@/pages/lab-reports/subjects/lab-subjects"),
  labTopics: () => import("@/pages/lab-reports/topics/lab-topics"),
  qBank: () => import("@/pages/q-bank"),
  syllabus: () => import("@/pages/syllabus"),
  syllabusBatch: () => import("@/pages/syllabus/batch/syllabus-batch"),
  syllabusDept: () => import("@/pages/syllabus/dept/syllabus-dept"),
  results: () => import("@/pages/results"),
  jokes: () => import("@/pages/jokes"),
  texGpt: () => import("@/pages/tex-gpt"),
} as const;

type ChunkName = keyof typeof ROUTE_CHUNKS;

/**
 * First path segment → the chunks for that branch, indexed by depth.
 *
 * The browse branches split into a separate chunk per level, so `/notes` and
 * `/notes/3/apparel` are different modules. This mirrors the <Route> table in
 * App.tsx; if a route is added there, add it here too — a miss costs a preload,
 * not correctness.
 */
const BRANCHES: Record<string, readonly ChunkName[]> = {
  notes: ["notes", "noteLevels", "noteSubjects", "noteTopics"],
  "lab-reports": ["labReports", "labLevels", "labSubjects", "labTopics"],
  syllabus: ["syllabus", "syllabusBatch", "syllabusDept"],
  about: ["about"],
  privacy: ["privacy"],
  terms: ["terms"],
  settings: ["settings"],
  "q-bank": ["qBank"],
  results: ["results"],
  jokes: ["jokes"],
  "tex-gpt": ["texGpt"],
};

function chunkFor(pathname: string): ChunkName | undefined {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return "home";

  const branch = BRANCHES[segments[0]];
  if (!branch) return undefined;

  // Deeper than the branch declares (a stray segment) still warms its last
  // known level rather than nothing.
  return branch[Math.min(segments.length - 1, branch.length - 1)];
}

/** Names whose import is in flight or done — the fetch must not be repeated. */
const started = new Set<ChunkName>();

/** Names whose module has actually arrived. */
const resolved = new Set<ChunkName>();

/**
 * Start fetching the chunk that will render `pathname`. Safe to call on every
 * pointer event: repeat calls for the same route are dropped, and a failed fetch
 * is forgotten so a later attempt can retry.
 */
export function preloadRoute(pathname: string): void {
  const name = chunkFor(pathname);
  if (!name || started.has(name)) return;

  started.add(name);
  void ROUTE_CHUNKS[name]().then(
    () => resolved.add(name),
    () => started.delete(name)
  );
}

/**
 * Is the chunk for `pathname` already in memory?
 *
 * This decides how the route's Suspense boundary is keyed. A warm route renders
 * without a meaningful pause, so it wants a stable boundary — React then holds
 * the outgoing screen for the microtask `lazy` needs and the view transition
 * crossfades straight to the new page. A cold route wants a fresh boundary, so
 * its fallback can appear instead of the screen sitting there looking stuck.
 */
export function isRouteWarm(pathname: string): boolean {
  const name = chunkFor(pathname);
  return !!name && resolved.has(name);
}

/**
 * Routes that are too expensive to fetch on spec.
 *
 * Tex-GPT drags in the markdown renderer and its highlighter — measured at about
 * 260 KiB on top of its own page chunk, against 1–2 KiB for a browse page. Idle
 * warming everything on the launcher was quietly downloading all of that for
 * visitors who only wanted their notes.
 *
 * This only gates SPECULATIVE warming. Hover, focus and touchstart still preload
 * it: by then there's real intent and the fetch is about to be needed anyway.
 */
const TOO_HEAVY_TO_GUESS: ReadonlySet<ChunkName> = new Set(["texGpt"]);

type SavingConnection = {
  saveData?: boolean;
  effectiveType?: string;
};

/** Don't spend someone's data budget speculatively. */
function shouldSkipSpeculativeWork(): boolean {
  const connection = (navigator as Navigator & { connection?: SavingConnection })
    .connection;
  if (!connection) return false;
  return (
    connection.saveData === true || /(^|-)2g$/.test(connection.effectiveType ?? "")
  );
}

/**
 * Warm several routes once the browser is idle.
 *
 * Hover and focus cover the pointer; this covers touch, where there is no hover
 * and the ~100ms between touchstart and click is far too short to hide a cold
 * fetch. The browse pages are a few hundred bytes each over a shared
 * implementation, so warming them is close to free — but anything in
 * TOO_HEAVY_TO_GUESS is left for a real gesture to ask for.
 *
 * Returns a cancel function.
 */
export function preloadRoutesWhenIdle(paths: readonly string[]): () => void {
  if (typeof window === "undefined" || shouldSkipSpeculativeWork()) {
    return () => {};
  }

  const cheap = paths.filter(path => {
    const name = chunkFor(path);
    return name && !TOO_HEAVY_TO_GUESS.has(name);
  });

  const warmAll = () => cheap.forEach(preloadRoute);

  // requestIdleCallback is still missing in Safari; the timeout is the fallback.
  if (typeof window.requestIdleCallback === "function") {
    const handle = window.requestIdleCallback(warmAll, { timeout: 2000 });
    return () => window.cancelIdleCallback?.(handle);
  }

  const timer = window.setTimeout(warmAll, 1200);
  return () => window.clearTimeout(timer);
}
