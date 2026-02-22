import React, { useState } from 'react';
import { ArrowRight, Ruler, Weight } from 'lucide-react';

interface MetricsStepProps {
  onNext: () => void;
}

export const MetricsStep: React.FC<MetricsStepProps> = ({ onNext }) => {
  const [unitSystem, setUnitSystem] = useState<'imperial' | 'metric'>('imperial');

  return (
    <div className="flex flex-col h-full bg-white p-6 pt-12">
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Baseline Metrics</h2>
        <p className="text-gray-500 mb-8">
          Let's establish your starting point.
        </p>

        {/* Unit Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
          <button 
            onClick={() => setUnitSystem('imperial')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
              unitSystem === 'imperial' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'
            }`}
          >
            Imperial (lbs/ft)
          </button>
          <button 
            onClick={() => setUnitSystem('metric')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
              unitSystem === 'metric' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'
            }`}
          >
            Metric (kg/cm)
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Weight size={16} />
              Weight
            </label>
            <div className="relative">
              <input 
                type="number" 
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-4 text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                placeholder="0"
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">
                {unitSystem === 'imperial' ? 'lbs' : 'kg'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Ruler size={16} />
              Height
            </label>
            <div className="flex gap-4">
              {unitSystem === 'imperial' ? (
                <>
                  <div className="relative flex-1">
                    <input 
                      type="number" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-4 text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                      placeholder="0"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">ft</span>
                  </div>
                  <div className="relative flex-1">
                    <input 
                      type="number" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-4 text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                      placeholder="0"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">in</span>
                  </div>
                </>
              ) : (
                <div className="relative flex-1">
                  <input 
                    type="number" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-4 text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                    placeholder="0"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">cm</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={onNext}
        className="w-full py-4 bg-black text-white rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2"
      >
        Next Step
        <ArrowRight size={20} />
      </button>
    </div>
  );
};
