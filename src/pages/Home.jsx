import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Search, Utensils, List, ChefHat } from "lucide-react";

export default function Home({ isDarkMode, toggleDarkMode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);

  // Modify your handleSearch function:
const handleSearch = async () => {
  if (!searchQuery.trim()) {
    setError('Please enter at least one ingredient');
    return;
  }

  setIsLoading(true);
  setError(null);
  
  try {
    const response = await fetch(
      `http://localhost:5000/api/recipes?ingredients=${encodeURIComponent(searchQuery)}`
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch recipes');
    }
    
    if (!data.recipes || data.recipes.length === 0) {
      setRecipes([]);
      setError('No recipes found with these ingredients');
      return;
    }
    
    setRecipes(data.recipes);
  } catch (err) {
    console.error('Search error:', err);
    setError(err.message || 'Failed to fetch recipes. Please try again.');
  } finally {
    setIsLoading(false);
  }
};
  const featuredRecipes = [
    {
      id: 1,
      title: "Spaghetti Carbonara",
      image: "/assets/images/carbonara.jpg",
      link: "/recipes/spaghetti-carbonara",
    },
    {
      id: 2,
      title: "Avocado Toast",
      image: "/assets/images/avocado-toast.jfif",
      link: "/recipes/avocado-toast",
    },
    {
      id: 3,
      title: "Berry Smoothie",
      image: "/assets/images/berry-smoothie.jfif",
      link: "/recipes/berry-smoothie",
    },
  ];

  return (
    <div
      className={`${
        isDarkMode ? "bg-black text-white" : "bg-white text-gray-900"
      } font-sans transition-colors duration-300`}
    >
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <div className="mt-0"></div>

      <section
        id="hero"
        className="relative text-center py-32 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: "url('/assets/images/heroImage.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10">
          <h2 className="text-6xl font-extrabold text-white mb-4 animate-fade-in">
            QuickBite
          </h2>
          <p className="text-xl text-[#F6B1CE] font-medium mb-8 animate-fade-in delay-100">
            Find the Best Recipes with the Ingredients You Have
          </p>

          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="mt-6 flex justify-center animate-fade-in delay-200">
            <input
              type="text"
              placeholder="Enter ingredients (comma separated)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="px-4 py-3 border border-gray-300 rounded-lg w-1/2 focus:outline-none focus:ring-2 focus:ring-[#d44480] text-gray-900"
            />
            <button
              onClick={handleSearch}
              className="ml-4 bg-[#d44480] px-6 py-3 text-white rounded-lg hover:bg-[#B83A6F] flex items-center transition duration-300 transform hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
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
                  Searching...
                </div>
              ) : (
                <>
                  <Search className="mr-2" size={20} /> Find Recipes Now
                </>
              )}
            </button>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                {recipe.image && (
                  <img
                    src={recipe.image}
                    alt={recipe.title || "Recipe image"}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}
                <h2 className="text-lg font-bold">
                  {recipe.title || "Untitled Recipe"}
                </h2>
                <p className="text-gray-600">{recipe.source || "Unknown source"}</p>
                <div className="mt-2">
                  <h3 className="font-semibold">Ingredients:</h3>
                  <ul className="text-sm text-gray-700 list-disc pl-5">
                    {recipe.ingredients &&
                      recipe.ingredients.slice(0, 5).map((ing, i) => (
                        <li key={i}>{ing}</li>
                      ))}
                  </ul>
                </div>
                {recipe.link && (
                  <a
                    href={recipe.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:underline text-sm mt-2 block"
                  >
                    View Full Recipe
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Featured Recipes */}
      <section
        id="recipes"
        className={`${
          isDarkMode ? "bg-black" : "bg-white"
        } py-16 px-6 transition-colors duration-300`}
      >
        <h3 className="text-3xl font-semibold text-center text-[#F6B1CE] mb-8">
          Featured Recipes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {featuredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white shadow-lg p-6 rounded-lg transform hover:scale-105 transition-transform duration-300"
            >
              <img
                src={recipe.image}
                alt={recipe.title}
                className="h-48 w-full object-cover rounded-md mb-4"
              />
              <h4 className="text-xl font-semibold text-[#F6B1CE] mb-2">
                {recipe.title}
              </h4>
              <a
                href={recipe.link}
                className="text-[#d44480] font-bold hover:text-[#B83A6F] transition duration-300"
              >
                View Recipe →
              </a>
            </div>
          ))}
        </div>
      </section>

      <section
        id="how-it-works"
        className={`${
          isDarkMode ? "bg-black" : "bg-[#F6B1CE]"
        } py-16 text-center transition-colors duration-300`}
      >
        <h3 className="text-3xl font-semibold text-[#541388] mb-8">
          How It Works
        </h3>
        <div className="flex flex-col md:flex-row justify-center gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: <List size={40} />,
              text: "Enter Ingredients",
              description: "List what you have at home.",
            },
            {
              icon: <Utensils size={40} />,
              text: "Find Recipes",
              description: "Get the best recipe matches.",
            },
            {
              icon: <ChefHat size={40} />,
              text: "Start Cooking",
              description: "Follow easy steps.",
            },
          ].map((step, index) => (
            <div
              key={index}
              className={`${
                isDarkMode ? "bg-black" : "bg-white"
              } p-6 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300`}
            >
              <div className="p-4 bg-[#541388] text-white rounded-full flex items-center justify-center w-16 h-16 mx-auto mb-4">
                {step.icon}
              </div>
              <h4 className="text-xl font-semibold text-[#F6B1CE] mb-2">
                {step.text}
              </h4>
              <p className={`${isDarkMode ? "text-white" : "text-gray-700"}`}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="testimonials"
        className={`${
          isDarkMode ? "bg-black" : "bg-white"
        } py-16 transition-colors duration-300`}
      >
        <h3 className="text-3xl font-semibold text-center text-[#F6B1CE] mb-8">
          What Our Users Say
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
          {[
            {
              name: "Alice",
              review:
                "QuickBite helped me discover so many new recipes with the ingredients I already had at home!",
            },
            {
              name: "Bob",
              review:
                "I love how easy it is to use. The recipes are delicious and easy to follow.",
            },
            {
              name: "Charlie",
              review:
                "This app has changed the way I cook. Highly recommend it to everyone!",
            },
          ].map((testimonial, index) => (
            <div
              key={index}
              className={`${
                isDarkMode ? "bg-black" : "bg-[#F6B1CE]"
              } p-6 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300`}
            >
              <p className="text-white italic">"{testimonial.review}"</p>
              <p className="mt-4 text-[#d44480] font-semibold">
                - {testimonial.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        className={`${
          isDarkMode ? "bg-black" : "bg-white"
        } py-16 transition-colors duration-300`}
      >
        <div className="max-w-4xl mx-auto text-center px-6">
          <h3 className="text-3xl font-semibold text-[#F6B1CE] mb-4">
            Subscribe to Our Newsletter
          </h3>
          <p className="text-lg text-[#d44480] mb-8">
            Get the latest recipes, cooking tips, and exclusive offers delivered
            straight to your inbox.
          </p>
          <div className="flex justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 border rounded-lg w-1/2 focus:outline-none focus:ring-2 focus:ring-[#d44480]"
            />
            <button className="ml-4 bg-[#d44480] px-6 py-3 text-white rounded-lg hover:bg-[#B83A6F] transition duration-300 transform hover:scale-105">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#541388] text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-4xl font-extrabold mb-4">
            Ready to Start Cooking?
          </h3>
          <p className="text-lg mb-8">
            Join thousands of users who are already discovering delicious recipes
            with QuickBite.
          </p>
          <button className="bg-[#d44480] px-8 py-4 text-white rounded-lg font-bold shadow-md hover:bg-[#B83A6F] transition duration-300 transform hover:scale-105">
            Get Started Now
          </button>
        </div>
      </section>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}