import React, { useState } from 'react';
import { WelcomeStep } from './WelcomeStep';
import { HealthConnectStep } from './HealthConnectStep';
import { MetricsStep } from './MetricsStep';
import { CaptureStudioStep } from './CaptureStudioStep';
import { AnimatePresence, motion } from 'motion/react';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const nextStep = () => setStep(s => s + 1);

  return (
    <div className="h-full w-full bg-white relative overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="welcome" className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -50 }}>
            <WelcomeStep onNext={nextStep} />
          </motion.div>
        )}
        {step === 1 && (
          <motion.div key="health" className="h-full" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <HealthConnectStep onNext={nextStep} />
          </motion.div>
        )}
        {step === 2 && (
          <motion.div key="metrics" className="h-full" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <MetricsStep onNext={nextStep} />
          </motion.div>
        )}
        {step === 3 && (
          <motion.div key="capture" className="h-full" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <CaptureStudioStep onComplete={onComplete} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Step Indicators */}
      {step < 3 && (
        <div className="absolute top-6 left-0 right-0 flex justify-center gap-2 z-10">
          {[0, 1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-300 ${
                i <= step ? 'w-8 bg-[#FF6B6B]' : 'w-2 bg-gray-200'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
