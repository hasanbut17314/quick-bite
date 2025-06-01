import { FaQuoteLeft } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Testimonials = ({ isDarkMode, toggleDarkMode }) => {
  const testimonials = [
    {
      name: "Sarah Khan",
      feedback:
        "QuickBite has made cooking so much easier! I love discovering new recipes with just the ingredients I have at home.",
    },
    {
      name: "Ahmed Raza",
      feedback:
        "This platform is a lifesaver! The ingredient-based search saves me so much time when I’m planning meals.",
    },
    {
      name: "Mariam Ali",
      feedback:
        "The personalized recipe recommendations are amazing! I always find something delicious to cook.",
    },
  ];

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      {/* Add a gap between Navbar and Section */}
      <div className="mt-0"></div>

      <section className="max-w-6xl mx-auto py-16 px-6">
        <h2
          className={`text-3xl font-bold text-center mb-8 ${
            isDarkMode ? "text-[#ff66b2]" : "text-[#d44480]"
          }`}
        >
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105 ${
                isDarkMode ? "bg-black text-gray-200" : "bg-white text-gray-900"
              }`}
            >
              <FaQuoteLeft className="text-3xl text-[#d44480] mb-4" />
              <p className="text-lg italic">"{testimonial.feedback}"</p>
              <h3 className="text-lg font-semibold mt-4">{testimonial.name}</h3>
            </div>
          ))}
        </div>
      </section>

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default Testimonials;
