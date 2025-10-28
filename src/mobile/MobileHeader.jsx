import React from 'react';

function MobileHeader({ onChatToggle }) {
  return (
    <header className="mobile-header">
      <h1 className="mobile-title">Alphearea</h1>
      <button className="mobile-chat-btn" onClick={onChatToggle}>
        💬
      </button>
    </header>
  );
}

export default MobileHeader;
