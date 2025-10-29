import { useState } from 'react'
import '../styles/settings.css'

function SiteSettings() {
  const [siteSettings, setSiteSettings] = useState({
    theme: 'dark',
    language: 'ru',
    notifications: true,
    soundEffects: true,
    autoSave: true,
    compactMode: false,
    showTips: true,
    fontSize: 'medium'
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setSiteSettings({
      ...siteSettings,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Site settings updated:', siteSettings)
  }

  return (
    <main>
      <div className="site-settings">
        <h2>Настройка сайта</h2>

        <form onSubmit={handleSubmit} className="settings-form">
          {/* Appearance */}
          <div className="form-section">
            <h3>Внешний вид</h3>
            <div className="form-group">
              <label htmlFor="theme">Тема</label>
              <select
                id="theme"
                name="theme"
                value={siteSettings.theme}
                onChange={handleChange}
                className="form-select"
              >
                <option value="dark">Темная</option>
                <option value="light">Светлая</option>
                <option value="auto">Автоматическая</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="fontSize">Размер шрифта</label>
              <select
                id="fontSize"
                name="fontSize"
                value={siteSettings.fontSize}
                onChange={handleChange}
                className="form-select"
              >
                <option value="small">Маленький</option>
                <option value="medium">Средний</option>
                <option value="large">Большой</option>
              </select>
            </div>
          </div>

          {/* Language */}
          <div className="form-section">
            <h3>Язык</h3>
            <div className="form-group">
              <label htmlFor="language">Язык интерфейса</label>
              <select
                id="language"
                name="language"
                value={siteSettings.language}
                onChange={handleChange}
                className="form-select"
              >
                <option value="ru">Русский</option>
                <option value="en">English</option>
                <option value="ko">한국어</option>
              </select>
            </div>
          </div>

          {/* Behavior */}
          <div className="form-section">
            <h3>Поведение</h3>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="notifications"
                  checked={siteSettings.notifications}
                  onChange={handleChange}
                />
                Включить уведомления
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="soundEffects"
                  checked={siteSettings.soundEffects}
                  onChange={handleChange}
                />
                Звуковые эффекты
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="autoSave"
                  checked={siteSettings.autoSave}
                  onChange={handleChange}
                />
                Автосохранение прогресса
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="compactMode"
                  checked={siteSettings.compactMode}
                  onChange={handleChange}
                />
                Компактный режим
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="showTips"
                  checked={siteSettings.showTips}
                  onChange={handleChange}
                />
                Показывать подсказки
              </label>
            </div>
          </div>

          {/* Accessibility */}
          <div className="form-section">
            <h3>Доступность</h3>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="highContrast"
                  checked={siteSettings.highContrast || false}
                  onChange={handleChange}
                />
                Высокий контраст
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="reduceMotion"
                  checked={siteSettings.reduceMotion || false}
                  onChange={handleChange}
                />
                Уменьшить анимации
              </label>
            </div>
          </div>

          <button type="submit" className="save-button">Сохранить настройки</button>
        </form>
      </div>
    </main>
  )
}

export default SiteSettings
