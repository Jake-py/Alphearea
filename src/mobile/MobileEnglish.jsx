import React from 'react';
import { Link } from 'react-router-dom';

function MobileEnglish() {
  return (
    <div className="mobile-english">
      <h2>🇺🇸 Английский</h2>
      <div className="mobile-buttons">
        <Link to="/mobile/english/courses" className="mobile-btn">📖 Курсы</Link>
        <Link to="/mobile/english/grammar" className="mobile-btn">📝 Грамматика</Link>
        <Link to="/mobile/english/dictionary" className="mobile-btn">📚 Словарь</Link>
        <Link to="/mobile/english/dialogues" className="mobile-btn">💬 Диалоги</Link>
        <Link to="/mobile/english/materials" className="mobile-btn">📄 Материалы</Link>
      </div>
      <Link to="/mobile" className="mobile-back-btn">⬅ Назад</Link>
    </div>
  );
}

export default MobileEnglish;
