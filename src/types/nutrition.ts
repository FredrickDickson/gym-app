export interface MacroNutrients {
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  calories: number; // kcal
}

export interface FoodItem {
  id: string;
  name: string;
  macros: MacroNutrients;
  servingSize: string; // e.g., "100g", "1 cup"
  confidence?: number; // 0-1 score from AI
}

export interface MealLog {
  id: string;
  name: string; // e.g., "Breakfast", "Lunch", "Snack"
  timestamp: string; // ISO date string
  foods: FoodItem[];
  totalMacros: MacroNutrients;
  imageUrl?: string; // Base64 or URL
}

export interface DailyNutrition {
  date: string; // YYYY-MM-DD
  meals: MealLog[];
  totalMacros: MacroNutrients;
  waterIntake: number; // ml
}

export interface FastingState {
  isFasting: boolean;
  startTime: string | null; // ISO date string
  endTime: string | null; // ISO date string
  goalDuration: number; // hours
}

export interface NutritionGoal {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}
