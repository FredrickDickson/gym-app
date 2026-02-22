import React, { useState } from 'react';
import { Check, ChevronRight, Dumbbell, Calendar, Trophy, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PlanBuilderProps {
  onClose: () => void;
  onPlanGenerated: (plan: any) => void;
}

const GOALS = [
  { id: 'hypertrophy', name: 'Build Muscle', icon: '💪', desc: 'Maximize growth with volume' },
  { id: 'strength', name: 'Get Stronger', icon: '🏋️', desc: 'Heavy weights, lower reps' },
  { id: 'fatloss', name: 'Lose Fat', icon: '🔥', desc: 'High intensity, calorie burn' },
  { id: 'endurance', name: 'Endurance', icon: '🏃', desc: 'Stamina and cardio focus' },
];

const EQUIPMENT_OPTIONS = [
  { id: 'full_gym', name: 'Full Gym', desc: 'Access to all machines & weights' },
  { id: 'dumbbells', name: 'Dumbbells Only', desc: 'Home setup with free weights' },
  { id: 'bodyweight', name: 'Bodyweight', desc: 'No equipment needed' },
];

export const PlanBuilder: React.FC<PlanBuilderProps> = ({ onClose, onPlanGenerated }) => {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('');
  const [equipment, setEquipment] = useState('');
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      // Mock Plan Generation
      const plan = {
        goal,
        equipment,
        daysPerWeek,
        schedule: Array.from({ length: daysPerWeek }).map((_, i) => ({
          day: `Day ${i + 1}`,
          title: i % 2 === 0 ? 'Upper Body' : 'Lower Body',
          duration: '45-60 min',
          exercises: 6
        }))
      };
      onPlanGenerated(plan);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#FAFAFA] flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 flex justify-between items-center bg-white border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">Build Your Plan</h2>
        <button onClick={onClose} className="p-2 bg-gray-100 rounded-full">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 className="text-2xl font-bold mb-2">What's your main goal?</h3>
              <p className="text-gray-500 mb-6">We'll tailor volume and intensity to this.</p>
              
              <div className="space-y-3">
                {GOALS.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGoal(g.id)}
                    className={`w-full p-4 rounded-2xl border-2 text-left flex items-center gap-4 transition-all ${
                      goal === g.id 
                        ? 'border-[#FF6B6B] bg-red-50' 
                        : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                  >
                    <div className="text-2xl">{g.icon}</div>
                    <div>
                      <h4 className="font-bold text-gray-900">{g.name}</h4>
                      <p className="text-xs text-gray-500">{g.desc}</p>
                    </div>
                    {goal === g.id && <Check size={20} className="ml-auto text-[#FF6B6B]" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 className="text-2xl font-bold mb-2">Available Equipment</h3>
              <p className="text-gray-500 mb-6">What do you have access to?</p>
              
              <div className="space-y-3">
                {EQUIPMENT_OPTIONS.map((eq) => (
                  <button
                    key={eq.id}
                    onClick={() => setEquipment(eq.id)}
                    className={`w-full p-4 rounded-2xl border-2 text-left flex items-center gap-4 transition-all ${
                      equipment === eq.id 
                        ? 'border-[#FF6B6B] bg-red-50' 
                        : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                  >
                    <div className="p-2 bg-gray-100 rounded-xl">
                      <Dumbbell size={20} className="text-gray-700" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{eq.name}</h4>
                      <p className="text-xs text-gray-500">{eq.desc}</p>
                    </div>
                    {equipment === eq.id && <Check size={20} className="ml-auto text-[#FF6B6B]" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 className="text-2xl font-bold mb-2">Weekly Schedule</h3>
              <p className="text-gray-500 mb-6">How many days can you train?</p>
              
              <div className="bg-white p-6 rounded-3xl border border-gray-100 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-gray-900 text-lg">{daysPerWeek} Days / Week</span>
                </div>
                <input 
                  type="range" 
                  min="2" 
                  max="6" 
                  step="1"
                  value={daysPerWeek}
                  onChange={(e) => setDaysPerWeek(parseInt(e.target.value))}
                  className="w-full accent-[#FF6B6B] h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-2 text-xs text-gray-400 font-bold">
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                  <span>6</span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-2xl flex gap-3 items-start">
                <Calendar size={20} className="text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-bold text-blue-900 text-sm">Recommendation</h4>
                  <p className="text-xs text-blue-700 mt-1">
                    Based on your goal to <span className="font-bold">{GOALS.find(g => g.id === goal)?.name}</span>, 
                    we recommend at least 4 days for optimal results.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
          
          {step === 4 && (
             <motion.div 
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full pt-20"
            >
              <div className="w-20 h-20 border-4 border-[#FF6B6B] border-t-transparent rounded-full animate-spin mb-6"></div>
              <h3 className="text-xl font-bold text-gray-900">Generating Plan...</h3>
              <p className="text-gray-500">Balancing volume and recovery</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Actions */}
      {step < 4 && (
        <div className="p-6 bg-white border-t border-gray-100">
          <button 
            onClick={() => {
              if (step < 3) setStep(step + 1);
              else {
                setStep(4);
                handleGenerate();
              }
            }}
            disabled={
              (step === 1 && !goal) || 
              (step === 2 && !equipment)
            }
            className="w-full py-4 bg-black text-white rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === 3 ? 'Generate Plan' : 'Next Step'}
            <ArrowRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};
