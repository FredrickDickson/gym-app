import React from 'react';
import { Users, Sliders, Dumbbell, Utensils, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'twin', icon: Users, label: 'Twin' },
    { id: 'edit', icon: Sliders, label: 'Edit' },
    { id: 'fitness', icon: Dumbbell, label: 'Fitness' },
    { id: 'nutrition', icon: Utensils, label: 'Nutrition' },
    { id: 'progress', icon: TrendingUp, label: 'Progress' },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 pb-8 flex justify-between items-center z-50 rounded-b-[32px]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="relative flex flex-col items-center justify-center w-14 h-12"
          >
            <Icon
              size={24}
              className={`transition-colors duration-300 ${
                isActive ? 'text-[#FF6B6B]' : 'text-gray-300'
              }`}
            />
            <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-[#FF6B6B]' : 'text-gray-300'}`}>
              {tab.label}
            </span>
            {isActive && (
              <motion.div
                layoutId="nav-dot"
                className="absolute -top-2 w-1 h-1 bg-[#FF6B6B] rounded-full"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
