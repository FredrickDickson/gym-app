import React, { useState, useEffect } from 'react';
import { Play, QrCode, Search, Dumbbell, Calendar, ChevronRight, Zap, Trophy, Clock, Check, History, Filter, Plus, Timer, Edit2, Loader2 } from 'lucide-react';
import { GymScanner } from '../components/GymScanner';
import { PlanBuilder } from '../components/PlanBuilder';
import { ExerciseDetailModal } from '../components/ExerciseDetailModal';
import { WorkoutDetails } from './WorkoutDetails';
import { WorkoutHistoryEditor } from '../components/WorkoutHistoryEditor';
import { WorkoutService, EXERCISE_DATABASE } from '../services/workoutService';
import { ImageService } from '../services/imageService';
import { WorkoutSession, Exercise } from '../types/fitness';
import { format } from 'date-fns';

export const FitnessPage = ({ onPlay }: { onPlay: () => void }) => {
  const [showScanner, setShowScanner] = useState(false);
  const [showPlanBuilder, setShowPlanBuilder] = useState(false);
  const [showWorkoutDetails, setShowWorkoutDetails] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [activePlan, setActivePlan] = useState<any>(null);
  const [history, setHistory] = useState<WorkoutSession[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeEquipment, setActiveEquipment] = useState('All');
  const [activeWorkoutDuration, setActiveWorkoutDuration] = useState<number | null>(null);
  const [editingSession, setEditingSession] = useState<WorkoutSession | null>(null);
  const [images, setImages] = useState<Record<string, string> | null>(null);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);

  // Get the recommended plan (mock)
  const recommendedPlan = WorkoutService.getRecommendedPlan();

  useEffect(() => {
    // Load history on mount
    setHistory(WorkoutService.getHistory());

    // Check for active session (mock)
    const activeSession = WorkoutService.getActiveSession();
    if (activeSession) {
      const start = new Date(activeSession.date).getTime();
      const interval = setInterval(() => {
        setActiveWorkoutDuration(Math.floor((Date.now() - start) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }

    // Load or Generate Images
    const loadImages = async () => {
      const existingImages = ImageService.getImages();
      if (existingImages) {
        setImages(existingImages);
      } else {
        setIsGeneratingImages(true);
        const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
        if (apiKey) {
            const generated = await ImageService.generateImages(apiKey);
            setImages(generated);
        } else {
            console.warn("No API Key found for image generation");
        }
        setIsGeneratingImages(false);
      }
    };
    loadImages();
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleScanComplete = (equipment: string[]) => {
    setShowScanner(false);
    alert(`Built workout using: ${equipment.join(', ')}`);
  };

  const handlePlanGenerated = (plan: any) => {
    setActivePlan(plan);
    setShowPlanBuilder(false);
  };

  const handleSaveSession = (updatedSession: WorkoutSession) => {
    WorkoutService.updateSession(updatedSession);
    setHistory(WorkoutService.getHistory());
    setEditingSession(null);
  };

  const CATEGORIES = ['All', 'Strength', 'Cardio', 'HIIT', 'Flexibility'];
  const EQUIPMENT_TYPES = ['Dumbbells', 'Barbell', 'Machines', 'Bodyweight'];

  // Mock "Up Next" exercises based on the service data
  const upNextExercises = EXERCISE_DATABASE.slice(0, 4).map(ex => ({
    ...ex,
    videoUrl: images?.[`ex_${ex.id}`] || ex.videoUrl
  }));

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 pt-28 px-6 bg-[#FAFAFA]">
      {isGeneratingImages && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-white">
            <Loader2 size={48} className="animate-spin mb-4 text-[#FF6B6B]" />
            <h2 className="text-2xl font-bold mb-2">Designing Your App...</h2>
            <p className="text-gray-400">Generating custom assets with Nano Banana</p>
        </div>
      )}

      {showScanner && (
        <GymScanner 
          onClose={() => setShowScanner(false)} 
          onScanComplete={handleScanComplete} 
        />
      )}

      {showPlanBuilder && (
        <PlanBuilder 
          onClose={() => setShowPlanBuilder(false)}
          onPlanGenerated={handlePlanGenerated}
        />
      )}

      {showWorkoutDetails && (
        <WorkoutDetails 
          plan={{
            ...recommendedPlan,
            // Use hero image for the plan details
            exercises: recommendedPlan.exercises.map(ex => ({
                ...ex,
                videoUrl: images?.[`ex_${ex.id}`] || ex.videoUrl
            }))
          }}
          onStart={() => {
            setShowWorkoutDetails(false);
            onPlay();
          }}
          onClose={() => setShowWorkoutDetails(false)}
        />
      )}

      {selectedExercise && (
        <ExerciseDetailModal 
          exercise={selectedExercise} 
          onClose={() => setSelectedExercise(null)} 
        />
      )}

      {editingSession && (
        <WorkoutHistoryEditor 
          session={editingSession}
          onSave={handleSaveSession}
          onClose={() => setEditingSession(null)}
        />
      )}

      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fitness</h1>
          {activeWorkoutDuration !== null && (
            <div className="flex items-center gap-2 text-[#FF6B6B] font-bold text-sm mt-1 animate-pulse">
              <Timer size={14} />
              <span>Workout in progress: {formatDuration(activeWorkoutDuration)}</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button 
            className="flex items-center justify-center w-10 h-10 bg-white border border-gray-100 rounded-xl text-gray-700 shadow-sm"
            onClick={() => alert('Create Custom Workout')}
          >
            <Plus size={20} />
          </button>
          <button 
            onClick={() => setShowScanner(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-sm font-bold shadow-lg hover:scale-105 transition-transform"
          >
            <QrCode size={16} />
            <span>Scan Gym</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search exercises, workouts..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-gray-100 rounded-2xl py-3 pl-10 pr-4 text-sm font-bold text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-200"
        />
      </div>

      {/* Category & Equipment Filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
              activeCategory === cat 
                ? 'bg-gray-900 text-white' 
                : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
        <div className="w-[1px] h-8 bg-gray-200 mx-1"></div>
        {EQUIPMENT_TYPES.map(eq => (
          <button
            key={eq}
            onClick={() => setActiveEquipment(eq)}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
              activeEquipment === eq 
                ? 'bg-gray-900 text-white' 
                : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
            }`}
          >
            {eq}
          </button>
        ))}
      </div>

      {/* Target Timeline & Compliance */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Trophy size={16} className="text-[#FF6B6B]" />
            Goal: {activePlan ? activePlan.goal.replace('_', ' ').toUpperCase() : 'Athletic Build'}
          </h2>
          <span className="text-xs font-bold text-gray-400">8 weeks left</span>
        </div>

        {/* Timeline Bar */}
        <div className="relative h-2 bg-gray-100 rounded-full mb-6">
          <div className="absolute top-0 left-0 h-full w-[65%] bg-[#FF6B6B] rounded-full"></div>
          {[0, 25, 50, 75, 100].map((pos) => (
            <div 
              key={pos} 
              className={`absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full ${pos <= 65 ? 'bg-white' : 'bg-gray-300'}`}
              style={{ left: `${pos}%` }}
            />
          ))}
        </div>

        {/* Compliance Stats */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium uppercase">Compliance</span>
            <span className="text-xl font-bold text-gray-900">94%</span>
          </div>
          <div className="h-8 w-[1px] bg-gray-100"></div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium uppercase">Streak</span>
            <span className="text-xl font-bold text-gray-900">12 Days</span>
          </div>
          <div className="h-8 w-[1px] bg-gray-100"></div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium uppercase">Volume</span>
            <span className="text-xl font-bold text-gray-900">12.4k</span>
          </div>
        </div>
      </div>

      {/* Next Workout Card */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Dumbbell size={16} />
            Up Next
          </h2>
          <button 
            onClick={() => setShowPlanBuilder(true)}
            className="text-xs font-bold text-[#FF6B6B]"
          >
            {activePlan ? 'Regenerate Plan' : 'Build Plan'}
          </button>
        </div>
        
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 cursor-pointer group hover:shadow-md transition-all">
          <div className="relative h-48 rounded-2xl overflow-hidden mb-4" onClick={() => setShowWorkoutDetails(true)}>
            <img 
              src={images?.fitness_hero || "https://picsum.photos/seed/fitness_main/400/300"}
              alt="Workout" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            
            <div className="absolute bottom-4 left-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-[#FF6B6B] rounded text-[10px] font-bold uppercase tracking-wide">High Intensity</span>
                <span className="px-2 py-0.5 bg-white/20 backdrop-blur rounded text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
                  <Clock size={10} /> 45 min
                </span>
              </div>
              <h3 className="text-xl font-bold">Push Day: Chest & Tris</h3>
            </div>

            <div className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center text-black shadow-lg group-hover:scale-110 transition-transform">
              <Play size={20} fill="currentColor" className="ml-1" />
            </div>
          </div>
          
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {upNextExercises.map((ex) => (
              <button 
                key={ex.id} 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedExercise(ex);
                }}
                className="px-3 py-1 bg-gray-50 rounded-lg text-xs font-bold text-gray-600 whitespace-nowrap border border-gray-100 hover:bg-gray-100 transition-colors"
              >
                {ex.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Workout History */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <History size={16} />
            Recent History
          </h2>
          <button className="text-xs font-bold text-gray-400 flex items-center">
            View All <ChevronRight size={12} />
          </button>
        </div>

        <div className="space-y-3">
          {history.length === 0 ? (
             <div className="text-center py-8 text-gray-400 text-sm bg-white rounded-2xl border border-gray-100">
               No workouts yet. Start training!
             </div>
          ) : (
            history.map((session) => (
              <div 
                key={session.id} 
                onClick={() => setEditingSession(session)}
                className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{session.title}</h3>
                  <p className="text-xs text-gray-500">{format(new Date(session.date), 'MMM d, h:mm a')} • {session.exercises.length} Exercises</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                    <Clock size={12} />
                    {Math.floor(session.duration / 60)} min
                  </div>
                  <Edit2 size={14} className="text-gray-300" />
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};
