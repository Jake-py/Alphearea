import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
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
import Programming from './pages/Programming.jsx'
import Electronics from './pages/Electronics.jsx'

import AccountSettings from './pages/AccountSettings.jsx'
import PrivacySettings from './pages/PrivacySettings.jsx'
import SiteSettings from './pages/SiteSettings.jsx'
import TestTaking from './pages/TestTaking.jsx'
import TestCreator from './pages/TestCreator.jsx'
import SmartEditor from './pages/SmartEditor.jsx'
import { API_ENDPOINTS } from './config/api.js'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [showRegistration, setShowRegistration] = useState(false)
  const [registrationStep, setRegistrationStep] = useState(1)
  const [registrationData, setRegistrationData] = useState({
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
  })
  const [forgotPasswordError, setForgotPasswordError] = useState('')



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
        setIsLoggedIn(true)
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('profile', JSON.stringify(data.profile))
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.')
    }
  }

  const handleRegistrationStep1 = (e) => {
    e.preventDefault()
    if (registrationData.password !== registrationData.confirmPassword) {
      setRegistrationError('Passwords do not match')
      return
    }
    if (registrationData.password.length < 8) {
      setRegistrationError('Password must be at least 8 characters long')
      return
    }
    setRegistrationError('')
    setRegistrationStep(2)
  }

  const handleRegistrationStep2 = async (e) => {
    e.preventDefault()
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
        alert('Registration successful! You can now log in.')
      } else {
        setRegistrationError(data.error || 'Registration failed')
      }
    } catch (error) {
      setRegistrationError('Network error. Please try again.')
    }
  }

  const updateRegistrationData = (field, value) => {
    setRegistrationData(prev => ({ ...prev, [field]: value }))
  }

  const updateForgotPasswordData = (field, value) => {
    setForgotPasswordData(prev => ({ ...prev, [field]: value }))
  }

  const handleForgotPasswordStep1 = (e) => {
    e.preventDefault()
    if (!forgotPasswordData.username) {
      setForgotPasswordError('Пожалуйста, введите логин')
      return
    }
    setForgotPasswordError('')
    setForgotPasswordStep(2)
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
          newPassword: forgotPasswordData.newPassword
        }),
      })

      if (response.ok) {
        alert('Пароль успешно изменен! Теперь вы можете войти в систему.')
        setShowForgotPassword(false)
        setForgotPasswordStep(1)
        setForgotPasswordData({
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
        // Refresh the page to reload the application state
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
    const savedUser = localStorage.getItem('user')
    const savedProfile = localStorage.getItem('profile')
    if (savedUser && savedProfile) {
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem('user')
    localStorage.removeItem('profile')
  }

  if (!isLoggedIn) {
    if (showForgotPassword) {
      return (
        <div id="forgot-password-container">
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
                />
                <button type="submit">Далее</button>
              </form>
            </div>
          ) : forgotPasswordStep === 2 ? (
            <div>
              <h3>Восстановление пароля - Шаг 2: Выбор метода подтверждения</h3>
              <form onSubmit={handleForgotPasswordStep2}>
                <div className="verification-methods">
                  <label>
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
                      />
                    )}
                  </label>
                  <label>
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
                      />
                    )}
                  </label>
                  <label>
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
                        />
                        <input
                          type="text"
                          placeholder="Код паспорта"
                          value={forgotPasswordData.verificationData.passportCode}
                          onChange={(e) => updateForgotPasswordData('verificationData', { ...forgotPasswordData.verificationData, passportCode: e.target.value })}
                          required
                        />
                        <input
                          type="text"
                          placeholder="Серия паспорта"
                          value={forgotPasswordData.verificationData.passportSeries}
                          onChange={(e) => updateForgotPasswordData('verificationData', { ...forgotPasswordData.verificationData, passportSeries: e.target.value })}
                          required
                        />
                      </div>
                    )}
                  </label>
                </div>
                <button type="submit">Подтвердить</button>
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
                />
                <input
                  type="password"
                  placeholder="Повторите новый пароль"
                  value={forgotPasswordData.confirmNewPassword}
                  onChange={(e) => updateForgotPasswordData('confirmNewPassword', e.target.value)}
                  required
                />
                <button type="submit">Изменить пароль</button>
              </form>
            </div>
          )}
          <button onClick={() => { setShowForgotPassword(false); setForgotPasswordStep(1); setForgotPasswordError(''); }}>Назад к входу</button>
          <p style={{ color: 'red', display: forgotPasswordError ? 'block' : 'none' }}>
            {forgotPasswordError}
          </p>
        </div>
      )
    } else if (showRegistration) {
      return (
        <div id="registration-container">
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
                />
                <input
                  type="password"
                  placeholder="Пароль"
                  value={registrationData.password}
                  onChange={(e) => updateRegistrationData('password', e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Повторите пароль"
                  value={registrationData.confirmPassword}
                  onChange={(e) => updateRegistrationData('confirmPassword', e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={registrationData.email}
                  onChange={(e) => updateRegistrationData('email', e.target.value)}
                  required
                />
                <button type="submit">Далее</button>
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
                />
                <input
                  type="text"
                  placeholder="Фамилия"
                  value={registrationData.lastName}
                  onChange={(e) => updateRegistrationData('lastName', e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Nickname"
                  value={registrationData.nickname}
                  onChange={(e) => updateRegistrationData('nickname', e.target.value)}
                />
                <input
                  type="date"
                  placeholder="Дата рождения"
                  value={registrationData.dateOfBirth}
                  onChange={(e) => updateRegistrationData('dateOfBirth', e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Специализация/Профессия"
                  value={registrationData.specialization}
                  onChange={(e) => updateRegistrationData('specialization', e.target.value)}
                  required
                />
                <button type="submit">Зарегистрироваться</button>
              </form>
            </div>
          )}
          <button onClick={() => { setShowRegistration(false); setRegistrationStep(1); setRegistrationError(''); }}>Назад к входу</button>
          <p style={{ color: 'red', display: registrationError ? 'block' : 'none' }}>
            {registrationError}
          </p>
        </div>
      )
    } else {
      return (
        <div id="login-container">
          <NeonTitle tag="h2" />
          <form id="login-form" onSubmit={handleLogin}>
            <input
              type="text"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '15px' }}>
            <button onClick={() => setShowRegistration(true)}>Регистрация</button>
            <button onClick={() => setShowForgotPassword(true)}>Забыли пароль?</button>
          </div>
          <p id="error-message" style={{ color: 'red', display: error ? 'block' : 'none' }}>
            {error}
          </p>
        </div>
      )
    }
  }

  return (
    <Router>
      <div id="main-container">
        <Header onOpenChat={() => setIsChatOpen(true)} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} onLogout={handleLogout} />
        <div className="content">
          <Sidebar isOpen={isSidebarOpen} />
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
            <Route path="/programming" element={<Programming />} />
            <Route path="/electronics" element={<Electronics />} />
            <Route path="/test-settings" element={<TestSettings />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/account" element={<AccountSettings />} />
            <Route path="/settings/privacy" element={<PrivacySettings />} />
            <Route path="/settings/site" element={<SiteSettings />} />
            <Route path="/about" element={<About />} />

            <Route path="/test-taking" element={<TestTaking />} />
            <Route path="/test-creator" element={<TestCreator />} />
            <Route path="/smart-editor" element={<SmartEditor />} />
          </Routes>
        </div>
        <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>
    </Router>
  )
}

export default App
