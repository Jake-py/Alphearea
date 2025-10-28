import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import MobileHeader from './MobileHeader';
import MobileMain from './MobileMain';
import MobileEnglish from './MobileEnglish';
import MobileChat from './MobileChat';
import './MobileApp.css';

function MobileApp() {
  const [currentView, setCurrentView] = useState('main');
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="mobile-app">
      <MobileHeader onChatToggle={() => setIsChatOpen(!isChatOpen)} />
      <div className="mobile-content">
        <Routes>
          <Route path="/mobile" element={<MobileMain />} />
          <Route path="/mobile/english" element={<MobileEnglish />} />
          {/* Add more mobile routes as needed */}
        </Routes>
      </div>
      {isChatOpen && <MobileChat onClose={() => setIsChatOpen(false)} />}
    </div>
  );
}

export default MobileApp;
