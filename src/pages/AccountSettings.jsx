import { useState, useEffect } from 'react'
import '../styles/settings.css'
import { API_ENDPOINTS } from '../config/api.js'

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

  if (!allSubjects || allSubjects.length === 0) {
    return (
      <div className="progress-chart no-data" style={h}>
        <h3>Прогресс по предметам</h3>
        <div className="no-subjects">
          <p>Нет данных прогресса. Добавьте предмет или проверьте профиль.</p>
          <p className="debug-hint">В консоли: <code>JSON.parse(localStorage.getItem('profile'))</code></p>
        </div>
      </div>
    )
  }

  return (
    <div className="progress-chart">
      <h3>Прогресс по предметам</h3>
      <div className="subjects-grid">
        {allSubjects.map((subject) => {
          const xp = subject.xp ?? 0
          const level = subject.level || 'beginner'
          const completedCount = subject.completed?.length || 0
          const widthPercent = Math.min(xp / 10, 100)

          return (
            <div key={subject.name} className="subject-card">
              <div className="subject-header">
                <h4>{subject.name}</h4>
                <span className={`level-badge level-${level}`}>
                  {level}
                </span>
              </div>
              <div className="progress-info">
                <div className="xp-display">
                  <span className="xp-label">XP:</span>
                  <span className="xp-value">{xp}</span>
                </div>
                <div className="completed-display">
                  <span className="completed-label">Завершено:</span>
                  <span className="completed-value">{completedCount}</span>
                </div>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${widthPercent}%`,
                    minWidth: xp > 0 ? undefined : '6px'
                  }}
                ></div>
              </div>
              {subject.isCustom && (
                <button
                  className="remove-subject-btn"
                  onClick={() => {
                    if (window.confirm(`Удалить предмет "${subject.name}"?`)) {
                      window.dispatchEvent(new CustomEvent('removeSubject', { detail: subject.id }));
                    }
                  }}
                >
                  Удалить
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Achievements Component
function Achievements({ achievements }) {
  const achievementIcons = {
    level_up: '⬆️',
    perfect_score: '🎯',
    test_streak: '🔥'
  }

  const achievementNames = {
    level_up: 'Повышение уровня',
    perfect_score: 'Идеальный результат',
    test_streak: 'Серия тестов'
  }

  return (
    <div className="achievements-section">
      <h3>Достижения</h3>
      {achievements && achievements.length > 0 ? (
        <div className="achievements-grid">
          {achievements.map((achievement, index) => (
            <div key={index} className="achievement-card">
              <div className="achievement-icon">
                {achievementIcons[achievement.type] || '🏆'}
              </div>
              <div className="achievement-info">
                <h4>{achievementNames[achievement.type] || achievement.type}</h4>
                {achievement.subject && (
                  <p className="achievement-subject">{achievement.subject}</p>
                )}
                {achievement.level && (
                  <p className="achievement-level">Уровень: {achievement.level}</p>
                )}
                {achievement.count && (
                  <p className="achievement-count">Количество: {achievement.count}</p>
                )}
                <p className="achievement-date">
                  {new Date(achievement.date).toLocaleDateString('ru-RU')}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-achievements">Достижений пока нет. Продолжайте учиться!</p>
      )}
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
    <div className="history-section">
      <h3>История действий</h3>
      {history && history.length > 0 ? (
        <div className="history-list">
          {history.map((item, index) => (
            <div key={index} className="history-item">
              <div className="history-icon">
                {historyIcons[item.type] || '📋'}
              </div>
              <div className="history-content">
                <div className="history-header">
                  <h4>{item.testTitle || item.materialId || item.type}</h4>
                  <span className="history-date">
                    {new Date(item.date).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                <div className="history-details">
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
        <p className="no-history">История действий пуста.</p>
      )}
    </div>
  )
}

function AccountSettings() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    nickname: '',
    dateOfBirth: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    avatar: '',
    twoFactorEnabled: false,
    language: 'ru'
  })

  const [userData, setUserData] = useState(null)
  const [profileData, setProfileData] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [achievements, setAchievements] = useState([])
  const [history, setHistory] = useState([])
  const [newSubjectName, setNewSubjectName] = useState('')
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const savedProfile = localStorage.getItem('profile')

    if (savedUser && savedProfile) {
      const user = JSON.parse(savedUser)
      const profile = JSON.parse(savedProfile)
      setUserData(user)
      setProfileData(profile)

      setFormData({
        username: user.username || '',
        email: user.email || '',
        phone: profile.phone || '',
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        nickname: profile.nickname || '',
        dateOfBirth: profile.dateOfBirth || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        avatar: profile.avatar || '/avatar_red.jpg',
        twoFactorEnabled: profile.twoFactorEnabled || false,
        language: profile.language || 'ru'
      })

      // Load achievements and history
      loadAchievements(user.username)
      loadHistory(user.username)
    }
  }, [])

  const loadAchievements = async (username) => {
    try {
      const response = await fetch(`https://alphearea-b.onrender.com/api/achievements/${username}`)
      if (response.ok) {
        const data = await response.json()
        setAchievements(data.achievements)
      }
    } catch (error) {
      console.error('Failed to load achievements:', error)
    }
  }

  const loadHistory = async (username) => {
    try {
      const response = await fetch(`https://alphearea-b.onrender.com/api/history/${username}`)
      if (response.ok) {
        const data = await response.json()
        setHistory(data.history)
      }
    } catch (error) {
      console.error('Failed to load history:', error)
    }
  }


  const handleAddSubject = async () => {
    if (!newSubjectName.trim()) {
      setError('Введите название предмета')
      return
    }

    try {
      const response = await fetch('https://alphearea-b.onrender.com/api/progress/subject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userData.username,
          subjectName: newSubjectName.trim(),
          subjectType: 'custom'
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to add subject')
      }

      setNewSubjectName('')
      setMessage('Предмет добавлен успешно!')
      // Reload profile data
      const profileResponse = await fetch(`https://alphearea-b.onrender.com/api/profile/${userData.username}`)
      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        setProfileData(profileData.profile)
        localStorage.setItem('profile', JSON.stringify(profileData.profile))
      }
    } catch (error) {
      setError('Ошибка при добавлении предмета: ' + error.message)
    }
  }

  const handleRemoveSubject = async (subjectId) => {
    try {
      const response = await fetch(`https://alphearea-b.onrender.com/api/progress/subject/${subjectId}?username=${userData.username}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to remove subject')
      }

      setMessage('Предмет удален успешно!')
      // Reload profile data
      const profileResponse = await fetch(`https://alphearea-b.onrender.com/api/profile/${userData.username}`)
      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        setProfileData(profileData.profile)
        localStorage.setItem('profile', JSON.stringify(profileData.profile))
      }
    } catch (error) {
      setError('Ошибка при удалении предмета: ' + error.message)
    }
  }

  // Listen for remove subject events
  useEffect(() => {
    const handleRemoveSubjectEvent = (event) => {
      handleRemoveSubject(event.detail)
    }

    window.addEventListener('removeSubject', handleRemoveSubjectEvent)
    return () => window.removeEventListener('removeSubject', handleRemoveSubjectEvent)
  }, [userData])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleChangePassword = async () => {
    if (!formData.newPassword) {
      setError('Введите новый пароль')
      return
    }

    if (formData.newPassword.length < 8) {
      setError('Пароль должен содержать минимум 8 символов')
      return
    }

    setMessage('')
    setError('')

    try {
      const response = await fetch('https://alphearea-b.onrender.com/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userData.username,
          currentPassword: formData.currentPassword || '', // Allow empty current password for admin reset
          newPassword: formData.newPassword
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to change password')
      }

      setMessage('Пароль успешно изменен!')
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      setError('Ошибка при изменении пароля: ' + error.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    try {
      // Update profile data
      const updatedProfile = {
        ...profileData,
        avatar: formData.avatar,
        phone: formData.phone,
        firstName: formData.firstName,
        lastName: formData.lastName,
        nickname: formData.nickname,
        dateOfBirth: formData.dateOfBirth,
        twoFactorEnabled: formData.twoFactorEnabled,
        language: formData.language
      }

      const profileResponse = await fetch(`https://alphearea-b.onrender.com/api/profile/${userData.username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profile: updatedProfile }),
      })

      if (!profileResponse.ok) {
        throw new Error('Failed to update profile')
      }

      // Update user data if username or email changed
      if (formData.username !== userData.username || formData.email !== userData.email) {
        const userResponse = await fetch(`https://alphearea-b.onrender.com/api/user/${userData.username}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email
          }),
        })

        if (!userResponse.ok) {
          throw new Error('Failed to update user data')
        }

        // Update localStorage with new user data
        const updatedUser = { ...userData, username: formData.username, email: formData.email }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        setUserData(updatedUser)
      }

      // Update localStorage with new profile data
      localStorage.setItem('profile', JSON.stringify(updatedProfile))
      setProfileData(updatedProfile)

      setMessage('Настройки аккаунта успешно обновлены!')
    } catch (error) {
      setError('Ошибка при обновлении настроек: ' + error.message)
    }
  }

  return (
    <main>
      <div className="account-settings">
        <h2>Настройка аккаунта</h2>
        <p className="page-description">Информация и почта</p>

        {/* Tab Navigation */}
        <div className="settings-tabs">
          <button
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Профиль
          </button>
          <button
            className={`tab-button ${activeTab === 'progress' ? 'active' : ''}`}
            onClick={() => setActiveTab('progress')}
          >
            Прогресс
          </button>
          <button
            className={`tab-button ${activeTab === 'achievements' ? 'active' : ''}`}
            onClick={() => setActiveTab('achievements')}
          >
            Достижения
          </button>
          <button
            className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            История
          </button>
        </div>

        {activeTab === 'profile' && (
          <form onSubmit={handleSubmit} className="settings-form">
          {/* Avatar Section */}
          <div className="form-section">
            <h3>Аватар</h3>
            <div className="avatar-section">
              <div className="avatar-container">
                <img src={formData.avatar} alt="Current avatar" className="current-avatar" />
                <div className="avatar-overlay">
                  <button
                    type="button"
                    className="change-avatar-button"
                    onClick={() => document.getElementById('avatar-input').click()}
                  >
                    Изменить
                  </button>
                </div>
              </div>
              <input
                id="avatar-input"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  // Handle file upload
                  const file = e.target.files[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onload = (e) => setFormData({...formData, avatar: e.target.result})
                    reader.readAsDataURL(file)
                  }
                }}
                className="file-input"
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* Basic Info */}
          <div className="form-section">
            <h3>Основная информация</h3>
            <div className="form-group">
              <label htmlFor="username">Имя пользователя</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Номер телефона</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
                placeholder="+7 (999) 123-45-67"
              />
            </div>

            <div className="form-group">
              <label htmlFor="firstName">Имя</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Фамилия</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="nickname">Nickname</label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                className="form-input"
                placeholder="Ваш никнейм"
              />
            </div>

            <div className="form-group">
              <label htmlFor="dateOfBirth">Дата рождения</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          {/* Password Change */}
          <div className="form-section">
            <h3>Изменить пароль</h3>
            <div className="form-group">
              <label htmlFor="currentPassword">Текущий пароль</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="form-input"
                placeholder="Введите текущий пароль"
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">Новый пароль</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="form-input"
                placeholder="Введите новый пароль"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Подтвердите новый пароль</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-input"
                placeholder="Повторите новый пароль"
              />
            </div>

            <button type="button" onClick={handleChangePassword} className="secondary-button" style={{ marginTop: '10px' }}>
              Изменить пароль
            </button>
          </div>

          {/* Security Settings */}
          <div className="form-section">
            <h3>Безопасность</h3>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="twoFactorEnabled"
                  checked={formData.twoFactorEnabled}
                  onChange={(e) => setFormData({...formData, twoFactorEnabled: e.target.checked})}
                />
                Включить двухфакторную аутентификацию
              </label>
            </div>
          </div>

          {/* Language */}
          <div className="form-section">
            <h3>Язык интерфейса</h3>
            <div className="form-group">
              <label htmlFor="language">Язык</label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="form-select"
              >
                <option value="ru">Русский</option>
                <option value="en">English</option>
                <option value="ko">한국어</option>
                <option value="uz">O'zbek</option>
              </select>
            </div>
          </div>

          {/* Account Management */}
          <div className="form-section">
            <h3>Управление аккаунтом</h3>
            <div className="account-actions">
              <button type="button" className="secondary-button">
                Экспортировать данные
              </button>
              <button type="button" className="danger-button">
                Удалить аккаунт
              </button>
            </div>
          </div>

          <button type="submit" className="save-button">Сохранить изменения</button>
          {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}
          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </form>
        )}

        {activeTab === 'progress' && profileData && (
          <div className="progress-tab">
            <ProgressChart
              subjects={profileData.progress || {}}
              customSubjects={profileData.customSubjects || []}
            />

            {/* Add Custom Subject Section */}
            <div className="form-section">
              <h3>Добавить предмет</h3>
              <div className="add-subject-form">
                <div className="form-group">
                  <label htmlFor="newSubjectName">Название предмета</label>
                  <input
                    type="text"
                    id="newSubjectName"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    className="form-input"
                    placeholder="Введите название предмета"
                  />
                </div>
                <button type="button" onClick={handleAddSubject} className="secondary-button">
                  Добавить предмет
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <Achievements achievements={achievements} />
        )}

        {activeTab === 'history' && (
          <History history={history} />
        )}
      </div>
    </main>
  )
}

export default AccountSettings
