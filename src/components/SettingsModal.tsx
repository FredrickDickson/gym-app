import React, { useState } from 'react';
import { X, Smartphone, Shield, Bell, Database, ChevronRight, Check, Download, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSection?: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, initialSection = 'Preferences' }) => {
  const [activeSection, setActiveSection] = useState(initialSection);
  
  // Mock State for Settings
  const [units, setUnits] = useState('metric');
  const [notifications, setNotifications] = useState({
    workouts: true,
    social: false,
    marketing: false
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'friends',
    activitySharing: true
  });
  const [healthConnections, setHealthConnections] = useState({
    googleFit: false,
    appleHealth: false
  });

  if (!isOpen) return null;

  const renderContent = () => {
    switch (activeSection) {
      case 'Integrations':
        return (
          <div className="space-y-4">
            <h3 className="font-bold text-lg mb-4">Health Connections</h3>
            <div className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg"><Smartphone size={20}/></div>
                    <div>
                        <p className="font-bold text-sm">Google Fit</p>
                        <p className="text-xs text-gray-500">Sync steps and heart rate</p>
                    </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={healthConnections.googleFit} onChange={() => setHealthConnections(p => ({...p, googleFit: !p.googleFit}))} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg"><Smartphone size={20}/></div>
                    <div>
                        <p className="font-bold text-sm">Apple Health</p>
                        <p className="text-xs text-gray-500">Sync activity rings</p>
                    </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={healthConnections.appleHealth} onChange={() => setHealthConnections(p => ({...p, appleHealth: !p.appleHealth}))} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
            </div>
          </div>
        );
      case 'Privacy':
        return (
            <div className="space-y-4">
                <h3 className="font-bold text-lg mb-4">Privacy & Visibility</h3>
                <div className="bg-white p-4 rounded-2xl border border-gray-100">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Profile Visibility</label>
                    <select 
                        value={privacy.profileVisibility}
                        onChange={(e) => setPrivacy(p => ({...p, profileVisibility: e.target.value}))}
                        className="w-full p-2 bg-gray-50 rounded-xl border border-gray-200 text-sm"
                    >
                        <option value="public">Public</option>
                        <option value="friends">Friends Only</option>
                        <option value="private">Private</option>
                    </select>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center">
                    <div>
                        <p className="font-bold text-sm">Share Activity</p>
                        <p className="text-xs text-gray-500">Allow friends to see your workouts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={privacy.activitySharing} onChange={() => setPrivacy(p => ({...p, activitySharing: !p.activitySharing}))} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>
        );
      case 'Preferences':
        return (
            <div className="space-y-4">
                <h3 className="font-bold text-lg mb-4">Units & Notifications</h3>
                <div className="bg-white p-4 rounded-2xl border border-gray-100">
                    <label className="block text-sm font-bold text-gray-700 mb-3">Units</label>
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button 
                            onClick={() => setUnits('metric')}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${units === 'metric' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}
                        >
                            Metric (kg/km)
                        </button>
                        <button 
                            onClick={() => setUnits('imperial')}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${units === 'imperial' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}
                        >
                            Imperial (lb/mi)
                        </button>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 space-y-4">
                    <label className="block text-sm font-bold text-gray-700">Notifications</label>
                    {[
                        { id: 'workouts', label: 'Workout Reminders' },
                        { id: 'social', label: 'Social Activity' },
                        { id: 'marketing', label: 'Tips & Offers' }
                    ].map(item => (
                        <div key={item.id} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{item.label}</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer" 
                                    checked={notifications[item.id as keyof typeof notifications]} 
                                    onChange={() => setNotifications(p => ({...p, [item.id]: !p[item.id as keyof typeof notifications]}))} 
                                />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        );
      case 'Data':
        return (
            <div className="space-y-4">
                <h3 className="font-bold text-lg mb-4">Data Management</h3>
                <div className="bg-white p-4 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Download size={20}/></div>
                        <div>
                            <p className="font-bold text-sm">Export Data</p>
                            <p className="text-xs text-gray-500">Download a copy of your data</p>
                        </div>
                    </div>
                    <button className="w-full py-2 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50">
                        Request Export
                    </button>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-red-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-50 text-red-600 rounded-lg"><Trash2 size={20}/></div>
                        <div>
                            <p className="font-bold text-sm text-red-600">Delete Account</p>
                            <p className="text-xs text-gray-500">Permanently remove all data</p>
                        </div>
                    </div>
                    <button className="w-full py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100">
                        Delete Account
                    </button>
                </div>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />
        <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md bg-[#FAFAFA] rounded-3xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
        >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
                <h2 className="font-bold text-lg">Settings</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                    <X size={20} />
                </button>
            </div>
            
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="w-1/3 bg-white border-r border-gray-100 p-2 space-y-1 overflow-y-auto">
                    {[
                        { id: 'Preferences', icon: Bell },
                        { id: 'Integrations', icon: Smartphone },
                        { id: 'Privacy', icon: Shield },
                        { id: 'Data', icon: Database },
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`w-full p-3 rounded-xl text-left flex flex-col items-center justify-center gap-1 transition-colors ${activeSection === item.id ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <item.icon size={20} />
                            <span className="text-[10px] font-bold">{item.id}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                    {renderContent()}
                </div>
            </div>
        </motion.div>
    </div>
  );
};
