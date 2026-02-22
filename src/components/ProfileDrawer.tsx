import React, { useState } from 'react';
import { X, Activity, Heart, Smartphone, CheckCircle2, AlertCircle, MapPin, Users } from 'lucide-react';
import { motion } from 'motion/react';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({ isOpen, onClose }) => {
  const [healthConnected, setHealthConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleConnect = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setHealthConnected(true);
      setIsSyncing(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Drawer */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-4/5 max-w-sm h-full bg-[#FAFAFA] shadow-2xl p-6 overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
          <button onClick={onClose} className="p-2 bg-white rounded-full shadow-sm">
            <X size={20} />
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-md">
            <img src="https://picsum.photos/seed/user/200/200" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Alex Doe</h3>
            <p className="text-sm text-gray-500">Pro Member</p>
          </div>
        </div>

        {/* Gym Network Section */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Gym Network</h3>
          
          {/* Current Gym Card */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <MapPin size={20} className="text-[#FF6B6B]" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Gold's Gym Venice</h4>
                <p className="text-xs text-green-600 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  You are here
                </p>
              </div>
            </div>
            <div className="flex -space-x-2 overflow-hidden pl-2">
              {[1, 2, 3].map((i) => (
                <img 
                  key={i}
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" 
                  src={`https://picsum.photos/seed/buddy_${i}/100/100`} 
                  alt=""
                  referrerPolicy="no-referrer"
                />
              ))}
              <div className="h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                +12
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">15 buddies are working out now</p>
          </div>

          {/* Buddies List (Preview) */}
          <div className="space-y-3">
            {[
              { name: 'Sarah Connor', status: 'Leg Day', time: 'Now', active: true },
              { name: 'Mike Ross', status: 'Cardio', time: '20m ago', active: false },
            ].map((buddy, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={`https://picsum.photos/seed/friend_${i}/100/100`} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                    {buddy.active && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{buddy.name}</h4>
                    <p className="text-xs text-gray-500">{buddy.status}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-400">{buddy.time}</span>
              </div>
            ))}
            <button className="w-full py-2 text-sm font-bold text-[#FF6B6B] flex items-center justify-center gap-1 hover:bg-red-50 rounded-xl transition-colors">
              View All Buddies <Users size={16} />
            </button>
          </div>
        </div>

        {/* Health Integration Section */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Integrations</h3>
          
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-50 rounded-xl text-red-500">
                <Heart size={20} fill="currentColor" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900">Google Fit</h4>
                <p className="text-xs text-gray-500">Sync steps & activity</p>
              </div>
              {healthConnected ? (
                <CheckCircle2 size={20} className="text-green-500" />
              ) : (
                <AlertCircle size={20} className="text-gray-300" />
              )}
            </div>

            {!healthConnected ? (
              <button 
                onClick={handleConnect}
                disabled={isSyncing}
                className="w-full py-2 bg-black text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2"
              >
                {isSyncing ? 'Connecting...' : 'Connect'}
              </button>
            ) : (
              <div className="bg-green-50 p-3 rounded-xl flex items-center gap-2 text-xs font-medium text-green-700">
                <Activity size={14} />
                Last synced: Just now
              </div>
            )}
          </div>
        </div>

        {/* Settings List */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Settings</h3>
          {['Account', 'Notifications', 'Privacy', 'Help & Support'].map((item) => (
            <button key={item} className="w-full p-4 bg-white rounded-2xl shadow-sm border border-gray-100 text-left font-bold text-gray-700 hover:bg-gray-50">
              {item}
            </button>
          ))}
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <button className="w-full py-3 text-red-500 font-bold text-sm">
            Sign Out
          </button>
        </div>
      </motion.div>
    </div>
  );
};
