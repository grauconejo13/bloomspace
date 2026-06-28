import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Garden from "./pages/Garden";
import CreateFlower from "./pages/CreateFlower";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import { pingFlowers } from "./services/flowerService";

function App() {
  // Fire a lightweight warm-up request as soon as the app loads, so a sleeping
  // Supabase project has a head start waking up before the user needs real data.
  useEffect(() => {
    pingFlowers().catch(() => {});
  }, []);

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/garden" element={<Garden />} />
        <Route path="/create" element={<CreateFlower />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;