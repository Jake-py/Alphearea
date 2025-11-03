import { useState, useEffect } from 'react'
import '../styles/settings.css'

function PrivacySettings() {
  const [privacySettings, setPrivacySettings] = useState({
    login: '',
    password: '',
    email: '',
    phone: '',
    profileVisibility: 'public',
    showOnlineStatus: true,
    showLastSeen: false,
    showJoinDate: true,
    showActivity: true,
    allowProfileIndexing: false,
    allowMessages: true,
    allowFriendRequests: true,
    allowTagging: true,
    dataSharing: false,
    analytics: true,
    targetedAds: false
  })

  const [userData, setUserData] = useState(null)
  const [profileData, setProfileData] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const savedProfile = localStorage.getItem('profile')

    if (savedUser && savedProfile) {
      const user = JSON.parse(savedUser)
      const profile = JSON.parse(savedProfile)
      setUserData(user)
      setProfileData(profile)

      setPrivacySettings({
        login: user.username || '',
        password: '',
        email: user.email || '',
        phone: profile.phone || '',
        profileVisibility: profile.preferences?.privacy || 'public',
        showOnlineStatus: profile.preferences?.showOnlineStatus !== false,
        showLastSeen: profile.preferences?.showLastSeen || false,
        showJoinDate: profile.preferences?.showJoinDate !== false,
        showActivity: profile.preferences?.showActivity !== false,
        allowProfileIndexing: profile.preferences?.allowProfileIndexing || false,
        allowMessages: profile.preferences?.allowMessages !== false,
        allowFriendRequests: profile.preferences?.allowFriendRequests !== false,
        allowTagging: profile.preferences?.allowTagging !== false,
        dataSharing: profile.preferences?.dataSharing || false,
        analytics: profile.preferences?.analytics !== false,
        targetedAds: profile.preferences?.targetedAds || false
      })
    }
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setPrivacySettings({
      ...privacySettings,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    try {
      // Update profile preferences
      const updatedProfile = {
        ...profileData,
        phone: privacySettings.phone,
        preferences: {
          ...profileData.preferences,
          privacy: privacySettings.profileVisibility,
          showOnlineStatus: privacySettings.showOnlineStatus,
          showLastSeen: privacySettings.showLastSeen,
          showJoinDate: privacySettings.showJoinDate,
          showActivity: privacySettings.showActivity,
          allowProfileIndexing: privacySettings.allowProfileIndexing,
          showProgress: privacySettings.showProgress,
          showAchievements: privacySettings.showAchievements,
          allowMessages: privacySettings.allowMessages,
          allowFriendRequests: privacySettings.allowFriendRequests,
          allowTagging: privacySettings.allowTagging,
          dataSharing: privacySettings.dataSharing,
          analytics: privacySettings.analytics,
          targetedAds: privacySettings.targetedAds
        }
      }

      const profileResponse = await fetch(`http://localhost:3002/api/profile/${userData.username}`, {
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
      if (privacySettings.login !== userData.username || privacySettings.email !== userData.email) {
        const userResponse = await fetch(`http://localhost:3002/api/user/${userData.username}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: privacySettings.login,
            email: privacySettings.email
          }),
        })

        if (!userResponse.ok) {
          throw new Error('Failed to update user data')
        }

        // Update localStorage with new user data
        const updatedUser = { ...userData, username: privacySettings.login, email: privacySettings.email }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        setUserData(updatedUser)
      }

      // Update localStorage with new profile data
      localStorage.setItem('profile', JSON.stringify(updatedProfile))
      setProfileData(updatedProfile)

      setMessage('Настройки конфиденциальности успешно обновлены!')
    } catch (error) {
      setError('Ошибка при обновлении настроек: ' + error.message)
    }
  }

  return (
    <main>
      <div className="privacy-settings">
        <h2>Конфиденциальность</h2>
        <p className="page-description">Настройки приватности и безопасности вашего аккаунта</p>

        <form onSubmit={handleSubmit} className="settings-form">
          {/* Personal Information */}
          <div className="form-section">
            <h3>Личная информация</h3>
            <div className="form-group">
              <label htmlFor="login">Логин</label>
              <input
                type="text"
                id="login"
                name="login"
                value={privacySettings.login}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <input
                type="password"
                id="password"
                name="password"
                value={privacySettings.password}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Почта</label>
              <input
                type="email"
                id="email"
                name="email"
                value={privacySettings.email}
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
                value={privacySettings.phone}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          {/* Profile Visibility */}
          <div className="form-section">
            <h3>Видимость профиля</h3>
            <div className="form-group">
              <label htmlFor="profileVisibility">Кто может видеть ваш профиль</label>
              <select
                id="profileVisibility"
                name="profileVisibility"
                value={privacySettings.profileVisibility}
                onChange={handleChange}
                className="form-select"
              >
                <option value="public">Public - Все пользователи</option>
                <option value="friends">Friends - Только друзья</option>
                <option value="private">Private - Только я</option>
              </select>
            </div>

            {/* Additional Privacy Options */}
            <div className="checkbox-group" style={{ marginTop: '20px' }}>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="showOnlineStatus"
                  checked={privacySettings.showOnlineStatus}
                  onChange={handleChange}
                />
                Показывать статус "онлайн"
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="showLastSeen"
                  checked={privacySettings.showLastSeen}
                  onChange={handleChange}
                />
                Показывать время последнего посещения
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="showJoinDate"
                  checked={privacySettings.showJoinDate}
                  onChange={handleChange}
                />
                Показывать дату регистрации
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="showActivity"
                  checked={privacySettings.showActivity}
                  onChange={handleChange}
                />
                Показывать активность
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="allowProfileIndexing"
                  checked={privacySettings.allowProfileIndexing}
                  onChange={handleChange}
                />
                Разрешить индексацию профиля в поиске
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="allowFriendRequests"
                  checked={privacySettings.allowFriendRequests}
                  onChange={handleChange}
                />
                Разрешать запросы в друзья
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="allowTagging"
                  checked={privacySettings.allowTagging}
                  onChange={handleChange}
                />
                Разрешать упоминания в постах
              </label>
            </div>
          </div>

          {/* Activity Sharing */}
          <div className="form-section">
            <h3>Показывать активность</h3>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="showProgress"
                  checked={privacySettings.showProgress || false}
                  onChange={handleChange}
                />
                Показывать прогресс обучения
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="showAchievements"
                  checked={privacySettings.showAchievements || false}
                  onChange={handleChange}
                />
                Показывать достижения
              </label>
            </div>
          </div>

          {/* Communication */}
          <div className="form-section">
            <h3>Связь</h3>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="allowMessages"
                  checked={privacySettings.allowMessages}
                  onChange={handleChange}
                />
                Разрешить личные сообщения
              </label>
            </div>
          </div>

          {/* Data & Analytics */}
          <div className="form-section">
            <h3>Данные и аналитика</h3>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="dataSharing"
                  checked={privacySettings.dataSharing}
                  onChange={handleChange}
                />
                Разрешить обмен данными для улучшения сервиса
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="analytics"
                  checked={privacySettings.analytics}
                  onChange={handleChange}
                />
                Сбор анонимной статистики использования
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="targetedAds"
                  checked={privacySettings.targetedAds}
                  onChange={handleChange}
                />
                Разрешить показ целевой рекламы
              </label>
            </div>
          </div>

          {/* Data Export/Delete */}
          <div className="form-section">
            <h3>Управление данными</h3>
            <div className="data-actions">
              <button type="button" className="secondary-button">
                Экспортировать мои данные
              </button>
              <button type="button" className="danger-button">
                Удалить аккаунт
              </button>
            </div>
          </div>

          <button type="submit" className="save-button">Сохранить настройки</button>
          {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}
          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </form>
      </div>
    </main>
  )
}

export default PrivacySettings
