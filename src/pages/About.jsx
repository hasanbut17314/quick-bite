import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { BookOpen, Search, Star, User } from "lucide-react"; // Icons

export default function About({ isDarkMode, toggleDarkMode }) {
  return (
    <div
      className={`${
        isDarkMode ? "bg-black text-gray-200" : "bg-white text-gray-900"
      } font-sans transition-colors duration-300`}
    >
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <div className="pt-16">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto py-20 px-6 text-center">
          <h2
            className={`text-5xl font-extrabold ${
              isDarkMode ? "text-[#ff66b2]" : "text-[#d44480]"
            } mb-6 animate-fade-in`}
          >
            About <span className="text-[#541388]">QuickBite</span>
          </h2>
          <p
            className={`text-xl max-w-3xl mx-auto leading-relaxed ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            } animate-fade-in delay-100`}
          >
            QuickBite helps you find the best recipes using the ingredients you
            already have. No more last-minute grocery store runs—cook delicious
            meals with what’s in your kitchen!
          </p>
        </section>

        {/* Mission Section */}
        <section className="max-w-6xl mx-auto py-16 px-6">
          <h2
            className={`text-4xl font-extrabold text-center mb-12 ${
              isDarkMode ? "text-[#ff66b2]" : "text-[#d44480]"
            } animate-fade-in delay-200`}
          >
            Our Mission
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-xl shadow-lg transition-all duration-300 transform ${
                  isDarkMode
                    ? "bg-black text-gray-200 hover:bg-gray-700"
                    : "bg-[#F6B1CE] text-gray-900 hover:bg-[#f49ac1]"
                } hover:scale-105 hover:shadow-xl`}
              >
                {/* Floating Shape */}
                <div className="absolute -top-5 -left-5 w-14 h-14 bg-white/30 dark:bg-gray-800/30 rounded-full blur-md animate-pulse"></div>

                {/* Icon */}
                <div className="flex items-center justify-center mb-6">
                  <div
                    className={`p-4 rounded-full ${
                      isDarkMode ? "bg-white" : "bg-white"
                    } shadow-md`}
                  >
                    {feature.icon}
                  </div>
                </div>

                {/* Title */}
                <h3
                  className={`text-2xl font-semibold text-center mb-4 ${
                    isDarkMode ? "text-[#ff66b2]" : "text-[#541388]"
                  }`}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="max-w-6xl mx-auto py-16 px-6">
          <h2
            className={`text-4xl font-extrabold text-center mb-12 ${
              isDarkMode ? "text-[#ff66b2]" : "text-[#d44480]"
            } animate-fade-in delay-300`}
          >
            Meet the Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className={`relative p-6 rounded-xl shadow-lg transition-all duration-300 transform ${
                  isDarkMode
                    ? "bg-black text-gray-200 hover:bg-gray-700"
                    : "bg-[#F6B1CE] text-gray-900 hover:bg-[#f49ac1]"
                } hover:scale-105 hover:shadow-xl`}
              >
                {/* Floating Shape */}
                <div className="absolute -top-5 -left-5 w-14 h-14 bg-white/30 dark:bg-gray-800/30 rounded-full blur-md animate-pulse"></div>

                {/* Image */}
                <div className="flex items-center justify-center mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md"
                  />
                </div>

                {/* Name */}
                <h3
                  className={`text-2xl font-semibold text-center mb-2 ${
                    isDarkMode ? "text-[#ff66b2]" : "text-[#541388]"
                  }`}
                >
                  {member.name}
                </h3>

                {/* Role */}
                <p className="text-center text-[#541388] dark:text-gray-300 mb-4 ">
                  {member.role}
                </p>

                {/* Bio */}
                <p className="text-center">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}

// Feature List
const features = [
  {
    title: "Easy-to-Follow Recipes",
    description: "Step-by-step instructions to help you cook like a pro.",
    icon: <BookOpen className="text-[#541388] dark:text-[#ff66b2] w-8 h-8" />,
  },
  {
    title: "Ingredient-Based Search",
    description: "Just enter what you have, and we'll suggest amazing dishes.",
    icon: <Search className="text-[#541388] dark:text-[#ff66b2] w-8 h-8" />,
  },
  {
    title: "Community Favorites",
    description: "See what recipes are trending and loved by our users.",
    icon: <Star className="text-[#541388] dark:text-[#ff66b2] w-8 h-8" />,
  },
  {
    title: "Personalized Experience",
    description: "Save your favorite recipes and get customized suggestions.",
    icon: <User className="text-[#541388] dark:text-[#ff66b2] w-8 h-8" />,
  },
];

// Team Members
const teamMembers = [
  {
    name: "Areej Fatima",
    role: "Owner and Developer",
    bio: "Passionate about making cooking accessible to everyone. Full-stack developer passionate about blending technology with food innovation to make cooking easier for everyone.",
    image: "https://source.unsplash.com/200x200/?portrait,woman",
  },
  {
    name: "Irsa Shahzad",
    role: "Partener and Developer",
    bio: "Frontend developer focused on creating seamless and user-friendly interfaces for an enhanced cooking experience.",
    image: "https://source.unsplash.com/200x200/?portrait,man",
  },
  {
    name: "Zakia Jalil",
    role: "Supervisor",
    bio: "Guiding QuickBite’s development to ensure a smooth, intuitive, and enjoyable user experience.",
    image: "https://source.unsplash.com/200x200/?portrait,man",
  },
];