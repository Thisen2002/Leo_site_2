import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Homepage from "./Pages/Homepage";
import Notfound from "./Pages/Notfound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import About from "./Pages/About";
import Projects from "./Pages/Projects";
import Events from "./Pages/Events";
import Team from "./Pages/Team";
import Gallery from "./Pages/Gallery";
import Contact from "./Pages/Contact";

// Component to handle scrolling to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top immediately when route changes
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Navbar />
        <main style={{ minHeight: "calc(100vh - 140px)" }}>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/events" element={<Events />} />
            <Route path="/team" element={<Team />} />
            <Route path="/team/:teamType" element={<Team />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Notfound />} />

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
