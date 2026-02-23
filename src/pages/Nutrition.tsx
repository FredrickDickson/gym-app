import React, { useState, useEffect } from 'react';
import { Camera, Utensils, Clock, Loader2 } from 'lucide-react';
import { NutritionService } from '../services/nutritionService';
import { SpoonacularService, SpoonacularRecipe } from '../services/spoonacularService';
import { DailyNutrition, MealLog, NutritionGoal } from '../types/nutrition';
import { FoodScanner } from '../components/FoodScanner';
import { FoodEditorModal } from '../components/FoodEditorModal';
import { FastingTimer } from '../components/FastingTimer';

import { NearbyPlaces } from '../components/NearbyPlaces';

export const NutritionPage = () => {
  const [todayLog, setTodayLog] = useState<DailyNutrition>(NutritionService.getTodayLog());
  const [goal, setGoal] = useState<NutritionGoal>(NutritionService.getGoal());
  const [showScanner, setShowScanner] = useState(false);
  const [scannedData, setScannedData] = useState<{items: any[], image: string} | null>(null);
  const [suggestions, setSuggestions] = useState<SpoonacularRecipe[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    setTodayLog(NutritionService.getTodayLog());
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    setLoadingSuggestions(true);
    // Calculate remaining macros roughly
    const remainingCals = Math.max(200, goal.calories - todayLog.totalMacros.calories);
    const remainingProtein = Math.max(10, goal.protein - todayLog.totalMacros.protein);
    
    // Fetch from Spoonacular
    const recipes = await SpoonacularService.getMealSuggestions(
        Math.min(remainingProtein, 30), // Don't ask for too much protein per meal
        Math.min(remainingCals, 800)
    );
    setSuggestions(recipes);
    setLoadingSuggestions(false);
  };

  const handleScanComplete = (items: any[], image: string) => {
    setShowScanner(false);
    setScannedData({ items, image });
  };

  const handleLogMeal = (meal: MealLog) => {
    NutritionService.addMeal(meal);
    setTodayLog(NutritionService.getTodayLog());
    setScannedData(null);
  };

  const MacroBar = ({ label, current, target, color }: { label: string, current: number, target: number, color: string }) => {
    const percent = Math.min(100, (current / target) * 100);
    return (
        <div className="mb-3">
            <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-gray-500">{label}</span>
                <span className="text-gray-900">{Math.round(current)} / {target}g</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${color}`} style={{ width: `${percent}%` }}></div>
            </div>
        </div>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 pt-28 px-6 bg-[#FAFAFA]">
      {showScanner && (
        <FoodScanner 
            onClose={() => setShowScanner(false)}
            onScanComplete={handleScanComplete}
        />
      )}

      {scannedData && (
        <FoodEditorModal
            initialItems={scannedData.items}
            image={scannedData.image}
            onSave={handleLogMeal}
            onClose={() => setScannedData(null)}
        />
      )}

      <div className="flex justify-between items-end mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nutrition</h1>
        <button 
            onClick={() => setShowScanner(true)}
            className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        >
            <Camera size={20} />
        </button>
      </div>

      {/* Fasting Timer */}
      <div className="mb-8">
        <FastingTimer />
      </div>

      {/* Daily Summary */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex justify-between items-start mb-6">
            <div>
                <span className="text-sm font-bold text-gray-400 uppercase">Calories Remaining</span>
                <div className="text-3xl font-bold text-gray-900 mt-1">
                    {Math.max(0, goal.calories - todayLog.totalMacros.calories)}
                </div>
            </div>
            <div className="text-right">
                <span className="text-xs font-bold text-gray-400 uppercase block">Goal</span>
                <span className="text-lg font-bold text-gray-900">{goal.calories}</span>
            </div>
        </div>

        <MacroBar label="Protein" current={todayLog.totalMacros.protein} target={goal.protein} color="bg-blue-500" />
        <MacroBar label="Carbs" current={todayLog.totalMacros.carbs} target={goal.carbs} color="bg-orange-500" />
        <MacroBar label="Fat" current={todayLog.totalMacros.fat} target={goal.fat} color="bg-yellow-500" />
      </div>

      {/* Meal Suggestions */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Utensils size={16} />
                Suggestions
            </h2>
            <button onClick={loadSuggestions} className="text-xs font-bold text-[#FF6B6B]">
                Refresh
            </button>
        </div>
        
        {loadingSuggestions ? (
            <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-gray-400" size={24} />
            </div>
        ) : (
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 mb-6">
                {suggestions.length > 0 ? (
                    suggestions.map((meal) => (
                        <div key={meal.id} className="min-w-[200px] w-[200px] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                            <div className="h-32 bg-gray-100 relative">
                                <img src={meal.image} alt={meal.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-3 flex-1 flex flex-col">
                                <h3 className="font-bold text-gray-900 mb-1 text-sm line-clamp-2 h-10">{meal.title}</h3>
                                <div className="mt-auto">
                                    <p className="text-xs text-gray-500 mb-2 font-bold">{meal.calories} kcal</p>
                                    <div className="flex gap-2 text-[10px] font-bold text-gray-400">
                                        <span className="text-blue-400">{meal.protein}</span>
                                        <span className="text-orange-400">{meal.carbs}</span>
                                        <span className="text-yellow-400">{meal.fat}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-gray-400 text-sm italic w-full text-center py-4">
                        No suggestions found based on your macros.
                    </div>
                )}
            </div>
        )}

        <NearbyPlaces type="food" />
      </section>

      {/* Meal Timeline */}
      <section>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Clock size={16} />
                Today's Meals
            </h2>
        </div>

        <div className="space-y-4">
            {todayLog.meals.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm bg-white rounded-2xl border border-gray-100">
                    No meals logged yet. Tap the camera to start.
                </div>
            ) : (
                todayLog.meals.map((meal) => (
                    <div key={meal.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                            {meal.imageUrl ? (
                                <img src={meal.imageUrl} className="w-full h-full object-cover" alt={meal.name} />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <Utensils size={20} />
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold text-gray-900">{meal.name}</h3>
                                <span className="text-xs font-bold text-gray-500">{new Date(meal.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-2 line-clamp-1">
                                {meal.foods.map(f => f.name).join(', ')}
                            </p>
                            <div className="flex gap-3 text-xs font-bold text-gray-400">
                                <span>{Math.round(meal.totalMacros.calories)} cal</span>
                                <span className="text-blue-400">{Math.round(meal.totalMacros.protein)}p</span>
                                <span className="text-orange-400">{Math.round(meal.totalMacros.carbs)}c</span>
                                <span className="text-yellow-400">{Math.round(meal.totalMacros.fat)}f</span>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
      </section>
    </div>
  );
};
