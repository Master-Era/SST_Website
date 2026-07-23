import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Activity from "./pages/Activity";
import Events from "./pages/Events";
import Gallery from "./pages/Gallery";
import HariBhakt from "./pages/HariBhakt";
import Contact from "./pages/Contact";
import News from "./pages/News";
import NewsDetails from "./pages/NewsDetails";
import Donation from "./pages/Donation";
import AdminPanel from "./admin/AdminPanel";
import DonationButton from "./components/DonationButton";
import "./App.css";

function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}

function AppShell() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/mandir" element={<About />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/activities" element={<Activity />} />
        <Route path="/events" element={<Events />} />
        <Route path="/utsav" element={<Events />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:slug" element={<NewsDetails />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/haribakt" element={<HariBhakt />} />
        <Route path="/hari-bhakto" element={<HariBhakt />} />
        <Route path="/hari-bhakto-registration" element={<HariBhakt />} />
        <Route path="/donation" element={<Donation />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin/*" element={<AdminPanel />} />
      </Routes>
      {!isAdminRoute && <DonationButton />}
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;
