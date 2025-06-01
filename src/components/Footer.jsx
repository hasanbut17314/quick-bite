import { Link } from "react-router-dom";

export default function Footer({ isDarkMode }) {
  return (
    <footer
      className={`${
        isDarkMode ? "bg-black" : "bg-[#541388]"
      } text-white py-12 transition-colors duration-300`}
    >
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8 px-6">
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold mb-2 text-[#F6B1CE]">QuickBite</h3>
          <p className="text-sm italic">"Your Recipe Companion"</p>
          <p className="text-sm mt-2">&copy; 2025 QuickBite. All Rights Reserved.</p>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4 text-[#F6B1CE]">Follow Us</h3>
          <div className="flex space-x-6 text-2xl">
            <a
              href="https://facebook.com"
              className="hover:text-[#d44480] transition duration-300"
            >
              Facebook
            </a>
            <a
              href="https://twitter.com"
              className="hover:text-[#d44480] transition duration-300"
            >
              Twitter
            </a>
            <a
              href="https://instagram.com"
              className="hover:text-[#d44480] transition duration-300"
            >
              Instagram
            </a>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4 text-[#F6B1CE]">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/PrivacyPolicy" className="hover:text-[#d44480] transition duration-300">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/Testimonials" className="hover:text-[#d44480] transition duration-300">
                Testimonials
              </Link>
            </li>
            <li>
              <Link to="/FAQ" className="hover:text-[#d44480] transition duration-300">
                FAQ
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}