import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Login = ({ isDarkMode, toggleDarkMode }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "", remember: false });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Login request
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
        },
        { timeout: 10000 }
      );

      const { token, user } = response.data;

      if (token && user) {
        // After login, create new activity for the user
        try {
          await axios.post(
            `http://localhost:5000/api/activity`,
            {
              userId: user._id,
              comment: `logged in at ${new Date().toLocaleString()}`,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
              timeout: 5000,
            }
          );
        } catch (activityError) {
          console.error("Failed to create activity:", activityError);
          // Optional: don't block login if activity fails
        }

        // Complete login
        login(token, user, formData.remember);
        navigate("/dashboard");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      if (err.code === "ECONNABORTED") {
        setError("Request timed out. Please check your internet connection and try again.");
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      <main className="flex-grow flex items-center justify-center mt-12 px-4 py-12">
        <div
          className={`w-full max-w-md rounded-xl shadow-lg overflow-hidden ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className={`p-8 ${isDarkMode ? "bg-gray-900" : "bg-purple-600"}`}>
            <h2
              className={`text-2xl font-bold text-center ${
                isDarkMode ? "text-purple-400" : "text-white"
              }`}
            >
              Welcome Back
            </h2>
            <p
              className={`text-center mt-2 ${
                isDarkMode ? "text-purple-300" : "text-purple-100"
              }`}
            >
              Sign in to access your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8" aria-label="Login form">
            {error && (
              <div
                className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-center"
                role="alert"
                aria-live="assertive"
              >
                {error}
              </div>
            )}

            <div className="mb-6">
              <label
                htmlFor="email"
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Email Address
              </label>
              <div
                className={`flex items-center border rounded-lg overflow-hidden ${
                  isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                }`}
              >
                <span className="px-3">
                  <FiMail className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full py-3 px-2 focus:outline-none ${
                    isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
                  }`}
                  placeholder="your@email.com"
                  aria-describedby="emailHelp"
                />
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Password
              </label>
              <div
                className={`flex items-center border rounded-lg overflow-hidden ${
                  isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                }`}
              >
                <span className="px-3">
                  <FiLock className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                </span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`w-full py-3 px-2 focus:outline-none ${
                    isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
                  }`}
                  placeholder="••••••••"
                  aria-describedby="passwordHelp"
                />
              </div>
            </div>

            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className={`h-4 w-4 rounded cursor-pointer ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-purple-500"
                      : "bg-white border-gray-300 text-purple-600"
                  } focus:ring-purple-500`}
                />
                <label
                  htmlFor="remember"
                  className={`ml-2 text-sm cursor-pointer ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className={`text-sm ${
                  isDarkMode ? "text-purple-400 hover:text-purple-300" : "text-purple-600 hover:text-purple-500"
                }`}
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors ${
                isLoading
                  ? "bg-purple-400 cursor-not-allowed"
                  : isDarkMode
                  ? "bg-purple-600 hover:bg-purple-500"
                  : "bg-purple-600 hover:bg-purple-700"
              } text-white`}
              aria-live="polite"
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                <>
                  <FiLogIn className="mr-2" />
                  Sign In
                </>
              )}
            </button>

            <div
              className={`mt-6 text-center text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Don't have an account?{" "}
              <Link
                to="/signup"
                className={`font-medium ${
                  isDarkMode ? "text-purple-400 hover:text-purple-300" : "text-purple-600 hover:text-purple-500"
                }`}
              >
                Create one
              </Link>
            </div>
          </form>
        </div>
      </main>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default Login;
