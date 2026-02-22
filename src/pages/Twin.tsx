import React, { useState, useEffect } from 'react';
import { Camera, Sparkles, ChevronRight, Calendar } from 'lucide-react';
import { SnapshotService } from '../services/snapshotService';
import { Snapshot } from '../types/snapshot';
import { NewSnapshotFlow } from './Snapshot/NewSnapshotFlow';
import { TwinViewer } from '../components/TwinViewer';
import { format } from 'date-fns';

export const TwinPage = () => {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [selectedSnapshot, setSelectedSnapshot] = useState<Snapshot | null>(null);
  const [showNewSnapshot, setShowNewSnapshot] = useState(false);
  const [viewMode, setViewMode] = useState<'current' | 'target' | 'split'>('current');

  const loadSnapshots = () => {
    const all = SnapshotService.getAll();
    const sorted = all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setSnapshots(sorted);
    // If we have a selected snapshot, try to keep it (by ID), otherwise default to latest
    if (sorted.length > 0) {
      setSelectedSnapshot(prev => prev ? sorted.find(s => s.id === prev.id) || sorted[0] : sorted[0]);
    }
  };

  useEffect(() => {
    loadSnapshots();
  }, []);

  const handleSnapshotSuccess = () => {
    loadSnapshots();
    setShowNewSnapshot(false);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 pt-28 px-6 bg-[#FAFAFA]">
      {showNewSnapshot && (
        <NewSnapshotFlow 
          onClose={() => setShowNewSnapshot(false)} 
          onSuccess={handleSnapshotSuccess} 
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Twin</h1>
          <p className="text-sm text-gray-500">Current You</p>
        </div>
        <button 
          onClick={() => setShowNewSnapshot(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#FF6B6B] text-white rounded-xl text-sm font-bold shadow-lg shadow-red-200 hover:scale-105 transition-transform"
        >
          <Camera size={16} />
          <span>New Scan</span>
        </button>
      </div>

      {/* Twin Viewer */}
      <div className="mb-8">
        <TwinViewer 
          snapshot={selectedSnapshot} 
          viewMode={viewMode} 
          onViewModeChange={setViewMode} 
        />
      </div>

      {/* Timeline Selector */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
           <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Timeline</h2>
           <button className="text-xs font-bold text-[#FF6B6B] flex items-center">
             View All <ChevronRight size={12} />
           </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
          {snapshots.map((snap) => {
            const isSelected = selectedSnapshot?.id === snap.id;
            return (
              <button
                key={snap.id}
                onClick={() => setSelectedSnapshot(snap)}
                className={`flex flex-col items-center gap-2 min-w-[60px] p-2 rounded-xl border transition-all ${
                  isSelected 
                    ? 'bg-white border-[#FF6B6B] shadow-md scale-105' 
                    : 'bg-gray-50 border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                  <img src={snap.photos.front} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <span className={`text-[10px] font-bold ${isSelected ? 'text-gray-900' : 'text-gray-400'}`}>
                  {format(new Date(snap.date), 'MMM d')}
                </span>
              </button>
            );
          })}
          {snapshots.length === 0 && (
            <div className="text-sm text-gray-400 italic">No snapshots yet</div>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Weight</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-900">{selectedSnapshot?.metrics.weight || '--'}</span>
            <span className="text-sm text-gray-400 font-medium">lbs</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Body Fat</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-900">{selectedSnapshot?.metrics.bodyFat || '--'}</span>
            <span className="text-sm text-gray-400 font-medium">%</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Waist</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-900">{selectedSnapshot?.metrics.waist || '--'}</span>
            <span className="text-sm text-gray-400 font-medium">in</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Lean Mass</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-900">
              {selectedSnapshot && selectedSnapshot.metrics.weight && selectedSnapshot.metrics.bodyFat 
                ? Math.round(selectedSnapshot.metrics.weight * (1 - selectedSnapshot.metrics.bodyFat / 100)) 
                : '--'}
            </span>
            <span className="text-sm text-gray-400 font-medium">lbs</span>
          </div>
        </div>
      </div>

      {/* Today's Focus */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
        
        <div className="flex items-start gap-3 mb-4 relative z-10">
          <div className="p-2 bg-white/10 rounded-lg">
            <Sparkles size={20} className="text-[#FF6B6B]" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Today's Focus</h3>
            <p className="text-white/60 text-sm">AI-Generated Insight</p>
          </div>
        </div>
        
        <p className="text-sm leading-relaxed text-white/90 relative z-10">
          Based on your latest scan, your <span className="font-bold text-[#FF6B6B]">waist-to-hip ratio</span> has improved by 2%. Focus on <span className="font-bold">core stability</span> today to maintain this momentum.
        </p>
      </div>
    </div>
  );
};
