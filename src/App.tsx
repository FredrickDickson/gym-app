/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BottomNav } from './components/BottomNav';
import { TopBar } from './components/TopBar';
import { CoachButton } from './components/CoachButton';
import { ProfileDrawer } from './components/ProfileDrawer';
import { TwinPage } from './pages/Twin';
import { EditBodyPage } from './pages/EditBody';
import { FitnessPage } from './pages/Fitness';
import { NutritionPage } from './pages/Nutrition';
import { ProgressPage } from './pages/Progress';
import { SocialPage } from './pages/Social';
import { WorkoutPlayerPage } from './pages/WorkoutPlayer';
import { OnboardingFlow } from './pages/Onboarding/OnboardingFlow';
import { AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('fitness');
  const [showPlayer, setShowPlayer] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  // Check local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem('onboardingComplete');
    if (stored === 'true') {
      setOnboardingComplete(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboardingComplete', 'true');
    setOnboardingComplete(true);
  };

  if (!onboardingComplete) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'twin': return <TwinPage />;
      case 'edit': return <EditBodyPage />;
      case 'fitness': return <FitnessPage onPlay={() => setShowPlayer(true)} />;
      case 'nutrition': return <NutritionPage />;
      case 'progress': return <ProgressPage />;
      case 'social': return <SocialPage />;
      default: return <FitnessPage onPlay={() => setShowPlayer(true)} />;
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#FAFAFA] relative">
      {showPlayer && <WorkoutPlayerPage onClose={() => setShowPlayer(false)} />}
      
      <AnimatePresence>
        {showProfile && (
          <ProfileDrawer 
            isOpen={showProfile} 
            onClose={() => setShowProfile(false)} 
            onNavigate={(tab) => {
              setActiveTab(tab);
              setShowProfile(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Global UI Elements */}
      {!showPlayer && <TopBar onOpenProfile={() => setShowProfile(true)} />}
      {!showPlayer && <CoachButton />}

      <main className="flex-1 overflow-hidden relative">
        {renderContent()}
      </main>
      
      {!showPlayer && <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />}
    </div>
  );
}
