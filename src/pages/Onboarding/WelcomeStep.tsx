import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  return (
    <div className="flex flex-col h-full bg-white p-6 pt-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-red-50 to-transparent -z-10"></div>
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#FF6B6B]/10 rounded-full blur-3xl"></div>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-[#FF6B6B] rounded-2xl flex items-center justify-center shadow-xl shadow-red-200 mb-8 rotate-3">
          <Sparkles size={40} className="text-white" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Meet Your <span className="text-[#FF6B6B]">Digital Twin</span>
        </h1>
        
        <p className="text-gray-500 text-lg leading-relaxed max-w-xs">
          Visualize your progress, design your target physique, and get AI-powered coaching tailored to your biology.
        </p>
      </div>

      <button 
        onClick={onNext}
        className="w-full py-4 bg-[#FF6B6B] text-white rounded-2xl font-bold text-lg shadow-lg shadow-red-200 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
      >
        Get Started
        <ArrowRight size={20} />
      </button>
    </div>
  );
};
