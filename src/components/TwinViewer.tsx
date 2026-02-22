import React, { useState } from 'react';
import { RotateCw, Maximize2, SplitSquareHorizontal, Target, User } from 'lucide-react';
import { Snapshot } from '../types/snapshot';
import { motion, AnimatePresence } from 'motion/react';

interface TwinViewerProps {
  snapshot: Snapshot | null;
  viewMode: 'current' | 'target' | 'split';
  onViewModeChange: (mode: 'current' | 'target' | 'split') => void;
}

export const TwinViewer: React.FC<TwinViewerProps> = ({ snapshot, viewMode, onViewModeChange }) => {
  const [angle, setAngle] = useState<'front' | 'side' | 'back'>('front');
  const [isRotating, setIsRotating] = useState(false);

  const rotate = () => {
    setIsRotating(true);
    if (angle === 'front') setAngle('side');
    else if (angle === 'side') setAngle('back');
    else setAngle('front');
    setTimeout(() => setIsRotating(false), 300);
  };

  if (!snapshot) {
    return (
      <div className="w-full aspect-[3/4] bg-gray-100 rounded-3xl flex items-center justify-center text-gray-400">
        <p>No snapshot data</p>
      </div>
    );
  }

  const currentImage = snapshot.photos[angle];
  
  // Simulated target image (just a filter for now)
  const targetImageStyle = viewMode === 'target' ? { filter: 'hue-rotate(90deg) brightness(1.1)' } : {};

  return (
    <div className="relative w-full aspect-[3/4] bg-gray-200 rounded-3xl overflow-hidden shadow-inner group">
      {/* Main Image Area */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-300">
        <AnimatePresence mode="wait">
          <motion.img 
            key={`${viewMode}-${angle}-${snapshot.id}`}
            src={currentImage} 
            alt="Twin" 
            className="w-full h-full object-cover mix-blend-multiply opacity-90"
            style={targetImageStyle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        
        {/* Split View Overlay */}
        {viewMode === 'split' && (
          <div className="absolute inset-0 flex">
            <div className="w-1/2 overflow-hidden border-r-2 border-white relative">
               <img 
                src={currentImage} 
                className="absolute inset-0 w-[200%] h-full object-cover max-w-none mix-blend-multiply opacity-90"
                alt="Current"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded">Current</div>
            </div>
            <div className="w-1/2 overflow-hidden relative bg-blue-100/50">
               <img 
                src={currentImage} 
                className="absolute inset-0 w-[200%] h-full object-cover max-w-none -translate-x-1/2 mix-blend-multiply opacity-60 grayscale"
                alt="Target"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">Target</div>
            </div>
          </div>
        )}
      </div>

      {/* Controls Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
        {/* Top Controls */}
        <div className="flex justify-between pointer-events-auto">
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-1 flex gap-1 shadow-sm">
            <button 
              onClick={() => onViewModeChange('current')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'current' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <User size={16} />
            </button>
            <button 
              onClick={() => onViewModeChange('target')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'target' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <Target size={16} />
            </button>
            <button 
              onClick={() => onViewModeChange('split')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'split' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <SplitSquareHorizontal size={16} />
            </button>
          </div>

          <button className="p-2 bg-white/80 backdrop-blur-md rounded-xl text-gray-700 shadow-sm">
            <Maximize2 size={20} />
          </button>
        </div>

        {/* Rotation Control */}
        <div className="flex justify-center pointer-events-auto">
          <button 
            onClick={rotate}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full text-sm font-bold text-gray-700 shadow-sm hover:bg-white transition-colors"
          >
            <RotateCw size={16} className={isRotating ? 'animate-spin' : ''} />
            <span className="uppercase tracking-wider text-xs">{angle} View</span>
          </button>
        </div>
      </div>
    </div>
  );
};
