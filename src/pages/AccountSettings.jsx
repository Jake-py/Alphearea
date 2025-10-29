import { useState } from 'react'
import '../styles/settings.css'

function AccountSettings() {
  const [formData, setFormData] = useState({
    username: 'red_ice',
    email: 'red_ice@alphearea.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    avatar: '/avatar_red.jpg'
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Account settings updated:', formData)
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
              <img src={formData.avatar} alt="Current avatar" className="current-avatar" />
              <input
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
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Подтвердить новый пароль</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <button type="submit" className="save-button">Сохранить изменения</button>
        </form>
      </div>
    </main>
  )
}

export default AccountSettings
