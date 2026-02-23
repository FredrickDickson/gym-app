import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw } from 'lucide-react';
import { NutritionService } from '../services/nutritionService';
import { FastingState } from '../types/nutrition';

export const FastingTimer: React.FC = () => {
  const [state, setState] = useState<FastingState>(NutritionService.getFastingState());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const updateTimer = () => {
      if (state.isFasting && state.startTime) {
        const start = new Date(state.startTime).getTime();
        const now = Date.now();
        setElapsed(Math.floor((now - start) / 1000));
      } else {
        setElapsed(0);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [state]);

  const toggleFasting = () => {
    const newState = { ...state };
    if (state.isFasting) {
      newState.isFasting = false;
      newState.endTime = new Date().toISOString();
    } else {
      newState.isFasting = true;
      newState.startTime = new Date().toISOString();
      newState.endTime = null;
    }
    setState(newState);
    NutritionService.saveFastingState(newState);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = Math.min(100, (elapsed / (state.goalDuration * 3600)) * 100);

  return (
    <div className="bg-black text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-20">
        <Timer size={120} />
      </div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
            <div>
                <h3 className="text-lg font-bold mb-1">Intermittent Fasting</h3>
                <p className="text-gray-400 text-xs">{state.goalDuration}h Goal • {state.isFasting ? 'Active' : 'Not Started'}</p>
            </div>
            <button 
                onClick={toggleFasting}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    state.isFasting ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                }`}
            >
                {state.isFasting ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
            </button>
        </div>

        <div className="mb-4">
            <div className="text-4xl font-mono font-bold mb-2">{formatTime(elapsed)}</div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>

        <div className="flex gap-4 text-xs text-gray-400">
            <div>
                <span className="block font-bold text-gray-200">Started</span>
                {state.startTime ? new Date(state.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
            </div>
            <div>
                <span className="block font-bold text-gray-200">Goal End</span>
                {state.startTime ? new Date(new Date(state.startTime).getTime() + state.goalDuration * 3600000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
            </div>
        </div>
      </div>
    </div>
  );
};
