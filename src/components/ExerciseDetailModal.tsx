import React from 'react';
import { X, Dumbbell, Play } from 'lucide-react';
import { motion } from 'motion/react';
import { Exercise } from '../types/fitness';

interface ExerciseDetailModalProps {
  exercise: Exercise;
  onClose: () => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({ exercise, onClose }) => {
  return (
    <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center pointer-events-none">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl pointer-events-auto max-h-[90vh] flex flex-col"
      >
        <div className="relative h-64 bg-gray-900">
          <img 
            src={exercise.videoUrl} 
            alt={exercise.name} 
            className="w-full h-full object-cover opacity-80"
            referrerPolicy="no-referrer"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full backdrop-blur-md"
          >
            <X size={20} />
          </button>
          <div className="absolute bottom-4 left-4 text-white">
            <span className="px-2 py-1 bg-[#FF6B6B] rounded text-[10px] font-bold uppercase tracking-wide mb-2 inline-block">
              {exercise.type}
            </span>
            <h2 className="text-2xl font-bold">{exercise.name}</h2>
          </div>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
              <span className="block text-xs text-gray-400 font-bold uppercase">Target</span>
              <span className="font-bold text-gray-900">{exercise.muscleGroup}</span>
            </div>
            <div className="flex-1 p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
              <span className="block text-xs text-gray-400 font-bold uppercase">Equipment</span>
              <span className="font-bold text-gray-900">{exercise.equipment}</span>
            </div>
          </div>

          <h3 className="font-bold text-gray-900 mb-2">Instructions</h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            {exercise.instructions}
          </p>

          <h3 className="font-bold text-gray-900 mb-2">Standard Protocol</h3>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Dumbbell size={16} />
              <span>{exercise.defaultSets} Sets</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div>{exercise.defaultReps} Reps</div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div>{exercise.defaultRest}s Rest</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
