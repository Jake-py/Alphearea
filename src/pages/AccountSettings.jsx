import { useState, useEffect } from 'react'
import '../styles/settings.css'

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
        avatar: profile.avatar || '/default-avatar.png',
        twoFactorEnabled: profile.twoFactorEnabled || false,
        language: profile.language || 'ru'
      })
    }
  }, [])

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
      const response = await fetch('http://localhost:3002/api/change-password', {
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
      if (formData.username !== userData.username || formData.email !== userData.email) {
        const userResponse = await fetch(`http://localhost:3002/api/user/${userData.username}`, {
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
      </div>
    </main>
  )
}

export default AccountSettings
