import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PrivacyPolicy = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      
      {/* Add spacing to prevent overlap */}
      <div className="mt-0"></div>

      <section className="max-w-4xl mx-auto py-16 px-6">
        <h2
          className={`text-4xl font-bold mb-8 text-center ${
            isDarkMode ? "text-[#ff66b2]" : "text-[#d44480]"
          } animate-fade-in`}
        >
          Privacy Policy
        </h2>
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-[#541388] to-[#d44480] p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 text-white">
              Your Privacy Matters
            </h3>
            <p className="text-white">
              At QuickBite, we value your privacy. This Privacy Policy outlines how we collect, use, and protect your personal data.
            </p>
          </div>

          <div className={`p-6 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105 ${
            isDarkMode ? "bg-gray-800" : "bg-gray-100"
          }`}>
            <h3 className="text-2xl font-semibold mb-4 text-[#d44480]">
              Information We Collect
            </h3>
            <p>
              We collect information such as your name, email address, and saved recipes when you use our platform.
            </p>
          </div>

          <div className={`p-6 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105 ${
            isDarkMode ? "bg-gray-800" : "bg-gray-100"
          }`}>
            <h3 className="text-2xl font-semibold mb-4 text-[#d44480]">
              How We Use Your Information
            </h3>
            <p>
              We use your data to personalize your experience, improve our services, and ensure the best recipe recommendations.
            </p>
          </div>

          <div className={`p-6 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105 ${
            isDarkMode ? "bg-gray-800" : "bg-gray-100"
          }`}>
            <h3 className="text-2xl font-semibold mb-4 text-[#d44480]">
              Data Security
            </h3>
            <p>
              We take security seriously and implement industry-standard measures to protect your data.
            </p>
          </div>
        </div>
      </section>

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default PrivacyPolicy;