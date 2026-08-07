/* Hallmark · genre: modern-minimal · design-system: design.md · designed-as-app
 *
 * The shell. Route list and paths are unchanged; what changed:
 *  - PersistQueryClientProvider restores the cache from localStorage on boot, so
 *    a returning visitor sees their note tree immediately (and offline).
 *  - Every route is lazy, not just four of them — the eager imports were pulling
 *    all eleven browse pages into the initial bundle.
 *  - <RouteTransition> handles the crossfade where the View Transitions API
 *    isn't available.
 */

import Footer from "@/components/atoms/layout/footer";
import Header from "@/components/atoms/layout/header";
import RouteTransition from "@/components/motion/route-transition";
import { ThemeProvider } from "@/components/theme-provider";
import { persistOptions, queryClient } from "@/lib/query-client";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { lazy, Suspense, useEffect, useRef, type ReactNode } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import PwaUpdatePrompt from "@/components/molecules/pwa-update-prompt";
import RouteFallback from "@/components/molecules/route-fallback";
import { APP_PATHS } from "@/constants/path-config";
import { isRouteWarm, preloadRoute, ROUTE_CHUNKS } from "@/lib/route-chunks";

/* Imports come from ROUTE_CHUNKS rather than inline `import()` calls so the
 * preloader and `lazy()` share one module promise — see lib/route-chunks.ts. */
const FrontPage = lazy(ROUTE_CHUNKS.home);
const AboutPage = lazy(ROUTE_CHUNKS.about);
const NotesPage = lazy(ROUTE_CHUNKS.notes);
const NoteLevels = lazy(ROUTE_CHUNKS.noteLevels);
const NoteSubjects = lazy(ROUTE_CHUNKS.noteSubjects);
const NoteTopics = lazy(ROUTE_CHUNKS.noteTopics);
const LabReportsPage = lazy(ROUTE_CHUNKS.labReports);
const LabLevels = lazy(ROUTE_CHUNKS.labLevels);
const LabSubjects = lazy(ROUTE_CHUNKS.labSubjects);
const LabTopics = lazy(ROUTE_CHUNKS.labTopics);
const QBankPage = lazy(ROUTE_CHUNKS.qBank);
const SyllabusPage = lazy(ROUTE_CHUNKS.syllabus);
const SyllabusBatch = lazy(ROUTE_CHUNKS.syllabusBatch);
const SyllabusDept = lazy(ROUTE_CHUNKS.syllabusDept);
const ResultsPage = lazy(ROUTE_CHUNKS.results);
const JokesPage = lazy(ROUTE_CHUNKS.jokes);
const TexGptPage = lazy(ROUTE_CHUNKS.texGpt);
const PrivacyPage = lazy(ROUTE_CHUNKS.privacy);
const TermsPage = lazy(ROUTE_CHUNKS.terms);

/**
 * The route Suspense boundary, keyed by how the next route will actually load.
 *
 * React only keeps the old screen up for a boundary that ALREADY existed. That's
 * the whole bug: under react-router 7 navigation runs inside `startTransition`,
 * so a cold chunk leaves the previous page on screen with the URL already
 * changed. Giving the boundary a new key mounts a new one, which has no previous
 * content to preserve and must show its fallback immediately.
 *
 * But keying every navigation overcorrects. A warm route still suspends for the
 * microtask `lazy` takes to read its resolved payload, and inside a view
 * transition that's long enough to commit the fallback and animate to it — the
 * skeleton flashed on navigations that should have been seamless.
 *
 * So: a cold route gets a new key (its pathname), and a warm route KEEPS THE
 * CURRENT KEY, whatever it happens to be. Reusing it is the point — any change
 * of key, even to a shared constant, mounts a fresh boundary and brings the
 * fallback with it. The key is only an identity token, so it doesn't matter that
 * after a cold visit to /privacy the reused token reads "/privacy".
 *
 * The decision is frozen for the lifetime of a pathname, so a route can't
 * remount itself the moment its own chunk finishes loading.
 */
function RouteBoundary({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const decision = useRef<{ pathname: string; key: string } | null>(null);

  if (decision.current?.pathname !== pathname) {
    const currentKey = decision.current?.key;
    decision.current = {
      pathname,
      key: isRouteWarm(pathname) && currentKey ? currentKey : pathname,
    };
  }

  // Registers the route we're on as loaded, so coming back to it later counts
  // as warm even if it was never preloaded.
  useEffect(() => {
    preloadRoute(pathname);
  }, [pathname]);

  return (
    <Suspense
      key={decision.current.key}
      fallback={<RouteFallback pathname={pathname} />}
    >
      {children}
    </Suspense>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={persistOptions}
      >
        <BrowserRouter>
          {/* A flex column pins the footer to the bottom without the magic
              `calc(100vh - 100px)` the shell used to carry — that number never
              matched the real header + footer heights, which is where the strip
              of dead space under the footer came from. */}
          <div className="flex min-h-dvh flex-col">
            <Header />

            <main className="flex-1">
              <RouteTransition>
                <RouteBoundary>
                  <Routes>
                  <Route path={APP_PATHS.HOME} element={<FrontPage />} />
                  <Route path={APP_PATHS.ABOUT} element={<AboutPage />} />

                  <Route path={APP_PATHS.NOTES} element={<NotesPage />} />
                  <Route path="/notes/:level" element={<NoteLevels />} />
                  <Route
                    path="/notes/:level/:subName"
                    element={<NoteSubjects />}
                  />
                  <Route
                    path="/notes/:level/:subName/:topic"
                    element={<NoteTopics />}
                  />

                  <Route
                    path={APP_PATHS.LAB_REPORTS}
                    element={<LabReportsPage />}
                  />
                  <Route path="/lab-reports/:level" element={<LabLevels />} />
                  <Route
                    path="/lab-reports/:level/:subName"
                    element={<LabSubjects />}
                  />
                  <Route
                    path="/lab-reports/:level/:subName/:topic"
                    element={<LabTopics />}
                  />

                  <Route path={APP_PATHS.QBANKS} element={<QBankPage />} />

                  <Route path={APP_PATHS.SYLLABUS} element={<SyllabusPage />} />
                  <Route path="/syllabus/:batch" element={<SyllabusBatch />} />
                  <Route
                    path="/syllabus/:batch/:dept"
                    element={<SyllabusDept />}
                  />

                  <Route path={APP_PATHS.RESULTS} element={<ResultsPage />} />
                    <Route path={APP_PATHS.JOKES} element={<JokesPage />} />
                    <Route path={APP_PATHS.TEX_GPT} element={<TexGptPage />} />

                    <Route
                      path={APP_PATHS.PRIVACY}
                      element={<PrivacyPage />}
                    />
                    <Route path={APP_PATHS.TERMS} element={<TermsPage />} />
                  </Routes>
                </RouteBoundary>
              </RouteTransition>
            </main>

            <Footer />

            {/* Fixed to the viewport, so it sits outside the flex flow and can't
                shift page layout when it appears. */}
            <PwaUpdatePrompt />
          </div>
        </BrowserRouter>
      </PersistQueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
