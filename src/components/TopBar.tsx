import React from 'react';
import { User, RefreshCw, MapPin, Menu, Settings, Bell } from 'lucide-react';

interface TopBarProps {
  onOpenProfile: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenProfile }) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-40 px-6 pt-12 pb-4 flex justify-between items-center bg-gradient-to-b from-[#FAFAFA] to-transparent pointer-events-none">
      {/* Profile Drawer Trigger (Pointer events enabled) */}
      <button 
        onClick={onOpenProfile}
        className="pointer-events-auto p-2 -ml-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm border border-gray-100 hover:bg-white transition-colors"
      >
        <Menu size={20} className="text-gray-700" />
      </button>

      {/* Center Status Pills */}
      <div className="flex flex-col items-center gap-2 pointer-events-auto">
        {/* Gym Presence */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-black/5 backdrop-blur-md rounded-full border border-white/20">
          <MapPin size={10} className="text-[#FF6B6B]" />
          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">Gold's Gym Venice</span>
        </div>
        
        {/* Sync Status */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-100/50 backdrop-blur-md rounded-full border border-green-200/50">
          <RefreshCw size={8} className="text-green-600" />
          <span className="text-[8px] font-bold text-green-700 uppercase tracking-wide">Synced</span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex gap-2 pointer-events-auto">
        <button className="p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm border border-gray-100">
          <Bell size={20} className="text-gray-700" />
        </button>
      </div>
    </div>
  );
};
