export interface SpoonacularRecipe {
  id: number;
  title: string;
  image: string;
  imageType: string;
  calories: number;
  protein: string;
  fat: string;
  carbs: string;
}

export const SpoonacularService = {
  // Use the provided key or fallback to env
  API_KEY: process.env.SPOONACULAR_API_KEY || '1206b7680e7f46d085cb8b44f18bdf57',
  BASE_URL: 'https://api.spoonacular.com/recipes',

  getMealSuggestions: async (
    minProtein: number = 10,
    maxCalories: number = 800
  ): Promise<SpoonacularRecipe[]> => {
    try {
      const params = new URLSearchParams({
        apiKey: SpoonacularService.API_KEY,
        minProtein: minProtein.toString(),
        maxCalories: maxCalories.toString(),
        number: '5',
        random: 'true'
      });

      const response = await fetch(`${SpoonacularService.BASE_URL}/findByNutrients?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Spoonacular API Error:', error);
      return [];
    }
  },

  searchRecipes: async (query: string): Promise<SpoonacularRecipe[]> => {
    try {
      const params = new URLSearchParams({
        apiKey: SpoonacularService.API_KEY,
        query: query,
        number: '5',
        addRecipeNutrition: 'true'
      });

      const response = await fetch(`${SpoonacularService.BASE_URL}/complexSearch?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to search recipes');
      }

      const data = await response.json();
      return data.results.map((item: any) => ({
        id: item.id,
        title: item.title,
        image: item.image,
        imageType: item.imageType,
        calories: item.nutrition.nutrients.find((n: any) => n.name === 'Calories')?.amount || 0,
        protein: item.nutrition.nutrients.find((n: any) => n.name === 'Protein')?.amount + 'g' || '0g',
        fat: item.nutrition.nutrients.find((n: any) => n.name === 'Fat')?.amount + 'g' || '0g',
        carbs: item.nutrition.nutrients.find((n: any) => n.name === 'Carbohydrates')?.amount + 'g' || '0g',
      }));
    } catch (error) {
      console.error('Spoonacular Search Error:', error);
      return [];
    }
  }
};
