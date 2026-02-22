import React, { useState, useEffect } from 'react';
import { Camera, RefreshCw, Check, Info, X, Dumbbell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GymScannerProps {
  onClose: () => void;
  onScanComplete: (equipment: string[]) => void;
}

export const GymScanner: React.FC<GymScannerProps> = ({ onClose, onScanComplete }) => {
  const [isScanning, setIsScanning] = useState(true);
  const [detectedItems, setDetectedItems] = useState<string[]>([]);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    // Simulate scanning process
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          return 100;
        }
        // Randomly "detect" items during scan
        if (prev === 30) setDetectedItems(prevItems => [...prevItems, 'Dumbbells']);
        if (prev === 60) setDetectedItems(prevItems => [...prevItems, 'Bench Press']);
        if (prev === 85) setDetectedItems(prevItems => [...prevItems, 'Cable Machine']);
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const handleComplete = () => {
    onScanComplete(detectedItems);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      {/* Camera Feed Simulation */}
      <img 
        src="https://picsum.photos/seed/gym_interior/430/932" 
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        alt="Gym Camera Feed"
        referrerPolicy="no-referrer"
      />
      
      {/* Scanning Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {isScanning && (
          <motion.div 
            className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)]"
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        )}
        
        {/* Detected Item Markers (Simulated positions) */}
        {detectedItems.includes('Dumbbells') && (
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="absolute top-[40%] left-[20%] bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-2"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-gray-900">Dumbbells</span>
          </motion.div>
        )}
        {detectedItems.includes('Bench Press') && (
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="absolute top-[60%] right-[30%] bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-2"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-gray-900">Bench Press</span>
          </motion.div>
        )}
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 pt-12 z-10">
        <div className="flex justify-between items-start">
           <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white font-bold flex items-center gap-2">
             {isScanning ? (
               <>
                 <RefreshCw size={14} className="animate-spin" />
                 Scanning Gym... {scanProgress}%
               </>
             ) : (
               <>
                 <Check size={14} className="text-green-400" />
                 Scan Complete
               </>
             )}
           </div>
           <button onClick={onClose} className="w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white">
             <X size={20} />
           </button>
        </div>

        <div className="bg-black/80 backdrop-blur-md rounded-3xl p-6 w-full">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Dumbbell size={18} />
            Detected Equipment
          </h3>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {detectedItems.length === 0 ? (
              <span className="text-gray-500 text-sm italic">Looking for equipment...</span>
            ) : (
              detectedItems.map((item, i) => (
                <motion.span 
                  key={i}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="px-3 py-1 bg-white/20 rounded-lg text-sm text-white font-medium"
                >
                  {item}
                </motion.span>
              ))
            )}
          </div>

          <button 
            onClick={handleComplete}
            disabled={isScanning}
            className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${
              isScanning 
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                : 'bg-[#FF6B6B] text-white shadow-lg shadow-red-900/20'
            }`}
          >
            {isScanning ? 'Scanning...' : 'Build Workout'}
          </button>
        </div>
      </div>
    </div>
  );
};
