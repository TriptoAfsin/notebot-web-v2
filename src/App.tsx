import { Box } from "@/components/atoms/layout";
import Footer from "@/components/atoms/layout/footer";
import Header from "@/components/atoms/layout/header";
import { Spinner } from "@/components/atoms/spinner/spinner";
import AboutPage from "@/pages/about";
import FrontPage from "@/pages/front-page";
import ResultsPage from "@/pages/results";
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import LabReportsPage from "@/pages/lab-reports";
import NotesPage from "@/pages/notes";
import SyllabusBatch from "@/pages/syllabus/batch/syllabus-batch";
import SyllabusDept from "@/pages/syllabus/dept/syllabus-dept";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LabLevels from "./pages/lab-reports/levels/lab-levels";
import LabSubjects from "./pages/lab-reports/subjects/lab-subjects";
import LabTopics from "./pages/lab-reports/topics/lab-topics";
import NoteLevels from "./pages/notes/levels/note-levels";
import NoteSubjects from "./pages/notes/subjects/note-subjects";
import NoteTopics from "./pages/notes/topics/note-topics";

// Lazy load the QBankPage
const QBankPage = lazy(() => import("@/pages/q-bank"));
const SyllabusPage = lazy(() => import("@/pages/syllabus"));
const JokesPage = lazy(() => import("@/pages/jokes"));

// Create a client
const queryClient = new QueryClient();

import { ThemeProvider } from "@/components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Header />
          <Box className="min-h-[calc(100vh-100px)]">
            <Suspense fallback={<Spinner className={`text-[#377fcc]`} />}>
              <Routes>
                <Route path="/" element={<FrontPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/q-bank" element={<QBankPage />} />
                <Route path="/syllabus" element={<SyllabusPage />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/jokes" element={<JokesPage />} />
                <Route path="/notes" element={<NotesPage />} />
                <Route path="/notes/:level" element={<NoteLevels />} />
                <Route
                  path="/notes/:level/:subName"
                  element={<NoteSubjects />}
                />
                <Route
                  path="/notes/:level/:subName/:topic"
                  element={<NoteTopics />}
                />

                <Route path="/lab-reports" element={<LabReportsPage />} />
                <Route path="/lab-reports/:level" element={<LabLevels />} />
                <Route
                  path="/lab-reports/:level/:subName"
                  element={<LabSubjects />}
                />
                <Route
                  path="/lab-reports/:level/:subName/:topic"
                  element={<LabTopics />}
                />

                <Route path="/syllabus/:batch" element={<SyllabusBatch />} />
                <Route
                  path="/syllabus/:batch/:dept"
                  element={<SyllabusDept />}
                />
              </Routes>
            </Suspense>
          </Box>
          <Footer />
        </QueryClientProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
