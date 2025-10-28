import React from 'react';
import { Link } from 'react-router-dom';

function MobileMain() {
  return (
    <div className="mobile-main">
      <h2>Добро пожаловать в Alphearea!</h2>
      <p>Выберите раздел для изучения:</p>
      <div className="mobile-buttons">
        <Link to="/mobile/english" className="mobile-btn">🇺🇸 Английский</Link>
        <Link to="/mobile/korean" className="mobile-btn">🇰🇷 Корейский</Link>
        <Link to="/mobile/russian" className="mobile-btn">🇷🇺 Русский</Link>
        <Link to="/mobile/philosophy" className="mobile-btn">📚 Философия</Link>
        <Link to="/mobile/psychology" className="mobile-btn">🧠 Психология</Link>
      </div>
    </div>
  );
}

export default MobileMain;
