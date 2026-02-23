import React from 'react';
import { Activity, Heart, ArrowRight, CheckCircle2 } from 'lucide-react';

interface HealthConnectStepProps {
  onNext: () => void;
}

export const HealthConnectStep: React.FC<HealthConnectStepProps> = ({ onNext }) => {
  const [connections, setConnections] = React.useState({
    apple: false,
    google: false
  });

  const toggleConnection = (type: 'apple' | 'google') => {
    setConnections(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const isAnyConnected = connections.apple || connections.google;

  return (
    <div className="flex flex-col h-full bg-white p-6 pt-12">
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Health Data</h2>
        <p className="text-gray-500 mb-8">
          We use your health data to calibrate your Digital Twin and metabolic baseline.
        </p>

        <div 
          onClick={() => toggleConnection('apple')}
          className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex items-center gap-4 mb-4 ${
            connections.apple 
              ? 'border-[#FF6B6B] bg-red-50' 
              : 'border-gray-100 bg-white hover:border-gray-200'
          }`}
        >
          <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
            <Heart size={24} className="text-red-500" fill="currentColor" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">Apple Health</h3>
            <p className="text-xs text-gray-500">Steps, Sleep, Heart Rate</p>
          </div>
          {connections.apple && <CheckCircle2 size={24} className="text-[#FF6B6B]" />}
        </div>

        <div 
          onClick={() => toggleConnection('google')}
          className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex items-center gap-4 mb-4 ${
            connections.google 
              ? 'border-[#4285F4] bg-blue-50' 
              : 'border-gray-100 bg-white hover:border-gray-200'
          }`}
        >
          <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
            <Activity size={24} className="text-[#4285F4]" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">Google Fit</h3>
            <p className="text-xs text-gray-500">Activity, Nutrition, Sleep</p>
          </div>
          {connections.google && <CheckCircle2 size={24} className="text-[#4285F4]" />}
        </div>
        
        <div className="p-4 bg-gray-50 rounded-2xl text-xs text-gray-500 leading-relaxed">
          <span className="font-bold text-gray-700">Privacy Note:</span> Your health data is processed locally on your device and encrypted when synced to your Digital Twin. We never sell your data.
        </div>
      </div>

      <button 
        onClick={onNext}
        className="w-full py-4 bg-black text-white rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2"
      >
        {isAnyConnected ? 'Continue' : 'Skip for Now'}
        <ArrowRight size={20} />
      </button>
    </div>
  );
};
