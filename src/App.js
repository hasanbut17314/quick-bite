import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { AuthProvider } from "./context/AuthContext";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import FAQ from "./pages/FAQ";
import Testimonials from "./pages/Testimonials";
import AdminDash from "./pages/AdminDash";
import Dashboard from "./pages/Dashboard";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Recipes from "./pages/Recipes";
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [recipes, setRecipes] = useState([]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* <Route
            path="/"
            element={<Home isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} setRecipes={setRecipes} />}
          /> */}
          <Route
            path="/"
            element={<Home setRecipes={setRecipes} recipes={recipes} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />}
          />
          <Route path="/about" element={<About isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="/contact" element={<Contact isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="/testimonials" element={<Testimonials isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="/privacypolicy" element={<PrivacyPolicy isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="/faq" element={<FAQ isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="/signup" element={<SignUp isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="/login" element={<Login isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="/dashboard" element={<Dashboard isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="/admin" element={<AdminDash isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route
            path="/recipes"
            element={<Recipes recipes={recipes} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />}
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
