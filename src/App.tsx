import { Box } from "@/components/atoms/layout";
import Footer from "@/components/atoms/layout/footer";
import Header from "@/components/atoms/layout/header";
import AboutPage from "@/pages/about";
import FrontPage from "@/pages/front-page";
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Spinner } from "./components/atoms/spinner/spinner";
import ResultsPage from "./pages/results";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LabReportsPage from "./pages/lab-reports";
import NotesPage from "./pages/notes";

// Lazy load the QBankPage
const QBankPage = lazy(() => import("@/pages/q-bank"));
const SyllabusPage = lazy(() => import("@/pages/syllabus"));
const JokesPage = lazy(() => import("@/pages/jokes"));

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Box className="min-h-[calc(100vh-150px)]">
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<Spinner className={`text-[#377fcc]`} />}>
            <Routes>
              <Route path="/" element={<FrontPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/q-bank" element={<QBankPage />} />
              <Route path="/syllabus" element={<SyllabusPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/jokes" element={<JokesPage />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/lab-reports" element={<LabReportsPage />} />
            </Routes>
          </Suspense>
        </QueryClientProvider>
      </Box>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
