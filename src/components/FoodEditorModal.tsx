import React, { useState } from 'react';
import { X, Check, Plus, Trash2, Edit2, Save } from 'lucide-react';
import { FoodItem, MealLog, MacroNutrients } from '../types/nutrition';

interface FoodEditorModalProps {
  initialItems: FoodItem[];
  image: string;
  onSave: (meal: MealLog) => void;
  onClose: () => void;
}

export const FoodEditorModal: React.FC<FoodEditorModalProps> = ({ initialItems, image, onSave, onClose }) => {
  const [items, setItems] = useState<FoodItem[]>(initialItems);
  const [mealName, setMealName] = useState('Lunch');

  const updateItem = (index: number, field: keyof FoodItem | keyof MacroNutrients, value: any) => {
    const newItems = [...items];
    if (field in newItems[index].macros) {
        newItems[index] = {
            ...newItems[index],
            macros: {
                ...newItems[index].macros,
                [field]: Number(value)
            }
        };
    } else {
        newItems[index] = { ...newItems[index], [field]: value };
    }
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const addNewItem = () => {
    setItems([...items, {
        id: crypto.randomUUID(),
        name: 'New Item',
        macros: { protein: 0, carbs: 0, fat: 0, calories: 0 },
        servingSize: '1 serving'
    }]);
  };

  const calculateTotal = (): MacroNutrients => {
    return items.reduce((acc, item) => ({
        protein: acc.protein + item.macros.protein,
        carbs: acc.carbs + item.macros.carbs,
        fat: acc.fat + item.macros.fat,
        calories: acc.calories + item.macros.calories
    }), { protein: 0, carbs: 0, fat: 0, calories: 0 });
  };

  const handleSave = () => {
    const total = calculateTotal();
    const meal: MealLog = {
        id: crypto.randomUUID(),
        name: mealName,
        timestamp: new Date().toISOString(),
        foods: items,
        totalMacros: total,
        imageUrl: image
    };
    onSave(meal);
  };

  const total = calculateTotal();

  return (
    <div className="fixed inset-0 z-[110] bg-white flex flex-col">
      <div className="relative h-64 bg-gray-900 shrink-0">
        <img src={image} className="w-full h-full object-cover opacity-80" alt="Meal" />
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
            <button onClick={onClose} className="p-2 bg-black/50 backdrop-blur rounded-full text-white">
                <X size={20} />
            </button>
            <button onClick={handleSave} className="px-4 py-2 bg-[#FF6B6B] rounded-full text-white font-bold flex items-center gap-2 shadow-lg">
                <Check size={16} />
                Log Meal
            </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <input 
                type="text" 
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                className="bg-transparent text-3xl font-bold text-white border-b border-white/30 focus:border-white focus:outline-none w-full pb-2"
            />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-32">
        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-2 mb-8">
            <div className="bg-gray-50 p-3 rounded-2xl text-center border border-gray-100">
                <span className="block text-xs font-bold text-gray-400 uppercase">Cals</span>
                <span className="text-lg font-bold text-gray-900">{Math.round(total.calories)}</span>
            </div>
            <div className="bg-blue-50 p-3 rounded-2xl text-center border border-blue-100">
                <span className="block text-xs font-bold text-blue-400 uppercase">Prot</span>
                <span className="text-lg font-bold text-blue-900">{Math.round(total.protein)}g</span>
            </div>
            <div className="bg-orange-50 p-3 rounded-2xl text-center border border-orange-100">
                <span className="block text-xs font-bold text-orange-400 uppercase">Carb</span>
                <span className="text-lg font-bold text-orange-900">{Math.round(total.carbs)}g</span>
            </div>
            <div className="bg-yellow-50 p-3 rounded-2xl text-center border border-yellow-100">
                <span className="block text-xs font-bold text-yellow-400 uppercase">Fat</span>
                <span className="text-lg font-bold text-yellow-900">{Math.round(total.fat)}g</span>
            </div>
        </div>

        <h3 className="font-bold text-gray-900 mb-4 flex justify-between items-center">
            <span>Detected Items</span>
            <button onClick={addNewItem} className="text-xs font-bold text-[#FF6B6B] flex items-center gap-1">
                <Plus size={12} /> Add Item
            </button>
        </h3>

        <div className="space-y-4">
            {items.map((item, i) => (
                <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                        <input 
                            value={item.name}
                            onChange={(e) => updateItem(i, 'name', e.target.value)}
                            className="font-bold text-gray-900 bg-transparent border-b border-transparent focus:border-gray-200 focus:outline-none w-full mr-2"
                        />
                        <button onClick={() => removeItem(i)} className="text-gray-400 hover:text-red-500">
                            <Trash2 size={16} />
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2 text-sm">
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Cals</label>
                            <input 
                                type="number" 
                                value={item.macros.calories}
                                onChange={(e) => updateItem(i, 'calories', e.target.value)}
                                className="w-full font-bold bg-gray-50 rounded px-2 py-1"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Prot</label>
                            <input 
                                type="number" 
                                value={item.macros.protein}
                                onChange={(e) => updateItem(i, 'protein', e.target.value)}
                                className="w-full font-bold bg-gray-50 rounded px-2 py-1"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Carb</label>
                            <input 
                                type="number" 
                                value={item.macros.carbs}
                                onChange={(e) => updateItem(i, 'carbs', e.target.value)}
                                className="w-full font-bold bg-gray-50 rounded px-2 py-1"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Fat</label>
                            <input 
                                type="number" 
                                value={item.macros.fat}
                                onChange={(e) => updateItem(i, 'fat', e.target.value)}
                                className="w-full font-bold bg-gray-50 rounded px-2 py-1"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
