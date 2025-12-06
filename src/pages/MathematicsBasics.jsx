import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import GraphExamples from '../components/GraphExamples';
import '../styles/Mathematics.css';

function MathematicsBasics() {
  const [selectedChapter, setSelectedChapter] = useState('graphs');
  const [chaptersExpanded, setChaptersExpanded] = useState(true);

  const chapters = [
    { id: 'graphs', title: 'Графы, раскраска и хроматическое число', component: GraphExamples },
    // Здесь можно добавить другие главы позже
  ];

  const toggleChapters = () => {
    setChaptersExpanded(!chaptersExpanded);
  };

  const selectedChapterData = chapters.find(ch => ch.id === selectedChapter);

  return (
    <div className="mathematics-basics-page">
      {/* Фиксированная навигация наверху */}
      <div className="fixed-nav top-nav">
        <div className="nav-content">
          <h3>Основы математики - Главы</h3>
          <div className="nav-chapters">
            {chapters.map((chapter) => (
              <button
                key={chapter.id}
                onClick={() => setSelectedChapter(chapter.id)}
                className={`nav-chapter ${selectedChapter === chapter.id ? 'active' : ''}`}
              >
                {chapter.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="basics-content">
        <h1>Основы математики</h1>

        {/* Мини-панель для глав */}
        <div className="chapters-panel">
          <button
            onClick={toggleChapters}
            className="chapters-toggle"
          >
            <h2>Главы</h2>
            {chaptersExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </button>

          {chaptersExpanded && (
            <div className="chapters-list">
              {chapters.map((chapter) => (
                <button
                  key={chapter.id}
                  onClick={() => setSelectedChapter(chapter.id)}
                  className={`chapter-item ${selectedChapter === chapter.id ? 'active' : ''}`}
                >
                  {chapter.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Контент выбранной главы */}
        <div className="chapter-content">
          {selectedChapterData && <selectedChapterData.component />}
        </div>
      </div>

      {/* Фиксированная навигация внизу */}
      <div className="fixed-nav bottom-nav">
        <div className="nav-chapters">
          {chapters.map((chapter) => (
            <button
              key={chapter.id}
              onClick={() => setSelectedChapter(chapter.id)}
              className={`nav-chapter ${selectedChapter === chapter.id ? 'active' : ''}`}
            >
              {chapter.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MathematicsBasics;