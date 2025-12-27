import { useState, useEffect, createContext, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Контекст для управления состоянием авторизации
 * Предоставляет унифицированный доступ к состоянию пользователя
 * и методам авторизации/выхода по всему приложению
 */
const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  /**
   * Проверка текущего состояния авторизации
   * Использует localStorage как источник истины
   */
  const checkAuthStatus = () => {
    try {
      const savedUser = localStorage.getItem('user')
      const savedProfile = localStorage.getItem('profile')
      
      if (savedUser && savedProfile) {
        const userData = JSON.parse(savedUser)
        const profileData = JSON.parse(savedProfile)
        setUser({ ...userData, profile: profileData })
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Ошибка при проверке состояния авторизации:', error)
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Вход в систему
   * @param {Object} userData - Данные пользователя
   * @param {Object} profileData - Данные профиля
   */
  const login = (userData, profileData) => {
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('profile', JSON.stringify(profileData))
    setUser({ ...userData, profile: profileData })
    setIsAuthenticated(true)
  }

  /**
   * Выход из системы
   */
  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('profile')
    setUser(null)
    setIsAuthenticated(false)
    navigate('/')
  }

  /**
   * Инициализация при монтировании
   */
  useEffect(() => {
    checkAuthStatus()
    
    // Подписка на события хранилища для синхронизации между вкладками
    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === 'profile') {
        checkAuthStatus()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      loading,
      login,
      logout,
      checkAuthStatus
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthProvider