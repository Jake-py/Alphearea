import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import usePoints from '../hooks/usePoints';
import '../styles/achievements.css';

function Achievements() {
  const location = useLocation();
  const username = JSON.parse(localStorage.getItem('user') || '{}').username || 'user';
  const { points, history, achievements, loading } = usePoints(username);
  const [activeTab, setActiveTab] = useState('achievements');

  return (
    <main>
      <div className="achievements-page">
        <div className="achievements-header">
          <h1>🏆 Ваши Достижения и Прогресс</h1>
          <p className="header-subtitle">Отслеживайте свой прогресс обучения и достижения</p>
        </div>

        {/* Прогресс-панель */}
        <div className="progress-section">
          <div className="progress-card main-progress">
            <div className="progress-icon">⭐</div>
            <div className="progress-info">
              <h3>Всего Points</h3>
              <p className="progress-value">{loading ? '...' : points}</p>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${Math.min((points / 1000) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="progress-text">
                {loading ? '...' : `${points} / 1000 points до золотого уровня`}
              </p>
            </div>
          </div>

          <div className="progress-cards-grid">
            <div className="progress-card">
              <div className="card-icon">📚</div>
              <div className="card-content">
                <h4>Активностей завершено</h4>
                <p className="card-value">{history.length}</p>
              </div>
            </div>

            <div className="progress-card">
              <div className="card-icon">🔥</div>
              <div className="card-content">
                <h4>Средний заработок</h4>
                <p className="card-value">
                  {history.length > 0 
                    ? Math.round(history.reduce((sum, a) => sum + a.points, 0) / history.length)
                    : 0}
                </p>
              </div>
            </div>

            <div className="progress-card">
              <div className="card-icon">📊</div>
              <div className="card-content">
                <h4>Уровень</h4>
                <p className="card-value">
                  {points >= 1000 ? '🏅' : points >= 500 ? '💎' : points >= 100 ? '⭐' : '🌱'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Вкладки */}
        <div className="tabs-section">
          <div className="tabs-header">
            <button 
              className={`tab-btn ${activeTab === 'achievements' ? 'active' : ''}`}
              onClick={() => setActiveTab('achievements')}
            >
              🏆 Достижения ({achievements.length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              📜 История ({history.length})
            </button>
          </div>

          {/* Вкладка достижений */}
          {activeTab === 'achievements' && (
            <div className="achievements-grid">
              {achievements.length > 0 ? (
                achievements.map(achievement => (
                  <div key={achievement.id} className="achievement-card unlocked">
                    <div className="achievement-icon">{achievement.icon}</div>
                    <h3>{achievement.name}</h3>
                    <p>{achievement.description}</p>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>Достижений еще нет. Начните прохождение курсов, чтобы получить достижения!</p>
                </div>
              )}

              {/* Заблокированные достижения */}
              <div className="achievement-card locked">
                <div className="achievement-icon">💎</div>
                <h3>500 Points</h3>
                <p>Заработайте 500 points</p>
                <div className="locked-badge">Заблокировано</div>
              </div>

              <div className="achievement-card locked">
                <div className="achievement-icon">👑</div>
                <h3>1000 Points</h3>
                <p>Заработайте 1000 points</p>
                <div className="locked-badge">Заблокировано</div>
              </div>

              <div className="achievement-card locked">
                <div className="achievement-icon">🔥</div>
                <h3>Пятидневная серия</h3>
                <p>Завершите 5 активностей за 5 дней</p>
                <div className="locked-badge">Заблокировано</div>
              </div>
            </div>
          )}

          {/* Вкладка истории */}
          {activeTab === 'history' && (
            <div className="history-section">
              {history.length > 0 ? (
                <div className="history-list">
                  {[...history].reverse().map((activity, index) => (
                    <div key={index} className="history-item">
                      <div className="history-icon">
                        {activity.type === 'lesson' && '📖'}
                        {activity.type === 'test' && '✅'}
                        {activity.type === 'material' && '📚'}
                        {activity.type === 'competition' && '🏅'}
                      </div>
                      <div className="history-content">
                        <h4>
                          {activity.type === 'lesson' && 'Урок'}
                          {activity.type === 'test' && 'Тест'}
                          {activity.type === 'material' && 'Материал'}
                          {activity.type === 'competition' && 'Соревнование'}
                          {' '}завершен
                        </h4>
                        <p className="history-date">
                          {new Date(activity.completedAt).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="history-points">
                        <span className="points-badge">+{activity.points}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>История активностей пуста. Начните учиться, чтобы заполнить историю!</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Советы */}
        <div className="tips-section">
          <h3>💡 Советы по заработку Points</h3>
          <div className="tips-grid">
            <div className="tip-card">
              <span className="tip-number">1</span>
              <h4>Различные активности</h4>
              <p>Разные типы активностей дают разное количество points</p>
            </div>
            <div className="tip-card">
              <span className="tip-number">2</span>
              <h4>Сложность имеет значение</h4>
              <p>Более сложные курсы и тесты дают больше points</p>
            </div>
            <div className="tip-card">
              <span className="tip-number">3</span>
              <h4>Без повторного фарма</h4>
              <p>Points начисляются только один раз за каждую активность</p>
            </div>
            <div className="tip-card">
              <span className="tip-number">4</span>
              <h4>Используйте свои points</h4>
              <p>Накопленные points можно потратить на премиум контент</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Achievements;
