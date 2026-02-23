import React, { useState, useRef } from 'react';
import { Camera, X, Check, RefreshCw, Upload } from 'lucide-react';
import { NutritionService } from '../services/nutritionService';
import { FoodItem } from '../types/nutrition';

interface FoodScannerProps {
  onClose: () => void;
  onScanComplete: (items: FoodItem[], image: string) => void;
}

export const FoodScanner: React.FC<FoodScannerProps> = ({ onClose, onScanComplete }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Start Camera
  React.useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera access denied", err);
      }
    };
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    const base64Image = canvas.toDataURL('image/jpeg');
    
    analyzeImage(base64Image);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        analyzeImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (base64: string) => {
    setIsAnalyzing(true);
    // Use API Key from env
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
    
    if (!apiKey) {
        // Mock delay if no key
        setTimeout(() => {
            const mockItems: FoodItem[] = [
                {
                    id: '1',
                    name: 'Grilled Chicken Breast',
                    macros: { protein: 30, carbs: 0, fat: 3, calories: 165 },
                    servingSize: '100g',
                    confidence: 0.95
                },
                {
                    id: '2',
                    name: 'Brown Rice',
                    macros: { protein: 3, carbs: 23, fat: 1, calories: 110 },
                    servingSize: '1/2 cup',
                    confidence: 0.88
                },
                {
                    id: '3',
                    name: 'Broccoli',
                    macros: { protein: 2, carbs: 4, fat: 0, calories: 30 },
                    servingSize: '1 cup',
                    confidence: 0.92
                }
            ];
            onScanComplete(mockItems, base64);
            setIsAnalyzing(false);
        }, 2000);
        return;
    }

    const items = await NutritionService.analyzeFoodImage(base64, apiKey);
    onScanComplete(items, base64);
    setIsAnalyzing(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      <div className="relative flex-1 bg-black">
        <video 
          ref={videoRef}
          autoPlay 
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 pointer-events-none border-[40px] border-black/50">
            <div className="w-full h-full border-2 border-white/30 rounded-lg relative">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl"></div>
            </div>
        </div>

        {/* Controls */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
            <button onClick={onClose} className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white">
                <X size={24} />
            </button>
            <div className="px-4 py-1 bg-black/40 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-wider">
                AI Food Scanner
            </div>
            <div className="w-10"></div>
        </div>
      </div>

      <div className="bg-black p-8 pb-12 flex justify-between items-center">
        <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-4 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition-colors"
        >
            <Upload size={24} />
            <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileUpload}
            />
        </button>

        <button 
            onClick={handleCapture}
            disabled={isAnalyzing}
            className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center relative group"
        >
            <div className={`w-16 h-16 bg-white rounded-full transition-all ${isAnalyzing ? 'scale-75 opacity-50' : 'group-active:scale-90'}`}></div>
            {isAnalyzing && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <RefreshCw className="animate-spin text-black" size={24} />
                </div>
            )}
        </button>

        <div className="w-14"></div> {/* Spacer */}
      </div>
    </div>
  );
};
