import React from 'react';
import { CaptureStudio } from '../../components/CaptureStudio';
import { SnapshotService } from '../../services/snapshotService';

interface CaptureStudioStepProps {
  onComplete: () => void;
}

export const CaptureStudioStep: React.FC<CaptureStudioStepProps> = ({ onComplete }) => {
  const handleComplete = (photos: { front: string; side: string; back: string }) => {
    // Save initial snapshot with default metrics (will be updated later or just initial)
    SnapshotService.add({
      photos,
      metrics: {
        weight: 0, // Placeholder, ideally passed from previous step
        height: 0
      }
    });
    onComplete();
  };

  // Onboarding version doesn't really have a "cancel" to go back easily in this flow structure without more prop drilling, 
  // so we just treat cancel as do nothing or maybe we should allow back. 
  // For now, let's just keep it simple.
  return <CaptureStudio onComplete={handleComplete} onCancel={() => {}} />;
};
