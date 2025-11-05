import { useState, useEffect } from 'react'
import '../styles/settings.css'

function SiteSettings() {
  const [siteSettings, setSiteSettings] = useState({
    theme: 'dark',
    animations: true,
    notifications: true,
    soundEffects: true,
    autoSave: true,
    compactMode: false,
    showTips: true,
    fontSize: 'medium',
    sidebarPosition: 'left',
    chatPosition: 'right'
  })

  const [hasChanges, setHasChanges] = useState(false)
  const [originalSettings, setOriginalSettings] = useState({})

  useEffect(() => {
    setOriginalSettings({...siteSettings})
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const newSettings = {
      ...siteSettings,
      [name]: type === 'checkbox' ? checked : value
    }
    setSiteSettings(newSettings)

    // Check if settings have changed
    const changed = JSON.stringify(newSettings) !== JSON.stringify(originalSettings)
    setHasChanges(changed)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setOriginalSettings({...siteSettings})
    setHasChanges(false)
    // Here you would typically save to backend/localStorage
  }

  return (
    <main>
      <div className="site-settings">
        <h2>Настройка сайта</h2>
        <p className="page-description">Персонализация интерфейса и поведения сайта</p>

        <form onSubmit={handleSubmit} className="settings-form">
          {/* Appearance */}
          <div className="form-section">
            <h3>Внешний вид</h3>
            <div className="form-group">
              <label htmlFor="theme">Тема сайта</label>
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

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="animations"
                  checked={siteSettings.animations}
                  onChange={handleChange}
                />
                Отключить анимации
              </label>
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



          {/* Layout */}
          <div className="form-section">
            <h3>Расположение элементов</h3>
            <div className="form-group">
              <label htmlFor="sidebarPosition">Положение боковой панели</label>
              <select
                id="sidebarPosition"
                name="sidebarPosition"
                value={siteSettings.sidebarPosition}
                onChange={handleChange}
                className="form-select"
              >
                <option value="left">Слева</option>
                <option value="right">Справа</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="chatPosition">Положение чата</label>
              <select
                id="chatPosition"
                name="chatPosition"
                value={siteSettings.chatPosition}
                onChange={handleChange}
                className="form-select"
              >
                <option value="left">Слева</option>
                <option value="right">Справа</option>
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

          <button type="submit" className="save-button" disabled={!hasChanges}>
            {hasChanges ? 'Сохранить настройки' : 'Настройки сохранены'}
          </button>
        </form>
      </div>
    </main>
  )
}

export default SiteSettings
