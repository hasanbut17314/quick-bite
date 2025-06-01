// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

// const SignUp = ({ isDarkMode, toggleDarkMode }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       // const response = await fetch("http://localhost:5000/signup", {
//       const response = await fetch("http://localhost:5000/api/auth/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();
//       if (data.success) {
//         navigate("/login"); // Redirect to login page after successful signup
//       } else {
//         setError(data.message || "Signup failed. Please try again.");
//       }
//     } catch (err) {
//       setError("Something went wrong. Please try again.");
//     }
//   };

//   return (
//     <div
//       className={`min-h-screen ${
//         isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
//       }`}
//     >
//       <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
//       <div className="mt-0"></div>

//       <section className="max-w-md mx-auto py-12 px-6">
//         <h2
//           className={`text-3xl font-bold text-center mb-8 mt-6 ${
//             isDarkMode ? "text-[#ff66b2]" : "text-[#d44480]"
//           }`}
//         >
//           Sign Up
//         </h2>
//         <form
//           className={`bg-gradient-to-r ${
//             isDarkMode
//               ? "from-gray-800 to-gray-700"
//               : "from-[#F6B1CE] to-[#f49ac1]"
//           } p-8 rounded-lg shadow-lg`}
//           onSubmit={handleSubmit}
//         >
//           {error && (
//             <p className="text-red-500 text-center mb-4">{error}</p>
//           )}
//           <div className="mb-6">
//             <label className="block font-semibold mb-2">Name</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
//                 isDarkMode
//                   ? "bg-gray-700 text-white focus:ring-[#ff66b2]"
//                   : "bg-white text-gray-900 focus:ring-[#d44480]"
//               }`}
//             />
//           </div>
//           <div className="mb-6">
//             <label className="block font-semibold mb-2">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
//                 isDarkMode
//                   ? "bg-gray-700 text-white focus:ring-[#ff66b2]"
//                   : "bg-white text-gray-900 focus:ring-[#d44480]"
//               }`}
//             />
//           </div>
//           <div className="mb-6">
//             <label className="block font-semibold mb-2">Password</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
//                 isDarkMode
//                   ? "bg-gray-700 text-white focus:ring-[#ff66b2]"
//                   : "bg-white text-gray-900 focus:ring-[#d44480]"
//               }`}
//             />
//           </div>
//           <button
//             type="submit"
//             className={`w-full py-3 rounded-lg font-bold transition duration-300 ${
//               isDarkMode
//                 ? "bg-[#ff66b2] hover:bg-[#e55a9f]"
//                 : "bg-[#d44480] hover:bg-[#b83a6f]"
//             } text-white`}
//           >
//             Sign Up
//           </button>
//           <p className="text-center mt-4">
//             Already have an account?{" "}
//             <Link
//               to="/login"
//               className={`${
//                 isDarkMode ? "text-[#ff66b2]" : "text-[#d44480]"
//               } hover:underline`}
//             >
//               Log In
//             </Link>
//           </p>
//         </form>
//       </section>

//       <Footer isDarkMode={isDarkMode} />
//     </div>
//   );
// };

// export default SignUp;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiUserPlus } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

const SignUp = ({ isDarkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !/[#$%^&*()_+=]/.test(email);
  };

  const validatePassword = (password) => {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(formData.email)) {
      return setError("Invalid email format.");
    }

    if (!validatePassword(formData.password)) {
      return setError("Password must be at least 8 characters long and include both letters and numbers.");
    }

    try {
      setIsLoading(true);
      const response = await axios.post("http://localhost:5000/api/auth/signup", formData);
      if (response.data.success) {
        navigate("/login");
      } else {
        setError(response.data.message || "Registration failed.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className={`w-full max-w-md rounded-xl shadow-lg overflow-hidden ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}>
          <div className={`p-8 ${isDarkMode ? "bg-gray-900" : "bg-[#ff66b2]"}`}>
            <h2 className={`text-2xl font-bold text-center ${isDarkMode ? "text-[#ff66b2]" : "text-white"}`}>
              Create Your Account
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {error && (
              <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-center">{error}</div>
            )}
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                Name
              </label>
              <input
                type="text"
                name="name"
                required
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none ${
                  isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"
                }`}
                placeholder="Your Name"
              />
            </div>

            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none ${
                  isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"
                }`}
                placeholder="your@email.com"
              />
            </div>

            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none ${
                  isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"
                }`}
                placeholder="Minimum 8 characters"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors ${
                isLoading
                  ? "bg-[#ff66b2]/70 cursor-not-allowed"
                  : isDarkMode
                    ? "bg-[#ff66b2] hover:bg-[#d44480]"
                    : "bg-[#ff66b2] hover:bg-[#d44480]"
              } text-white`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                <>
                  <FiUserPlus className="mr-2" />
                  Sign Up
                </>
              )}
            </button>

            <div className={`mt-6 text-center text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Already have an account?{" "}
              <Link
                to="/login"
                className={`font-medium ${isDarkMode ? "text-[#ff66b2] hover:text-[#d44480]" : "text-[#ff66b2] hover:text-[#d44480]"}`}
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </main>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default SignUp;