import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/settings.css'

function Settings() {
  const [user] = useState({
    username: 'red_ice',
    email: 'red_ice@alphearea.com',
    avatar: '/avatars/red_ice.png',
    joinDate: '2023-01-15',
    level: 15,
    xp: 2450,
    achievements: ['Первый урок', 'Неделя подряд', 'Мастер английского']
  })

  const [progress] = useState({
    english: 75,
    korean: 45,
    russian: 60,
    philosophy: 30,
    psychology: 20
  })

  return (
    <main>
      <div className="settings-container">
        {/* User Profile Section */}
        <div className="profile-section">
          <div className="profile-header">
            <img src={user.avatar} alt="Avatar" className="profile-avatar" />
            <div className="profile-info">
              <h2>{user.username}</h2>
              <p>{user.email}</p>
              <p>Уровень: {user.level} | XP: {user.xp}</p>
              <p>Присоединился: {new Date(user.joinDate).toLocaleDateString('ru-RU')}</p>
            </div>
          </div>

          {/* Achievements */}
          <div className="achievements-section">
            <h3>Достижения</h3>
            <div className="achievements-list">
              {user.achievements.map((achievement, index) => (
                <span key={index} className="achievement-badge">{achievement}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Settings Buttons */}
        <div className="settings-buttons">
          <Link to="/settings/account" className="settings-button">
            <span className="button-icon">👤</span>
            Настройка аккаунта
          </Link>
          <Link to="/settings/privacy" className="settings-button">
            <span className="button-icon">🔒</span>
            Конфиденциальность
          </Link>
          <Link to="/settings/site" className="settings-button">
            <span className="button-icon">⚙️</span>
            Настройка сайта
          </Link>
        </div>

        {/* Progress Chart */}
        <div className="progress-section">
          <h3>Прогресс обучения</h3>
          <div className="progress-chart">
            {Object.entries(progress).map(([subject, percentage]) => (
              <div key={subject} className="progress-item">
                <div className="progress-label">
                  <span className="subject-name">{subject.charAt(0).toUpperCase() + subject.slice(1)}</span>
                  <span className="percentage">{percentage}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="activity-section">
          <h3>Недавняя активность</h3>
          <ul className="activity-list">
            <li>Завершил урок "Present Simple" - 2 дня назад</li>
            <li>Получил достижение "Мастер английского" - 5 дней назад</li>
            <li>Изучил 50 новых слов - неделя назад</li>
            <li>Пройден тест по грамматике - 2 недели назад</li>
          </ul>
        </div>
      </div>
    </main>
  )
}

export default Settings
