import React, { useState, useEffect, useRef } from 'react';
import { Camera, RefreshCw, Check, Info, X, Zap, Shield, Target, Cpu, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

interface CaptureStudioProps {
  onComplete: (photos: { front: string; side: string; back: string }) => void;
  onCancel: () => void;
}

export const CaptureStudio: React.FC<CaptureStudioProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState<'intro' | 'capture'>('intro');
  const [angle, setAngle] = useState<'front' | 'side' | 'back'>('front');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);
  const [hologramUrl, setHologramUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Store captured photos
  const [photos, setPhotos] = useState<{ front: string; side: string; back: string }>({
    front: '',
    side: '',
    back: ''
  });

  const generateHologram = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: 'A high-tech holographic blue glowing human silhouette guide for a body scan. Translucent, wireframe details, anatomical precision, isolated on a pure black background, futuristic interface elements around it.',
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "9:16",
          },
        },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          setHologramUrl(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (error) {
      console.error('Failed to generate hologram:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const startCapture = () => {
    setCountdown(3);
  };

  const simulateCapture = () => {
    const mockPhoto = `https://picsum.photos/seed/${angle}_${Date.now()}/430/932`;
    setPhotos(prev => ({ ...prev, [angle]: mockPhoto }));
  };

  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setFlash(true);
      simulateCapture();
      
      setTimeout(() => {
        setFlash(false);
        setCountdown(null);
        if (angle === 'front') setAngle('side');
        else if (angle === 'side') setAngle('back');
        else {
          const finalPhotos = {
            ...photos,
            back: `https://picsum.photos/seed/back_${Date.now()}/430/932`
          };
          onComplete(finalPhotos);
        }
      }, 300);
    }
  }, [countdown, angle]);

  if (step === 'intro') {
    return (
      <div className="fixed inset-0 z-[100] bg-[#0A0A0A] text-white p-6 pt-12 flex flex-col overflow-hidden">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-500/10 blur-[120px] rounded-full"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        </div>

        <button onClick={onCancel} className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors z-10">
          <X size={24} />
        </button>

        <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative mb-12"
          >
            <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 border border-white/10 rounded-full animate-ping opacity-20"></div>
              <div className="absolute inset-2 border border-blue-500/20 rounded-full animate-pulse"></div>
              <Cpu size={48} className="text-blue-400 relative z-10" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-blue-500 p-2 rounded-lg shadow-lg shadow-blue-500/20">
              <Zap size={16} className="text-white" />
            </div>
          </motion.div>

          <h2 className="text-4xl font-black mb-4 tracking-tighter uppercase italic">
            Capture <span className="text-blue-400">Studio</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xs leading-tight">
            Calibrating your <span className="text-white font-bold">Digital Twin</span> with sub-millimeter precision.
          </p>
          
          <div className="grid grid-cols-1 gap-3 w-full max-w-sm mb-12">
            {[
              { icon: Shield, text: "Privacy-first local processing", color: "blue" },
              { icon: Target, text: "AI-guided pose alignment", color: "red" },
              { icon: Zap, text: "Real-time metabolic baseline", color: "yellow" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * i }}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 backdrop-blur-md"
              >
                <div className={`p-2 bg-${item.color}-500/20 rounded-lg`}>
                  <item.icon size={18} className={`text-${item.color}-400`} />
                </div>
                <span className="text-sm font-medium text-gray-300">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
        
        <button 
          onClick={() => {
            setStep('capture');
            generateHologram();
          }}
          className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-blue-900/40 transition-all active:scale-[0.98] flex items-center justify-center gap-3 relative z-10"
        >
          Initialize Scan
          <RefreshCw size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden font-mono">
      {/* Camera Feed Simulation */}
      <img 
        src="https://picsum.photos/seed/studio_room/430/932?blur=2" 
        className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale"
        alt="Camera Feed"
        referrerPolicy="no-referrer"
      />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      {/* Pose Guide Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <Loader2 size={48} className="text-blue-400 animate-spin" />
              <span className="text-xs text-blue-400 uppercase tracking-widest">Generating Guide...</span>
            </motion.div>
          ) : hologramUrl ? (
            <motion.img 
              key="hologram"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 0.4, scale: 1 }}
              src={hologramUrl}
              className="h-[85%] object-contain mix-blend-screen"
              alt="Hologram Guide"
            />
          ) : (
            <motion.svg 
              key="fallback"
              viewBox="0 0 200 400" 
              className="h-[80%] opacity-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
            >
              <path d="M100,50 C120,50 130,70 130,90 C130,110 150,130 160,180 L160,350 L140,350 L140,220 L100,220 L60,220 L60,350 L40,350 L40,180 C50,130 70,110 70,90 C70,70 80,50 100,50 Z" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4,4" />
            </motion.svg>
          )}
        </AnimatePresence>
      </div>

      {/* Scanning Line Animation */}
      <motion.div 
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-[2px] bg-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.5)] z-20 pointer-events-none"
      />

      {/* UI Overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 pt-12 z-30">
        <div className="flex justify-between items-start">
           <div className="bg-black/80 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-xl text-white text-[10px] uppercase tracking-widest flex items-center gap-3">
             <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
             <span>System Status: Calibrating</span>
             <div className="w-[1px] h-3 bg-white/20"></div>
             <span className="text-blue-400">FPS: 60.0</span>
           </div>
           <button onClick={onCancel} className="w-10 h-10 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl flex items-center justify-center text-white hover:bg-white/10 transition-colors">
             <X size={20} />
           </button>
        </div>

        {/* Telemetry Data (Left) */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 space-y-6 hidden md:block">
          {[
            { label: 'DEPTH', value: '1.24m' },
            { label: 'ALIGN', value: '98.2%' },
            { label: 'LIGHT', value: 'OK' }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-[8px] text-white/40 uppercase tracking-widest mb-1">{stat.label}</span>
              <span className="text-xs text-blue-400 font-bold">{stat.value}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-black/80 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl mb-8 text-center">
            <h3 className="text-xl font-black text-white drop-shadow-md uppercase tracking-tighter italic">
              {angle} <span className="text-blue-400">Scan</span>
            </h3>
            <p className="text-white/40 text-[10px] uppercase tracking-widest mt-1">Position body within guide</p>
          </div>

          <div className="flex items-center gap-8 mb-8">
            {['front', 'side', 'back'].map((a) => (
              <div 
                key={a}
                className={`w-2 h-2 rounded-full transition-all duration-500 ${angle === a ? 'bg-blue-500 scale-150 shadow-[0_0_10px_rgba(59,130,246,1)]' : 'bg-white/20'}`}
              />
            ))}
          </div>

          <button 
            onClick={startCapture}
            disabled={countdown !== null}
            className="group relative"
          >
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl group-hover:bg-blue-500/40 transition-all"></div>
            <div className="w-24 h-24 rounded-full border-2 border-white/20 flex items-center justify-center relative bg-black/40 backdrop-blur-md overflow-hidden">
              <div className={`absolute inset-2 border-2 border-white/60 rounded-full transition-all duration-300 ${countdown !== null ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}`}></div>
              <div className={`w-16 h-16 bg-blue-500 rounded-full transition-all duration-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] ${countdown !== null ? 'scale-75 bg-red-500' : 'scale-100'}`}></div>
              {countdown === null && <Camera size={24} className="text-white relative z-10" />}
            </div>
          </button>
        </div>
      </div>

      {/* Countdown Overlay */}
      <AnimatePresence>
        {countdown !== null && countdown > 0 && (
          <motion.div 
            initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 2, opacity: 0, rotate: 10 }}
            key={countdown}
            className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <span className="text-[12rem] font-black text-white italic drop-shadow-[0_0_50px_rgba(59,130,246,0.5)]">{countdown}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flash Effect */}
      {flash && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-white z-[60]"
        />
      )}

      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-white/20 m-6 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-white/20 m-6 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-white/20 m-6 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-white/20 m-6 pointer-events-none"></div>
    </div>
  );
};
