import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiSettings, FiHeart, FiBookmark, FiUser, FiBarChart2, FiLogOut, FiExternalLink, FiTrash2, FiShoppingCart, FiPlus, FiEdit3, FiCheck, FiX  } from "react-icons/fi";



const Dashboard = () => {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [imgUrl, setImgUrl] = useState(null);

  const navigate = useNavigate();
  
   const userDataLo = JSON.parse(localStorage.getItem("user")) || {};

   const handleLogout = async () => {
     try {
    const authToken = localStorage.getItem('token');
    await axios.post(
      `http://localhost:5000/api/activity`,
      {
        userId: userDataLo._id,
        comment: `${userDataLo.name} logged out at ${new Date().toLocaleString()}`,
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
      if(response.data.image) {
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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-gradient-to-b from-purple-900 to-purple-700 text-white">
          <div className="flex items-center justify-center h-16 px-4 border-b border-purple-800">
            <h1 className="text-xl font-bold">My Dashboard</h1>
          </div>
          <div className="flex flex-col flex-grow px-4 py-8">
            <div className="flex flex-col items-center mb-8">
              <label className="relative">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                <img
                  src={imgUrl ? `${imgUrl}` : "https://ui-avatars.com/api/?name=" + (userData?.name || "User") + "&background=random"}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-4 border-purple-300 cursor-pointer hover:opacity-90 transition"
                />
                <div className="absolute bottom-0 right-0 bg-white text-purple-700 p-1 rounded-full">
                  <FiUser className="w-4 h-4" />
                </div>
              </label>
              <h2 className="mt-4 text-lg font-semibold">{userDataLo?.name || "User"}</h2>
              <p className="text-purple-200 text-sm">{userDataLo?.email || "user@example.com"}</p>
            </div>
            
            <nav className="flex-1 space-y-2">
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition ${activeTab === "overview" ? "bg-purple-600 text-white" : "text-purple-200 hover:bg-purple-800"}`}
              >
                <FiBarChart2 className="mr-3" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab("saved")}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition ${activeTab === "saved" ? "bg-purple-600 text-white" : "text-purple-200 hover:bg-purple-800"}`}
              >
                <FiBookmark className="mr-3" />
                Saved Items
                {userData?.savedItems?.length > 0 && (
                  <span className="ml-auto bg-white text-purple-700 text-xs font-bold px-2 py-1 rounded-full">
                    {userData.savedItems.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("favorites")}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition ${activeTab === "favorites" ? "bg-purple-600 text-white" : "text-purple-200 hover:bg-purple-800"}`}
              >
                <FiHeart className="mr-3" />
                Favorites
                {userData?.favorites?.length > 0 && (
                  <span className="ml-auto bg-white text-purple-700 text-xs font-bold px-2 py-1 rounded-full">
                    {userData.favorites.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("shopping")}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition ${
                  activeTab === "shopping" ? "bg-purple-600 text-white" : "text-purple-200 hover:bg-purple-800"
                }`}
              >
                <FiShoppingCart className="mr-3" />
                Shopping List
                {userData?.shoppingList?.length > 0 && (
                  <span className="ml-auto bg-white text-purple-700 text-xs font-bold px-2 py-1 rounded-full">
                    {userData.shoppingList.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition ${activeTab === "settings" ? "bg-purple-600 text-white" : "text-purple-200 hover:bg-purple-800"}`}
              >
                <FiSettings className="mr-3" />
                Settings
              </button>
            </nav>
            
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 mt-auto text-purple-200 hover:bg-purple-800 rounded-lg transition"
            >
              <FiLogOut className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="hidden bg-purple-700 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <button className="p-2 rounded-full bg-purple-600">
          <FiSettings className="w-5 h-5" />
        </button>
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
      className="w-12 h-12 rounded-full object-cover border-2 border-purple-300 cursor-pointer"
    />
  </label>
  <div>
    <h2 className="text-lg font-semibold text-gray-800">{userData?.name || "User"}</h2>
    <p className="text-sm text-gray-600">{userData?.email || "user@example.com"}</p>
  </div>
  <div className="ml-auto">
    <button
  onClick={handleLogout}
  className="flex items-center px-4 py-2 text-white bg-purple-700 hover:bg-purple-800 rounded-lg transition"
>
  <FiLogOut className="mr-2" />
  Logout
</button>

  </div>
</div>


            

            {/* Mobile tabs */}
            <div className="md:hidden flex overflow-x-auto mb-6 pb-2 space-x-2">
              {["overview", "saved", "favorites", "shopping", "settings"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${activeTab === tab ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-700"}`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {["saved", "favorites"].includes(tab) && userData?.[tab]?.length > 0 && (
                    <span className="ml-1 bg-white text-purple-700 text-xs font-bold px-1.5 py-0.5 rounded-full">
                      {userData[tab].length}
                    </span>
                  )}
                </button>
              ))}
              
            </div>

            {/* Dashboard content */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {activeTab === "overview" && <OverviewTab userData={userData} />}
              {activeTab === "saved" && <SavedItemsTab userData={userData} />}
              {activeTab === "favorites" && <FavoritesTab userData={userData} />}
              {activeTab === "shopping" && <ShoppingTab userData={userData} />}
              {activeTab === "settings" && <SettingsTab userData={userData} />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};


const OverviewTab = ({ userData }) => {
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
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Welcome back, {userData?.name || "User"}!
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Saved Items</h3>
          <p className="text-3xl font-bold text-purple-600">{savedItemsCount}</p>
          <p className="text-sm text-gray-500 mt-2">Items you've saved for later</p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Favorites</h3>
          <p className="text-3xl font-bold text-blue-600">{favoritesCount}</p>
          <p className="text-sm text-gray-500 mt-2">Your favorite items</p>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Today's Activity</h3>
          <p className="text-3xl font-bold text-green-600">{todayActivitiesCount}</p>
          <p className="text-sm text-gray-500 mt-2">Activities done today</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        {loading ? (
          <p>Loading activities...</p>
        ) : activities.length > 0 ? (
          <ul className="space-y-4">
            {activities.slice(0, 10).map((activity) => (
              <li key={activity._id} className="flex items-start">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <FiBookmark className="text-purple-600" />
                </div>
                <div>
                  <p className="text-gray-800">{activity.comment}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No recent activity found</p>
          </div>
        )}
      </div>
    </div>
  );
};






const SavedItemsTab = ({ userData }) => {
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
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 sticky top-0 bg-white py-4 z-10">Favorites</h2>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : savedRecipes?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedRecipes.map((recipe, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
              <div className="h-48 bg-gray-100 overflow-hidden">
                <img 
                  src={recipe.image || '/placeholder-recipe.jpg'} 
                  alt={recipe.label}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{recipe.title}</h3>
                <p className="text-gray-600 text-sm mb-2">
                   {Math.round(recipe.calories)} calories
                </p>
                <div className="flex justify-between items-center">
                  <a 
                    href={recipe.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-purple-600 hover:text-purple-800 text-sm"
                  >
                    <FiExternalLink className="mr-1" /> View
                  </a>
                  <button 
                    onClick={() => handleRemoveRecipe(recipe.link)}
                    className="flex items-center text-red-500 hover:text-red-700 text-sm"
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
          <div className="mx-auto w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <FiBookmark className="text-purple-600 text-3xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No saved recipes yet</h3>
          <p className="text-gray-600 mb-4">Save recipes to see them appear here</p>
          
        </div>
      )}
    </div>
  );
};

const FavoritesTab = ({ userData }) => {
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
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 sticky top-0 bg-white py-4 z-10">Favorites</h2>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : favoriteRecipes?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteRecipes.map((recipe, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
              <div className="h-48 bg-gray-100 overflow-hidden">
                <img 
                  src={recipe.image || '/placeholder-recipe.jpg'} 
                  alt={recipe.label}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{recipe.title}</h3>
                <p className="text-gray-600 text-sm mb-2">
                   {Math.round(recipe.calories)} calories
                </p>
                <div className="flex justify-between items-center">
                  <a 
                    href={recipe.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-purple-600 hover:text-purple-800 text-sm"
                  >
                    <FiExternalLink className="mr-1" /> View
                  </a>
                  <button 
                    onClick={() => handleRemoveFavorite(recipe.link)}
                    className="flex items-center text-red-500 hover:text-red-700 text-sm"
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
          <div className="mx-auto w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mb-4">
            <FiHeart className="text-pink-600 text-3xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No favorites yet</h3>
          <p className="text-gray-600">Mark recipes as favorite to see them here</p>
        </div>
      )}
    </div>
  );
};



const ShoppingTab = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editIngredientsText, setEditIngredientsText] = useState("");

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

  // Parse ingredients but ignore quantities; only keep names
  const parseIngredients = (text) => {
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => ({ name: line, quantity: "" }));
  };

  // Convert ingredients array back to multiline text (only names)
  const ingredientsToText = (ingredients) =>
    ingredients
      .map((ing) => ing.name)
      .join("\n");

  const updateItem = async (id) => {
    if (!editComment.trim()) {
      alert("Comment cannot be empty");
      return;
    }
    const ingredients = parseIngredients(editIngredientsText);
    if (ingredients.length === 0) {
      alert("Please enter at least one ingredient");
      return;
    }

    // Find the existing item to get its recipeId
    const existingItem = items.find(item => item._id === id);
    const recipeId = "manual-entry";

    const payload = {
      comment: editComment,
      ingredients,
      recipeId,  // use existing item's recipeId here
    };

    try {
      const res = await axios.put(`http://localhost:5000/api/list/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(items.map((item) => (item._id === id ? res.data : item)));
      setEditingId(null);
      setEditComment("");
      setEditIngredientsText("");
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
      setItems(items.filter(item => item._id !== id));
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-b-2 pb-2">
        My Shopping List
      </h2>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-600"></div>
        </div>
      ) : items.length === 0 ? (
        <p className="text-gray-500 text-center text-lg mt-10">No shopping items available.</p>
      ) : (
        <ul className="space-y-6">
          {items.map((item) => (
            <li
              key={item._id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              {editingId === item._id ? (
                <>
                  <label className="block mb-2 font-semibold text-gray-700">Edit Comment:</label>
                  <input
                    type="text"
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Edit comment"
                  />

                  <label className="block mb-2 font-semibold text-gray-700">
                    Edit Ingredients (one per line):
                  </label>
                  <textarea
                    rows={5}
                    value={editIngredientsText}
                    onChange={(e) => setEditIngredientsText(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., flour"
                  />

                  <div className="flex gap-4">
                    <button
                      onClick={() => updateItem(item._id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      title="Save"
                    >
                      <FiCheck size={20} />
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditComment("");
                        setEditIngredientsText("");
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                      title="Cancel"
                    >
                      <FiX size={20} />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-purple-700 mb-3 border-b border-purple-300 pb-1">
                    {item.comment || "No Comment"}
                  </h3>
                  <ul className="list-disc list-inside space-y-1 mb-4 text-gray-800">
                    {item.ingredients.map((ing, i) => (
                      <li key={i} className="pl-2 list-disc text-gray-800">
                        {ing.name}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => {
                        setEditingId(item._id);
                        setEditComment(item.comment);
                        setEditIngredientsText(ingredientsToText(item.ingredients));
                      }}
                      className="text-purple-600 hover:text-purple-800 font-semibold"
                      title="Edit"
                    >
                      <FiEdit3 size={22} />
                    </button>

                    {item.recipeId === "manual-entry" && (
                      <button
                        onClick={() => deleteItem(item._id)}
                        className="text-red-600 hover:text-red-800 font-semibold"
                        title="Delete"
                      >
                        <FiTrash2 size={22} />
                      </button>
                    )}
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




const SettingsTab = ({ userData }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    preferences: {}
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { user } = useAuth();

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 
    'Nut-Free', 'Keto', 'Paleo', 'Low-Carb', 'Halal', 'Kosher'
  ];

  const cuisineOptions = [
    'American', 'Italian', 'Mexican', 'Chinese', 
    'Japanese', 'Indian', 'Mediterranean', 'French', 'Thai'
  ];

  const mealTypeOptions = [
    'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'
  ];

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        preferences: userData.preferences || {
          notifications: true,
          darkMode: false,
          dietaryRestrictions: [],
          favoriteCuisines: [],
          mealTypes: []
        }
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreferenceChange = (category, value) => {
    const currentValues = formData.preferences[category] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(item => item !== value)
      : [...currentValues, value];
    
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [category]: newValues
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");
    
    try {
      const response = await axios.put(
        `http://localhost:5000/api/users/${user._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      const updatedUser = { ...userData, ...response.data };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      setSuccessMessage("Settings saved successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error saving settings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>
      
      {successMessage && (
        <div className="mb-6 p-3 bg-green-100 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notifications"
                checked={formData.preferences?.notifications || false}
                onChange={() => setFormData(prev => ({
                  ...prev,
                  preferences: {
                    ...prev.preferences,
                    notifications: !prev.preferences?.notifications
                  }
                }))}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="notifications" className="ml-2 block text-sm text-gray-700">
                Email notifications
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="darkMode"
                checked={formData.preferences?.darkMode || false}
                onChange={() => setFormData(prev => ({
                  ...prev,
                  preferences: {
                    ...prev.preferences,
                    darkMode: !prev.preferences?.darkMode
                  }
                }))}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="darkMode" className="ml-2 block text-sm text-gray-700">
                Dark mode
              </label>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Dietary Preferences</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {dietaryOptions.map(option => (
              <div key={option} className="flex items-center">
                <input
                  type="checkbox"
                  id={`diet-${option}`}
                  checked={formData.preferences?.dietaryRestrictions?.includes(option) || false}
                  onChange={() => handlePreferenceChange('dietaryRestrictions', option)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor={`diet-${option}`} className="ml-2 block text-sm text-gray-700">
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Favorite Cuisines</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {cuisineOptions.map(option => (
              <div key={option} className="flex items-center">
                <input
                  type="checkbox"
                  id={`cuisine-${option}`}
                  checked={formData.preferences?.favoriteCuisines?.includes(option) || false}
                  onChange={() => handlePreferenceChange('favoriteCuisines', option)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor={`cuisine-${option}`} className="ml-2 block text-sm text-gray-700">
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Meal Types</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {mealTypeOptions.map(option => (
              <div key={option} className="flex items-center">
                <input
                  type="checkbox"
                  id={`meal-${option}`}
                  checked={formData.preferences?.mealTypes?.includes(option) || false}
                  onChange={() => handlePreferenceChange('mealTypes', option)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor={`meal-${option}`} className="ml-2 block text-sm text-gray-700">
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
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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