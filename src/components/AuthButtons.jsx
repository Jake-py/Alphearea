import React from 'react'
import { useAuth } from './AuthManager'

/**
 * Компонент для отображения кнопок авторизации/выхода
 * Автоматически адаптируется к текущему состоянию пользователя
 */
const AuthButtons = () => {
  const { isAuthenticated, logout } = useAuth()

  const handleLoginClick = () => {
    // Перенаправление на страницу входа
    window.location.href = '/login'
  }

  return (
    <div className="auth-buttons-container">
      {isAuthenticated ? (
        <button
          onClick={logout}
          className="logout-button"
          style={{ 
            padding: '8px 16px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#d32f2f'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f44336'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          Выйти
        </button>
      ) : (
        <button
          onClick={handleLoginClick}
          className="login-button"
          style={{ 
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#388E3C'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#4CAF50'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          Войти / Регистрация
        </button>
      )}
    </div>
  )
}

export default AuthButtons