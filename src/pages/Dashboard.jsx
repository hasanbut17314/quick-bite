import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiSettings, FiHeart, FiBookmark, FiUser, FiBarChart2, FiLogOut, FiExternalLink, FiTrash2, FiShoppingCart, FiPlus, FiEdit3, FiCheck, FiX, FiHome, FiPrinter } from "react-icons/fi";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [imgUrl, setImgUrl] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const navigate = useNavigate();

  const userDataLo = JSON.parse(localStorage.getItem("user")) || {};

  const handleLogout = async () => {
    try {
      const authToken = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/activity`,
        {
          userId: userData._id,
          comment: `logged out at ${new Date().toLocaleString()}`,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log logout activity:", error);
      logout();
      navigate("/login");
    }
  };

  const handlelogged = localStorage.getItem("token");
  if (!handlelogged) {
    navigate("/login");
  }

  // Dark mode check

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          console.error("No token found in localStorage");
          return;
        }

        const user = JSON.parse(localStorage.getItem("user")); // assuming user._id is needed
        if (!user || !user.id) {
          console.error("No valid user found in localStorage");
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/users/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data);
        setIsDarkMode(response.data.preferences?.darkMode || false);
        if (response.data.image) {
          setImgUrl(response.data.image);
        }
        localStorage.setItem("userData", JSON.stringify(response.data));
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [])

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/${userData?._id}/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.image) {
        const imagePath = `${res.data.image}`;
        const updatedUser = { ...userData, image: imagePath };
        setUserData(updatedUser);
        setImgUrl(updatedUser.image);
        localStorage.setItem("userData", JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error("Error uploading image", err);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-800'}`}>
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className={`flex flex-col w-64 ${isDarkMode ? 'bg-gray-800' : 'bg-gradient-to-b from-purple-900 to-purple-700'} text-white`}>
          <div className={`flex items-center justify-center h-16 px-4 ${isDarkMode ? 'border-b border-gray-600' : 'border-b border-purple-800'}`}>
            <h1 className="text-xl font-bold">My Dashboard</h1>
          </div>
          <div className="flex flex-col flex-grow px-4 py-8">
            <div className="flex flex-col items-center mb-8">
              <label className="relative">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                <img
                  src={imgUrl ? `${imgUrl}` : "https://ui-avatars.com/api/?name=" + (userData?.name || "User") + "&background=random"}
                  alt="Profile"
                  className={`w-20 h-20 rounded-full object-cover border-4 ${isDarkMode ? 'border-gray-300' : 'border-purple-300'} cursor-pointer hover:opacity-90 transition`}
                />
                <div className={`absolute bottom-0 right-0 ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-purple-700'} p-1 rounded-full`}>
                  <FiUser className="w-4 h-4" />
                </div>
              </label>
              <h2 className="mt-4 text-lg usernameUpdate font-semibold">{userData?.name || "User"}</h2>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-purple-200'} useremailUpdate text-sm`}>{userData?.email || "user@example.com"}</p>
            </div>

            <nav className="flex-1 space-y-2">
              <button
                onClick={() => navigate("/")}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition ${isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-purple-200 hover:bg-purple-800'}`}
              >
                <FiHome className="mr-3" />
                Home
              </button>
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition ${activeTab === "overview" ? (isDarkMode ? "bg-gray-600 text-white" : "bg-purple-600 text-white") : (isDarkMode ? "text-gray-300 hover:bg-gray-600" : "text-purple-200 hover:bg-purple-800")}`}
              >
                <FiBarChart2 className="mr-3" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab("saved")}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition ${activeTab === "saved" ? (isDarkMode ? "bg-gray-600 text-white" : "bg-purple-600 text-white") : (isDarkMode ? "text-gray-300 hover:bg-gray-600" : "text-purple-200 hover:bg-purple-800")}`}
              >
                <FiBookmark className="mr-3" />
                Saved Items
                {userData?.savedItems?.length > 0 && (
                  <span className={`ml-auto ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-purple-700'} text-xs font-bold px-2 py-1 rounded-full`}>
                    {userData.savedItems.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("favorites")}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition ${activeTab === "favorites" ? (isDarkMode ? "bg-gray-600 text-white" : "bg-purple-600 text-white") : (isDarkMode ? "text-gray-300 hover:bg-gray-600" : "text-purple-200 hover:bg-purple-800")}`}
              >
                <FiHeart className="mr-3" />
                Favorites
                {userData?.favorites?.length > 0 && (
                  <span className={`ml-auto ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-purple-700'} text-xs font-bold px-2 py-1 rounded-full`}>
                    {userData.favorites.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("shopping")}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition ${
                  activeTab === "shopping" ? (isDarkMode ? "bg-gray-600 text-white" : "bg-purple-600 text-white") : (isDarkMode ? "text-gray-300 hover:bg-gray-600" : "text-purple-200 hover:bg-purple-800")
                }`}
              >
                <FiShoppingCart className="mr-3" />
                Shopping List
                {userData?.shoppingList?.length > 0 && (
                  <span className={`ml-auto ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-purple-700'} text-xs font-bold px-2 py-1 rounded-full`}>
                    {userData.shoppingList.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition ${activeTab === "settings" ? (isDarkMode ? "bg-gray-600 text-white" : "bg-purple-600 text-white") : (isDarkMode ? "text-gray-300 hover:bg-gray-600" : "text-purple-200 hover:bg-purple-800")}`}
              >
                <FiSettings className="mr-3" />
                Settings
              </button>
            </nav>

            <button
              onClick={handleLogout}
              className={`flex items-center w-full px-4 py-3 mt-auto ${isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-purple-200 hover:bg-purple-800'} rounded-lg transition`}
            >
              <FiLogOut className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            {/* Mobile profile header */}
            <div className="md:hidden flex items-center mb-6">
              <label className="relative mr-4">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                <img
                  src={imgUrl ? `${imgUrl}` : "https://ui-avatars.com/api/?name=" + (userData?.name || "User") + "&background=random"}
                  alt="Profile"
                  className={`w-12 h-12 rounded-full object-cover border-2 ${isDarkMode ? 'border-gray-300' : 'border-purple-300'} cursor-pointer`}
                />
              </label>
              <div>
                <h2 className={`text-lg usernameUpdate font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>{userData?.name || "User"}</h2>
                <p className={`text-sm useremailUpdate ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{userData?.email || "user@example.com"}</p>
              </div>
              <div className="ml-auto">
                <button
                  onClick={handleLogout}
                  className={`flex items-center px-4 py-2 text-white ${isDarkMode ? 'bg-gray-700 hover:bg-gray-800' : 'bg-purple-700 hover:bg-purple-800'} rounded-lg transition`}
                >
                  <FiLogOut className="mr-2" />
                  Logout
                </button>
              </div>
            </div>

                {/* Mobile tabs */}
                            <div className="md:hidden flex overflow-x-auto mb-6 pb-2 space-x-2">
                              <button
                                onClick={() => navigate("/")}
                                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
                              >
                                Home
                              </button>
                              {["overview", "saved", "favorites", "shopping", "settings"].map((tab) => (
                                <button
                                  key={tab}
                                  onClick={() => setActiveTab(tab)}
                                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                                    activeTab === tab 
                                      ? `${isDarkMode ? 'bg-gray-600' : 'bg-purple-600'} text-white` 
                                      : `${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`
                                  }`}
                                >
                                  {tab === "users" ? "User Management" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                              ))}
                            </div>

            {/* Dashboard content */}
            <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-xl shadow-md overflow-hidden`}>
              {activeTab === "overview" && <OverviewTab userData={userData} isDarkMode={isDarkMode} />}
              {activeTab === "saved" && <SavedItemsTab userData={userData} isDarkMode={isDarkMode} />}
              {activeTab === "favorites" && <FavoritesTab userData={userData} isDarkMode={isDarkMode} />}
              {activeTab === "shopping" && <ShoppingTab userData={userData} isDarkMode={isDarkMode} />}
              {activeTab === "settings" && <SettingsTab 
  userData={userData} 
  setUserData={setUserData} 
  isDarkMode={isDarkMode} 
  setIsDarkMode={setIsDarkMode} 
/>}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const OverviewTab = ({ userData, isDarkMode }) => {
  const [activities, setActivities] = useState([]);
  const [savedItemsCount, setSavedItemsCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [todayActivitiesCount, setTodayActivitiesCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/activity", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = res.data;

        setSavedItemsCount(data.counts.savedRecipes || 0);
        setFavoritesCount(data.counts.favorites || 0);
        setTodayActivitiesCount(data.counts.todayActivitiesCount || 0);
        setActivities(data.activities || []);
      } catch (err) {
        console.error("Failed to fetch overview data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  return (
    <div className={`p-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
      <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
        Welcome back, {userData?.name || "User"}!
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Saved Items</h3>
          <p className="text-3xl font-bold text-purple-600">{savedItemsCount}</p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Favorites</h3>
          <p className="text-3xl font-bold text-blue-600">{favoritesCount}</p>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Today's Activity</h3>
          <p className="text-3xl font-bold text-green-600">{todayActivitiesCount}</p>
        </div>
      </div>

      <div className={`border ${isDarkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-200'} rounded-lg p-6`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Recent Activity</h3>
        {loading ? (
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading activities...</p>
        ) : activities.length > 0 ? (
          <ul className="space-y-4">
            {activities.slice(0, 10).map((activity) => (
              <li key={activity._id} className="flex items-start">
                <div className={`${isDarkMode ? 'bg-gray-500' : 'bg-purple-100'} p-2 rounded-full mr-3`}>
                  <FiBookmark className={`${isDarkMode ? 'text-gray-200' : 'text-purple-600'}`} />
                </div>
                <div>
                  <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{userData.name} {activity.comment}</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No recent activity found</p>
          </div>
        )}
      </div>
    </div>
  );
};






const SavedItemsTab = ({ userData, isDarkMode }) => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSavedRecipes();
  }, []);

  const fetchSavedRecipes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/savedrecipes', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSavedRecipes(response.data);
    } catch (err) {
      console.error('Error fetching favorite recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRecipe = async (url) => {
    try {
      await axios.delete(`http://localhost:5000/api/savedrecipes`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        data: { url }
      });
      setSavedRecipes(savedRecipes.filter(recipe => recipe.link !== url));
      deleteShoppingList(url); // Call to delete shopping list item
    } catch (err) {
      console.error('Error removing Saved:', err);
    }
  };

  const deleteShoppingList = async (recipeUrl) => {
    const token = localStorage.getItem("token");

    if (!recipeUrl) {
      console.error("Recipe URL is required to delete shopping list.");
      return;
    }

    try {
      const res = await axios.delete(
        "http://localhost:5000/api/list", // assuming this is your delete endpoint
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { recipeId: recipeUrl }, // DELETE with a body requires 'data' in axios
        }
      );

    } catch (error) {
      console.error("Failed to delete shopping list item:", error);
    }
  };

  return (
    <div className={`p-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
      <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} mb-6 sticky top-0 ${isDarkMode ? 'bg-gray-700' : 'bg-white'} py-4 z-10`}>
        Saved Recipes
      </h2>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : savedRecipes?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedRecipes.map((recipe, index) => (
            <div key={index} className={`border ${isDarkMode ? 'border-gray-500 bg-gray-600' : 'border-gray-200 bg-white'} rounded-lg overflow-hidden hover:shadow-md transition`}>
              <div className="h-48 bg-gray-100 overflow-hidden">
                <img 
                  src={recipe.image || '/placeholder-recipe.jpg'} 
                  alt={recipe.label}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className={`font-semibold text-lg mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>{recipe.title}</h3>
                <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {Math.round(recipe.calories)} calories
                </p>
                <div className="flex justify-between items-center">
                  <a 
                    href={recipe.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`flex items-center ${isDarkMode ? 'text-purple-300 hover:text-purple-400' : 'text-purple-600 hover:text-purple-800'} text-sm`}
                  >
                    <FiExternalLink className="mr-1" /> View
                  </a>
                  <button 
                    onClick={() => handleRemoveRecipe(recipe.link)}
                    className={`flex items-center ${isDarkMode ? 'text-red-300 hover:text-red-400' : 'text-red-500 hover:text-red-700'} text-sm`}
                  >
                    <FiHeart className="fill-current mr-1" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className={`mx-auto w-24 h-24 ${isDarkMode ? 'bg-gray-500' : 'bg-purple-100'} rounded-full flex items-center justify-center mb-4`}>
            <FiBookmark className={`text-3xl ${isDarkMode ? 'text-gray-300' : 'text-purple-600'}`} />
          </div>
          <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} mb-2`}>No saved recipes yet</h3>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>Save recipes to see them appear here</p>
        </div>
      )}
    </div>
  );
};

const FavoritesTab = ({ userData, isDarkMode }) => {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFavoriteRecipes();
  }, []);

  const fetchFavoriteRecipes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/favorites', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFavoriteRecipes(response.data);
    } catch (err) {
      console.error('Error fetching favorite recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (url) => {
    try {
      await axios.delete(`http://localhost:5000/api/favorites`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        data: { url }
      });
      setFavoriteRecipes(favoriteRecipes.filter(recipe => recipe.link !== url));
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  return (
    <div className={`p-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
      <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} mb-6 sticky top-0 ${isDarkMode ? 'bg-gray-700' : 'bg-white'} py-4 z-10`}>Favorites</h2>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : favoriteRecipes?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteRecipes.map((recipe, index) => (
            <div key={index} className={`border ${isDarkMode ? 'border-gray-500 bg-gray-600' : 'border-gray-200 bg-white'} rounded-lg overflow-hidden hover:shadow-md transition`}>
              <div className="h-48 bg-gray-100 overflow-hidden">
                <img 
                  src={recipe.image || '/placeholder-recipe.jpg'} 
                  alt={recipe.label}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className={`font-semibold text-lg mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>{recipe.title}</h3>
                <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {Math.round(recipe.calories)} calories
                </p>
                <div className="flex justify-between items-center">
                  <a 
                    href={recipe.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`flex items-center ${isDarkMode ? 'text-purple-300 hover:text-purple-400' : 'text-purple-600 hover:text-purple-800'} text-sm`}
                  >
                    <FiExternalLink className="mr-1" /> View
                  </a>
                  <button 
                    onClick={() => handleRemoveFavorite(recipe.link)}
                    className={`flex items-center ${isDarkMode ? 'text-red-300 hover:text-red-400' : 'text-red-500 hover:text-red-700'} text-sm`}
                  >
                    <FiHeart className="fill-current mr-1" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className={`mx-auto w-24 h-24 ${isDarkMode ? 'bg-gray-500' : 'bg-pink-100'} rounded-full flex items-center justify-center mb-4`}>
            <FiHeart className={`text-3xl ${isDarkMode ? 'text-gray-300' : 'text-pink-600'}`} />
          </div>
          <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} mb-2`}>No favorites yet</h3>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Mark recipes as favorite to see them here</p>
        </div>
      )}
    </div>
  );
};




const ShoppingTab = ({ isDarkMode }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editIngredientsText, setEditIngredientsText] = useState("");
  const [editStatus, setEditStatus] = useState("pending");
  const [editShoppingDate, setEditShoppingDate] = useState("");

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [newIngredientsText, setNewIngredientsText] = useState("");
  const [newShoppingDate, setNewShoppingDate] = useState("");
  const [creating, setCreating] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data);
    } catch (err) {
      console.error("Failed to fetch items:", err);
    } finally {
      setLoading(false);
    }
  };

  const parseIngredients = (text) =>
    text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => ({ name: line, quantity: "" }));

  const ingredientsToText = (ingredients) =>
    ingredients.map((ing) => ing.name).join("\n");

  const adjustDateMinusHours = (datetimeStr, hours) => {
    const date = new Date(datetimeStr);
    date.setHours(date.getHours() - hours);
    return date.toISOString();
  };

  const createItem = async () => {
    if (!newComment.trim()) return alert("Comment cannot be empty");
    const ingredients = parseIngredients(newIngredientsText);
    if (ingredients.length === 0) return alert("Add at least one ingredient");

    const payload = {
      recipeId: "manual-entry",
      comment: newComment,
      ingredients,
      status: "pending",
      shoppingDate: newShoppingDate ? adjustDateMinusHours(newShoppingDate, 5) : null,
    };

    setCreating(true);
    try {
      const res = await axios.post("http://localhost:5000/api/list", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems([res.data, ...items]);
      setShowCreateForm(false);
      setNewComment("");
      setNewIngredientsText("");
      setNewShoppingDate("");
    } catch (err) {
      console.error("Failed to create item:", err);
      alert("Failed to create shopping list item");
    } finally {
      setCreating(false);
    }
  };

  const updateItem = async (id) => {
    if (!editComment.trim()) return alert("Comment cannot be empty");
    const ingredients = parseIngredients(editIngredientsText);
    if (ingredients.length === 0) return alert("Add at least one ingredient");

    const payload = {
      recipeId: "manual-entry",
      comment: editComment,
      ingredients,
      status: editStatus,
      shoppingDate: editShoppingDate ? adjustDateMinusHours(editShoppingDate, 5) : null,
    };

    try {
      const res = await axios.put(`http://localhost:5000/api/list/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(items.map((item) => (item._id === id ? res.data : item)));
      setEditingId(null);
      setEditComment("");
      setEditIngredientsText("");
      setEditStatus("pending");
      setEditShoppingDate("");
    } catch (err) {
      console.error("Failed to update item:", err);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/list/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(items.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  const handlePrint = (item) => {
    const printWindow = window.open("", "_blank", "width=600,height=800");
    const htmlContent = `
      <html>
        <head>
          <title>Shopping List - ${item.comment}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { color: #6B21A8; }
            ul { list-style: disc; padding-left: 20px; }
            .info { margin: 10px 0; }
          </style>
        </head>
        <body>
          <h2>🛒 Shopping List</h2>
          <div class="info"><strong>Comment:</strong> ${item.comment}</div>
          <div class="info"><strong>Status:</strong> ${item.status}</div>
          <div class="info"><strong>Shopping Date:</strong> ${
            item.shoppingDate
              ? new Date(new Date(item.shoppingDate).getTime() - 5 * 60 * 60 * 1000).toLocaleString()
              : "Not set"
          }</div>
          <h3>Ingredients:</h3>
          <ul>
            ${item.ingredients.map((ing) => `<li>${ing.name}</li>`).join("")}
          </ul>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className={`p-3 md:p-6 max-w-3xl mx-auto ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
      <div className="flex justify-between items-center mb-6 border-b-2 pb-2">
        <h2 className={`text-3xl font-extrabold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          Shopping List
        </h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className={`flex items-center px-4 py-2 ${isDarkMode ? 'bg-gray-600 hover:bg-gray-700 text-gray-200' : 'bg-purple-600 hover:bg-purple-700 text-white'} rounded-lg transition`}
        >
          <FiPlus className="mr-2" size={20} />
          Add Item
        </button>
      </div>

      {showCreateForm && (
        <div className={`rounded-xl p-6 mb-6 border-2 ${isDarkMode ? 'bg-gray-600 border-gray-500' : 'bg-gray-50 border-purple-200'}`}>
          <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} mb-4`}>
            Create New Shopping List
          </h3>

          <label className="block mb-2 font-semibold">Comment/Title:</label>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className={`w-full p-3 border rounded-lg mb-4 ${isDarkMode ? 'bg-gray-500 border-gray-400 text-white' : 'bg-white border-gray-300'}`}
          />

          <label className="block mb-2 font-semibold">Ingredients (one per line):</label>
          <textarea
            rows={5}
            value={newIngredientsText}
            onChange={(e) => setNewIngredientsText(e.target.value)}
            className={`w-full p-3 border rounded-lg mb-4 resize-none ${isDarkMode ? 'bg-gray-500 border-gray-400 text-white' : 'bg-white border-gray-300'}`}
          />

          <label className="block mb-2 font-semibold">Shopping Date & Time:</label>
          <input
            type="datetime-local"
            value={newShoppingDate}
            onChange={(e) => setNewShoppingDate(e.target.value)}
            className={`w-full p-3 mb-4 border rounded-lg ${isDarkMode ? 'bg-gray-500 border-gray-400 text-white' : 'bg-white border-gray-300'}`}
          />

          <div className="flex gap-4">
            <button
              onClick={createItem}
              disabled={creating}
              className={`px-6 py-2 ${isDarkMode ? 'bg-green-700 hover:bg-green-800' : 'bg-green-600 hover:bg-green-700'} text-white rounded-lg`}
            >
              {creating ? "Creating..." : (<><FiCheck className="inline mr-2" size={18} />Create</>)}
            </button>
            <button
              onClick={() => {
                setShowCreateForm(false);
                setNewComment("");
                setNewIngredientsText("");
              }}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              <FiX className="inline mr-2" size={18} />
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-600"></div>
        </div>
      ) : items.length === 0 ? (
        <p className="text-center text-lg mt-10 text-gray-400">No shopping items available.</p>
      ) : (
        <ul className="space-y-6">
          {items.map((item) => (
            <li key={item._id} className={`rounded-xl shadow-md p-6 ${isDarkMode ? 'bg-gray-600' : 'bg-white'}`}>
              {editingId === item._id ? (
                <>
                  <input
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    className={`w-full p-2 mb-3 border rounded ${isDarkMode ? 'bg-gray-500 border-gray-400 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                  />
                  <textarea
                    value={editIngredientsText}
                    onChange={(e) => setEditIngredientsText(e.target.value)}
                    rows={3}
                    className={`w-full p-2 mb-3 border rounded ${isDarkMode ? 'bg-gray-500 border-gray-400 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                  />
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className={`w-full p-2 mb-3 border rounded ${isDarkMode ? 'bg-gray-500 border-gray-400 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="purchased">Purchased</option>
                  </select>
                  <input
                    type="datetime-local"
                    value={editShoppingDate}
                    onChange={(e) => setEditShoppingDate(e.target.value)}
                    className={`w-full p-2 mb-3 border rounded ${isDarkMode ? 'bg-gray-500 border-gray-400 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                  />
                  <div className="flex gap-2">
                    <button onClick={() => updateItem(item._id)} className="text-green-600">
                      <FiCheck size={20} />
                    </button>
                    <button onClick={() => setEditingId(null)} className="text-gray-500">
                      <FiX size={20} />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold mb-2">{item.comment}</h3>
                  <ul className="list-disc list-inside mb-2">
                    {item.ingredients.map((ing, i) => <li key={i}>{ing.name}</li>)}
                  </ul>
                  <p className="text-sm mb-1">Status: <strong>{item.status}</strong></p>
                  <p className="text-sm mb-2">
                    Shopping Date: {item.shoppingDate
                      ? new Date(new Date(item.shoppingDate).getTime() - 5 * 60 * 60 * 1000).toLocaleString()
                      : "Not set"}
                  </p>

                  <div className="flex gap-4">
                    <button onClick={() => {
                      setEditingId(item._id);
                      setEditComment(item.comment);
                      setEditIngredientsText(ingredientsToText(item.ingredients));
                      setEditStatus(item.status || "pending");
                      setEditShoppingDate(item.shoppingDate ? new Date(item.shoppingDate).toISOString().slice(0, 16) : "");
                    }}>
                      <FiEdit3 size={22} />
                    </button>
                    <button onClick={() => deleteItem(item._id)} className="text-red-500">
                      <FiTrash2 size={22} />
                    </button>
                    <button onClick={() => handlePrint(item)} className="text-blue-500">
                      <FiPrinter size={22} />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};




const SettingsTab = ({ isDarkMode, setIsDarkMode }) => {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    preferences: {
      notifications: true,
      darkMode: isDarkMode,
      dietaryRestrictions: [],
      favoriteCuisines: [],
      mealTypes: [],
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loadingUserData, setLoadingUserData] = useState(true);

  const dietaryOptions = [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Dairy-Free",
    "Nut-Free",
    "Keto",
    "Paleo",
    "Low-Carb",
    "Halal",
    "Kosher",
  ];

  const cuisineOptions = [
    "American",
    "Italian",
    "Mexican",
    "Chinese",
    "Japanese",
    "Indian",
    "Mediterranean",
    "French",
    "Thai",
  ];

  const mealTypeOptions = [
    "Breakfast",
    "Lunch",
    "Dinner",
    "Snack",
    "Dessert",
  ];

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      setLoadingUserData(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in localStorage");
          return;
        }

        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) {
          console.error("No valid user found in localStorage");
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/users/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserData(response.data);
        localStorage.setItem("userData", JSON.stringify(response.data));
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoadingUserData(false);
      }
    };

    fetchUserData();
  }, []);

  // Update form data when userData changes
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        preferences: {
          notifications: userData.preferences?.notifications ?? true,
          darkMode: userData.preferences?.darkMode ?? false,
          dietaryRestrictions: userData.preferences?.dietaryRestrictions || [],
          favoriteCuisines: userData.preferences?.favoriteCuisines || [],
          mealTypes: userData.preferences?.mealTypes || [],
        },
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePreferenceChange = (category, value) => {
    const currentValues = formData.preferences[category] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [category]: newValues,
      },
    }));
  };

  const handleTogglePreference = (category) => {
    if (category === 'darkMode') {
      setIsDarkMode(!formData.preferences.darkMode);
    }
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [category]: !prev.preferences[category],
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");

    const authToken = localStorage.getItem("token");
    const payload = {
      name: formData.name,
      email: formData.email,
      preferences: {
        notifications: formData.preferences.notifications,
        darkMode: formData.preferences.darkMode,
        dietaryRestrictions: formData.preferences.dietaryRestrictions,
        favoriteCuisines: formData.preferences.favoriteCuisines,
        mealTypes: formData.preferences.mealTypes,
      },
    };

    try {
      const res = await axios.put(
        `http://localhost:5000/api/preferences`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if(res.data.success == true){
        document.querySelectorAll(".usernameUpdate").forEach((el) => {
        el.textContent = res.data.name;
      });
      document.querySelectorAll(".useremailUpdate").forEach((el) => {
        el.textContent = res.data.email;
      });
      setIsDarkMode(res.data.preferences.darkMode);
      setSuccessMessage("Settings updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      }else{
        setSuccessMessage("Failed to update settings. Please try again.");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
      
    } catch (err) {
      console.error("Failed to update:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingUserData) {
    return (
      <div className="p-6 text-center text-gray-600">Loading user settings...</div>
    );
  }

  return (
    <div className={`p-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
      <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} mb-6`}>Settings</h2>

      {successMessage && (
        <div className={`mb-6 p-3 ${isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-green-100 text-green-700'} rounded-lg`}>
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}
              htmlFor="name"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${isDarkMode ? 'bg-gray-500 border-gray-400' : 'bg-white border-gray-300'} rounded-lg focus:ring-purple-500 focus:border-purple-500`}
            />
          </div>
          <div>
            <label
              className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${isDarkMode ? 'bg-gray-500 border-gray-400' : 'bg-white border-gray-300'} rounded-lg focus:ring-purple-500 focus:border-purple-500`}
            />
          </div>
        </div>

        <div>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} mb-4`}>Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notifications"
                checked={formData.preferences.notifications}
                onChange={() => handleTogglePreference("notifications")}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label
                htmlFor="notifications"
                className={`ml-2 block text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
              >
                Email notifications
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="darkMode"
                checked={formData.preferences.darkMode}
                onChange={() => handleTogglePreference("darkMode")}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label
                htmlFor="darkMode"
                className={`ml-2 block text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
              >
                Dark mode
              </label>
            </div>
          </div>
        </div>

        {/* Dietary Preferences */}
        <div>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} mb-4`}>
            Dietary Preferences
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {dietaryOptions.map((option) => (
              <div key={option} className="flex items-center">
                <input
                  type="checkbox"
                  id={`diet-${option}`}
                  checked={
                    formData.preferences.dietaryRestrictions?.includes(option) ||
                    false
                  }
                  onChange={() => handlePreferenceChange("dietaryRestrictions", option)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label
                  htmlFor={`diet-${option}`}
                  className={`ml-2 block text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Favorite Cuisines */}
<div>
  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} mb-4`}>
    Favorite Cuisines
  </h3>
  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
    {cuisineOptions.map((option) => (
      <div key={option} className="flex items-center">
        <input
          type="checkbox"
          id={`cuisine-${option}`}
          checked={
            formData.preferences.favoriteCuisines?.includes(option) ||
            false
          }
          onChange={() => handlePreferenceChange("favoriteCuisines", option)}
          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
        />
        <label
          htmlFor={`cuisine-${option}`}
          className={`ml-2 block text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
        >
          {option}
        </label>
      </div>
    ))}
  </div>
</div>

{/* Meal Types */}
<div>
  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} mb-4`}>Meal Types</h3>
  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
    {mealTypeOptions.map((option) => (
      <div key={option} className="flex items-center">
        <input
          type="checkbox"
          id={`meal-${option}`}
          checked={formData.preferences.mealTypes?.includes(option) || false}
          onChange={() => handlePreferenceChange("mealTypes", option)}
          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
        />
        <label
          htmlFor={`meal-${option}`}
          className={`ml-2 block text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
        >
          {option}
        </label>
      </div>
    ))}
  </div>
</div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center justify-center ${
              isLoading ? "opacity-75 cursor-not-allowed" : ""
            }`}
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
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Dashboard;