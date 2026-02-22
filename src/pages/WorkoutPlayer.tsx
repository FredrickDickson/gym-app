import React from 'react';
import { X, Maximize2, Play, SkipBack, SkipForward } from 'lucide-react';

export const WorkoutPlayerPage = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://picsum.photos/seed/gym_ropes/430/932" 
          alt="Workout Background" 
          className="w-full h-full object-cover opacity-80"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center p-6 pt-12">
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
          <X size={20} />
        </button>
        <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
          <Maximize2 size={20} />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center">
        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 mb-8">
           <Play size={32} fill="white" className="ml-1" />
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="relative z-10 p-8 pb-12">
        {/* Vertical Text on Left (Rotated) */}
        <div className="absolute left-6 bottom-32 origin-bottom-left -rotate-90">
           <h2 className="text-2xl font-bold whitespace-nowrap">DAY 7: ARM & SHOULDER WORKOUT</h2>
           <p className="text-sm text-gray-300 mt-1">Workouts by Richard Tea</p>
        </div>

        {/* Progress Bar (Vertical on right side in design, but let's stick to standard horizontal for usability or mimic design) */}
        {/* The design has a vertical progress bar on the right. Let's try to mimic it. */}
        <div className="absolute right-6 top-1/4 bottom-32 w-1 bg-white/20 rounded-full overflow-hidden">
           <div className="absolute top-0 left-0 right-0 h-1/3 bg-[#FF6B6B]"></div>
           {/* Time indicators */}
           <div className="absolute top-4 right-4 text-xs rotate-90 origin-top-right">45:37</div>
           <div className="absolute bottom-4 right-4 text-xs rotate-90 origin-bottom-right">16:28</div>
        </div>

        {/* Play Controls Overlay (Simulated) */}
        <div className="flex justify-center items-center gap-8 mb-8">
           <SkipBack size={32} className="text-white/70" />
           <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center">
              <Play size={24} fill="white" className="ml-1" />
           </div>
           <SkipForward size={32} className="text-white/70" />
        </div>
      </div>
    </div>
  );
};
