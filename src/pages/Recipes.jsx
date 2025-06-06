import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiClock, FiShare2, FiBookmark, FiHeart } from 'react-icons/fi';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Recipes = ({ isDarkMode, toggleDarkMode }) => {
  const [recipes, setRecipes] = useState([]);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    diet: [],
    cuisineType: [],
    mealType: [],
    dishType: [],
    calories: '',
    time: ''
  });
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searched, setSearched] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [favRecipes, setFavRecipes] = useState([]);

  const dietOptions = [
    { value: 'balanced', label: 'Balanced' },
    { value: 'high-protein', label: 'High Protein' },
    { value: 'low-carb', label: 'Low Carb' },
    { value: 'low-fat', label: 'Low Fat' }
  ];

  const cuisineOptions = [
    { value: 'Italian', label: 'Italian' },
    { value: 'Mexican', label: 'Mexican' },
    { value: 'Indian', label: 'Indian' },
    { value: 'Asian', label: 'Asian' },
    { value: 'Mediterranean', label: 'Mediterranean' }
  ];

  const mealOptions = [
    { value: 'Breakfast', label: 'Breakfast' },
    { value: 'Lunch', label: 'Lunch' },
    { value: 'Dinner', label: 'Dinner' },
    { value: 'Snack', label: 'Snack' }
  ];

  const dishOptions = [
    { value: 'Biscuits and cookies', label: 'Biscuits and Cookies' },
    { value: 'Bread', label: 'Bread' },
    { value: 'Cereals', label: 'Cereals' },
    { value: 'Condiments and sauces', label: 'Condiments and Sauces' },
    { value: 'Desserts', label: 'Desserts' },
    { value: 'Drinks', label: 'Drinks' },
    { value: 'Main course', label: 'Main Course' },
    { value: 'Pancake', label: 'Pancake' },
    { value: 'Preps', label: 'Preps' },
    { value: 'Preserve', label: 'Preserve' },
    { value: 'Salad', label: 'Salad' },
    { value: 'Sandwiches', label: 'Sandwiches' },
    { value: 'Side dish', label: 'Side Dish' },
    { value: 'Soup', label: 'Soup' },
    { value: 'Starter', label: 'Starter' },
    { value: 'Sweets', label: 'Sweets' }
  ];

  const edamamAppId = 'b8e6b112';
  const edamamAppKey = '9eac36ceba817b8386398fe7376d8019';
  const spoonacularApiKey = 'a927b1afa7d442d6804d75615efa1099';

  const fetchRecipes = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const edamamParams = {
        type: 'public',
        q: query || 'recipe',
        app_id: edamamAppId,
        app_key: edamamAppKey
      };

      if (filters.diet.length > 0) edamamParams.diet = filters.diet.join(',');
      if (filters.cuisineType.length > 0) edamamParams.cuisineType = filters.cuisineType.join(',');
      if (filters.mealType.length > 0) edamamParams.mealType = filters.mealType.join(',');
      if (filters.dishType.length > 0) edamamParams.dishType = filters.dishType.join(',');
      if (filters.calories) edamamParams.calories = filters.calories;
      if (filters.time) edamamParams.time = filters.time.replace('+', '%2B');

      const edamamResponse = await axios.get('https://api.edamam.com/api/recipes/v2', { params: edamamParams });
      const edamamResults = edamamResponse.data.hits || [];

      if (edamamResults.length === 0) {
        const spoonacularParams = {
          apiKey: spoonacularApiKey,
          query: query || 'recipe',
          addRecipeInformation: true,
          addRecipeNutrition: true
        };

        if (filters.diet.length > 0) spoonacularParams.diet = filters.diet.join(',');
        if (filters.cuisineType.length > 0) spoonacularParams.cuisine = filters.cuisineType.join(',');
        if (filters.mealType.length > 0) spoonacularParams.type = filters.mealType.join(',');

        if (filters.calories) {
          const parts = filters.calories.split('-');
          spoonacularParams.maxCalories = parts[1] ? parts[1] : parts[0];
        }

        if (filters.time) {
          if (filters.time.includes('+')) {
            spoonacularParams.maxReadyTime = filters.time.replace('+', '');
          } else {
            const parts = filters.time.split('-');
            spoonacularParams.maxReadyTime = parts[1] ? parts[1] : parts[0];
          }
        }

        const spoonacularResponse = await axios.get('https://api.spoonacular.com/recipes/complexSearch', { params: spoonacularParams });
        const spoonacularResults = spoonacularResponse.data.results || [];

        const mappedSpoonacularResults = spoonacularResults.map(recipe => ({
          recipe: {
            uri: recipe.id.toString(),
            label: recipe.title,
            image: recipe.image,
            url: recipe.sourceUrl || `https://spoonacular.com/recipes/${recipe.title.replace(/\s+/g, '-').toLowerCase()}-${recipe.id}`,
            totalTime: recipe.readyInMinutes || "N/A",
            calories: recipe.nutrition && recipe.nutrition.nutrients
              ? Math.round(recipe.nutrition.nutrients.find(n => n.title === 'Calories')?.amount || 0)
              : 0
          }
        }));

        setRecipes(mappedSpoonacularResults);
      } else {
        setRecipes(edamamResults);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setRecipes([]);
    } finally {
      setLoading(false);
      searchActivity(query);
    }
  };

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/savedrecipes', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setSavedRecipes(response.data.map(recipe => recipe.link));
      } catch (error) {
        console.error('Error fetching saved recipes:', error);
      }
    };

    const fetchFavRecipes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/favorites', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setFavRecipes(response.data.map(recipe => recipe.link));
      } catch (error) {
        console.error('Error fetching favorite recipes:', error);
      }
    };

    const handlelogged = localStorage.getItem("token");
  if (handlelogged) {
    fetchSavedRecipes();
    fetchFavRecipes();
  }
  }, [])
  

  const saveRecipe = async (recipe) => {
  try {
    if(!localStorage.getItem('token')) {
      alert('Please log in to save recipes.');
      return;
    }
    // Extract the needed fields
    const recipeData = {
      title: recipe.label,
      image: recipe.image,
      calories: recipe.calories,
      time: recipe.totalTime,
      link: recipe.url,
    };

    await axios.post('http://localhost:5000/api/savedrecipes', recipeData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    setSavedRecipes([...savedRecipes, recipe.url]); // keep recipe.uri if you want to track saved recipes by uri
    createShoppingList(recipe);

  } catch (error) {
    console.error('Error saving recipe:', error);
  }
};


const createShoppingList = async (recipe) => {
  const token = localStorage.getItem("token");

  if (!recipe.ingredients || recipe.ingredients.length === 0) {
    console.error("No ingredients found in recipe.");
    return;
  }

  // Prepare ingredients array as-is, or map if you want only specific fields
  const ingredients = recipe.ingredients.map(({ text, quantity }) => ({
    name: text,
    quantity,
  }));

  const payload = {
    recipeId: recipe.url,            // assuming your recipe has _id field
    comment: `Shopping list for recipe: ${recipe.label || "Unnamed"}`, // optional comment
    ingredients,
  };

  try {
    const res = await axios.post(
      "http://localhost:5000/api/list",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Failed to create shopping list item:", error);
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



const searchActivity = async (title) => {
  try {
    if(!localStorage.getItem('token')) {
     return;  
    }
    await axios.post(
      'http://localhost:5000/api/activity',
      { comment: `search recipe: ${title}` },  // request body
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
  } catch (error) {
    console.error('Error saving activity:', error);
  }
};


const saveActivity = async (title) => {
  try {
    if(!localStorage.getItem('token')) {
     return;  
    }
    await axios.post(
      'http://localhost:5000/api/activity',
      { comment: `viewed recipe: ${title}` },  // request body
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
  } catch (error) {
    console.error('Error saving activity:', error);
  }
};


 const FavRecipe = async (recipe) => {
  try {
    if(!localStorage.getItem('token')) {
      alert('Please log in to Faviroute recipes.');
      return;
    }
    // Extract the needed fields
    const recipeData = {
      title: recipe.label,
      image: recipe.image,
      calories: recipe.calories,
      time: recipe.totalTime,
      link: recipe.url,
    };
    
    await axios.post('http://localhost:5000/api/favorites', recipeData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    setFavRecipes([...favRecipes, recipe.url]); // keep recipe.uri if you want to track saved recipes by uri

  } catch (error) {
    console.error('Error saving recipe:', error);
  }
};



  const removeRecipe = async (url) => {
  try {
    await axios.delete('http://localhost:5000/api/savedrecipes', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      data: { url }  // send URL in body properly
    });
    setSavedRecipes(savedRecipes.filter(id => id !== url));
    deleteShoppingList(url); // also delete from shopping list
  } catch (error) {
    console.error('Error removing recipe:', error);
  }
};


  const removeFav = async (url) => {
  try {
    await axios.delete('http://localhost:5000/api/favorites', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      data: { url }  // send URL in body properly
    });
    setFavRecipes(favRecipes.filter(id => id !== url));
  } catch (error) {
    console.error('Error removing recipe:', error);
  }
};


  const isRecipeSaved = (url) => savedRecipes.includes(url);
  const isRecipeFav = (url) => favRecipes.includes(url);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRecipes();
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const inputClasses = "w-full p-3 border rounded-lg focus:ring-2 transition duration-300 " +
    (isDarkMode
      ? "bg-gray-800 border-gray-700 text-white focus:ring-purple-500"
      : "bg-white border-gray-200 text-gray-800 focus:ring-purple-500");

  const sectionClasses = isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900";
  const cardClasses = isDarkMode ? "bg-gray-800 shadow-lg" : "bg-white shadow-md";

  return (
    <div className={`min-h-screen flex flex-col ${sectionClasses}`}>
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <main className="flex-grow container mx-auto mt-12 px-4 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Discover Delicious Recipes</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Find the perfect recipe for any occasion</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className={`max-w-4xl mx-auto mb-10 p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search recipes (e.g., pasta, vegan, chicken)"
              className={`${inputClasses} pl-12`}
            />
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl text-gray-400" />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition duration-300"
            >
              Search
            </button>
          </div>

          {/* Filter Toggle */}
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="text-purple-600 hover:text-purple-800 font-semibold flex items-center"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
              <svg
                className={`ml-2 h-5 w-5 transition-transform ${showFilters ? 'rotate-180' : ''}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414L10 13.414l-4.707-4.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: 'Diet', name: 'diet', options: dietOptions },
                { label: 'Cuisine', name: 'cuisineType', options: cuisineOptions },
                { label: 'Meal Type', name: 'mealType', options: mealOptions },
                { label: 'Dish Type', name: 'dishType', options: dishOptions }
              ].map((filter, idx) => (
                <div key={idx}>
                  <label className="block mb-2 font-medium">{filter.label}</label>
                  <select
                    multiple
                    onChange={(e) =>
                      handleFilterChange(filter.name, Array.from(e.target.selectedOptions, (o) => o.value))
                    }
                    className={inputClasses}
                  >
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              <div>
                <label className="block mb-2 font-medium">Calories Range (e.g., 100-500)</label>
                <input
                  type="text"
                  value={filters.calories}
                  onChange={(e) => handleFilterChange('calories', e.target.value)}
                  placeholder="100-500"
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Time Range (e.g., 10-30 or 30+)</label>
                <input
                  type="text"
                  value={filters.time}
                  onChange={(e) => handleFilterChange('time', e.target.value)}
                  placeholder="10-30 or 30+"
                  className={inputClasses}
                />
              </div>
            </div>
          )}
        </form>

        {/* Results */}
        <div className="mb-16">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <>
              {recipes.length > 0 ? (
                <>
                  <h2 className="text-2xl font-bold mb-6">Found {recipes.length} Recipes</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recipes.map((recipeData, index) => {
                      const { recipe } = recipeData;
                      const isSaved = isRecipeSaved(recipe.url);
                      const isFav = isRecipeFav(recipe.url);

                      return (
                        <div key={index} className={`${cardClasses} rounded-xl overflow-hidden hover:shadow-2xl transition-shadow relative`}>
                          <img src={recipe.image} alt={recipe.label} className="w-full h-48 object-cover" />
                          <div className="p-6">
                            <h3 className="text-lg font-semibold mb-2">{recipe.label}</h3>
                            <div className="flex items-center mb-2">
                              <FiClock className="mr-2" />
                              <span>{recipe.totalTime || "N/A"} min</span>
                            </div>
                            <p className="mb-4 font-medium">{Math.round(recipe.calories)} Calories</p>
                            <div className="flex justify-between items-center">
                              <a
                                href={recipe.url}
                                target="_blank"
                                onClick={() => saveActivity(recipe.label)}
                                rel="noopener noreferrer"
                                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center"
                              >
                                View Recipe
                                <FiShare2 className="ml-2" />
                              </a>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => (isFav ? removeFav(recipe.url) : FavRecipe(recipe))}
                                  className={`p-2 rounded-full ${isFav ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                                >
                                  <FiHeart className={isFav ? 'fill-current' : ''} />
                                </button>
                                <button
                                  onClick={() => (isSaved ? removeRecipe(recipe.url) : saveRecipe(recipe))}
                                  className={`p-2 rounded-full ${isSaved ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                                >
                                  <FiBookmark className={isSaved ? 'fill-current' : ''} />
                                </button>
                              </div>
                            </div>
                          </div>
                          {isSaved && (
                            <div className="absolute top-2 right-2 bg-white text-purple-600 px-2 py-1 rounded-full text-xs font-bold flex items-center">
                              <FiBookmark className="mr-1" /> Saved
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                searched && (
                  <div className="text-center py-20">
                    <h3 className="text-2xl font-semibold mb-2">No Recipes Found</h3>
                    <p className="text-gray-400">Try adjusting your search or filters.</p>
                  </div>
                )
              )}
            </>
          )}
        </div>
      </main>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default Recipes;
