import React, { useState, useEffect } from 'react';
import { Camera, RefreshCw, Check, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CaptureStudioProps {
  onComplete: (photos: { front: string; side: string; back: string }) => void;
  onCancel: () => void;
}

export const CaptureStudio: React.FC<CaptureStudioProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState<'intro' | 'capture'>('intro');
  const [angle, setAngle] = useState<'front' | 'side' | 'back'>('front');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);
  
  // Store captured photos
  const [photos, setPhotos] = useState<{ front: string; side: string; back: string }>({
    front: '',
    side: '',
    back: ''
  });

  const startCapture = () => {
    setCountdown(3);
  };

  const simulateCapture = () => {
    // In a real app, this would capture from the video stream
    // For now, we use a placeholder image
    const mockPhoto = `https://picsum.photos/seed/${angle}_${Date.now()}/400/600`;
    setPhotos(prev => ({ ...prev, [angle]: mockPhoto }));
  };

  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Capture!
      setFlash(true);
      simulateCapture();
      
      setTimeout(() => {
        setFlash(false);
        setCountdown(null);
        if (angle === 'front') setAngle('side');
        else if (angle === 'side') setAngle('back');
        else {
          // All done
          // We need to pass the photos including the one just captured (state update might be slow, so we construct it)
          const finalPhotos = {
            ...photos,
            back: `https://picsum.photos/seed/back_${Date.now()}/400/600` // The one we just captured
          };
          onComplete(finalPhotos);
        }
      }, 300);
    }
  }, [countdown, angle]); // Removed onComplete from dependency to avoid loop if it changes

  if (step === 'intro') {
    return (
      <div className="fixed inset-0 z-[100] bg-black text-white p-6 pt-12 flex flex-col">
        <button onClick={onCancel} className="absolute top-6 right-6 p-2 bg-white/10 rounded-full">
          <X size={24} />
        </button>

        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-8 animate-pulse">
            <Camera size={40} className="text-[#FF6B6B]" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Capture Studio</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-xs">
            We'll take 3 photos to build your 3D Digital Twin.
          </p>
          
          <div className="bg-white/10 rounded-2xl p-6 text-left w-full max-w-sm space-y-4">
            <div className="flex items-start gap-3">
              <Check size={20} className="text-green-400 mt-0.5" />
              <span className="text-sm">Wear tight-fitting clothes or underwear</span>
            </div>
            <div className="flex items-start gap-3">
              <Check size={20} className="text-green-400 mt-0.5" />
              <span className="text-sm">Find a well-lit space with a plain background</span>
            </div>
            <div className="flex items-start gap-3">
              <Check size={20} className="text-green-400 mt-0.5" />
              <span className="text-sm">Place phone vertically at waist height</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => setStep('capture')}
          className="w-full py-4 bg-[#FF6B6B] text-white rounded-2xl font-bold text-lg shadow-lg shadow-red-900/20"
        >
          Enter Studio
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden">
      {/* Camera Feed Simulation */}
      <img 
        src="https://picsum.photos/seed/room/430/932" 
        className="absolute inset-0 w-full h-full object-cover opacity-50"
        alt="Camera Feed"
        referrerPolicy="no-referrer"
      />
      
      {/* Pose Guide Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg viewBox="0 0 200 400" className="h-[80%] opacity-30">
          {angle === 'front' && (
            <path d="M100,50 C120,50 130,70 130,90 C130,110 150,130 160,180 L160,350 L140,350 L140,220 L100,220 L60,220 L60,350 L40,350 L40,180 C50,130 70,110 70,90 C70,70 80,50 100,50 Z" fill="none" stroke="white" strokeWidth="2" strokeDasharray="5,5" />
          )}
          {angle === 'side' && (
            <path d="M100,50 C110,50 120,70 120,90 C120,110 125,130 125,180 L125,350 L105,350 L105,220 L95,220 L95,350 L75,350 L75,180 C80,130 80,110 80,90 C80,70 90,50 100,50 Z" fill="none" stroke="white" strokeWidth="2" strokeDasharray="5,5" />
          )}
          {angle === 'back' && (
            <path d="M100,50 C120,50 130,70 130,90 C130,110 150,130 160,180 L160,350 L140,350 L140,220 L100,220 L60,220 L60,350 L40,350 L40,180 C50,130 70,110 70,90 C70,70 80,50 100,50 Z" fill="none" stroke="white" strokeWidth="2" strokeDasharray="5,5" />
          )}
        </svg>
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 pt-12 z-10">
        <div className="flex justify-between items-start">
           <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white font-bold flex items-center gap-2">
             <RefreshCw size={14} className="animate-spin" />
             Auto-Capture Active
           </div>
           <button onClick={onCancel} className="w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white">
             <X size={20} />
           </button>
        </div>

        <div className="flex flex-col items-center">
          <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-md uppercase tracking-wider">
            {angle} Pose
          </h3>
          <p className="text-white/80 text-sm mb-8 drop-shadow-md">Align your body with the guide</p>

          <button 
            onClick={startCapture}
            disabled={countdown !== null}
            className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center relative"
          >
            <div className={`w-16 h-16 bg-[#FF6B6B] rounded-full transition-all duration-300 ${countdown !== null ? 'scale-90' : 'scale-100'}`}></div>
          </button>
        </div>
      </div>

      {/* Countdown Overlay */}
      <AnimatePresence>
        {countdown !== null && countdown > 0 && (
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            key={countdown}
            className="absolute inset-0 flex items-center justify-center z-50"
          >
            <span className="text-9xl font-bold text-white drop-shadow-lg">{countdown}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flash Effect */}
      {flash && (
        <div className="absolute inset-0 bg-white z-[60] animate-out fade-out duration-300"></div>
      )}
    </div>
  );
};
