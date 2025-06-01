import axios from 'axios';

const appId = 'b8e6b112'; 
const appKey = '9eac36ceba817b8386398fe7376d8019'; 

export const fetchRecipes = async (query, filters) => {
  try {
    const params = {
      type: 'public',
      q: query || 'recipe',
      app_id: appId,
      app_key: appKey,
    };

    if (filters.diet.length > 0) params.diet = filters.diet.join(',');
    if (filters.cuisineType.length > 0) params.cuisineType = filters.cuisineType.join(',');
    if (filters.mealType.length > 0) params.mealType = filters.mealType.join(',');
    if (filters.dishType.length > 0) params.dishType = filters.dishType.join(',');
    if (filters.calories) params.calories = filters.calories;
    if (filters.time) params.time = filters.time.replace('+', '%2B');

    const response = await axios.get('https://api.edamam.com/api/recipes/v2', { params });
    return response.data.hits;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};
