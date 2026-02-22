import React from 'react';
import { Sparkles } from 'lucide-react';

export const CoachButton = () => {
  return (
    <button className="absolute bottom-24 right-6 z-50 w-14 h-14 bg-black text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 transition-transform">
      <Sparkles size={24} />
    </button>
  );
};
