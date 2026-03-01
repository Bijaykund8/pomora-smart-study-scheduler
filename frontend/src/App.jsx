import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Loader from "./components/Loader";
import Feed from "./pages/Feed";
import ProfileSettings from "./pages/ProfileSettings";

/* =========================
   APP CONTENT
========================= */
function AppContent() {
  const location = useLocation();

  const [loading, setLoading] = useState(false);

  /* =========================
     GLOBAL DARK MODE STATE
  ========================= */
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  /* =========================
     APPLY DARK MODE
  ========================= */
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  /* =========================
     PAGE LOADER
  ========================= */
  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      {loading && <Loader />}

      <Routes>
        <Route path="/" element={<Home darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/login" element={<Login darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/signup" element={<Signup darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/forgot-password" element={<ForgotPassword darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/feed" element={<Feed darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/profile-settings" element={<ProfileSettings darkMode={darkMode} setDarkMode={setDarkMode} />} />
      </Routes>
    </>
  );
}

/* =========================
   MAIN APP
========================= */
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;