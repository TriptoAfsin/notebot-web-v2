import Footer from "@/components/atoms/layout/footer";
import Header from "@/components/atoms/layout/header";
import AboutPage from "@/pages/about";
import FrontPage from "@/pages/front-page";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
