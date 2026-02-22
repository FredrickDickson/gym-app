import React from 'react';
import { Camera, ScanBarcode, Utensils, Droplet } from 'lucide-react';

export const NutritionPage = () => {
  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 pt-28 px-6 bg-[#FAFAFA]">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nutrition</h1>
          <p className="text-sm text-gray-500">Log & track macros</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#FF6B6B] text-white rounded-xl text-sm font-bold shadow-lg shadow-red-200">
          <Camera size={16} />
          <span>Log Food</span>
        </button>
      </div>

      {/* Macro Ring */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8 flex items-center justify-between">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="64" cy="64" r="56" stroke="#F3F4F6" strokeWidth="8" fill="none" />
            <circle cx="64" cy="64" r="56" stroke="#FF6B6B" strokeWidth="8" fill="none" strokeDasharray="351" strokeDashoffset="100" strokeLinecap="round" />
            <circle cx="64" cy="64" r="56" stroke="#3B82F6" strokeWidth="8" fill="none" strokeDasharray="351" strokeDashoffset="280" strokeLinecap="round" />
            <circle cx="64" cy="64" r="56" stroke="#F59E0B" strokeWidth="8" fill="none" strokeDasharray="351" strokeDashoffset="320" strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">1,240</span>
            <span className="text-xs text-gray-400">kcal left</span>
          </div>
        </div>
        
        <div className="flex-1 pl-6 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF6B6B]"></div>
              <span className="text-sm font-medium text-gray-600">Protein</span>
            </div>
            <span className="text-sm font-bold text-gray-900">140g</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#3B82F6]"></div>
              <span className="text-sm font-medium text-gray-600">Carbs</span>
            </div>
            <span className="text-sm font-bold text-gray-900">180g</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
              <span className="text-sm font-medium text-gray-600">Fats</span>
            </div>
            <span className="text-sm font-bold text-gray-900">65g</span>
          </div>
        </div>
      </div>

      {/* Meals */}
      <section>
        <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Utensils size={16} />
          Today's Meals
        </h2>
        
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden">
               <img src="https://picsum.photos/seed/oats/100/100" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-900">Oatmeal & Berries</h3>
                <span className="text-xs font-bold text-gray-400">450 kcal</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Breakfast • 8:30 AM</p>
              <div className="flex gap-2 mt-2">
                <span className="px-2 py-0.5 bg-red-50 text-[#FF6B6B] text-[10px] font-bold rounded">24g P</span>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded">45g C</span>
              </div>
            </div>
          </div>

          <button className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-medium flex items-center justify-center gap-2 hover:bg-gray-50">
            <ScanBarcode size={20} />
            Scan Barcode
          </button>
        </div>
      </section>
    </div>
  );
};
