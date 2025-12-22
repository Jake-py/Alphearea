import { useAuth } from '../components/AuthManager'

/**
 * Хук для безопасного доступа к данным пользователя
 * Возвращает данные пользователя или значения по умолчанию для гостевого режима
 * @returns {Object} Объект с данными пользователя и флагом авторизации
 */
const useUser = () => {
  const { isAuthenticated, user } = useAuth()

  /**
   * Безопасное получение username
   * @returns {string} username или 'guest' для неавторизованных пользователей
   */
  const getUsername = () => {
    if (isAuthenticated && user?.username) {
      return user.username
    }
    return 'guest'
  }

  /**
   * Безопасное получение email
   * @returns {string} email или пустая строка для неавторизованных пользователей
   */
  const getEmail = () => {
    if (isAuthenticated && user?.email) {
      return user.email
    }
    return ''
  }

  /**
   * Проверка авторизации
   * @returns {boolean} true если пользователь авторизован
   */
  const isAuth = () => {
    return isAuthenticated
  }

  return {
    username: getUsername(),
    email: getEmail(),
    isAuthenticated: isAuth(),
    userId: getUsername(), // Для обратной совместимости
    user // Полные данные пользователя (null для гостей)
  }
}

export default useUser