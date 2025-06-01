import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const FAQ = ({ isDarkMode, toggleDarkMode }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How does QuickBite work?",
      answer:
        "QuickBite helps you find recipes based on ingredients you already have. Just enter your ingredients, and we'll suggest delicious recipes!",
    },
    {
      question: "Is QuickBite free to use?",
      answer:
        "Yes! QuickBite is completely free to use. You can explore recipes, save favorites, and plan meals without any cost.",
    },
    {
      question: "Can I save my favorite recipes?",
      answer:
        "Yes! You can create an account and save your favorite recipes for quick access anytime.",
    },
    {
      question: "Does QuickBite support dietary restrictions?",
      answer:
        "Absolutely! You can filter recipes based on dietary preferences like vegan, gluten-free, or keto.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      
      <section className="max-w-4xl mx-auto py-12 px-6 pt-24">
        <h2
          className={`text-3xl font-bold text-center mb-8 ${
            isDarkMode ? "text-[#ff66b2]" : "text-[#d44480]"
          }`}
        >
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-lg p-4 transition-all duration-300 cursor-pointer shadow-md ${
                isDarkMode
                  ? "bg-black text-white hover:bg-gray-700"
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              }`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{faq.question}</h3>
                {openIndex === index ? (
                  <FaChevronUp className="text-[#d44480]" />
                ) : (
                  <FaChevronDown className="text-[#541388]" />
                )}
              </div>
              <p
                className={`mt-2 text-gray-600 transition-all duration-300 ${
                  openIndex === index ? "block" : "hidden"
                }`}
              >
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
      
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default FAQ;
