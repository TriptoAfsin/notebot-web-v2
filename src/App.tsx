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
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import RouteFallback from "@/components/molecules/route-fallback";
import { APP_PATHS } from "@/constants/path-config";

const FrontPage = lazy(() => import("@/pages/front-page"));
const AboutPage = lazy(() => import("@/pages/about"));
const NotesPage = lazy(() => import("@/pages/notes"));
const NoteLevels = lazy(() => import("@/pages/notes/levels/note-levels"));
const NoteSubjects = lazy(() => import("@/pages/notes/subjects/note-subjects"));
const NoteTopics = lazy(() => import("@/pages/notes/topics/note-topics"));
const LabReportsPage = lazy(() => import("@/pages/lab-reports"));
const LabLevels = lazy(() => import("@/pages/lab-reports/levels/lab-levels"));
const LabSubjects = lazy(
  () => import("@/pages/lab-reports/subjects/lab-subjects")
);
const LabTopics = lazy(() => import("@/pages/lab-reports/topics/lab-topics"));
const QBankPage = lazy(() => import("@/pages/q-bank"));
const SyllabusPage = lazy(() => import("@/pages/syllabus"));
const SyllabusBatch = lazy(() => import("@/pages/syllabus/batch/syllabus-batch"));
const SyllabusDept = lazy(() => import("@/pages/syllabus/dept/syllabus-dept"));
const ResultsPage = lazy(() => import("@/pages/results"));
const JokesPage = lazy(() => import("@/pages/jokes"));
const TexGptPage = lazy(() => import("@/pages/tex-gpt"));

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
                <Suspense fallback={<RouteFallback />}>
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
                  </Routes>
                </Suspense>
              </RouteTransition>
            </main>

            <Footer />
          </div>
        </BrowserRouter>
      </PersistQueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
