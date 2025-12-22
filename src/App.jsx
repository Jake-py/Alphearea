import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import './styles/style.css'
import Header from './components/Header.jsx'
import Sidebar from './components/Sidebar.jsx'
import Main from './pages/Main.jsx'
import NeonTitle from './components/NeonTitle.jsx'
import English from './pages/English.jsx'
import Korean from './pages/Korean.jsx'
import Russian from './pages/Russian.jsx'
import Philosophy from './pages/Philosophy.jsx'
import Psychology from './pages/Psychology.jsx'
import Settings from './pages/Settings.jsx'
import About from './pages/About.jsx'
import EnglishGrammar from './pages/EnglishGrammar.jsx'
import EnglishCoursesBeginner from './pages/EnglishCoursesBeginner.jsx'
import EnglishCoursesIntermediate from './pages/EnglishCoursesIntermediate.jsx'
import EnglishCoursesAdvanced from './pages/EnglishCoursesAdvanced.jsx'
import EnglishDictionaryBasic from './pages/EnglishDictionaryBasic.jsx'
import EnglishDictionaryIdioms from './pages/EnglishDictionaryIdioms.jsx'
import EnglishDictionaryPhrasalVerbs from './pages/EnglishDictionaryPhrasalVerbs.jsx'
import EnglishDialogues from './pages/EnglishDialogues.jsx'
import EnglishMaterials from './pages/EnglishMaterials.jsx'
import SmartMaterialViewer from './components/SmartMaterialViewer.jsx'
import KoreanGrammar from './pages/KoreanGrammar.jsx'
import KoreanCourses from './pages/KoreanCourses.jsx'
import KoreanDialogues from './pages/KoreanDialogues.jsx'
import RussianGrammar from './pages/RussianGrammar.jsx'
import RussianCourses from './pages/RussianCourses.jsx'
import RussianDialogues from './pages/RussianDialogues.jsx'
import PhilosophyWisdom from './pages/PhilosophyWisdom.jsx'
import PhilosophyBooks from './pages/PhilosophyBooks.jsx'
import PsychologyTheories from './pages/PsychologyTheories.jsx'
import PsychologyPractices from './pages/PsychologyPractices.jsx'
import TestSettings from './pages/TestSettings.jsx'
import ChatPanel from './components/ChatPanel.jsx'
import Mathematics from './pages/Mathematics.jsx'
import MathematicsBasics from './pages/MathematicsBasics.jsx'
import Programming from './pages/Programming.jsx'
import Electronics from './pages/Electronics.jsx'

import AccountSettings from './pages/AccountSettings.jsx'
import PrivacySettings from './pages/PrivacySettings.jsx'
import SiteSettings from './pages/SiteSettings.jsx'
import TestTaking from './pages/TestTaking.jsx'
import TestCreator from './pages/TestCreator.jsx'
import SmartEditor from './pages/SmartEditor.jsx'
import Achievements from './pages/Achievements.jsx'
import EnglishGrammarTest from './pages/EnglishGrammarTest.jsx'
import KoreanGrammarTest from './pages/KoreanGrammarTest.jsx'
import RussianGrammarTest from './pages/RussianGrammarTest.jsx'
import PhilosophyWisdomTest from './pages/PhilosophyWisdomTest.jsx'
import PsychologyTheoriesTest from './pages/PsychologyTheoriesTest.jsx'
import { API_ENDPOINTS } from './config/api.js'
import { AuthProvider, useAuth } from './components/AuthManager'



function App() { // Главный компонент приложения
  const [isChatOpen, setIsChatOpen] = useState(false) // Состояние открытия чата
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => { // Инициализация состояния боковой панели из localStorage
    const saved = localStorage.getItem('sidebarOpen') 
    return saved !== null ? JSON.parse(saved) : false
  }) // Инициализация состояния боковой панели из localStorage
  const [showRegistration, setShowRegistration] = useState(false)
  const [registrationStep, setRegistrationStep] = useState(1)
  const [registrationData, setRegistrationData] = useState({ // Для хранения данных формы регистрации
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    firstName: '',
    lastName: '',
    nickname: '',
    dateOfBirth: '',
    specialization: ''
  })// Для хранения данных формы регистрации
  const [registrationError, setRegistrationError] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1)
  const [forgotPasswordData, setForgotPasswordData] = useState({
    username: '',
    verificationMethod: '',
    verificationData: {
      phone: '',
      email: '',
      passportId: '',
      passportCode: '',
      passportSeries: ''
    },
    newPassword: '',
    confirmNewPassword: ''
  }) // Для хранения данных формы восстановления пароля
  const [forgotPasswordError, setForgotPasswordError] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const { isAuthenticated, user, login, logout } = useAuth()
// Обработчики форм авторизации, регистрации и восстановления пароля


  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const response = await fetch(API_ENDPOINTS.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
      const data = await response.json()
      if (response.ok) {
        login(data.user, data.profile)
      } else {
        setError(data.error || 'Неправильное имя пользователя или пароль') // Общая ошибка входа
      }
    } catch (error) {
      setError('Сервер временно недоступен. Пожалуйста, попробуйте позже. \n Или обратитесь в поддержку. \n Телефон +998913950001')
    }
  }

  const handleRegistrationStep1 = (e) => {
    e.preventDefault()
    if (registrationData.password !== registrationData.confirmPassword) {
      setRegistrationError('Пароли не совпадают') // Пароли не совпадают
      return
    }
    if (registrationData.password.length < 8) {
      setRegistrationError('Пароль должен содержать минимум 8 символов') // Слишком короткий пароль
      return
    }
    setRegistrationError('')
    setRegistrationStep(2)
  }

  const handleRegistrationStep2 = async (e) => {
    e.preventDefault() // Отправка данных регистрации на сервер
    try {
      const response = await fetch(API_ENDPOINTS.register, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      })
      const data = await response.json()
      if (response.ok) {
        setShowRegistration(false)
        setRegistrationStep(1)
        setRegistrationData({
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
        alert('Регистрация прошла успешно! Теперь вы можете войти в систему.')
      } else {
        setRegistrationError(data.error || 'Ошибка при регистрации') // Ошибка регистрации
      }
    } catch (error) {
      setRegistrationError('Ошибка сети. Попробуйте еще раз.') // Ошибка сети
    }
  }

  const updateRegistrationData = (field, value) => {
    setRegistrationData(prev => ({ ...prev, [field]: value }))
  } // Обновление данных регистрации

  const updateForgotPasswordData = (field, value) => {
    setForgotPasswordData(prev => ({ ...prev, [field]: value }))
  } // Обновление данных восстановления пароля

  const handleForgotPasswordStep1 = (e) => {
    e.preventDefault()
    if (!forgotPasswordData.username) {
      setForgotPasswordError('Пожалуйста, введите логин')
      return
    }
    setForgotPasswordError('') // Очистка ошибок
    setForgotPasswordStep(2) // Переход к следующему шагу
  }

  const handleForgotPasswordStep2 = async (e) => {
    e.preventDefault()
    if (!forgotPasswordData.verificationMethod) {
      setForgotPasswordError('Пожалуйста, выберите метод подтверждения')
      return
    }

    // Validate verification data based on method
    const { verificationMethod, verificationData } = forgotPasswordData
    if (verificationMethod === 'phone' && !verificationData.phone) {
      setForgotPasswordError('Пожалуйста, введите номер телефона')
      return
    }
    if (verificationMethod === 'email' && !verificationData.email) {
      setForgotPasswordError('Пожалуйста, введите email')
      return
    }
    if (verificationMethod === 'passport' &&
        (!verificationData.passportId || !verificationData.passportCode || !verificationData.passportSeries)) {
      setForgotPasswordError('Пожалуйста, введите все данные паспорта')
      return
    }
    
    setForgotPasswordError('')
    setForgotPasswordStep(3)
  }

  const handleForgotPasswordStep3 = async (e) => {
    e.preventDefault()
    if (!forgotPasswordData.newPassword || !forgotPasswordData.confirmNewPassword) {
      setForgotPasswordError('Пожалуйста, введите новый пароль и подтверждение')
      return
    }
    if (forgotPasswordData.newPassword !== forgotPasswordData.confirmNewPassword) {
      setForgotPasswordError('Пароли не совпадают')
      return
    }
    if (forgotPasswordData.newPassword.length < 8) {
      setForgotPasswordError('Пароль должен содержать минимум 8 символов')
      return
    }

    try {
      const response = await fetch(API_ENDPOINTS.resetPassword, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: forgotPasswordData.username,
          newPassword: forgotPasswordData.newPassword // и другие данные подтверждения по необходимости
        }),
      })

      if (response.ok) { // Успешное изменение пароля
        alert('Пароль успешно изменен! Теперь вы можете войти в систему.')
        setShowForgotPassword(false)
        setForgotPasswordStep(1)
        setForgotPasswordData({ // Сброс данных формы
          username: '',
          verificationMethod: '',
          verificationData: {
            phone: '',
            email: '',
            passportId: '',
            passportCode: '',
            passportSeries: ''
          },
          newPassword: '',
          confirmNewPassword: ''
        })
        setForgotPasswordError('')
        // Перезагрузка страницы для обновления состояния авторизации
        window.location.reload()
      } else {
        const errorData = await response.json()
        setForgotPasswordError(errorData.message || 'Ошибка при изменении пароля')
      }
    } catch (error) {
      setForgotPasswordError('Ошибка сети. Попробуйте еще раз.')
    }
  }

  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(isSidebarOpen))
  }, [isSidebarOpen])

  // Формы авторизации и регистрации теперь отображаются поверх основного контента
  // а не блокируют его полностью
  const renderAuthForms = () => {
    if (showForgotPassword) {
      return (
        <div id="forgot-password-container" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <NeonTitle tag="h2" />
            {forgotPasswordStep === 1 ? (
              <div>
                <h3>Восстановление пароля - Шаг 1: Подтверждение личности</h3>
                <p>Пожалуйста, подтвердите, что этот аккаунт принадлежит вам.</p>
                <form onSubmit={handleForgotPasswordStep1}>
                  <input
                    type="text"
                    placeholder="Логин"
                    value={forgotPasswordData.username}
                    onChange={(e) => updateForgotPasswordData('username', e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px', margin: '8px 0' }}
                  />
                  <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>Далее</button>
                </form>
              </div>
            ) : forgotPasswordStep === 2 ? (
              <div>
                <h3>Восстановление пароля - Шаг 2: Выбор метода подтверждения</h3>
                <form onSubmit={handleForgotPasswordStep2}>
                  <div className="verification-methods">
                    <label style={{ display: 'block', margin: '10px 0' }}>
                      <input
                        type="radio"
                        name="verificationMethod"
                        value="phone"
                        onChange={(e) => updateForgotPasswordData('verificationMethod', e.target.value)}
                      />
                      Подтверждение через номер телефона
                      {forgotPasswordData.verificationMethod === 'phone' && (
                        <input
                          type="tel"
                          placeholder="Номер телефона"
                          value={forgotPasswordData.verificationData.phone}
                          onChange={(e) => updateForgotPasswordData('verificationData', { ...forgotPasswordData.verificationData, phone: e.target.value })}
                          required
                          style={{ width: '100%', padding: '8px', margin: '8px 0' }}
                        />
                      )}
                    </label>
                    <label style={{ display: 'block', margin: '10px 0' }}>
                      <input
                        type="radio"
                        name="verificationMethod"
                        value="email"
                        onChange={(e) => updateForgotPasswordData('verificationMethod', e.target.value)}
                      />
                      Подтверждение через почту
                      {forgotPasswordData.verificationMethod === 'email' && (
                        <input
                          type="email"
                          placeholder="Email"
                          value={forgotPasswordData.verificationData.email}
                          onChange={(e) => updateForgotPasswordData('verificationData', { ...forgotPasswordData.verificationData, email: e.target.value })}
                          required
                          style={{ width: '100%', padding: '8px', margin: '8px 0' }}
                        />
                      )}
                    </label>
                    <label style={{ display: 'block', margin: '10px 0' }}>
                      <input
                        type="radio"
                        name="verificationMethod"
                        value="passport"
                        onChange={(e) => updateForgotPasswordData('verificationMethod', e.target.value)}
                      />
                      Подтверждение через паспорт
                      {forgotPasswordData.verificationMethod === 'passport' && (
                        <div className="passport-fields">
                          <input
                            type="text"
                            placeholder="ID паспорта"
                            value={forgotPasswordData.verificationData.passportId}
                            onChange={(e) => updateForgotPasswordData('verificationData', { ...forgotPasswordData.verificationData, passportId: e.target.value })}
                            required
                            style={{ width: '100%', padding: '8px', margin: '8px 0' }}
                          />
                          <input
                            type="text"
                            placeholder="Код паспорта"
                            value={forgotPasswordData.verificationData.passportCode}
                            onChange={(e) => updateForgotPasswordData('verificationData', { ...forgotPasswordData.verificationData, passportCode: e.target.value })}
                            required
                            style={{ width: '100%', padding: '8px', margin: '8px 0' }}
                          />
                          <input
                            type="text"
                            placeholder="Серия паспорта"
                            value={forgotPasswordData.verificationData.passportSeries}
                            onChange={(e) => updateForgotPasswordData('verificationData', { ...forgotPasswordData.verificationData, passportSeries: e.target.value })}
                            required
                            style={{ width: '100%', padding: '8px', margin: '8px 0' }}
                          />
                        </div>
                      )}
                    </label>
                  </div>
                  <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>Подтвердить</button>
                </form>
              </div>
            ) : (
              <div>
                <h3>Восстановление пароля - Шаг 3: Новый пароль</h3>
                <form onSubmit={handleForgotPasswordStep3}>
                  <input
                    type="password"
                    placeholder="Новый пароль"
                    value={forgotPasswordData.newPassword}
                    onChange={(e) => updateForgotPasswordData('newPassword', e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px', margin: '8px 0' }}
                  />
                  <input
                    type="password"
                    placeholder="Повторите новый пароль"
                    value={forgotPasswordData.confirmNewPassword}
                    onChange={(e) => updateForgotPasswordData('confirmNewPassword', e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px', margin: '8px 0' }}
                  />
                  <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>Изменить пароль</button>
                </form>
              </div>
            )}
            <button onClick={() => { setShowForgotPassword(false); setForgotPasswordStep(1); setForgotPasswordError(''); }} style={{ marginTop: '15px', padding: '8px 16px', backgroundColor: '#9E9E9E', color: 'white', border: 'none', borderRadius: '4px' }}>Назад к входу</button>
            <p style={{ color: 'red', display: forgotPasswordError ? 'block' : 'none', marginTop: '10px' }}>
              {forgotPasswordError}
            </p>
          </div>
        </div>
      )
    } else if (showRegistration) {
      return (
        <div id="registration-container" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <NeonTitle tag="h2" />
            {registrationStep === 1 ? (
              <div>
                <h3>Регистрация - Шаг 1: Аккаунт</h3>
                <form onSubmit={handleRegistrationStep1}>
                  <input
                    type="text"
                    placeholder="Логин"
                    value={registrationData.username}
                    onChange={(e) => updateRegistrationData('username', e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px', margin: '8px 0' }}
                  />
                  <input
                    type="password"
                    placeholder="Пароль"
                    value={registrationData.password}
                    onChange={(e) => updateRegistrationData('password', e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px', margin: '8px 0' }}
                  />
                  <input
                    type="password"
                    placeholder="Повторите пароль"
                    value={registrationData.confirmPassword}
                    onChange={(e) => updateRegistrationData('confirmPassword', e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px', margin: '8px 0' }}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={registrationData.email}
                    onChange={(e) => updateRegistrationData('email', e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px', margin: '8px 0' }}
                  />
                  <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>Далее</button>
                </form>
              </div>
            ) : (
              <div>
                <h3>Регистрация - Шаг 2: Личная информация</h3>
                <form onSubmit={handleRegistrationStep2}>
                  <input
                    type="text"
                    placeholder="Имя"
                    value={registrationData.firstName}
                    onChange={(e) => updateRegistrationData('firstName', e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px', margin: '8px 0' }}
                  />
                  <input
                    type="text"
                    placeholder="Фамилия"
                    value={registrationData.lastName}
                    onChange={(e) => updateRegistrationData('lastName', e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px', margin: '8px 0' }}
                  />
                  <input
                    type="text"
                    placeholder="Nickname"
                    value={registrationData.nickname}
                    onChange={(e) => updateRegistrationData('nickname', e.target.value)}
                    style={{ width: '100%', padding: '8px', margin: '8px 0' }}
                  />
                  <input
                    type="date"
                    placeholder="Дата рождения"
                    value={registrationData.dateOfBirth}
                    onChange={(e) => updateRegistrationData('dateOfBirth', e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px', margin: '8px 0' }}
                  />
                  <input
                    type="text"
                    placeholder="Специализация / Профессия / Род деятельности / Интересы / Цели обучения"
                    value={registrationData.specialization}
                    onChange={(e) => updateRegistrationData('specialization', e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px', margin: '8px 0' }}
                  />
                  <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>Зарегистрироваться</button>
                </form>
              </div>
            )}
            <button onClick={() => { setShowRegistration(false); setRegistrationStep(1); setRegistrationError(''); }} style={{ marginTop: '15px', padding: '8px 16px', backgroundColor: '#9E9E9E', color: 'white', border: 'none', borderRadius: '4px' }}>Назад к входу</button>
            <p style={{ color: 'red', display: registrationError ? 'block' : 'none', marginTop: '10px' }}>
              {registrationError}
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  return (

      <AuthProvider>
        <div id="main-container">
          <Header
            onOpenChat={() => setIsChatOpen(true)}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          <Sidebar isOpen={isSidebarOpen} />
          <div className={`content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <main>
              <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/english" element={<English />} />
              <Route path="/english/grammar" element={<EnglishGrammar />} />
              <Route path="/english/courses/beginner" element={<EnglishCoursesBeginner />} />
              <Route path="/english/courses/intermediate" element={<EnglishCoursesIntermediate />} />
              <Route path="/english/courses/advanced" element={<EnglishCoursesAdvanced />} />
              <Route path="/english/dictionary/basic" element={<EnglishDictionaryBasic />} />
              <Route path="/english/dictionary/idioms" element={<EnglishDictionaryIdioms />} />
              <Route path="/english/dictionary/phrasal-verbs" element={<EnglishDictionaryPhrasalVerbs />} />
              <Route path="/english/dialogues" element={<EnglishDialogues />} />
              <Route path="/english/materials" element={<EnglishMaterials />} />
              <Route path="/korean" element={<Korean />} />
              <Route path="/korean/grammar" element={<KoreanGrammar />} />
              <Route path="/korean/courses" element={<KoreanCourses />} />
              <Route path="/korean/dialogues" element={<KoreanDialogues />} />
              <Route path="/russian" element={<Russian />} />
              <Route path="/russian/grammar" element={<RussianGrammar />} />
              <Route path="/russian/courses" element={<RussianCourses />} />
              <Route path="/russian/dialogues" element={<RussianDialogues />} />
              <Route path="/philosophy" element={<Philosophy />} />
              <Route path="/philosophy/wisdom" element={<PhilosophyWisdom />} />
              <Route path="/philosophy/books" element={<PhilosophyBooks />} />
              <Route path="/psychology" element={<Psychology />} />
              <Route path="/psychology/theories" element={<PsychologyTheories />} />
              <Route path="/psychology/practices" element={<PsychologyPractices />} />
              <Route path="/mathematics" element={<Mathematics />} />
              <Route path="/mathematics/basics" element={<MathematicsBasics />} />
              <Route path="/programming" element={<Programming />} />
              <Route path="/electronics" element={<Electronics />} />
              <Route path="/test-settings" element={<TestSettings />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/settings/account" element={<AccountSettings />} />
              <Route path="/settings/privacy" element={<PrivacySettings />} />
              <Route path="/settings/site" element={<SiteSettings />} />
              <Route path="/about" element={<About />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/english/grammar/test" element={<EnglishGrammarTest />} />
              <Route path="/korean/grammar/test" element={<KoreanGrammarTest />} />
              <Route path="/russian/grammar/test" element={<RussianGrammarTest />} />
              <Route path="/philosophy/wisdom/test" element={<PhilosophyWisdomTest />} />
              <Route path="/psychology/theories/test" element={<PsychologyTheoriesTest />} />

              <Route path="/test-taking" element={<TestTaking />} />
              <Route path="/test-creator" element={<TestCreator />} />
              <Route path="/smart-editor" element={<SmartEditor />} />
            </Routes>
            </main>
          </div>
          <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
          {renderAuthForms()}
        </div>
      </AuthProvider>
      
  )
}

export default App
