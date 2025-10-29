import { useState } from 'react'
import '../styles/settings.css'

function PrivacySettings() {
  const [privacySettings, setPrivacySettings] = useState({
    login: 'red_ice',
    password: '',
    email: 'red_ice@alphearea.com',
    phone: '',
    profileVisibility: 'public',
    showProgress: true,
    showAchievements: true,
    allowMessages: true,
    dataSharing: false,
    analytics: true
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setPrivacySettings({
      ...privacySettings,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Privacy settings updated:', privacySettings)
  }

  return (
    <main>
      <div className="privacy-settings">
        <h2>Конфиденциальность</h2>
        <p className="page-description">поля для ввода, и введенные к примеру Логин и пароли, почта, номер</p>

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
                <option value="public">Все пользователи</option>
                <option value="friends">Только друзья</option>
                <option value="private">Только я</option>
              </select>
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
                  checked={privacySettings.showProgress}
                  onChange={handleChange}
                />
                Показывать прогресс обучения
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="showAchievements"
                  checked={privacySettings.showAchievements}
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
        </form>
      </div>
    </main>
  )
}

export default PrivacySettings
