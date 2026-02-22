import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { WorkoutSession, WorkoutSetLog } from '../types/fitness';
import { WorkoutService } from '../services/workoutService';

interface WorkoutHistoryEditorProps {
  session: WorkoutSession;
  onSave: (updatedSession: WorkoutSession) => void;
  onClose: () => void;
}

export const WorkoutHistoryEditor: React.FC<WorkoutHistoryEditorProps> = ({ session, onSave, onClose }) => {
  const [editedSession, setEditedSession] = useState<WorkoutSession>(session);

  const updateSet = (exerciseIndex: number, setIndex: number, field: keyof WorkoutSetLog, value: number) => {
    const newExercises = [...editedSession.exercises];
    const newSets = [...newExercises[exerciseIndex].sets];
    newSets[setIndex] = { ...newSets[setIndex], [field]: value };
    newExercises[exerciseIndex] = { ...newExercises[exerciseIndex], sets: newSets };
    setEditedSession({ ...editedSession, exercises: newExercises });
  };

  const handleSave = () => {
    onSave(editedSession);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
        <h2 className="text-xl font-bold text-gray-900">Edit Workout</h2>
        <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-50">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-32">
        <div className="mb-8">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Workout Title</label>
            <input 
                type="text" 
                value={editedSession.title}
                onChange={(e) => setEditedSession({...editedSession, title: e.target.value})}
                className="w-full text-2xl font-bold border-b-2 border-gray-100 focus:border-black focus:outline-none py-2 bg-transparent"
            />
        </div>

        <div className="space-y-6">
          {editedSession.exercises.map((exerciseLog, exIndex) => {
            const exerciseDef = WorkoutService.getExerciseById(exerciseLog.exerciseId);
            return (
              <div key={exIndex} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs">{exIndex + 1}</span>
                  {exerciseDef?.name || 'Unknown Exercise'}
                </h3>
                
                <div className="grid grid-cols-[40px_1fr_1fr] gap-4 mb-2 text-xs font-bold text-gray-400 uppercase text-center px-2">
                    <span>Set</span>
                    <span>lbs</span>
                    <span>Reps</span>
                </div>

                <div className="space-y-3">
                    {exerciseLog.sets.map((set, setIndex) => (
                        <div key={setIndex} className="grid grid-cols-[40px_1fr_1fr] gap-4 items-center">
                            <div className="text-center font-bold text-gray-500 bg-white rounded-lg py-2 border border-gray-100">
                              {set.setNumber}
                            </div>
                            <input 
                                type="number" 
                                value={set.weight}
                                onChange={(e) => updateSet(exIndex, setIndex, 'weight', parseInt(e.target.value) || 0)}
                                className="bg-white border border-gray-200 rounded-xl text-center py-2 font-bold text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                            />
                            <input 
                                type="number" 
                                value={set.reps}
                                onChange={(e) => updateSet(exIndex, setIndex, 'reps', parseInt(e.target.value) || 0)}
                                className="bg-white border border-gray-200 rounded-xl text-center py-2 font-bold text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                            />
                        </div>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-6 border-t border-gray-100 bg-white absolute bottom-0 left-0 right-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <button 
            onClick={handleSave}
            className="w-full py-4 bg-black text-white rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
        >
            <Save size={20} />
            Save Changes
        </button>
      </div>
    </div>
  );
};
