// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function Navbar({ isDarkMode, toggleDarkMode }) {
//   const { user, logout } = useAuth();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   return (
//     <nav
//       className={`${
//         isDarkMode ? "bg-black" : "bg-[#541388]"
//       } text-white p-4 flex justify-between items-center shadow-lg fixed w-full top-0 z-50`}
//     >
//       <h1 className="text-2xl font-extrabold tracking-wide italic transform hover:scale-105 transition-transform duration-300">
//         🍽️ Quick<span className="text-[#F6B1CE]">Bite</span>
//       </h1>
//       {/* Mobile Menu Button */}
//       <button onClick={toggleMenu} className="md:hidden text-3xl focus:outline-none">
//         ☰
//       </button>
//       {/* Desktop & Mobile Menu */}
//       <ul
//         className={`${
//           isMenuOpen ? "flex" : "hidden"
//         } flex-col md:flex md:flex-row md:space-x-6 text-lg absolute md:static ${
//           isDarkMode ? "bg-black" : "bg-[#541388]"
//         } md:bg-transparent w-full md:w-auto top-16 left-0 p-4 md:p-0 transition-all duration-300`}
//       >
//         <li>
//           <Link to="/" className="hover:text-[#F6B1CE] transition duration-300 block py-2 md:py-0">
//             Home
//           </Link>
//         </li>
//         <li>
//           <Link to="/about" className="hover:text-[#F6B1CE] transition duration-300 block py-2 md:py-0">
//             About
//           </Link>
//         </li>
//         <li>
//           <Link to="/recipes" className="hover:text-[#F6B1CE] transition duration-300 block py-2 md:py-0">
//             Recipes
//           </Link>
//         </li>
//         <li>
//           <Link to="/contact" className="hover:text-[#F6B1CE] transition duration-300 block py-2 md:py-0">
//             Contact
//           </Link>
//         </li>
//         {user ? (
//           <li>
//             <button
//               onClick={logout}
//               className="hover:text-[#F6B1CE] transition duration-300"
//             >
//               Logout
//             </button>
//           </li>
//         ) : (
//           <>
//             <li>
//               <Link
//                 to="/signup"
//                 className="hover:text-[#F6B1CE] transition duration-300"
//               >
//                 Sign Up
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/login"
//                 className="hover:text-[#F6B1CE] transition duration-300"
//               >
//                 Login
//               </Link>
//             </li>
//           </>
//         )}
//       </ul>
//       {/* Dark Mode Toggle Button */}
//       <button
//         onClick={toggleDarkMode}
//         className={`px-4 py-2 rounded-full font-bold shadow-md transition duration-300 transform hover:scale-105 ${
//           isDarkMode
//             ? "bg-white text-gray-900 hover:bg-gray-200"
//             : "bg-[#d44480] hover:bg-[#B83A6F]"
//         }`}
//       >
//         {isDarkMode ? "Light Mode" : "Dark Mode"}
//       </button>
//     </nav>
//   );
// }

//New
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiSun, FiMoon, FiUser, FiLogOut, FiSettings, FiHeart, FiBookmark } from "react-icons/fi";

export default function Header({ isDarkMode, toggleDarkMode }) {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? isDarkMode
            ? "bg-black shadow-lg"
            : "bg-white shadow-md"
          : isDarkMode
          ? "bg-black"
          : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className={`text-2xl font-bold ${
                isDarkMode ? "text-purple-400" : "text-purple-600"
              }`}
            >
              <span className="mr-2">🍽️</span>
              <span className="text-purple-600">Quick</span>
              <span className="text-pink-300">Bite</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isDarkMode
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              Home
            </Link>
            <Link
              to="/recipes"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isDarkMode
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              Recipes
            </Link>
            <Link
              to="/about"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isDarkMode
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isDarkMode
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right side controls */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                isDarkMode
                  ? "text-yellow-300 hover:bg-gray-800"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {user ? (
              <div className="relative ml-4">
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  {/* <img
                    src={user.profileImage || "https://ui-avatars.com/api/?name=" + user.name}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover"
                  /> */}
                  <div className="relative">
                    <img
                      className="h-8 w-8 rounded-full border-2 border-pink-300"
                      src={user.profileImage || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                      alt="Profile"
                    />
                    <span className="absolute -bottom-1 -right-1 bg-pink-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      👑
                    </span>
                  </div>
                  <span className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    {user.name.split(" ")[0]}
                  </span>
                </button>

                {isProfileMenuOpen && (
                  <div
                    className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${
                      isDarkMode ? "bg-gray-800" : "bg-white"
                    } ring-1 ring-black ring-opacity-5 focus:outline-none`}
                  >
                    <Link
                      to="/dashboard"
                      className={`block px-4 py-2 text-sm ${
                        isDarkMode
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <FiUser className="inline mr-2" /> Profile
                    </Link>
                    <Link
                      to="/dashboard/saved"
                      className={`block px-4 py-2 text-sm ${
                        isDarkMode
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <FiBookmark className="inline mr-2" /> Saved Items
                    </Link>
                    <Link
                      to="/dashboard/settings"
                      className={`block px-4 py-2 text-sm ${
                        isDarkMode
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <FiSettings className="inline mr-2" /> Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        isDarkMode
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <FiLogOut className="inline mr-2" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    isDarkMode
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className={`px-4 py-2 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700`}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className={`p-2 rounded-md ${
                isDarkMode
                  ? "text-gray-300 hover:bg-gray-800"
                  : "text-gray-700 hover:bg-gray-100"
              } focus:outline-none`}
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div
          className={`md:hidden ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } shadow-lg`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isDarkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Home
            </Link>
            <Link
              to="/recipes"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isDarkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Recipes
            </Link>
            <Link
              to="/about"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isDarkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isDarkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Contact
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            {user ? (
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <img
                    src={user.profileImage || "https://ui-avatars.com/api/?name=" + user.name}
                    alt="Profile"
                    className="h-10 w-10 rounded-full"
                  />
                </div>
                <div className="ml-3">
                  <div
                    className={`text-base font-medium ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {user.name}
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {user.email}
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-2 space-y-1">
                <Link
                  to="/login"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isDarkMode
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isDarkMode
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}