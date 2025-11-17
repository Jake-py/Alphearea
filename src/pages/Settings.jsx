import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/settings.css'

// Progress Chart Component
function ProgressChart({ subjects, customSubjects }) {
  const allSubjects = [
    ...Object.entries(subjects).map(([key, value]) => ({
      name: key,
      ...value,
      isCustom: false
    })),
    ...(customSubjects || []).map(subject => ({
      name: subject.name,
      ...subject.progress,
      isCustom: true,
      id: subject.id
    }))
  ]

  return (
    <div className="progress-chart">
      <div className="subjects-grid">
        {allSubjects.map((subject) => (
          <div key={subject.name} className="subject-card">
            <div className="subject-header">
              <h4>{subject.name}</h4>
              <span className={`level-badge level-${subject.level}`}>
                {subject.level}
              </span>
            </div>
            <div className="progress-info">
              <div className="xp-display">
                <span className="xp-label">XP:</span>
                <span className="xp-value">{subject.xp || 0}</span>
              </div>
              <div className="completed-display">
                <span className="completed-label">Завершено:</span>
                <span className="completed-value">{subject.completed?.length || 0}</span>
              </div>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min((subject.xp || 0) / 10, 100)}%`
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// History Component
function History({ history }) {
  const historyIcons = {
    test: '📝',
    material: '📖'
  }

  return (
    <div className="activity-section">
      <h3>Недавняя активность</h3>
      {history && history.length > 0 ? (
        <div className="activity-list">
          {history.slice(0, 10).map((item, index) => (
            <div key={index} className="activity-item">
              <div className="activity-icon">
                {historyIcons[item.type] || '📋'}
              </div>
              <div className="activity-content">
                <div className="activity-header">
                  <h4>{item.testTitle || item.materialId || item.type}</h4>
                  <span className="activity-date">
                    {new Date(item.date).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                <div className="activity-details">
                  {item.type === 'test' && (
                    <>
                      <span className="subject-tag">{item.subject}</span>
                      <span className="score-display">Результат: {item.score}%</span>
                      <span className="time-display">
                        Время: {Math.floor(item.timeSpent / 60)}:{(item.timeSpent % 60).toString().padStart(2, '0')}
                      </span>
                    </>
                  )}
                  {item.type === 'material' && (
                    <>
                      <span className="subject-tag">{item.subject}</span>
                      <span className="action-display">{item.action === 'view' ? 'Просмотрено' : 'Завершено'}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-activity">Активность отсутствует.</p>
      )}
    </div>
  )
}

function Settings() {
  const [user, setUser] = useState({
    username: '',
    email: '',
    avatar: '',
    joinDate: '',
    level: 1,
    xp: 0,
    achievements: []
  })

  const [profileData, setProfileData] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const savedProfile = localStorage.getItem('profile')

    if (savedUser && savedProfile) {
      const userData = JSON.parse(savedUser)
      const profileData = JSON.parse(savedProfile)

      setUser({
        username: userData.username,
        email: userData.email,
        avatar: profileData.avatar || '/default-avatar.png',
        joinDate: userData.createdAt ? new Date(userData.createdAt).toISOString().split('T')[0] : '',
        level: profileData.level || 1,
        xp: profileData.xp || 0,
        achievements: profileData.achievements || []
      })

      setProfileData(profileData)

      // Load history
      loadHistory(userData.username)
    }
  }, [])

  const loadHistory = async (username) => {
    try {
      const response = await fetch(`http://localhost:3002/api/history/${username}`)
      if (response.ok) {
        const data = await response.json()
        setHistory(data.history)
      }
    } catch (error) {
      console.error('Failed to load history:', error)
    }
  }

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
        {profileData && (
          <div className="progress-section">
            <h3>Прогресс обучения</h3>
            <ProgressChart
              subjects={profileData.progress || {}}
              customSubjects={profileData.customSubjects || []}
            />
          </div>
        )}

        {/* Recent Activity */}
        <History history={history} />
      </div>
    </main>
  )
}

export default Settings
