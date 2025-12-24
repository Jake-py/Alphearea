import React, { useState, useEffect } from 'react'
import { useAuth } from './AuthManager'
import { API_ENDPOINTS } from '../config/api'
import './AuthModal.css' // Создадим отдельный CSS файл для стилей

const AuthModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('login') // 'login' или 'register'
  const [loginData, setLoginData] = useState({ username: '', password: '' })
  const [registerData, setRegisterData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    firstName: '',
    lastName: '',
    nickname: '',
    dateOfBirth: '',
    specialization: ''
  })
  const [error, setError] = useState('')
  const [registrationStep, setRegistrationStep] = useState(1)
  
  const { login } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const response = await fetch(API_ENDPOINTS.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
        credentials: 'include',
      })
      const data = await response.json()
      if (response.ok) {
        login(data.user, data.profile)
        onClose()
      } else {
        setError(data.error || 'Неправильное имя пользователя или пароль')
      }
    } catch (error) {
      setError('Сервер временно недоступен. Пожалуйста, попробуйте позже.')
    }
  }

  const handleRegisterStep1 = (e) => {
    e.preventDefault()
    if (registerData.password !== registerData.confirmPassword) {
      setError('Пароли не совпадают')
      return
    }
    if (registerData.password.length < 8) {
      setError('Пароль должен содержать минимум 8 символов')
      return
    }
    setError('')
    setRegistrationStep(2)
  }

  const handleRegisterStep2 = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(API_ENDPOINTS.register, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
        credentials: 'include',
      })
      const data = await response.json()
      if (response.ok) {
        setActiveTab('login')
        setRegistrationStep(1)
        setError('')
        alert('Регистрация прошла успешно! Теперь вы можете войти в систему.')
      } else {
        setError(data.error || 'Ошибка при регистрации')
      }
    } catch (error) {
      setError('Ошибка сети. Попробуйте еще раз.')
    }
  }

  const updateLoginData = (field, value) => {
    setLoginData(prev => ({ ...prev, [field]: value }))
  }

  const updateRegisterData = (field, value) => {
    setRegisterData(prev => ({ ...prev, [field]: value }))
  }

  // Закрытие модального окна при нажатии на Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-container">
        <div className="auth-modal">
          <div className="modal-header">
            <div className="auth-tabs">
              <button
                className={`tab-button ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('login')
                  setError('')
                  setRegistrationStep(1)
                }}
              >
                Вход
              </button>
              <button
                className={`tab-button ${activeTab === 'register' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('register')
                  setError('')
                  setRegistrationStep(1)
                }}
              >
                Регистрация
              </button>
            </div>
            <button className="close-button" onClick={onClose}>
              ×
            </button>
          </div>
          
          <div className="modal-content">
            {activeTab === 'login' ? (
              <div className="login-form">
                <h3>Вход в систему</h3>
                <form onSubmit={handleLogin}>
                  <input
                    type="text"
                    placeholder="Логин"
                    value={loginData.username}
                    onChange={(e) => updateLoginData('username', e.target.value)}
                    required
                    className="auth-input"
                  />
                  <input
                    type="password"
                    placeholder="Пароль"
                    value={loginData.password}
                    onChange={(e) => updateLoginData('password', e.target.value)}
                    required
                    className="auth-input"
                  />
                  {error && <p className="error-message">{error}</p>}
                  <button type="submit" className="auth-submit-button">
                    Войти
                  </button>
                </form>
              </div>
            ) : (
              <div className="register-form">
                {registrationStep === 1 ? (
                  <div>
                    <h3>Регистрация - Шаг 1</h3>
                    <form onSubmit={handleRegisterStep1}>
                      <input
                        type="text"
                        placeholder="Логин"
                        value={registerData.username}
                        onChange={(e) => updateRegisterData('username', e.target.value)}
                        required
                        className="auth-input"
                      />
                      <input
                        type="password"
                        placeholder="Пароль"
                        value={registerData.password}
                        onChange={(e) => updateRegisterData('password', e.target.value)}
                        required
                        className="auth-input"
                      />
                      <input
                        type="password"
                        placeholder="Повторите пароль"
                        value={registerData.confirmPassword}
                        onChange={(e) => updateRegisterData('confirmPassword', e.target.value)}
                        required
                        className="auth-input"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={registerData.email}
                        onChange={(e) => updateRegisterData('email', e.target.value)}
                        required
                        className="auth-input"
                      />
                      {error && <p className="error-message">{error}</p>}
                      <button type="submit" className="auth-submit-button">
                        Далее
                      </button>
                    </form>
                  </div>
                ) : (
                  <div>
                    <h3>Регистрация - Шаг 2</h3>
                    <form onSubmit={handleRegisterStep2}>
                      <input
                        type="text"
                        placeholder="Имя"
                        value={registerData.firstName}
                        onChange={(e) => updateRegisterData('firstName', e.target.value)}
                        required
                        className="auth-input"
                      />
                      <input
                        type="text"
                        placeholder="Фамилия"
                        value={registerData.lastName}
                        onChange={(e) => updateRegisterData('lastName', e.target.value)}
                        required
                        className="auth-input"
                      />
                      <input
                        type="text"
                        placeholder="Nickname"
                        value={registerData.nickname}
                        onChange={(e) => updateRegisterData('nickname', e.target.value)}
                        className="auth-input"
                      />
                      <input
                        type="date"
                        placeholder="Дата рождения"
                        value={registerData.dateOfBirth}
                        onChange={(e) => updateRegisterData('dateOfBirth', e.target.value)}
                        required
                        className="auth-input"
                      />
                      <input
                        type="text"
                        placeholder="Специализация"
                        value={registerData.specialization}
                        onChange={(e) => updateRegisterData('specialization', e.target.value)}
                        required
                        className="auth-input"
                      />
                      {error && <p className="error-message">{error}</p>}
                      <button type="submit" className="auth-submit-button">
                        Зарегистрироваться
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthModal