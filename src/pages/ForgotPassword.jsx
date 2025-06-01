import { useState } from "react";
import { FiMail } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ForgotPassword = ({ isDarkMode, toggleDarkMode }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      <main className="flex-grow flex items-center justify-center mt-10 px-4 py-12">
        <div className={`w-full max-w-md rounded-xl shadow-lg overflow-hidden ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className={`p-8 ${isDarkMode ? "bg-gray-900" : "bg-[#d44480]"}`}>
            <h2 className={`text-2xl font-bold text-center ${isDarkMode ? "text-[#ff66b2]" : "text-white"}`}>
              Forgot Password?
            </h2>
            <p className={`text-center mt-2 ${isDarkMode ? "text-purple-300" : "text-pink-100"}`}>
              Enter your email to receive a reset link
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {message && (
              <div className="mb-6 p-3 bg-green-100 text-green-700 rounded-lg text-center">
                {message}
              </div>
            )}
            {error && (
              <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-center">
                {error}
              </div>
            )}

            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                Email Address
              </label>
              <div className={`flex items-center border rounded-lg overflow-hidden ${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}>
                <span className="px-3">
                  <FiMail className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full py-3 px-2 focus:outline-none ${isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"}`}
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors ${
                isDarkMode ? "bg-[#d44480] hover:bg-[#ff66b2]" : "bg-[#ff66b2] hover:bg-[#d44480]"
              } text-white`}
            >
              Send Reset Link
            </button>

            <div className={`mt-6 text-center text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Remembered your password?{" "}
              <Link
                to="/login"
                className={`font-medium ${isDarkMode ? "text-[#ff66b2] hover:text-[#d44480]" : "text-[#d44480] hover:text-[#ff66b2]"}`}
              >
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </main>

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default ForgotPassword;
