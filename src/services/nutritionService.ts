import { GoogleGenAI } from "@google/genai";
import { DailyNutrition, MealLog, FoodItem, MacroNutrients, NutritionGoal, FastingState } from '../types/nutrition';

const NUTRITION_HISTORY_KEY = 'fit_track_nutrition_history';
const FASTING_STATE_KEY = 'fit_track_fasting_state';
const NUTRITION_GOAL_KEY = 'fit_track_nutrition_goal';

const DEFAULT_GOAL: NutritionGoal = {
  calories: 2500,
  protein: 180,
  carbs: 250,
  fat: 80
};

export const NutritionService = {
  // --- Data Persistence ---
  getHistory: (): DailyNutrition[] => {
    try {
      const data = localStorage.getItem(NUTRITION_HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  getTodayLog: (): DailyNutrition => {
    const history = NutritionService.getHistory();
    const today = new Date().toISOString().split('T')[0];
    let log = history.find(d => d.date === today);
    
    if (!log) {
      log = {
        date: today,
        meals: [],
        totalMacros: { protein: 0, carbs: 0, fat: 0, calories: 0 },
        waterIntake: 0
      };
    }
    return log;
  },

  saveTodayLog: (log: DailyNutrition) => {
    const history = NutritionService.getHistory();
    const index = history.findIndex(d => d.date === log.date);
    if (index !== -1) {
      history[index] = log;
    } else {
      history.push(log);
    }
    localStorage.setItem(NUTRITION_HISTORY_KEY, JSON.stringify(history));
  },

  addMeal: (meal: MealLog) => {
    const log = NutritionService.getTodayLog();
    log.meals.push(meal);
    
    // Recalculate totals
    log.totalMacros = log.meals.reduce((acc, m) => ({
      protein: acc.protein + m.totalMacros.protein,
      carbs: acc.carbs + m.totalMacros.carbs,
      fat: acc.fat + m.totalMacros.fat,
      calories: acc.calories + m.totalMacros.calories
    }), { protein: 0, carbs: 0, fat: 0, calories: 0 });

    NutritionService.saveTodayLog(log);
  },

  // --- Goals ---
  getGoal: (): NutritionGoal => {
    try {
      const data = localStorage.getItem(NUTRITION_GOAL_KEY);
      return data ? JSON.parse(data) : DEFAULT_GOAL;
    } catch (e) {
      return DEFAULT_GOAL;
    }
  },

  saveGoal: (goal: NutritionGoal) => {
    localStorage.setItem(NUTRITION_GOAL_KEY, JSON.stringify(goal));
  },

  // --- Fasting ---
  getFastingState: (): FastingState => {
    try {
      const data = localStorage.getItem(FASTING_STATE_KEY);
      return data ? JSON.parse(data) : { isFasting: false, startTime: null, endTime: null, goalDuration: 16 };
    } catch (e) {
      return { isFasting: false, startTime: null, endTime: null, goalDuration: 16 };
    }
  },

  saveFastingState: (state: FastingState) => {
    localStorage.setItem(FASTING_STATE_KEY, JSON.stringify(state));
  },

  // --- AI Analysis ---
  analyzeFoodImage: async (base64Image: string, apiKey: string): Promise<FoodItem[]> => {
    const ai = new GoogleGenAI({ apiKey });
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image.split(',')[1] // Remove data:image/jpeg;base64, prefix
              }
            },
            {
              text: `Analyze this food image. Identify the food items and estimate their macronutrients. 
                     Return ONLY a JSON array with the following structure:
                     [
                       {
                         "name": "Food Name",
                         "macros": { "protein": 0, "carbs": 0, "fat": 0, "calories": 0 },
                         "servingSize": "e.g. 1 cup",
                         "confidence": 0.9
                       }
                     ]
                     Do not include markdown formatting.`
            }
          ]
        }
      });

      const text = response.text || "[]";
      // Clean up markdown if present
      const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const items = JSON.parse(jsonStr);
      
      return items.map((item: any) => ({
        ...item,
        id: crypto.randomUUID()
      }));

    } catch (error) {
      console.error("AI Analysis Failed", error);
      // Fallback mock data
      return [
        {
          id: crypto.randomUUID(),
          name: "Detected Food (Fallback)",
          macros: { protein: 20, carbs: 30, fat: 10, calories: 300 },
          servingSize: "1 serving",
          confidence: 0.5
        }
      ];
    }
  }
};
