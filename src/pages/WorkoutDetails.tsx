import React from 'react';
import { ArrowLeft, Clock, Zap, Dumbbell, Play, MoreHorizontal } from 'lucide-react';
import { WorkoutPlan } from '../types/fitness';

interface WorkoutDetailsProps {
  plan: WorkoutPlan;
  onStart: () => void;
  onClose: () => void;
}

export const WorkoutDetails: React.FC<WorkoutDetailsProps> = ({ plan, onStart, onClose }) => {
  return (
    <div className="fixed inset-0 z-[50] bg-[#FAFAFA] flex flex-col overflow-hidden">
      {/* Header Image & Nav */}
      <div className="relative h-72 shrink-0">
        <img
          src={plan.exercises[0]?.videoUrl || "https://picsum.photos/seed/fitness_main/800/600"}
          alt={plan.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAFA] via-transparent to-black/30"></div>
        
        <div className="absolute top-0 left-0 right-0 p-6 pt-12 flex justify-between items-center text-white">
          <button 
            onClick={onClose}
            className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <button className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors">
            <MoreHorizontal size={24} />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-[#FF6B6B] text-white rounded-lg text-xs font-bold uppercase tracking-wide">
              {plan.type}
            </span>
            <span className="px-2 py-1 bg-black/50 backdrop-blur-md text-white rounded-lg text-xs font-bold uppercase tracking-wide flex items-center gap-1">
              <Zap size={10} fill="currentColor" /> {plan.intensity} Intensity
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{plan.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
            <span className="flex items-center gap-1"><Clock size={14} /> {plan.duration}</span>
            <span className="flex items-center gap-1"><Dumbbell size={14} /> {plan.exercises.length} Exercises</span>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-32">
        <div className="space-y-4">
          {plan.exercises.map((exercise, index) => (
            <div key={exercise.id} className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                <img 
                  src={exercise.videoUrl} 
                  alt={exercise.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">{exercise.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{exercise.muscleGroup} • {exercise.equipment}</p>
                <div className="flex items-center gap-3 text-xs font-bold text-gray-700">
                  <span className="bg-gray-100 px-2 py-1 rounded-md">{exercise.defaultSets} Sets</span>
                  <span className="bg-gray-100 px-2 py-1 rounded-md">{exercise.defaultReps} Reps</span>
                  {exercise.defaultRest && (
                    <span className="text-gray-400 font-medium">{exercise.defaultRest}s Rest</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Bottom Action */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA] to-transparent">
        <button 
          onClick={onStart}
          className="w-full py-4 bg-black text-white rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
        >
          <Play size={20} fill="currentColor" />
          Start Workout
        </button>
      </div>
    </div>
  );
};
