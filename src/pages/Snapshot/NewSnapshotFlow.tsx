import React, { useState } from 'react';
import { CaptureStudio } from '../../components/CaptureStudio';
import { SnapshotService } from '../../services/snapshotService';
import { ArrowRight, Weight, Ruler, CheckCircle2 } from 'lucide-react';

interface NewSnapshotFlowProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const NewSnapshotFlow: React.FC<NewSnapshotFlowProps> = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState<'capture' | 'metrics' | 'generating'>('capture');
  const [photos, setPhotos] = useState<{ front: string; side: string; back: string } | null>(null);
  const [metrics, setMetrics] = useState({
    weight: '',
    bodyFat: '',
    chest: '',
    waist: '',
    hips: ''
  });

  const handleCaptureComplete = (capturedPhotos: { front: string; side: string; back: string }) => {
    setPhotos(capturedPhotos);
    setStep('metrics');
  };

  const handleSave = () => {
    if (!photos) return;

    setStep('generating');
    
    // Simulate generation delay
    setTimeout(() => {
      SnapshotService.add({
        photos,
        metrics: {
          weight: parseFloat(metrics.weight) || 0,
          height: 175, // Default for now
          bodyFat: parseFloat(metrics.bodyFat) || undefined,
          chest: parseFloat(metrics.chest) || undefined,
          waist: parseFloat(metrics.waist) || undefined,
          hips: parseFloat(metrics.hips) || undefined,
        }
      });
      onSuccess();
    }, 2000);
  };

  if (step === 'capture') {
    return <CaptureStudio onComplete={handleCaptureComplete} onCancel={onClose} />;
  }

  if (step === 'generating') {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 relative">
           <div className="absolute inset-0 border-4 border-[#FF6B6B] border-t-transparent rounded-full animate-spin"></div>
           <CheckCircle2 size={40} className="text-[#FF6B6B]" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating Twin...</h2>
        <p className="text-gray-500 text-center">Analyzing geometry and body composition</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col p-6 pt-12">
      <div className="flex-1 overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Update Metrics</h2>
        <p className="text-gray-500 mb-8">Enter your latest measurements to calibrate your twin.</p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Weight size={16} />
              Weight (lbs)
            </label>
            <input 
              type="number" 
              value={metrics.weight}
              onChange={(e) => setMetrics({...metrics, weight: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-4 text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Ruler size={16} />
              Body Fat % (Optional)
            </label>
            <input 
              type="number" 
              value={metrics.bodyFat}
              onChange={(e) => setMetrics({...metrics, bodyFat: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-4 text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
              placeholder="0"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">Chest (in)</label>
              <input 
                type="number" 
                value={metrics.chest}
                onChange={(e) => setMetrics({...metrics, chest: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-3 font-bold text-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">Waist (in)</label>
              <input 
                type="number" 
                value={metrics.waist}
                onChange={(e) => setMetrics({...metrics, waist: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-3 font-bold text-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">Hips (in)</label>
              <input 
                type="number" 
                value={metrics.hips}
                onChange={(e) => setMetrics({...metrics, hips: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-3 font-bold text-gray-900"
              />
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={handleSave}
        className="w-full py-4 bg-[#FF6B6B] text-white rounded-2xl font-bold text-lg shadow-lg shadow-red-200 flex items-center justify-center gap-2"
      >
        Generate Twin
        <ArrowRight size={20} />
      </button>
    </div>
  );
};
