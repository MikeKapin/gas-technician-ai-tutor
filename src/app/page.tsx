'use client';

import React, { useState } from 'react';
import TutorSelection from '@/components/tutor/TutorSelection';
import ChatInterface from '@/components/chat/ChatInterface';
import { CertificationLevel } from '@/types';

export default function Home() {
  const [currentView, setCurrentView] = useState<'selection' | 'chat'>('selection');
  const [selectedLevel, setSelectedLevel] = useState<CertificationLevel | ''>('');

  const handleTutorSelection = (level: CertificationLevel) => {
    setSelectedLevel(level);
    setCurrentView('chat');
  };

  const handleBackToSelection = () => {
    setCurrentView('selection');
    setSelectedLevel('');
  };

  return (
    <>
      {currentView === 'selection' ? (
        <TutorSelection onSelectLevel={handleTutorSelection} />
      ) : (
        <ChatInterface
          selectedLevel={selectedLevel as CertificationLevel}
          onBack={handleBackToSelection}
        />
      )}
    </>
  );
}