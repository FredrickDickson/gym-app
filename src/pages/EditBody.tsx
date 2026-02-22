import React, { useState, useEffect } from 'react';
import { Save, RotateCw, Layers, Zap, Ruler, ChevronDown, Plus, Check } from 'lucide-react';
import { TwinViewer } from '../components/TwinViewer';
import { SnapshotService } from '../services/snapshotService';
import { Snapshot } from '../types/snapshot';
import { TargetProfile, DEFAULT_TARGETS } from '../types/target';
import { motion, AnimatePresence } from 'motion/react';

export const EditBodyPage = () => {
  const [currentSnapshot, setCurrentSnapshot] = useState<Snapshot | null>(null);
  const [activeProfileId, setActiveProfileId] = useState<string>('athletic');
  const [customTargets, setCustomTargets] = useState<TargetProfile[]>(DEFAULT_TARGETS);
  const [activeTab, setActiveTab] = useState<'global' | 'segments'>('global');
  
  // Current editing state
  const [metrics, setMetrics] = useState(DEFAULT_TARGETS[0].metrics);
  const [segments, setSegments] = useState(DEFAULT_TARGETS[0].segments);

  useEffect(() => {
    const latest = SnapshotService.getLatest();
    setCurrentSnapshot(latest);
  }, []);

  useEffect(() => {
    const profile = customTargets.find(p => p.id === activeProfileId) || customTargets[0];
    setMetrics(profile.metrics);
    setSegments(profile.segments);
  }, [activeProfileId, customTargets]);

  const handleSave = () => {
    // In a real app, save to backend/local storage
    alert('Target saved!');
  };

  // Create a "Target Snapshot" for the viewer by modifying the current snapshot
  // This is a visual hack to simulate the target look
  const targetSnapshot: Snapshot | null = currentSnapshot ? {
    ...currentSnapshot,
    metrics: {
      ...currentSnapshot.metrics,
      weight: metrics.weight,
      bodyFat: metrics.bodyFat,
      muscleMass: metrics.muscleMass,
    }
  } : null;

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 pt-28 px-6 bg-[#FAFAFA]">
      {/* Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Target</h1>
          <p className="text-sm text-gray-500">Design your physique</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-sm font-bold shadow-lg"
        >
          <Save size={16} />
          <span>Save</span>
        </button>
      </div>

      {/* Target Selector */}
      <div className="relative mb-6 z-20">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {customTargets.map(profile => (
            <button
              key={profile.id}
              onClick={() => setActiveProfileId(profile.id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                activeProfileId === profile.id 
                  ? 'bg-[#FF6B6B] text-white shadow-md shadow-red-200' 
                  : 'bg-white text-gray-500 border border-gray-100'
              }`}
            >
              {profile.name}
            </button>
          ))}
          <button className="px-3 py-2 rounded-xl bg-gray-100 text-gray-400 border border-dashed border-gray-300">
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* 3D Preview */}
      <div className="mb-8 relative">
        <div className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-gray-600 shadow-sm border border-white">
          Target Weight: {metrics.weight} lbs
        </div>
        
        {/* We use the TwinViewer in 'target' mode. 
            Ideally, we'd pass the specific target metrics to the viewer to render the morph.
            For now, we rely on the viewer's internal 'target' mode styling. 
        */}
        <TwinViewer 
          snapshot={targetSnapshot} 
          viewMode="target" 
          onViewModeChange={() => {}} 
        />
      </div>

      {/* Controls */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        {/* Tabs */}
        <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
          <button 
            onClick={() => setActiveTab('global')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'global' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'
            }`}
          >
            Global
          </button>
          <button 
            onClick={() => setActiveTab('segments')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'segments' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'
            }`}
          >
            Segments
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'global' ? (
            <motion.div 
              key="global"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Weight Slider */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Layers size={16} className="text-blue-500" />
                    Target Weight
                  </label>
                  <span className="text-sm font-bold text-blue-500">{metrics.weight} lbs</span>
                </div>
                <input 
                  type="range" 
                  min="100" 
                  max="300" 
                  value={metrics.weight} 
                  onChange={(e) => setMetrics({...metrics, weight: parseInt(e.target.value)})}
                  className="w-full accent-blue-500 h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer" 
                />
              </div>

              {/* Body Fat Slider */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Zap size={16} className="text-orange-500" />
                    Body Fat %
                  </label>
                  <span className="text-sm font-bold text-orange-500">{metrics.bodyFat}%</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="40" 
                  value={metrics.bodyFat} 
                  onChange={(e) => setMetrics({...metrics, bodyFat: parseInt(e.target.value)})}
                  className="w-full accent-orange-500 h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer" 
                />
              </div>

              {/* Muscle Mass Slider */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Ruler size={16} className="text-purple-500" />
                    Muscle Mass
                  </label>
                  <span className="text-sm font-bold text-purple-500">{metrics.muscleMass}%</span>
                </div>
                <input 
                  type="range" 
                  min="40" 
                  max="90" 
                  value={metrics.muscleMass} 
                  onChange={(e) => setMetrics({...metrics, muscleMass: parseInt(e.target.value)})}
                  className="w-full accent-purple-500 h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer" 
                />
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="segments"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Arms */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-bold text-gray-700">Arms</label>
                  <span className="text-xs font-bold text-gray-400">{segments.arms}%</span>
                </div>
                <input 
                  type="range" 
                  value={segments.arms} 
                  onChange={(e) => setSegments({...segments, arms: parseInt(e.target.value)})}
                  className="w-full accent-gray-900 h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer" 
                />
              </div>

              {/* Chest */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-bold text-gray-700">Chest</label>
                  <span className="text-xs font-bold text-gray-400">{segments.chest}%</span>
                </div>
                <input 
                  type="range" 
                  value={segments.chest} 
                  onChange={(e) => setSegments({...segments, chest: parseInt(e.target.value)})}
                  className="w-full accent-gray-900 h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer" 
                />
              </div>

              {/* Waist */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-bold text-gray-700">Waist</label>
                  <span className="text-xs font-bold text-gray-400">{segments.waist}%</span>
                </div>
                <input 
                  type="range" 
                  value={segments.waist} 
                  onChange={(e) => setSegments({...segments, waist: parseInt(e.target.value)})}
                  className="w-full accent-gray-900 h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer" 
                />
              </div>

              {/* Legs */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-bold text-gray-700">Legs</label>
                  <span className="text-xs font-bold text-gray-400">{segments.legs}%</span>
                </div>
                <input 
                  type="range" 
                  value={segments.legs} 
                  onChange={(e) => setSegments({...segments, legs: parseInt(e.target.value)})}
                  className="w-full accent-gray-900 h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer" 
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
